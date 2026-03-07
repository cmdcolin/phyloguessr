package com.phyloguessr.game

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import coil.imageLoader
import coil.request.ImageRequest
import com.phyloguessr.data.EasyScenario
import com.phyloguessr.data.Organism
import com.phyloguessr.data.TaxonomyData
import com.phyloguessr.data.FirebaseRepository
import com.phyloguessr.data.loadEasyScenariosFromAssets
import com.phyloguessr.data.loadSpeciesPoolFromAssets
import com.phyloguessr.data.loadTaxonomyFromAssets
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

enum class GameState {
    LOADING,
    CUSTOMIZING,
    SELECTING,
    RESULT,
    EASY_COMPLETED,
}

data class ResultData(
    val correct: Boolean,
    val sister1: Organism,
    val sister2: Organism,
    val outgroup: Organism,
    val cladeLabel: String,
    val sisterMrcaName: String,
    val sisterMrcaRank: String,
    val sisterMrcaTaxId: Int,
    val overallMrcaName: String,
    val overallMrcaRank: String,
    val overallMrcaTaxId: Int,
    val isPolytomy: Boolean,
    val funFact: String? = null,
    val activelyDebated: Boolean = false,
)

data class MultiResultData(
    val score: Int,
    val rank: Int,
    val totalPairs: Int,
    val userPair: PairRanking,
    val bestPair: PairRanking,
    val allPairs: List<PairRanking>,
    val organisms: List<Organism>,
)

data class GameUiState(
    val state: GameState = GameState.LOADING,
    val loadingMessage: String = "",
    val organisms: List<Organism> = emptyList(),
    val selected: List<Int> = emptyList(),
    val result: ResultData? = null,
    val multiResult: MultiResultData? = null,
    val cladeInfo: CladeInfo? = null,
    val roundNumber: Int = 0,
    val easyTotal: Int = 0,
    val cladeFilter: Int? = null,
    val cladeFilterError: String? = null,
    val taxonomyData: TaxonomyData? = null,
)

class GameViewModel(application: Application) : AndroidViewModel(application) {
    private val _uiState = MutableStateFlow(GameUiState())
    val uiState: StateFlow<GameUiState> = _uiState

    private var taxonomyData: TaxonomyData? = null
    private var speciesPool: List<SpeciesPoolEntry>? = null
    private var easyScenarios: List<EasyScenario>? = null
    private val seenCombos = mutableSetOf<String>()
    private val shownScenarioIndices = mutableSetOf<Int>()

    fun startGame(mode: String) {
        viewModelScope.launch(Dispatchers.IO) {
            _uiState.value = _uiState.value.copy(
                state = GameState.LOADING,
                loadingMessage = "Loading taxonomy data...",
            )

            val context = getApplication<Application>()

            if (taxonomyData == null) {
                val filename = if (mode == "easy") "parents-easy.json" else "parents.json"
                taxonomyData = loadTaxonomyFromAssets(context, filename)
                _uiState.value = _uiState.value.copy(taxonomyData = taxonomyData)
            }

            if (mode == "easy" && easyScenarios == null) {
                _uiState.value = _uiState.value.copy(loadingMessage = "Loading scenarios...")
                easyScenarios = loadEasyScenariosFromAssets(context)
            }

            if (mode != "easy" && speciesPool == null) {
                _uiState.value = _uiState.value.copy(loadingMessage = "Loading species pool...")
                speciesPool = loadSpeciesPoolFromAssets(context)
            }

            if (mode == "custom") {
                _uiState.value = _uiState.value.copy(
                    state = GameState.CUSTOMIZING,
                    cladeFilter = null,
                    cladeFilterError = null,
                )
            } else {
                pickNewRound(mode)
            }
        }
    }

    fun setCladeFilter(taxId: Int) {
        _uiState.value = _uiState.value.copy(cladeFilter = taxId, cladeFilterError = null)
    }

    fun startCustomRound() {
        val cladeTaxId = _uiState.value.cladeFilter
        if (cladeTaxId == null) {
            _uiState.value = _uiState.value.copy(cladeFilterError = "Please select a group first")
            return
        }
        viewModelScope.launch(Dispatchers.IO) {
            _uiState.value = _uiState.value.copy(
                state = GameState.LOADING,
                loadingMessage = "Picking species...",
            )
            pickCustomRound(taxonomyData ?: return@launch, cladeTaxId)
        }
    }

    private suspend fun pickCustomRound(data: TaxonomyData, cladeTaxId: Int) {
        val pool = speciesPool ?: return

        for (attempt in 0 until 20) {
            val picks = pickThreeFromClade(cladeTaxId, pool, data) ?: break
            val orgs = picks.map { it.toOrganism("custom") }
            val taxIds = Triple(orgs[0].ncbiTaxId, orgs[1].ncbiTaxId, orgs[2].ncbiTaxId)
            val pair = findClosestPairFromData(taxIds, data)
            val key = comboKey(orgs.map { it.ncbiTaxId })
            if (pair.isPolytomy || key in seenCombos) continue

            seenCombos.add(key)
            preloadImages(orgs)
            val cladeName = data.names[cladeTaxId.toString()] ?: "Taxon $cladeTaxId"
            val cladeRank = data.ranks[cladeTaxId.toString()] ?: ""
            _uiState.value = _uiState.value.copy(
                state = GameState.SELECTING,
                organisms = orgs.shuffled(),
                selected = emptyList(),
                result = null,
                cladeInfo = CladeInfo(cladeTaxId, cladeName, cladeRank),
                roundNumber = _uiState.value.roundNumber + 1,
            )
            return
        }

        _uiState.value = _uiState.value.copy(
            state = GameState.CUSTOMIZING,
            cladeFilterError = "Not enough species in this group — try another",
        )
    }

