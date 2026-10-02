package com.example.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Place
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.PatientProfile
import com.example.model.SosPreset
import com.example.ui.components.ResQLaunchRail
import com.example.ui.theme.ResQGreen
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQGreenSoft
import com.example.ui.theme.ResQLine
import com.example.ui.theme.ResQRed
import com.example.ui.theme.ResQWhite

@Composable
fun HomeScreen(
  profile: PatientProfile,
  location: String,
  onStartPreset: (SosPreset) -> Unit,
  onChangePatient: () -> Unit,
  onLocationClick: () -> Unit,
  onReachMeClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  val context = LocalContext.current

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ResQWhite)
      .padding(horizontal = 16.dp, vertical = 8.dp),
    verticalArrangement = Arrangement.SpaceBetween
  ) {
    // 1. Current Location Row
    Row(
      verticalAlignment = Alignment.CenterVertically,
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = 60.dp)
        .clickable { onLocationClick() }
        .testTag("home_location_row")
    ) {
      Icon(
        imageVector = Icons.Default.Place,
        contentDescription = "Location icon",
        tint = ResQGreen,
        modifier = Modifier.size(24.dp)
      )
      Spacer(Modifier.width(12.dp))
      Column(modifier = Modifier.weight(1f)) {
        Text(
          text = location,
          fontSize = 16.sp,
          fontWeight = FontWeight.Bold,
          color = ResQGreenDark,
          maxLines = 1,
          overflow = TextOverflow.Ellipsis
        )
        Text(
          text = "Your phone's location",
          fontSize = 12.sp,
          fontWeight = FontWeight.SemiBold,
          color = ResQGreenMuted
        )
      }
      Box(
        modifier = Modifier
          .heightIn(min = 48.dp)
          .padding(horizontal = 8.dp),
        contentAlignment = Alignment.Center
      ) {
        Text(
          text = "Edit",
          fontSize = 14.sp,
          fontWeight = FontWeight.Bold,
          color = ResQGreen
        )
      }
    }

    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(1.dp)
        .background(ResQLine)
    )

    Spacer(Modifier.height(8.dp))

    // 2. Middle Launch Area (Hyper SOS Rail + Tap alternative)
    Column(
      horizontalAlignment = Alignment.CenterHorizontally,
      modifier = Modifier.fillMaxWidth()
    ) {
      ResQLaunchRail(
        onHyper = {
          onStartPreset(
            SosPreset(
              id = "hyper",
              title = "Hyper SOS",
              subtitle = "Medical emergency",
              number = "112",
              mode = com.example.model.SosMode.HYPER,
              alerts = true
            )
          )
        }
      )

      Spacer(Modifier.height(8.dp))

      // Accessible tap alternative
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .heightIn(min = 48.dp)
          .clickable {
            onStartPreset(
              SosPreset(
                id = "hyper",
                title = "Hyper SOS",
                subtitle = "Medical emergency",
                number = "112",
                mode = com.example.model.SosMode.HYPER,
                alerts = true
              )
            )
          }
          .testTag("tap_alternative_hyper_sos"),
        contentAlignment = Alignment.Center
      ) {
        Text(
          text = "Tap instead to start Hyper SOS",
          fontSize = 14.sp,
          fontWeight = FontWeight.Bold,
          color = ResQRed
        )
      }
    }

    Spacer(Modifier.height(8.dp))

    // 3. Bottom emergency actions (Call 112, Patient, Reach Me)
    Column(modifier = Modifier.fillMaxWidth()) {
      // Call 112 Action button
      OutlinedButton(
        onClick = {
          val dialIntent = Intent(Intent.ACTION_DIAL).apply {
            data = Uri.parse("tel:112")
          }
          context.startActivity(dialIntent)
        },
        shape = RoundedCornerShape(6.dp),
        border = androidx.compose.foundation.BorderStroke(2.dp, ResQRed),
        colors = ButtonDefaults.outlinedButtonColors(
          containerColor = ResQWhite,
          contentColor = ResQRed
        ),
        modifier = Modifier
          .fillMaxWidth()
          .heightIn(min = 64.dp)
          .testTag("call_112_button")
      ) {
        Icon(
          imageVector = Icons.Default.Phone,
          contentDescription = "Phone icon",
          tint = ResQRed,
          modifier = Modifier.size(24.dp)
        )
        Spacer(Modifier.width(10.dp))
        Text(
          text = "Call 112",
          fontSize = 21.sp,
          fontWeight = FontWeight.ExtraBold,
          color = ResQRed
        )
      }

      Spacer(Modifier.height(10.dp))

      Box(
        modifier = Modifier
          .fillMaxWidth()
          .height(1.dp)
          .background(ResQLine)
      )

      // Selected patient row & Reach Me action
      Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
          .fillMaxWidth()
          .heightIn(min = 68.dp)
          .clickable { onChangePatient() }
          .testTag("patient_selection_row")
      ) {
        Box(
          modifier = Modifier
            .size(42.dp)
            .clip(RoundedCornerShape(4.dp))
            .background(ResQGreenSoft),
          contentAlignment = Alignment.Center
        ) {
          Text(
            text = profile.initials,
            fontSize = 16.sp,
            fontWeight = FontWeight.ExtraBold,
            color = ResQGreen
          )
        }

        Spacer(Modifier.width(12.dp))

        Column(modifier = Modifier.weight(1f)) {
          Text(
            text = "Patient",
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = ResQGreenMuted
          )
          Spacer(Modifier.height(2.dp))
          Text(
            text = "${profile.name} · ${profile.age}",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = ResQGreenDark,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
          )
        }

        Box(
          modifier = Modifier
            .heightIn(min = 48.dp)
            .padding(horizontal = 8.dp),
          contentAlignment = Alignment.Center
        ) {
          Text(
            text = "Change",
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = ResQGreen
          )
        }
      }

      // Secondary Reach Me button row
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(top = 4.dp, bottom = 4.dp),
        horizontalArrangement = Arrangement.End
      ) {
        OutlinedButton(
          onClick = onReachMeClick,
          shape = RoundedCornerShape(4.dp),
          border = androidx.compose.foundation.BorderStroke(1.dp, ResQGreen),
          colors = ButtonDefaults.outlinedButtonColors(
            containerColor = ResQWhite,
            contentColor = ResQGreen
          ),
          modifier = Modifier
            .heightIn(min = 48.dp)
            .testTag("reach_me_button")
        ) {
          Text(
            text = "Reach Me",
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = ResQGreen
          )
        }
      }
    }
  }
}
