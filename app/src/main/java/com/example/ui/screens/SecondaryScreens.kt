package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Place
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.EmergencyHistoryItem
import com.example.model.PatientProfile
import com.example.ui.components.ResQRowItem
import com.example.ui.components.ResQTapButton
import com.example.ui.components.TapButtonTone
import com.example.ui.theme.ResQGreen
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQLine
import com.example.ui.theme.ResQWhite

@Composable
fun SecondaryPageScaffold(
  title: String,
  subtitle: String,
  onBack: () -> Unit,
  modifier: Modifier = Modifier,
  content: @Composable () -> Unit
) {
  BackHandler {
    onBack()
  }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ResQWhite)
      .verticalScroll(rememberScrollState())
      .padding(horizontal = 16.dp, vertical = 12.dp)
  ) {
    Row(
      verticalAlignment = Alignment.CenterVertically,
      modifier = Modifier
        .fillMaxWidth()
        .padding(bottom = 8.dp)
    ) {
      IconButton(onClick = onBack) {
        Icon(
          imageVector = Icons.AutoMirrored.Filled.ArrowBack,
          contentDescription = "Back",
          tint = ResQGreen
        )
      }
      Text(
        text = "Back",
        fontSize = 15.sp,
        fontWeight = FontWeight.Bold,
        color = ResQGreen
      )
    }

    Text(
      text = "RESQ",
      fontSize = 11.sp,
      fontWeight = FontWeight.ExtraBold,
      letterSpacing = 1.6.sp,
      color = ResQGreen
    )

    Spacer(Modifier.height(4.dp))

    Text(
      text = title,
      fontSize = 28.sp,
      fontWeight = FontWeight.ExtraBold,
      fontFamily = FontFamily.SansSerif,
      color = ResQGreenDark
    )

    Spacer(Modifier.height(4.dp))

    Text(
      text = subtitle,
      fontSize = 14.sp,
      color = ResQGreenMuted
    )

    Spacer(Modifier.height(16.dp))

    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(ResQLine))

    content()

    Spacer(Modifier.height(32.dp))
  }
}

@Composable
fun EmergencyHistoryScreen(
  historyItems: List<EmergencyHistoryItem>,
  onBack: () -> Unit,
  modifier: Modifier = Modifier
) {
  SecondaryPageScaffold(
    title = "Emergency history",
    subtitle = "A factual record of previous ResQ activity.",
    onBack = onBack,
    modifier = modifier.testTag("emergency_history_screen")
  ) {
    if (historyItems.isEmpty()) {
      ResQRowItem(
        label = "No previous events",
        value = "Your emergency activity will appear here",
        action = null
      )
    } else {
      historyItems.forEach { item ->
        ResQRowItem(
          label = "${item.title} · ${item.date} ${item.time}",
          value = "${item.patientName} (${item.status})",
          action = "Details",
          icon = Icons.Default.Info
        )
      }
    }
  }
}

