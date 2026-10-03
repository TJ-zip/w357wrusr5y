package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.SosSession
import com.example.ui.components.ResQLogo
import com.example.ui.components.ResQRowItem
import com.example.ui.theme.ResQGreen
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQGreenSoft
import com.example.ui.theme.ResQLine
import com.example.ui.theme.ResQRed
import com.example.ui.theme.ResQWhite
import kotlinx.coroutines.delay

@Composable
fun ActiveSosScreen(
  session: SosSession,
  location: String,
  onCancelSos: () -> Unit,
  onChangePatient: () -> Unit,
  onAddDetail: (String) -> Unit,
  onFixLocation: () -> Unit,
  onViewFamily: () -> Unit,
  modifier: Modifier = Modifier
) {
  val context = LocalContext.current
  var elapsedSeconds by remember { mutableIntStateOf(0) }
  var scriptExpanded by remember { mutableStateOf(false) }
  var showDetailDialog by remember { mutableStateOf(false) }
  var detailText by remember { mutableStateOf(session.detail) }
  var showCancelConfirmDialog by remember { mutableStateOf(false) }

  BackHandler {
    showCancelConfirmDialog = true
  }

  LaunchedEffect(Unit) {
    while (true) {
      delay(1000L)
      elapsedSeconds += 1
    }
  }

  val minutes = (elapsedSeconds / 60).toString().padStart(2, '0')
  val seconds = (elapsedSeconds % 60).toString().padStart(2, '0')

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ResQWhite)
      .testTag("active_sos_screen")
  ) {
    // 1. Header with Logo & Cancel SOS
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .height(64.dp)
        .padding(horizontal = 16.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      ResQLogo()

      Box(
        modifier = Modifier
          .heightIn(min = 48.dp)
          .clickable { showCancelConfirmDialog = true }
          .padding(horizontal = 8.dp)
          .testTag("cancel_sos_header_button"),
        contentAlignment = Alignment.Center
      ) {
        Text(
          text = "Cancel SOS",
          fontSize = 14.sp,
          fontWeight = FontWeight.Bold,
          color = ResQRed
        )
      }
    }

    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(1.dp)
        .background(ResQLine)
    )

    // 2. Incident Status Banner (Left border 4dp red, bg #E8F3EE)
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .background(ResQGreenSoft)
    ) {
      Box(
        modifier = Modifier
          .width(4.dp)
          .height(100.dp)
          .background(ResQRed)
      )

      Column(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 14.dp, vertical = 12.dp)
      ) {
        Text(
          text = "SOS active · $minutes:$seconds",
          fontSize = 13.sp,
          fontWeight = FontWeight.Bold,
          color = ResQGreenMuted
        )
        Spacer(Modifier.height(4.dp))
        Text(
          text = session.statusTitle,
          fontSize = 22.sp,
          fontWeight = FontWeight.ExtraBold,
          fontFamily = FontFamily.SansSerif,
          color = ResQGreenDark
        )
        Spacer(Modifier.height(4.dp))
        Text(
          text = session.statusDetail,
          fontSize = 14.sp,
          lineHeight = 20.sp,
          color = ResQGreenMuted
        )
      }
    }

    // 3. What ResQ has done progress steps
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
      Text(
        text = "WHAT RESQ HAS DONE",
        fontSize = 11.sp,
        fontWeight = FontWeight.ExtraBold,
        letterSpacing = 1.2.sp,
        color = ResQGreen
      )

      Spacer(Modifier.height(8.dp))

      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        session.steps.forEach { step ->
          Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.weight(1f)
          ) {
            Box(
              modifier = Modifier
                .size(28.dp)
                .background(
                  if (step.done) ResQGreen else ResQWhite,
                  shape = RoundedCornerShape(4.dp)
                )
                .border(
                  width = 1.dp,
                  color = if (step.done) ResQGreen else ResQLine,
                  shape = RoundedCornerShape(4.dp)
                ),
              contentAlignment = Alignment.Center
            ) {
              if (step.done) {
                Icon(
                  imageVector = Icons.Default.Check,
                  contentDescription = "${step.label} completed",
                  tint = ResQWhite,
                  modifier = Modifier.size(16.dp)
                )
              } else {
                Icon(
                  imageVector = Icons.Default.DateRange,
                  contentDescription = "${step.label} pending",
                  tint = ResQGreenMuted,
                  modifier = Modifier.size(14.dp)
                )
              }
            }
            Spacer(Modifier.height(4.dp))
            Text(
              text = step.label,
              fontSize = 11.sp,
              fontWeight = FontWeight.SemiBold,
              color = ResQGreenMuted
            )
          }
        }
      }
    }

    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(1.dp)
        .background(ResQLine)
    )

    // 4. Middle scrollable information rows
    Column(
      modifier = Modifier
        .weight(1f)
        .verticalScroll(rememberScrollState())
    ) {
      ResQRowItem(
        label = "Location",
        value = location,
        action = "Fix",
        icon = Icons.Default.Place,
        onClick = onFixLocation,
        testTag = "sos_location_row"
      )

      val allergyText = session.profile.allergies.firstOrNull() ?: "None"
      ResQRowItem(
        label = "Patient",
        value = "${session.profile.name} · Allergy: $allergyText",
        action = "Change",
        icon = Icons.Default.Person,
        onClick = onChangePatient,
        testTag = "sos_patient_row"
      )

      ResQRowItem(
        label = "Family",
        value = session.familyStatus,
        action = "View",
        icon = Icons.Default.Info,
        onClick = onViewFamily,
        testTag = "sos_family_row"
      )

      ResQRowItem(
        label = "Tell the operator",
        value = "Read this summary to 112",
        action = if (scriptExpanded) "Close" else "Open",
        icon = Icons.Default.Warning,
        onClick = { scriptExpanded = !scriptExpanded },
        testTag = "sos_operator_script_row"
      )

      // Operator script expanded container
      AnimatedVisibility(visible = scriptExpanded) {
        Column(
          modifier = Modifier
            .fillMaxWidth()
            .background(ResQGreenSoft)
            .padding(16.dp)
            .testTag("operator_script_container")
        ) {
          Text(
            text = "My name is ${session.profile.name}. I am at $location.",
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = ResQGreenDark,
            lineHeight = 22.sp
          )
          Spacer(Modifier.height(4.dp))
          Text(
            text = "Known condition: ${session.profile.conditions.joinToString(", ")}.",
            fontSize = 14.sp,
            color = ResQGreenDark
          )
          Text(
            text = "Allergy: ${session.profile.allergies.joinToString(", ")}.",
            fontSize = 14.sp,
            color = ResQGreenDark
          )
          Text(
            text = "Current medicine: ${session.profile.medicines.joinToString(", ")}.",
            fontSize = 14.sp,
            color = ResQGreenDark
          )
          Spacer(Modifier.height(8.dp))
          Text(
            text = "Confirm the location and emergency details directly with the operator.",
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = ResQGreenDark
          )
        }
      }

      ResQRowItem(
        label = "What is happening?",
        value = if (session.detail.isNotBlank()) session.detail else "Not added",
        action = if (session.detail.isNotBlank()) "Edit" else "Add",
        icon = Icons.Default.Info,
        onClick = {
          detailText = session.detail
          showDetailDialog = true
        },
        testTag = "sos_detail_row"
      )
    }

    // 5. Bottom Action Controls (NO Call 112 CTA)
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .background(ResQWhite)
        .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
      Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxWidth()
      ) {
        OutlinedButton(
          onClick = onFixLocation,
          shape = RoundedCornerShape(4.dp),
          modifier = Modifier.weight(1f).heightIn(min = 48.dp)
        ) {
          Icon(
            imageVector = Icons.Default.Place,
            contentDescription = null,
            tint = ResQGreen,
            modifier = Modifier.size(16.dp)
          )
          Spacer(Modifier.width(4.dp))
          Text("Update location", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ResQGreenDark)
        }

        OutlinedButton(
          onClick = onChangePatient,
          shape = RoundedCornerShape(4.dp),
          modifier = Modifier.weight(1f).heightIn(min = 48.dp)
        ) {
          Icon(
            imageVector = Icons.Default.Person,
            contentDescription = null,
            tint = ResQGreen,
            modifier = Modifier.size(16.dp)
          )
          Spacer(Modifier.width(4.dp))
          Text("Change patient", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ResQGreenDark)
        }
      }

      Spacer(Modifier.height(8.dp))

      Button(
        onClick = {
          detailText = session.detail
          showDetailDialog = true
        },
        shape = RoundedCornerShape(4.dp),
        colors = ButtonDefaults.buttonColors(
          containerColor = ResQGreen,
          contentColor = ResQWhite
        ),
        modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)
      ) {
        Text("Add emergency details", fontSize = 14.sp, fontWeight = FontWeight.Bold)
      }

      Spacer(Modifier.height(8.dp))

      Button(
        onClick = onCancelSos,
        shape = RoundedCornerShape(4.dp),
        colors = ButtonDefaults.buttonColors(
          containerColor = ResQWhite,
          contentColor = ResQRed
        ),
        border = androidx.compose.foundation.BorderStroke(1.dp, ResQRed),
        modifier = Modifier.fillMaxWidth().heightIn(min = 44.dp)
      ) {
        Text("Cancel Get ResQ", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ResQRed)
      }
    }
  }

  // Cancel Confirmation Dialog
  if (showCancelConfirmDialog) {
    AlertDialog(
      onDismissRequest = { showCancelConfirmDialog = false },
      title = {
        Text(
          text = "Cancel emergency SOS?",
          fontWeight = FontWeight.Bold,
          color = ResQGreenDark
        )
      },
      text = {
        Text(
          text = "Are you sure you want to end this active emergency session? This will be saved to your emergency history.",
          color = ResQGreenMuted
        )
      },
      confirmButton = {
        Button(
          onClick = {
            showCancelConfirmDialog = false
            onCancelSos()
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQRed)
        ) {
          Text("End SOS", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { showCancelConfirmDialog = false }) {
          Text("Keep active", color = ResQGreen, fontWeight = FontWeight.Bold)
        }
      }
    )
  }

  // Add/Edit detail dialog
  if (showDetailDialog) {
    AlertDialog(
      onDismissRequest = { showDetailDialog = false },
      title = {
        Text(
          text = "What is happening?",
          fontWeight = FontWeight.Bold,
          color = ResQGreenDark
        )
      },
      text = {
        Column {
          Text(
            text = "Add brief notes about symptoms or circumstances for emergency personnel.",
            fontSize = 13.sp,
            color = ResQGreenMuted,
            modifier = Modifier.padding(bottom = 8.dp)
          )
          OutlinedTextField(
            value = detailText,
            onValueChange = { detailText = it },
            placeholder = { Text("e.g. Chest discomfort, severe fall, allergic reaction") },
            modifier = Modifier.fillMaxWidth()
          )
        }
      },
      confirmButton = {
        Button(
          onClick = {
            onAddDetail(detailText)
            showDetailDialog = false
          },
          colors = ButtonDefaults.buttonColors(containerColor = ResQGreen)
        ) {
          Text("Save", fontWeight = FontWeight.Bold)
        }
      },
      dismissButton = {
        TextButton(onClick = { showDetailDialog = false }) {
          Text("Cancel", color = ResQGreenMuted)
        }
      }
    )
  }
}
