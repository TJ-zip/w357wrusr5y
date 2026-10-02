package com.example.data

import com.example.model.EmergencyHistoryItem
import com.example.model.PatientProfile
import com.example.model.SosMode
import com.example.model.SosPreset
import com.example.model.SosSession
import com.example.model.SosStep
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.random.Random

object ResQRepository {

  val defaultPresets = listOf(
    SosPreset(
      id = "hyper",
      title = "Hyper SOS",
      subtitle = "Medical emergency",
      number = "112",
      mode = SosMode.HYPER,
      alerts = true
    ),
    SosPreset(
      id = "reach",
      title = "Reach Me",
      subtitle = "Call me and alert my circle",
      number = null,
      mode = SosMode.REACH,
      alerts = true
    ),
    SosPreset(
      id = "ambulance",
      title = "Ambulance helpline",
      subtitle = "Configured emergency number",
      number = "102",
      mode = SosMode.CALL,
      alerts = false
    ),
    SosPreset(
      id = "family",
      title = "Family emergency",
      subtitle = "Call primary family contact",
      number = "+919000000002",
      mode = SosMode.CALL,
      alerts = true
    )
  )

  private val initialProfiles = listOf(
    PatientProfile(
      id = "self",
      name = "Suvan Pantina",
      relation = "My profile",
      age = "20",
      initials = "SP",
      usual = true,
      bloodGroup = "B+",
      phone = "+91 90000 00001",
      address = "Indiranagar, Bangalore, KA",
      preferredLanguage = "English",
      conditions = listOf("No condition added"),
      allergies = listOf("No allergy added"),
      medicines = listOf("No medicine added"),
      procedures = listOf("None"),
      implants = listOf("None"),
      mobilityRequirements = "Normal mobility",
      contact = "Aarav · +91 90000 00001",
      additionalContacts = listOf("Priya · +91 90000 00003"),
      hospital = "City Care Hospital",
      hospitalPhone = "+91 80 4455 6677",
      mediclaim = "Care Health · Policy #482109",
      mediclaimTpa = "Medi Assist TPA",
      mediclaimHelpline = "1800-200-4477",
      policyReference = "POL-2026-B81",
      updated = "Today",
      isManaged = false,
      receiveAlerts = true
    ),
    PatientProfile(
      id = "parent",
      name = "Raman Pantina",
      relation = "Father",
      age = "58",
      initials = "RP",
      usual = false,
      bloodGroup = "O+",
      phone = "+91 90000 00002",
      address = "Indiranagar, Bangalore, KA",
      preferredLanguage = "English",
      conditions = listOf("Type 2 diabetes"),
      allergies = listOf("Penicillin"),
      medicines = listOf("Metformin 500mg"),
      procedures = listOf("Appendectomy (2018)"),
      implants = listOf("None"),
      mobilityRequirements = "Normal mobility",
      contact = "Suvan · +91 90000 00001",
      additionalContacts = listOf("Radha · +91 90000 00004"),
      hospital = "City Care Hospital",
      hospitalPhone = "+91 80 4455 6677",
      mediclaim = "Star Health · Policy #783912",
      mediclaimTpa = "Heritage TPA",
      mediclaimHelpline = "1800-425-2255",
      policyReference = "STAR-449-P2",
      updated = "18 Sep 2026",
      isManaged = true,
      receiveAlerts = true
    )
  )

  private val _profiles = MutableStateFlow(initialProfiles)
  val profiles: StateFlow<List<PatientProfile>> = _profiles.asStateFlow()

  private val _selectedProfile = MutableStateFlow(initialProfiles[0])
  val selectedProfile: StateFlow<PatientProfile> = _selectedProfile.asStateFlow()

  private val _location = MutableStateFlow("12.9716, 77.5946 · Bangalore")
  val location: StateFlow<String> = _location.asStateFlow()

  private val _activeSession = MutableStateFlow<SosSession?>(null)
  val activeSession: StateFlow<SosSession?> = _activeSession.asStateFlow()

  private val _history = MutableStateFlow<List<EmergencyHistoryItem>>(
    listOf(
      EmergencyHistoryItem(
        id = "HIST-01",
        title = "Reach Me check-in",
        date = "15 Sep 2026",
        time = "08:42 PM",
        patientName = "Suvan Pantina",
        location = "Indiranagar, Bangalore",
        status = "Completed without escalation",
        mode = SosMode.REACH
      )
    )
  )
  val history: StateFlow<List<EmergencyHistoryItem>> = _history.asStateFlow()

