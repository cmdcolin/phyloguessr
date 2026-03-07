package com.phyloguessr.game

import com.phyloguessr.data.TaxonomyData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

// A small mock taxonomy tree:
//
//        1 (root)
//        |
//       10 (Eukaryota)
//      /    \
//    20      30
//  (Plants) (Animals)
//   /  \       \
//  21   22      31
// (A)  (B)     (C)
//
fun makeMockData() = TaxonomyData(
    parents = mapOf(
        "10" to 1,
        "20" to 10,
        "30" to 10,
        "21" to 20,
        "22" to 20,
        "31" to 30,
    ),
    names = mapOf(
        "1" to "root",
        "10" to "Eukaryota",
        "20" to "Plants",
        "30" to "Animals",
        "21" to "Species A",
        "22" to "Species B",
        "31" to "Species C",
    ),
    ranks = mapOf(
        "10" to "domain",
        "20" to "kingdom",
        "30" to "kingdom",
        "21" to "species",
        "22" to "species",
        "31" to "species",
    ),
)

class GetLineageFromParentsTest {
    private val data = makeMockData()

    @Test
    fun `returns full lineage from leaf to root`() {
        val lineage = getLineageFromParents(21, data.parents)
        assertEquals(listOf(21, 20, 10, 1), lineage)
    }

    @Test
    fun `returns taxId plus 1 when taxId is missing from parents`() {
        val lineage = getLineageFromParents(9999, data.parents)
        assertEquals(listOf(9999, 1), lineage)
    }

    @Test
    fun `handles root directly`() {
        val lineage = getLineageFromParents(1, data.parents)
        assertEquals(listOf(1), lineage)
    }
}

class FindClosestPairFromDataTest {
    private val data = makeMockData()

    @Test
    fun `identifies the correct sister pair`() {
        val result = findClosestPairFromData(Triple(21, 22, 31), data)
        assertEquals(setOf(21, 22), setOf(result.sister1TaxId, result.sister2TaxId))
        assertEquals(31, result.outgroupTaxId)
    }

    @Test
    fun `works regardless of input order`() {
        val orderings = listOf(
            Triple(21, 22, 31),
            Triple(21, 31, 22),
            Triple(31, 21, 22),
            Triple(31, 22, 21),
            Triple(22, 21, 31),
            Triple(22, 31, 21),
        )
        for (order in orderings) {
            val result = findClosestPairFromData(order, data)
            assertEquals(setOf(21, 22), setOf(result.sister1TaxId, result.sister2TaxId))
            assertEquals(31, result.outgroupTaxId)
        }
    }

    @Test
    fun `returns correct LCA info for the sister pair`() {
        val result = findClosestPairFromData(Triple(21, 22, 31), data)
        assertEquals(20, result.sisterLca.taxId)
        assertEquals("Plants", result.sisterLca.name)
    }

    @Test
    fun `returns correct overall LCA`() {
        val result = findClosestPairFromData(Triple(21, 22, 31), data)
        assertEquals(10, result.overallLca.taxId)
        assertEquals("Eukaryota", result.overallLca.name)
    }

    @Test
    fun `gives wrong answer when a taxId is missing from parents`() {
        val brokenData = data.copy(
            parents = data.parents - "21"
        )
        val result = findClosestPairFromData(Triple(21, 22, 31), brokenData)
        assertNotEquals(setOf(21, 22), setOf(result.sister1TaxId, result.sister2TaxId))
    }
}

class PolytomyTest {
    @Test
    fun `detects a polytomy when all three share the same LCA`() {
        val data = TaxonomyData(
            parents = mapOf(
                "10" to 1,
                "11" to 10,
                "12" to 10,
                "13" to 10,
            ),
            names = mapOf(
                "1" to "root",
                "10" to "Clade",
                "11" to "A",
                "12" to "B",
                "13" to "C",
            ),
            ranks = mapOf(
                "10" to "family",
                "11" to "species",
                "12" to "species",
                "13" to "species",
            ),
        )
        val result = findClosestPairFromData(Triple(11, 12, 13), data)
        assertTrue(result.isPolytomy)
    }

    @Test
    fun `does not flag a polytomy when one pair is closer`() {
        val data = makeMockData()
        val result = findClosestPairFromData(Triple(21, 22, 31), data)
        assertFalse(result.isPolytomy)
    }
}

class ComboKeyTest {
    @Test
    fun `produces consistent key regardless of order`() {
        assertEquals(comboKey(listOf(3, 1, 2)), comboKey(listOf(1, 2, 3)))
        assertEquals(comboKey(listOf(100, 50, 75)), comboKey(listOf(50, 75, 100)))
    }
}

class ToggleSelectTest {
    @Test
    fun `adds index when under limit`() {
        assertEquals(listOf(0), toggleSelect(emptyList(), 0))
        assertEquals(listOf(0, 1), toggleSelect(listOf(0), 1))
    }

    @Test
    fun `removes index when already selected`() {
        assertEquals(listOf(1), toggleSelect(listOf(0, 1), 0))
    }

    @Test
    fun `replaces oldest when at limit`() {
        assertEquals(listOf(1, 2), toggleSelect(listOf(0, 1), 2))
    }
}

class IsDescendantOfTest {
    private val data = makeMockData()

    @Test
    fun `species is descendant of its parent`() {
        assertTrue(isDescendantOf(21, 20, data.parents))
    }

    @Test
    fun `species is descendant of root`() {
        assertTrue(isDescendantOf(21, 1, data.parents))
    }

    @Test
    fun `species is not descendant of sibling clade`() {
        assertFalse(isDescendantOf(21, 30, data.parents))
    }
}

class FindTaxIdTest {
    private val data = makeMockData()

    @Test
    fun `finds by numeric ID`() {
        assertEquals(10, findTaxId("10", data))
    }

    @Test
    fun `finds by name case-insensitive`() {
        assertEquals(20, findTaxId("plants", data))
        assertEquals(20, findTaxId("Plants", data))
    }

    @Test
    fun `returns null for unknown`() {
        assertEquals(null, findTaxId("Unicorns", data))
    }
}
