package com.phyloguessr.game

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.phyloguessr.data.EasyScenario
import com.phyloguessr.data.Organism
import com.phyloguessr.data.TaxonomyData
import com.phyloguessr.data.loadEasyScenariosFromAssets
import com.phyloguessr.data.loadSpeciesPoolFromAssets
import com.phyloguessr.data.loadTaxonomyFromAssets
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

enum class GameState {
    LOADING,
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
    val overallMrcaName: String,
    val overallMrcaRank: String,
    val isPolytomy: Boolean,
    val funFact: String? = null,
    val activelyDebated: Boolean = false,
)

data class GameUiState(
    val state: GameState = GameState.LOADING,
    val loadingMessage: String = "",
    val organisms: List<Organism> = emptyList(),
    val selected: List<Int> = emptyList(),
    val result: ResultData? = null,
    val cladeInfo: CladeInfo? = null,
    val roundNumber: Int = 0,
    val easyTotal: Int = 0,
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
            }

            if (mode == "easy" && easyScenarios == null) {
                _uiState.value = _uiState.value.copy(loadingMessage = "Loading scenarios...")
                easyScenarios = loadEasyScenariosFromAssets(context)
            }

            if (mode != "easy" && speciesPool == null) {
                _uiState.value = _uiState.value.copy(loadingMessage = "Loading species pool...")
                speciesPool = loadSpeciesPoolFromAssets(context)
            }

            pickNewRound(mode)
        }
    }

    private fun pickNewRound(mode: String) {
        val data = taxonomyData ?: return

        if (mode == "easy") {
            pickEasyRound(data)
        } else {
            pickRandomRound(data)
        }
    }

    private fun pickEasyRound(data: TaxonomyData) {
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

    private fun pickRandomRound(data: TaxonomyData) {
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

    fun toggleSelect(idx: Int) {
        val current = _uiState.value
        if (current.state != GameState.SELECTING) return
        _uiState.value = current.copy(
            selected = toggleSelect(current.selected, idx),
        )
    }

    fun submit() {
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
                overallMrcaName = pair.overallLca.name,
                overallMrcaRank = pair.overallLca.rank,
                isPolytomy = pair.isPolytomy,
                funFact = scenario?.funFact,
                activelyDebated = scenario?.activelyDebated ?: false,
            ),
        )
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
