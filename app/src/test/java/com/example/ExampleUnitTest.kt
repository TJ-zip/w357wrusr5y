package com.example

import com.example.data.ResQRepository
import com.example.model.PatientProfile
import com.example.model.SosMode
import com.example.model.SosPreset
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class ExampleUnitTest {

  @Before
  fun setup() {
    ResQRepository.resetForTesting()
  }

  @Test
  fun testInitialState() {
    val profile = ResQRepository.selectedProfile.value
    assertEquals("Suvan Pantina", profile.name)
    assertEquals("20", profile.age)
    assertEquals("B+", profile.bloodGroup)
    assertEquals(2, ResQRepository.profiles.value.size)
  }

  @Test
  fun testSelectProfile() {
    val father = ResQRepository.profiles.value.first { it.id == "parent" }
    ResQRepository.selectProfile(father)

    assertEquals("Raman Pantina", ResQRepository.selectedProfile.value.name)
    assertEquals("Father", ResQRepository.selectedProfile.value.relation)
  }

  @Test
  fun testUpdateProfile() {
    val current = ResQRepository.selectedProfile.value
    val updated = current.copy(bloodGroup = "AB+", address = "Koramangala, Bangalore")
    ResQRepository.updateProfile(updated)

    val refreshed = ResQRepository.selectedProfile.value
    assertEquals("AB+", refreshed.bloodGroup)
    assertEquals("Koramangala, Bangalore", refreshed.address)
    assertEquals("Today", refreshed.updated)
  }

  @Test
  fun testAddAndRemoveFamilyMember() {
    val initialCount = ResQRepository.profiles.value.size
    val newMember = PatientProfile(
      id = "sister_1",
      name = "Ananya Pantina",
      relation = "Sister",
      age = "16",
      initials = "AP",
      bloodGroup = "B+"
    )
    ResQRepository.addFamilyMember(newMember)
    assertEquals(initialCount + 1, ResQRepository.profiles.value.size)

    ResQRepository.removeFamilyMember("sister_1")
    assertEquals(initialCount, ResQRepository.profiles.value.size)
  }

  @Test
  fun testSosSessionLifecycle() {
    val hyperPreset = ResQRepository.defaultPresets.first { it.mode == SosMode.HYPER }
    val session = ResQRepository.startSession(hyperPreset)

    assertNotNull(ResQRepository.activeSession.value)
    assertEquals("Get ResQ started", session.statusTitle)
    assertEquals(4, session.steps.size)
    assertTrue(session.steps[0].done) // Started is done

    // Add incident detail
    ResQRepository.addSessionDetail("Patient collapsed, breathing shallow")
    assertEquals("Patient collapsed, breathing shallow", ResQRepository.activeSession.value?.detail)

    // Cancel SOS session
    val historyCountBefore = ResQRepository.history.value.size
    ResQRepository.cancelActiveSession("Resolved safely")

    assertNull(ResQRepository.activeSession.value)
    assertEquals(historyCountBefore + 1, ResQRepository.history.value.size)
    val latestHistory = ResQRepository.history.value.first()
    assertEquals("Resolved safely", latestHistory.status)
    assertEquals("Get ResQ", latestHistory.title)
  }

  @Test
  fun testReachMePresetBehavior() {
    val reachPreset = ResQRepository.defaultPresets.first { it.mode == SosMode.REACH }
    val session = ResQRepository.startSession(reachPreset)

    assertNotNull(ResQRepository.activeSession.value)
    assertEquals("Reach Me is active", session.statusTitle)
    assertTrue(session.familyStatus.contains("contacts", ignoreCase = true))

    ResQRepository.cancelActiveSession("Check-in complete")
    assertNull(ResQRepository.activeSession.value)
  }
}
