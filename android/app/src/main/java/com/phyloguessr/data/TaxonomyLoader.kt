package com.phyloguessr.data

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.phyloguessr.game.SpeciesPoolEntry

private val gson = Gson()

fun loadTaxonomyFromAssets(context: Context, filename: String): TaxonomyData {
    val json = context.assets.open("taxonomy/$filename").bufferedReader().use { it.readText() }
    val compact = gson.fromJson(json, CompactTaxonomyData::class.java)
    return unpackTaxonomyData(compact)
}

fun loadSpeciesPoolFromAssets(context: Context): List<SpeciesPoolEntry> {
    val json = context.assets.open("taxonomy/species-pool.json").bufferedReader().use { it.readText() }
    val rawType = object : TypeToken<List<List<Any>>>() {}.type
    val raw: List<List<Any>> = gson.fromJson(json, rawType)
    return raw.map { entry ->
        SpeciesPoolEntry(
            taxId = (entry[0] as Number).toInt(),
            commonName = entry[1] as String,
            scientificName = entry[2] as String,
            imageUrl = if (entry.size > 3) entry[3] as? String else null,
        )
    }
}