    private suspend fun preloadImages(organisms: List<Organism>) {
        val context = getApplication<Application>()
        val imageLoader = context.imageLoader
        coroutineScope {
            organisms.mapNotNull { it.imageUrl }.map { url ->
                async {
                    val request = ImageRequest.Builder(context).data(url).build()
                    imageLoader.execute(request)
                }
            }.awaitAll()
        }
    }

    private suspend fun pickNewRound(mode: String) {
        val data = taxonomyData ?: return

        if (mode == "easy") {
            pickEasyRound(data)
        } else if (mode == "multi") {
            pickMultiRound(data)
        } else {
            pickRandomRound(data)
        }
    }

    private suspend fun pickEasyRound(data: TaxonomyData) {
        val scenarios = easyScenarios ?: return

        val unshown = scenarios.indices.filter { i ->
            i !in shownScenarioIndices &&
                comboKey(scenarios[i].organisms.map { it.ncbiTaxId }) !in seenCombos
        }.filter { i ->
            val s = scenarios[i]
            if (s.correctPair != null) {
                true
            } else {
                val taxIds = Triple(
                    s.organisms[0].ncbiTaxId,
                    s.organisms[1].ncbiTaxId,
                    s.organisms[2].ncbiTaxId,
                )
                val pair = findClosestPairFromData(taxIds, data)
                !pair.isPolytomy
            }
        }

        if (unshown.isEmpty()) {
            _uiState.value = _uiState.value.copy(
                state = GameState.EASY_COMPLETED,
                easyTotal = scenarios.size,
            )
            return
        }

        val pickIdx = unshown.random()
        shownScenarioIndices.add(pickIdx)
        val scenario = scenarios[pickIdx]
        val orgs = scenario.organisms.shuffled()
        seenCombos.add(comboKey(orgs.map { it.ncbiTaxId }))
        preloadImages(orgs)

        _uiState.value = _uiState.value.copy(
            state = GameState.SELECTING,
            organisms = orgs,
            selected = emptyList(),
            result = null,
            cladeInfo = null,
            roundNumber = _uiState.value.roundNumber + 1,
            easyTotal = scenarios.size,
        )
    }

    private suspend fun pickRandomRound(data: TaxonomyData) {
        val pool = speciesPool ?: return

        for (attempt in 0 until 20) {
            val (picks, clade) = pickThreeHardModeDistance(pool, data)
            val orgs = picks.map { it.toOrganism() }
            val taxIds = Triple(orgs[0].ncbiTaxId, orgs[1].ncbiTaxId, orgs[2].ncbiTaxId)
            val pair = findClosestPairFromData(taxIds, data)

            val key = comboKey(orgs.map { it.ncbiTaxId })
            if (pair.isPolytomy || key in seenCombos) {
                continue
            }

            seenCombos.add(key)
            preloadImages(orgs)
            _uiState.value = _uiState.value.copy(
                state = GameState.SELECTING,
                organisms = orgs.shuffled(),
                selected = emptyList(),
                result = null,
                cladeInfo = clade,
                roundNumber = _uiState.value.roundNumber + 1,
            )
            return
        }

        _uiState.value = _uiState.value.copy(
            loadingMessage = "Couldn't find a valid set — please try again",
        )
    }

    private suspend fun pickMultiRound(data: TaxonomyData) {
        val pool = speciesPool ?: return

        for (attempt in 0 until 20) {
            val (picks, clade) = pickNHardModeDistance(6, pool, data, "order")
            val orgs = picks.map { it.toOrganism("multi") }
            val key = comboKey(orgs.map { it.ncbiTaxId })
            if (key in seenCombos) continue

            val taxIds = orgs.map { it.ncbiTaxId }
            val pairs = getAllPairLcas(taxIds, data)
            if (pairs.size >= 2 && pairs[0].lca.depth > pairs[1].lca.depth) {
                seenCombos.add(key)
                preloadImages(orgs)
                _uiState.value = _uiState.value.copy(
                    state = GameState.SELECTING,
                    organisms = orgs.shuffled(),
                    selected = emptyList(),
                    result = null,
                    multiResult = null,
                    cladeInfo = clade,
                    roundNumber = _uiState.value.roundNumber + 1,
                )
                return
            }
        }

        _uiState.value = _uiState.value.copy(
            loadingMessage = "Couldn't find a valid set — please try again",
        )
    }

