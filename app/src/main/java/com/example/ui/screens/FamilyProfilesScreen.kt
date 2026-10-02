package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
import com.example.ui.theme.ResQRed
import com.example.ui.theme.ResQWhite
import java.util.UUID

@Composable
fun FamilyProfilesScreen(
  profiles: List<PatientProfile>,
  onAddProfile: (PatientProfile) -> Unit,
  onRemoveProfile: (String) -> Unit,
  onSelectProfile: (PatientProfile) -> Unit,
  onBack: () -> Unit,
  modifier: Modifier = Modifier
) {
  var showAddDialog by remember { mutableStateOf(false) }
  var profileToInspect by remember { mutableStateOf<PatientProfile?>(null) }

  BackHandler {
    onBack()
  }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ResQWhite)
      .verticalScroll(rememberScrollState())
      .padding(horizontal = 16.dp, vertical = 12.dp)
      .testTag("family_profiles_screen")
  ) {
    // Top Bar Back Navigation
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
      text = "Family profiles",
      fontSize = 28.sp,
      fontWeight = FontWeight.ExtraBold,
      fontFamily = FontFamily.SansSerif,
      color = ResQGreenDark
    )

    Spacer(Modifier.height(4.dp))

    Text(
      text = "Create a managed profile or link an independent ResQ account.",
      fontSize = 14.sp,
      color = ResQGreenMuted
    )

    Spacer(Modifier.height(16.dp))

    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(ResQLine))

    profiles.forEach { profile ->
      val typeLabel = if (profile.id == "self") "Account owner" else if (profile.isManaged) "Managed profile" else "Linked ResQ"
      ResQRowItem(
        label = "${profile.relation} · ${profile.age} years ($typeLabel)",
        value = profile.name,
        action = "Open",
        icon = Icons.Default.Person,
        onClick = { profileToInspect = profile },
        testTag = "family_row_${profile.id}"
      )
    }

    Spacer(Modifier.height(24.dp))

    ResQTapButton(
      text = "Add or link family member",
      onClick = { showAddDialog = true },
      tone = TapButtonTone.PRIMARY,
      icon = Icons.Default.Add,
      testTag = "add_family_button"
    )

    Spacer(Modifier.height(32.dp))
  }

  // Add Family Member Dialog
  if (showAddDialog) {
    var name by remember { mutableStateOf("") }
    var relation by remember { mutableStateOf("") }
    var age by remember { mutableStateOf("") }
    var bloodGroup by remember { mutableStateOf("O+") }
    var allergy by remember { mutableStateOf("") }
    var isManaged by remember { mutableStateOf(true) }

    AlertDialog(
      onDismissRequest = { showAddDialog = false },
      title = { Text("Add Family Member", fontWeight = FontWeight.Bold, color = ResQGreenDark) },
      text = {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
          OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Full Name") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = relation,
            onValueChange = { relation = it },
            label = { Text("Relationship (e.g. Mother, Son, Spouse)") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = age,
            onValueChange = { age = it },
            label = { Text("Age") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = bloodGroup,
            onValueChange = { bloodGroup = it },
            label = { Text("Blood Group (e.g. A+, B+, O+)") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = allergy,
            onValueChange = { allergy = it },
            label = { Text("Known Allergies (if any)") },
            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
          )
          Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
          ) {
            Column(modifier = Modifier.weight(1f)) {
              Text("Managed Profile", fontWeight = FontWeight.Bold, fontSize = 14.sp)
              Text("Managed under this phone", fontSize = 12.sp, color = ResQGreenMuted)
            }
            Switch(
              checked = isManaged,
              onCheckedChange = { isManaged = it },
              colors = SwitchDefaults.colors(checkedThumbColor = ResQGreen)
            )
          }
        }
      },
      confirmButton = {
        Button(
          onClick = {
            if (name.isNotBlank()) {
              val initials = name.trim().split(" ")
                .mapNotNull { it.firstOrNull()?.uppercase() }
                .take(2)
                .joinToString("")
                .ifEmpty { "FM" }

              val newProfile = PatientProfile(
                id = "fam_${UUID.randomUUID().toString().take(6)}",
                name = name,
                relation = relation.ifBlank { "Family" },
                age = age.ifBlank { "Unknown" },
                initials = initials,
                bloodGroup = bloodGroup,
                allergies = if (allergy.isNotBlank()) listOf(allergy) else listOf("No allergy added"),
                isManaged = isManaged,
                updated = "Today"
              )
              onAddProfile(newProfile)
              showAddDialog = false
            }
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Add Profile", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { showAddDialog = false }) {
          Text("Cancel", color = ResQGreenMuted)
        }
      }
    )
  }

  // Profile Details / Actions Dialog
  profileToInspect?.let { inspected ->
    AlertDialog(
      onDismissRequest = { profileToInspect = null },
      title = {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Box(
            modifier = Modifier
              .size(36.dp)
              .clip(RoundedCornerShape(4.dp))
              .background(ResQGreenSoft),
            contentAlignment = Alignment.Center
          ) {
            Text(inspected.initials, fontWeight = FontWeight.ExtraBold, color = ResQGreen)
          }
          Spacer(Modifier.width(10.dp))
          Text(inspected.name, fontWeight = FontWeight.Bold, color = ResQGreenDark)
        }
      },
      text = {
        Column {
          Text("Relationship: ${inspected.relation}", fontSize = 14.sp, color = ResQGreenDark)
          Text("Age: ${inspected.age} years", fontSize = 14.sp, color = ResQGreenDark)
          Text("Blood Group: ${inspected.bloodGroup}", fontSize = 14.sp, color = ResQGreenDark)
          Text("Allergies: ${inspected.allergies.joinToString(", ")}", fontSize = 14.sp, color = ResQGreenDark)
          Text("Conditions: ${inspected.conditions.joinToString(", ")}", fontSize = 14.sp, color = ResQGreenDark)
          Text("Medicines: ${inspected.medicines.joinToString(", ")}", fontSize = 14.sp, color = ResQGreenDark)
        }
      },
      confirmButton = {
        Button(
          onClick = {
            onSelectProfile(inspected)
            profileToInspect = null
            onBack()
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Select as Patient", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        if (inspected.id != "self") {
          TextButton(
            onClick = {
              onRemoveProfile(inspected.id)
              profileToInspect = null
            }
          ) {
            Text("Remove", color = ResQRed)
          }
        } else {
          TextButton(onClick = { profileToInspect = null }) {
            Text("Close", color = ResQGreenMuted)
          }
        }
      }
    )
  }
}
