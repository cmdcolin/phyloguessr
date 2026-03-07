package com.phyloguessr.data

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

data class Source(
    val url: String,
    val label: String,
)

data class EasyScenario(
    val organisms: List<Organism>,
    val funFact: String,
    val sources: List<Source>,
    val correctPair: List<String>? = null,
    val activelyDebated: Boolean = false,
)

fun loadEasyScenariosFromAssets(context: Context): List<EasyScenario> {
    val json = context.assets.open("taxonomy/easy-scenarios.json")
        .bufferedReader().use { it.readText() }
    val type = object : TypeToken<List<EasyScenario>>() {}.type
    return Gson().fromJson(json, type)
}