@Composable
fun EmergencyContactsScreen(
  profile: PatientProfile,
  onUpdateProfile: (PatientProfile) -> Unit,
  onBack: () -> Unit,
  modifier: Modifier = Modifier
) {
  var showEditContactDialog by remember { mutableStateOf(false) }
  var contactText by remember { mutableStateOf(profile.contact) }

  SecondaryPageScaffold(
    title = "Emergency contacts",
    subtitle = "Choose who receives ResQ alerts.",
    onBack = onBack,
    modifier = modifier.testTag("emergency_contacts_screen")
  ) {
    ResQRowItem(
      label = "Primary contact",
      value = profile.contact,
      action = "Edit",
      icon = Icons.Default.Phone,
      onClick = { showEditContactDialog = true }
    )

    profile.additionalContacts.forEachIndexed { index, contact ->
      ResQRowItem(
        label = "Additional contact #${index + 1}",
        value = contact,
        action = "Edit",
        icon = Icons.Default.Phone
      )
    }

    ResQRowItem(
      label = "Automatic alerts",
      value = if (profile.receiveAlerts) "Enabled for Hyper SOS" else "Disabled",
      action = "Change",
      onClick = {
        onUpdateProfile(profile.copy(receiveAlerts = !profile.receiveAlerts))
      }
    )
  }

  if (showEditContactDialog) {
    AlertDialog(
      onDismissRequest = { showEditContactDialog = false },
      title = { Text("Edit Primary Contact", fontWeight = FontWeight.Bold) },
      text = {
        OutlinedTextField(
          value = contactText,
          onValueChange = { contactText = it },
          label = { Text("Name · Phone Number") },
          modifier = Modifier.fillMaxWidth()
        )
      },
      confirmButton = {
        Button(
          onClick = {
            onUpdateProfile(profile.copy(contact = contactText))
            showEditContactDialog = false
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Save", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { showEditContactDialog = false }) {
          Text("Cancel", color = ResQGreenMuted)
        }
      }
    )
  }
}

@Composable
fun MediclaimScreen(
  profile: PatientProfile,
  onUpdateProfile: (PatientProfile) -> Unit,
  onBack: () -> Unit,
  modifier: Modifier = Modifier
) {
  var showEditDialog by remember { mutableStateOf(false) }
  var mediclaim by remember { mutableStateOf(profile.mediclaim) }
  var tpa by remember { mutableStateOf(profile.mediclaimTpa) }
  var helpline by remember { mutableStateOf(profile.mediclaimHelpline) }

  SecondaryPageScaffold(
    title = "Mediclaim",
    subtitle = "Policy details available during a medical situation.",
    onBack = onBack,
    modifier = modifier.testTag("mediclaim_screen")
  ) {
    ResQRowItem(
      label = "Policy & Provider",
      value = profile.mediclaim,
      action = "Edit",
      onClick = { showEditDialog = true }
    )

    ResQRowItem(
      label = "TPA Reference",
      value = profile.mediclaimTpa,
      action = "Edit",
      onClick = { showEditDialog = true }
    )

    ResQRowItem(
      label = "24x7 Insurance Helpline",
      value = profile.mediclaimHelpline,
      action = "Edit",
      onClick = { showEditDialog = true }
    )

    ResQRowItem(
      label = "Cashless Approval",
      value = "Share emergency summary with hospital TPA desk",
      action = null
    )
  }

  if (showEditDialog) {
    AlertDialog(
      onDismissRequest = { showEditDialog = false },
      title = { Text("Edit Mediclaim Details", fontWeight = FontWeight.Bold) },
      text = {
        Column {
          OutlinedTextField(
            value = mediclaim,
            onValueChange = { mediclaim = it },
            label = { Text("Provider & Policy Number") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = tpa,
            onValueChange = { tpa = it },
            label = { Text("TPA Provider Name") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = helpline,
            onValueChange = { helpline = it },
            label = { Text("Helpline Number") },
            modifier = Modifier.fillMaxWidth()
          )
        }
      },
      confirmButton = {
        Button(
          onClick = {
            onUpdateProfile(
              profile.copy(
                mediclaim = mediclaim,
                mediclaimTpa = tpa,
                mediclaimHelpline = helpline
              )
            )
            showEditDialog = false
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Save", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { showEditDialog = false }) {
          Text("Cancel", color = ResQGreenMuted)
        }
      }
    )
  }
}

@Composable
fun PreferredHospitalsScreen(
  profile: PatientProfile,
  onUpdateProfile: (PatientProfile) -> Unit,
  onBack: () -> Unit,
  modifier: Modifier = Modifier
) {
  var showEditDialog by remember { mutableStateOf(false) }
  var hospitalName by remember { mutableStateOf(profile.hospital) }
  var hospitalPhone by remember { mutableStateOf(profile.hospitalPhone) }

  SecondaryPageScaffold(
    title = "Preferred hospitals",
    subtitle = "A preference only. Emergency professionals decide the destination.",
    onBack = onBack,
    modifier = modifier.testTag("preferred_hospitals_screen")
  ) {
    ResQRowItem(
      label = "Preferred hospital",
      value = profile.hospital,
      action = "Edit",
      onClick = { showEditDialog = true }
    )

    ResQRowItem(
      label = "Hospital Emergency Phone",
      value = profile.hospitalPhone,
      action = "Edit",
      onClick = { showEditDialog = true }
    )

    ResQRowItem(
      label = "Emergency Route Advice",
      value = "Always notify 112 paramedic crew of chosen hospital",
      action = null
    )
  }

  if (showEditDialog) {
    AlertDialog(
      onDismissRequest = { showEditDialog = false },
      title = { Text("Edit Preferred Hospital", fontWeight = FontWeight.Bold) },
      text = {
        Column {
          OutlinedTextField(
            value = hospitalName,
            onValueChange = { hospitalName = it },
            label = { Text("Hospital Name & Branch") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = hospitalPhone,
            onValueChange = { hospitalPhone = it },
            label = { Text("Emergency Phone Number") },
            modifier = Modifier.fillMaxWidth()
          )
        }
      },
      confirmButton = {
        Button(
          onClick = {
            onUpdateProfile(
              profile.copy(
                hospital = hospitalName,
                hospitalPhone = hospitalPhone
              )
            )
            showEditDialog = false
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Save", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { showEditDialog = false }) {
          Text("Cancel", color = ResQGreenMuted)
        }
      }
    )
  }
}

@Composable
fun PermissionsSettingsScreen(
  location: String,
  onToggleLocation: () -> Unit,
  onBack: () -> Unit,
  modifier: Modifier = Modifier
) {
  SecondaryPageScaffold(
    title = "Permissions & privacy",
    subtitle = "Control what ResQ can access and share.",
    onBack = onBack,
    modifier = modifier.testTag("permissions_screen")
  ) {
    val isLocOn = !location.contains("off", ignoreCase = true)
    ResQRowItem(
      label = "Location",
      value = if (isLocOn) "While using ResQ" else "Off",
      action = if (isLocOn) "Active" else "Fix",
      onClick = onToggleLocation
    )

    ResQRowItem(
      label = "Family alerts",
      value = "On for Hyper SOS",
      action = "Change"
    )

    ResQRowItem(
      label = "Medical sharing",
      value = "Emergency summary only",
      action = "Change"
    )

    ResQRowItem(
      label = "Language",
      value = "English",
      action = "Change"
    )

    ResQRowItem(
      label = "Truthful status guarantee",
      value = "Verified local telemetry only · No simulated fleets",
      action = null
    )
  }
}

@Composable
fun LocationManagementScreen(
  currentLocation: String,
  onRefreshLocation: () -> Unit,
  onSetCustomLocation: (String) -> Unit,
  onBack: () -> Unit,
  modifier: Modifier = Modifier
) {
  var showCustomDialog by remember { mutableStateOf(false) }
  var customAddress by remember { mutableStateOf(currentLocation) }

  SecondaryPageScaffold(
    title = "Location",
    subtitle = "ResQ uses the phone's location. Confirm if the patient is elsewhere.",
    onBack = onBack,
    modifier = modifier.testTag("location_management_screen")
  ) {
    ResQRowItem(
      label = "Current location",
      value = currentLocation,
      action = "Refresh",
      icon = Icons.Default.Place,
      onClick = onRefreshLocation
    )

    ResQRowItem(
      label = "Patient location",
      value = "With me (phone position)",
      action = "Change",
      onClick = { showCustomDialog = true }
    )

    ResQRowItem(
      label = "Home address",
      value = "Indiranagar, Bangalore, Karnataka",
      action = "Edit"
    )
  }

  if (showCustomDialog) {
    AlertDialog(
      onDismissRequest = { showCustomDialog = false },
      title = { Text("Update Patient Location", fontWeight = FontWeight.Bold) },
      text = {
        OutlinedTextField(
          value = customAddress,
          onValueChange = { customAddress = it },
          label = { Text("Specify Patient Location") },
          placeholder = { Text("e.g. 100 Feet Rd, Indiranagar, Bangalore") },
          modifier = Modifier.fillMaxWidth()
        )
      },
      confirmButton = {
        Button(
          onClick = {
            onSetCustomLocation(customAddress)
            showCustomDialog = false
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Update", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { showCustomDialog = false }) {
          Text("Cancel", color = ResQGreenMuted)
        }
      }
    )
  }
}
