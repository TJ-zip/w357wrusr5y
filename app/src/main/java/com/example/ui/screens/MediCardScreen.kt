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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
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
import com.example.model.PatientProfile
import com.example.ui.components.ResQRowItem
import com.example.ui.components.ResQTapButton
import com.example.ui.components.TapButtonTone
import com.example.ui.theme.ResQGreen
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQGreenSoft
import com.example.ui.theme.ResQLine
import com.example.ui.theme.ResQWhite

@Composable
fun MediCardScreen(
  profile: PatientProfile,
  onUpdateProfile: (PatientProfile) -> Unit,
  onBack: () -> Unit,
  modifier: Modifier = Modifier
) {
  var editingField by remember { mutableStateOf<Pair<String, String>?>(null) }
  var showFullEditDialog by remember { mutableStateOf(false) }

  BackHandler {
    onBack()
  }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ResQWhite)
      .verticalScroll(rememberScrollState())
      .padding(horizontal = 16.dp, vertical = 12.dp)
      .testTag("medicard_screen")
  ) {
    // Back navigation button
    Row(
      verticalAlignment = Alignment.CenterVertically,
      modifier = Modifier
        .fillMaxWidth()
        .padding(bottom = 8.dp)
    ) {
      IconButton(
        onClick = onBack,
        modifier = Modifier.testTag("medicard_back_button")
      ) {
        Icon(
          imageVector = Icons.AutoMirrored.Filled.ArrowBack,
          contentDescription = "Back to home",
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
      text = "My MediCard",
      fontSize = 28.sp,
      fontWeight = FontWeight.ExtraBold,
      fontFamily = FontFamily.SansSerif,
      color = ResQGreenDark
    )

    Spacer(Modifier.height(4.dp))

    Text(
      text = "The essential information needed during a medical situation.",
      fontSize = 14.sp,
      color = ResQGreenMuted
    )

    Spacer(Modifier.height(16.dp))

    // Profile summary block
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .background(ResQGreenSoft)
        .padding(16.dp)
    ) {
      Column {
        Text(
          text = profile.name,
          fontSize = 19.sp,
          fontWeight = FontWeight.Bold,
          color = ResQGreenDark
        )
        Spacer(Modifier.height(2.dp))
        Text(
          text = "Last updated ${profile.updated}",
          fontSize = 13.sp,
          color = ResQGreenMuted
        )
      }
    }

    // 1. Identity section
    Spacer(Modifier.height(20.dp))
    Text(
      text = "IDENTITY",
      fontSize = 11.sp,
      fontWeight = FontWeight.ExtraBold,
      letterSpacing = 1.4.sp,
      color = ResQGreen
    )
    Spacer(Modifier.height(6.dp))
    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(ResQLine))

    ResQRowItem(
      label = "Name",
      value = profile.name,
      action = "Edit",
      onClick = { editingField = "Name" to profile.name }
    )
    ResQRowItem(
      label = "Age",
      value = profile.age,
      action = "Edit",
      onClick = { editingField = "Age" to profile.age }
    )
    ResQRowItem(
      label = "Blood group",
      value = profile.bloodGroup,
      action = "Edit",
      onClick = { editingField = "Blood group" to profile.bloodGroup }
    )
    ResQRowItem(
      label = "Phone number",
      value = profile.phone,
      action = "Edit",
      onClick = { editingField = "Phone number" to profile.phone }
    )
    ResQRowItem(
      label = "Home address",
      value = profile.address,
      action = "Edit",
      onClick = { editingField = "Home address" to profile.address }
    )
    ResQRowItem(
      label = "Preferred language",
      value = profile.preferredLanguage,
      action = "Edit",
      onClick = { editingField = "Preferred language" to profile.preferredLanguage }
    )

    // 2. Medical section
    Spacer(Modifier.height(20.dp))
    Text(
      text = "MEDICAL",
      fontSize = 11.sp,
      fontWeight = FontWeight.ExtraBold,
      letterSpacing = 1.4.sp,
      color = ResQGreen
    )
    Spacer(Modifier.height(6.dp))
    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(ResQLine))

    ResQRowItem(
      label = "Conditions",
      value = profile.conditions.joinToString(", "),
      action = "Edit",
      onClick = { editingField = "Conditions" to profile.conditions.joinToString(", ") }
    )
    ResQRowItem(
      label = "Allergies",
      value = profile.allergies.joinToString(", "),
      action = "Edit",
      urgent = profile.allergies.any { it != "No allergy added" && it != "None" },
      onClick = { editingField = "Allergies" to profile.allergies.joinToString(", ") }
    )
    ResQRowItem(
      label = "Current medicines",
      value = profile.medicines.joinToString(", "),
      action = "Edit",
      onClick = { editingField = "Medicines" to profile.medicines.joinToString(", ") }
    )
    ResQRowItem(
      label = "Procedures",
      value = profile.procedures.joinToString(", "),
      action = "Edit",
      onClick = { editingField = "Procedures" to profile.procedures.joinToString(", ") }
    )
    ResQRowItem(
      label = "Implants / Devices",
      value = profile.implants.joinToString(", "),
      action = "Edit",
      onClick = { editingField = "Implants" to profile.implants.joinToString(", ") }
    )
    ResQRowItem(
      label = "Mobility / Communication",
      value = profile.mobilityRequirements,
      action = "Edit",
      onClick = { editingField = "Mobility" to profile.mobilityRequirements }
    )

    // 3. Emergency Support section
    Spacer(Modifier.height(20.dp))
    Text(
      text = "EMERGENCY SUPPORT",
      fontSize = 11.sp,
      fontWeight = FontWeight.ExtraBold,
      letterSpacing = 1.4.sp,
      color = ResQGreen
    )
    Spacer(Modifier.height(6.dp))
    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(ResQLine))

    ResQRowItem(
      label = "Primary contact",
      value = profile.contact,
      action = "Edit",
      onClick = { editingField = "Primary contact" to profile.contact }
    )
    ResQRowItem(
      label = "Preferred hospital",
      value = profile.hospital,
      action = "Edit",
      onClick = { editingField = "Preferred hospital" to profile.hospital }
    )
    ResQRowItem(
      label = "Mediclaim provider",
      value = profile.mediclaim,
      action = "Edit",
      onClick = { editingField = "Mediclaim" to profile.mediclaim }
    )
    ResQRowItem(
      label = "TPA reference",
      value = profile.mediclaimTpa,
      action = "Edit",
      onClick = { editingField = "TPA" to profile.mediclaimTpa }
    )

    Spacer(Modifier.height(24.dp))

    ResQTapButton(
      text = "Edit MediCard",
      onClick = { showFullEditDialog = true },
      tone = TapButtonTone.PRIMARY,
      testTag = "edit_medicard_full_button"
    )

    Spacer(Modifier.height(32.dp))
  }

  // Field Edit Dialog
  if (editingField != null) {
    val fieldName = editingField!!.first
    var currentText by remember { mutableStateOf(editingField!!.second) }

    AlertDialog(
      onDismissRequest = { editingField = null },
      title = { Text(text = "Edit $fieldName", fontWeight = FontWeight.Bold) },
      text = {
        OutlinedTextField(
          value = currentText,
          onValueChange = { currentText = it },
          label = { Text(fieldName) },
          modifier = Modifier.fillMaxWidth()
        )
      },
      confirmButton = {
        Button(
          onClick = {
            val updated = when (fieldName) {
              "Name" -> profile.copy(name = currentText)
              "Age" -> profile.copy(age = currentText)
              "Blood group" -> profile.copy(bloodGroup = currentText)
              "Phone number" -> profile.copy(phone = currentText)
              "Home address" -> profile.copy(address = currentText)
              "Preferred language" -> profile.copy(preferredLanguage = currentText)
              "Conditions" -> profile.copy(conditions = currentText.split(",").map { it.trim() })
              "Allergies" -> profile.copy(allergies = currentText.split(",").map { it.trim() })
              "Medicines" -> profile.copy(medicines = currentText.split(",").map { it.trim() })
              "Procedures" -> profile.copy(procedures = currentText.split(",").map { it.trim() })
              "Implants" -> profile.copy(implants = currentText.split(",").map { it.trim() })
              "Mobility" -> profile.copy(mobilityRequirements = currentText)
              "Primary contact" -> profile.copy(contact = currentText)
              "Preferred hospital" -> profile.copy(hospital = currentText)
              "Mediclaim" -> profile.copy(mediclaim = currentText)
              "TPA" -> profile.copy(mediclaimTpa = currentText)
              else -> profile
            }
            onUpdateProfile(updated)
            editingField = null
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Save", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { editingField = null }) {
          Text("Cancel", color = ResQGreenMuted)
        }
      }
    )
  }

  // Full Edit Dialog
  if (showFullEditDialog) {
    var editName by remember { mutableStateOf(profile.name) }
    var editAge by remember { mutableStateOf(profile.age) }
    var editBlood by remember { mutableStateOf(profile.bloodGroup) }
    var editConditions by remember { mutableStateOf(profile.conditions.joinToString(", ")) }
    var editAllergies by remember { mutableStateOf(profile.allergies.joinToString(", ")) }
    var editMedicines by remember { mutableStateOf(profile.medicines.joinToString(", ")) }
    var editHospital by remember { mutableStateOf(profile.hospital) }
    var editMediclaim by remember { mutableStateOf(profile.mediclaim) }

    AlertDialog(
      onDismissRequest = { showFullEditDialog = false },
      title = { Text("Update MediCard", fontWeight = FontWeight.Bold) },
      text = {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
          OutlinedTextField(
            value = editName,
            onValueChange = { editName = it },
            label = { Text("Full Name") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = editAge,
            onValueChange = { editAge = it },
            label = { Text("Age") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = editBlood,
            onValueChange = { editBlood = it },
            label = { Text("Blood Group") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = editConditions,
            onValueChange = { editConditions = it },
            label = { Text("Conditions (comma separated)") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = editAllergies,
            onValueChange = { editAllergies = it },
            label = { Text("Allergies (comma separated)") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = editMedicines,
            onValueChange = { editMedicines = it },
            label = { Text("Current Medicines") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = editHospital,
            onValueChange = { editHospital = it },
            label = { Text("Preferred Hospital") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = editMediclaim,
            onValueChange = { editMediclaim = it },
            label = { Text("Mediclaim Provider & Policy") },
            modifier = Modifier.fillMaxWidth()
          )
        }
      },
      confirmButton = {
        Button(
          onClick = {
            val updated = profile.copy(
              name = editName,
              age = editAge,
              bloodGroup = editBlood,
              conditions = editConditions.split(",").map { it.trim() },
              allergies = editAllergies.split(",").map { it.trim() },
              medicines = editMedicines.split(",").map { it.trim() },
              hospital = editHospital,
              mediclaim = editMediclaim
            )
            onUpdateProfile(updated)
            showFullEditDialog = false
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Update", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { showFullEditDialog = false }) {
          Text("Cancel", color = ResQGreenMuted)
        }
      }
    )
  }
}