  fun selectProfile(profile: PatientProfile) {
    _selectedProfile.value = profile
    val current = _activeSession.value
    if (current != null) {
      _activeSession.value = current.copy(
        profile = profile,
        statusDetail = "Patient updated to ${profile.name}. Now call 112."
      )
    }
  }

  fun updateLocation(newLocation: String) {
    _location.value = newLocation
  }

  fun updateProfile(updated: PatientProfile) {
    val list = _profiles.value.toMutableList()
    val index = list.indexOfFirst { it.id == updated.id }
    if (index >= 0) {
      list[index] = updated.copy(updated = "Today")
    } else {
      list.add(updated.copy(updated = "Today"))
    }
    _profiles.value = list
    if (_selectedProfile.value.id == updated.id) {
      _selectedProfile.value = updated
    }
    val current = _activeSession.value
    if (current != null && current.profile.id == updated.id) {
      _activeSession.value = current.copy(profile = updated)
    }
  }

  fun addFamilyMember(member: PatientProfile) {
    val list = _profiles.value.toMutableList()
    list.add(member)
    _profiles.value = list
  }

  fun removeFamilyMember(id: String) {
    val list = _profiles.value.filterNot { it.id == id }
    _profiles.value = list
    if (_selectedProfile.value.id == id) {
      _selectedProfile.value = list.firstOrNull() ?: initialProfiles[0]
    }
  }

  fun startSession(preset: SosPreset): SosSession {
    val currentProfile = _selectedProfile.value
    val sessionId = "RQ-${Random.nextInt(1000, 9999)}"
    val loc = _location.value

    val isLocAvailable = !loc.contains("off", ignoreCase = true) && !loc.contains("unavailable", ignoreCase = true)

    val session = when (preset.mode) {
      SosMode.HYPER -> SosSession(
        id = sessionId,
        profile = currentProfile,
        preset = preset,
        statusTitle = "SOS started",
        statusDetail = "Your location and MediCard are being prepared. Now call 112.",
        familyStatus = "Connected family alerts initialized",
        detail = "",
        steps = listOf(
          SosStep("Started", true),
          SosStep("Location", isLocAvailable),
          SosStep("MediCard", true),
          SosStep("Family", true)
        )
      )
      SosMode.REACH -> SosSession(
        id = sessionId,
        profile = currentProfile,
        preset = preset,
        statusTitle = "Reach Me is active",
        statusDetail = "Sharing your location with selected contacts.",
        familyStatus = "Connected contacts are being alerted",
        detail = "",
        steps = listOf(
          SosStep("Started", true),
          SosStep("Location", isLocAvailable),
          SosStep("Contacts", true),
          SosStep("Callback", true)
        )
      )
      SosMode.CALL -> SosSession(
        id = sessionId,
        profile = currentProfile,
        preset = preset,
        statusTitle = "Calling ${preset.title}",
        statusDetail = "Opening the phone calling interface.",
        familyStatus = if (preset.alerts) "Alerts initializing" else "Not configured",
        detail = "",
        steps = listOf(
          SosStep("Started", true),
          SosStep("Location", isLocAvailable),
          SosStep("MediCard", true),
          SosStep("Family", preset.alerts)
        )
      )
    }

    _activeSession.value = session
    return session
  }

  fun addSessionDetail(detailText: String) {
    val current = _activeSession.value ?: return
    _activeSession.value = current.copy(detail = detailText)
  }

  fun cancelActiveSession(outcome: String = "Cancelled by user") {
    val current = _activeSession.value ?: return
    val sdfDate = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
    val sdfTime = SimpleDateFormat("hh:mm a", Locale.getDefault())
    val now = Date()

    val historyItem = EmergencyHistoryItem(
      id = current.id,
      title = current.preset.title,
      date = sdfDate.format(now),
      time = sdfTime.format(now),
      patientName = current.profile.name,
      location = _location.value,
      status = outcome,
      mode = current.preset.mode
    )

    _history.value = listOf(historyItem) + _history.value
    _activeSession.value = null
  }

  fun resetForTesting() {
    _profiles.value = initialProfiles
    _selectedProfile.value = initialProfiles[0]
    _location.value = "12.9716, 77.5946 · Bangalore"
    _activeSession.value = null
    _history.value = listOf(
      EmergencyHistoryItem(
        id = "HIST-01",
        title = "Reach Me check-in",
        date = "15 Sep 2026",
        time = "08:42 PM",
        patientName = "Suvan Pantina",
        location = "Indiranagar, Bangalore",
        status = "Completed without escalation",
        mode = SosMode.REACH
      )
    )
  }
}