    fun submitMulti(difficulty: Difficulty) {
        val current = _uiState.value
        if (current.selected.size != 2 || current.state != GameState.SELECTING) return
        val data = taxonomyData ?: return
        val orgs = current.organisms

        val taxIds = orgs.map { it.ncbiTaxId }
        val allPairs = getAllPairLcas(taxIds, data)

        val userTaxA = orgs[current.selected[0]].ncbiTaxId
        val userTaxB = orgs[current.selected[1]].ncbiTaxId
        val userPair = allPairs.first { p ->
            (p.taxIdA == userTaxA && p.taxIdB == userTaxB) ||
                (p.taxIdA == userTaxB && p.taxIdB == userTaxA)
        }

        val bestPair = allPairs[0]
        val userDepth = userPair.lca.depth
        val betterCount = allPairs.count { it.lca.depth > userDepth }
        val rank = betterCount + 1
        val totalPairs = allPairs.size
        val t = if (totalPairs <= 1) 1.0 else (totalPairs - rank).toDouble() / (totalPairs - 1)
        val score = (t * t * 100).toInt()

        _uiState.value = current.copy(
            state = GameState.RESULT,
            multiResult = MultiResultData(
                score = score,
                rank = rank,
                totalPairs = totalPairs,
                userPair = userPair,
                bestPair = bestPair,
                allPairs = allPairs,
                organisms = orgs,
            ),
        )

        viewModelScope.launch(Dispatchers.IO) {
            try {
                FirebaseRepository.submitScore("multi", difficulty, rank == 1, score)
                FirebaseRepository.updatePresence()
            } catch (_: Exception) {}
        }
    }

    fun toggleSelect(idx: Int) {
        val current = _uiState.value
        if (current.state != GameState.SELECTING) return
        _uiState.value = current.copy(
            selected = toggleSelect(current.selected, idx),
        )
    }

    fun submit(difficulty: Difficulty) {
        val current = _uiState.value
        if (current.selected.size != 2 || current.state != GameState.SELECTING) return
        val data = taxonomyData ?: return
        val orgs = current.organisms

        val scenario = easyScenarios?.find { s ->
            comboKey(s.organisms.map { it.ncbiTaxId }) == comboKey(orgs.map { it.ncbiTaxId })
        }

        val taxIds = Triple(orgs[0].ncbiTaxId, orgs[1].ncbiTaxId, orgs[2].ncbiTaxId)
        val pair = findClosestPairFromData(taxIds, data)

        val userPickedTaxIds = current.selected
            .filter { it in orgs.indices }
            .map { orgs[it].ncbiTaxId }
            .toSet()

        var correct: Boolean
        var sister1: Organism
        var sister2: Organism
        var outgroup: Organism

        if (scenario?.correctPair != null) {
            val cp = scenario.correctPair
            val userPicked = current.selected.map { orgs[it].commonName }.toSet()
            correct = cp.all { it in userPicked }
            sister1 = orgs.first { it.commonName == cp[0] }
            sister2 = orgs.first { it.commonName == cp[1] }
            outgroup = orgs.first { it.commonName != cp[0] && it.commonName != cp[1] }
        } else {
            correct = pair.isPolytomy || (
                userPickedTaxIds.contains(pair.sister1TaxId) &&
                    userPickedTaxIds.contains(pair.sister2TaxId)
                )

            val byTaxId = orgs.associateBy { it.ncbiTaxId }
            sister1 = byTaxId[pair.sister1TaxId] ?: orgs[0]
            sister2 = byTaxId[pair.sister2TaxId] ?: orgs[1]
            outgroup = byTaxId[pair.outgroupTaxId] ?: orgs[2]
        }

        if (scenario?.activelyDebated == true) {
            correct = true
        }

        val mode = if (scenario != null) {
            "easy"
        } else if (current.cladeFilter != null) {
            "custom"
        } else {
            "random"
        }

        _uiState.value = current.copy(
            state = GameState.RESULT,
            result = ResultData(
                correct = correct,
                sister1 = sister1,
                sister2 = sister2,
                outgroup = outgroup,
                cladeLabel = pair.sisterLca.name,
                sisterMrcaName = pair.sisterLca.name,
                sisterMrcaRank = pair.sisterLca.rank,
                sisterMrcaTaxId = pair.sisterLca.taxId,
                overallMrcaName = pair.overallLca.name,
                overallMrcaRank = pair.overallLca.rank,
                overallMrcaTaxId = pair.overallLca.taxId,
                isPolytomy = pair.isPolytomy,
                funFact = scenario?.funFact,
                activelyDebated = scenario?.activelyDebated ?: false,
            ),
        )

        viewModelScope.launch(Dispatchers.IO) {
            try {
                FirebaseRepository.submitScore(mode, difficulty, correct, if (correct) 100 else 0)
                FirebaseRepository.updatePresence()
            } catch (_: Exception) {}
        }
    }

    fun nextRound(mode: String) {
        viewModelScope.launch(Dispatchers.IO) {
            _uiState.value = _uiState.value.copy(
                state = GameState.LOADING,
                loadingMessage = "Picking species...",
            )
            pickNewRound(mode)
        }
    }

    fun restartEasy() {
        shownScenarioIndices.clear()
        seenCombos.clear()
        startGame("easy")
    }
}
