package com.example.model

data class PatientProfile(
  val id: String,
  val name: String,
  val relation: String,
  val age: String,
  val initials: String,
  val usual: Boolean = false,
  val bloodGroup: String = "Unknown",
  val phone: String = "+91 90000 00001",
  val address: String = "Bangalore, Karnataka",
  val preferredLanguage: String = "English",
  val conditions: List<String> = listOf("No condition added"),
  val allergies: List<String> = listOf("No allergy added"),
  val medicines: List<String> = listOf("No medicine added"),
  val procedures: List<String> = listOf("None reported"),
  val implants: List<String> = listOf("None reported"),
  val mobilityRequirements: String = "None",
  val contact: String = "Aarav · +91 90000 00001",
  val additionalContacts: List<String> = listOf("Priya · +91 90000 00003"),
  val hospital: String = "Preferred hospital not added",
  val hospitalPhone: String = "Not added",
  val mediclaim: String = "Mediclaim not added",
  val mediclaimTpa: String = "Not added",
  val mediclaimHelpline: String = "Not added",
  val policyReference: String = "Not added",
  val updated: String = "Today",
  val isManaged: Boolean = false,
  val receiveAlerts: Boolean = true
)

enum class SosMode {
  HYPER,
  REACH,
  CALL
}

data class SosPreset(
  val id: String,
  val title: String,
  val subtitle: String,
  val number: String?,
  val mode: SosMode,
  val alerts: Boolean
)

data class SosStep(
  val label: String,
  val done: Boolean
)

data class SosSession(
  val id: String,
  val profile: PatientProfile,
  val preset: SosPreset,
  val statusTitle: String,
  val statusDetail: String,
  val familyStatus: String,
  val detail: String = "",
  val startTimeMillis: Long = System.currentTimeMillis(),
  val steps: List<SosStep> = emptyList()
)

data class EmergencyHistoryItem(
  val id: String,
  val title: String,
  val date: String,
  val time: String,
  val patientName: String,
  val location: String,
  val status: String,
  val mode: SosMode
)

enum class PageDestination {
  HOME,
  ACTIVE_SOS,
  HISTORY,
  MEDICARD,
  FAMILY,
  CONTACTS,
  MEDICLAIM,
  HOSPITALS,
  SETTINGS,
  LOCATION
}
