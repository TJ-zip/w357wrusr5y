package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
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
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.PatientProfile
import com.example.ui.theme.ResQGreen
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQGreenSoft
import com.example.ui.theme.ResQLine
import com.example.ui.theme.ResQWhite

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PersonPickerSheet(
  profiles: List<PatientProfile>,
  selected: PatientProfile,
  onChoose: (PatientProfile) -> Unit,
  onDismiss: () -> Unit,
  modifier: Modifier = Modifier
) {
  val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

  ModalBottomSheet(
    onDismissRequest = onDismiss,
    sheetState = sheetState,
    containerColor = ResQWhite,
    shape = RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp),
    dragHandle = null,
    modifier = modifier.testTag("person_picker_sheet")
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .verticalScroll(rememberScrollState())
        .padding(bottom = 32.dp)
    ) {
      // Sheet Header
      Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
          .fillMaxWidth()
          .height(64.dp)
          .padding(horizontal = 16.dp)
      ) {
        Text(
          text = "Who needs help?",
          fontSize = 21.sp,
          fontWeight = FontWeight.ExtraBold,
          fontFamily = FontFamily.SansSerif,
          color = ResQGreenDark,
          modifier = Modifier.weight(1f)
        )
        IconButton(
          onClick = onDismiss,
          modifier = Modifier.size(48.dp)
        ) {
          Icon(
            imageVector = Icons.Default.Close,
            contentDescription = "Close picker",
            tint = ResQGreen
          )
        }
      }

      Box(
        modifier = Modifier
          .fillMaxWidth()
          .height(1.dp)
          .background(ResQLine)
      )

      // Known Profiles
      profiles.forEach { person ->
        val isSelected = selected.id == person.id
        Row(
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 74.dp)
            .clickable { onChoose(person) }
            .padding(horizontal = 16.dp, vertical = 12.dp)
            .testTag("profile_item_${person.id}")
        ) {
          Box(
            modifier = Modifier
              .size(42.dp)
              .clip(RoundedCornerShape(4.dp))
              .background(ResQGreenSoft),
            contentAlignment = Alignment.Center
          ) {
            Text(
              text = person.initials,
              fontSize = 16.sp,
              fontWeight = FontWeight.ExtraBold,
              color = ResQGreen
            )
          }

          Spacer(Modifier.width(12.dp))

          Column(modifier = Modifier.weight(1f)) {
            Text(
              text = person.name,
              fontSize = 17.sp,
              fontWeight = FontWeight.Bold,
              color = ResQGreenDark
            )
            Spacer(Modifier.height(2.dp))
            Text(
              text = "${person.relation} · ${person.age} years",
              fontSize = 13.sp,
              fontWeight = FontWeight.SemiBold,
              color = ResQGreenMuted
            )
          }

          if (isSelected) {
            Icon(
              imageVector = Icons.Default.Check,
              contentDescription = "Selected",
              tint = ResQGreen,
              modifier = Modifier.size(24.dp)
            )
          }
        }

        Box(
          modifier = Modifier
            .fillMaxWidth()
            .height(1.dp)
            .background(ResQLine)
        )
      }

      // Someone else option
      Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
          .fillMaxWidth()
          .heightIn(min = 64.dp)
          .clickable {
            val someoneElse = PatientProfile(
              id = "someone_else",
              name = "Someone else",
              relation = "Unknown person",
              age = "Adult",
              initials = "?",
              conditions = listOf("Unknown"),
              allergies = listOf("Unknown"),
              medicines = listOf("Unknown"),
              procedures = listOf("Unknown"),
              implants = listOf("Unknown"),
              contact = "Not provided",
              hospital = "Emergency triage destination",
              mediclaim = "Not provided",
              updated = "Now"
            )
            onChoose(someoneElse)
          }
          .padding(horizontal = 16.dp)
          .testTag("profile_someone_else")
      ) {
        Text(
          text = "Someone else",
          fontSize = 16.sp,
          fontWeight = FontWeight.Bold,
          color = ResQGreen
        )
      }

      Box(
        modifier = Modifier
          .fillMaxWidth()
          .height(1.dp)
          .background(ResQLine)
      )

      // I don't know this person option
      Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
          .fillMaxWidth()
          .heightIn(min = 64.dp)
          .clickable {
            val unknownPerson = PatientProfile(
              id = "unknown_person",
              name = "Unknown person",
              relation = "Bystander aid",
              age = "Unknown",
              initials = "?",
              conditions = listOf("Unknown"),
              allergies = listOf("Unknown"),
              medicines = listOf("Unknown"),
              procedures = listOf("Unknown"),
              implants = listOf("Unknown"),
              contact = "Emergency dispatcher",
              hospital = "Nearest public hospital",
              mediclaim = "Not provided",
              updated = "Now"
            )
            onChoose(unknownPerson)
          }
          .padding(horizontal = 16.dp)
          .testTag("profile_unknown_person")
      ) {
        Text(
          text = "I don't know this person",
          fontSize = 16.sp,
          fontWeight = FontWeight.Bold,
          color = ResQGreen
        )
      }
    }
  }
}
