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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.SosMode
import com.example.model.SosPreset
import com.example.ui.components.ResQLogo
import com.example.ui.components.ResQTapButton
import com.example.ui.components.TapButtonTone
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQRed
import com.example.ui.theme.ResQWhite
import kotlinx.coroutines.delay

@Composable
fun CountdownScreen(
  preset: SosPreset,
  onCancel: () -> Unit,
  onComplete: () -> Unit,
  modifier: Modifier = Modifier
) {
  var seconds by remember(preset) { mutableIntStateOf(5) }

  BackHandler {
    onCancel()
  }

  LaunchedEffect(seconds) {
    if (seconds <= 0) {
      onComplete()
    } else {
      delay(1000L)
      seconds -= 1
    }
  }

  Box(
    modifier = modifier
      .fillMaxSize()
      .background(ResQWhite)
      .padding(horizontal = 20.dp, vertical = 24.dp)
      .testTag("countdown_screen")
  ) {
    Column(
      modifier = Modifier.fillMaxSize(),
      verticalArrangement = Arrangement.SpaceBetween
    ) {
      // Header: Logo & Starting indicator
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        ResQLogo()
        Text(
          text = "STARTING",
          fontSize = 12.sp,
          fontWeight = FontWeight.ExtraBold,
          letterSpacing = 1.5.sp,
          color = ResQRed
        )
      }

      // Middle: Countdown display & explanation
      Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.fillMaxWidth()
      ) {
        Text(
          text = preset.title.uppercase(),
          fontSize = 13.sp,
          fontWeight = FontWeight.ExtraBold,
          letterSpacing = 2.sp,
          color = ResQRed
        )

        Spacer(Modifier.height(24.dp))

        Text(
          text = seconds.toString(),
          fontSize = 108.sp,
          fontWeight = FontWeight.ExtraBold,
          fontFamily = FontFamily.SansSerif,
          color = ResQRed,
          lineHeight = 108.sp,
          modifier = Modifier.testTag("countdown_timer_text")
        )

        Spacer(Modifier.height(20.dp))

        Text(
          text = "Starting in $seconds seconds",
          fontSize = 26.sp,
          fontWeight = FontWeight.ExtraBold,
          fontFamily = FontFamily.SansSerif,
          color = ResQGreenDark,
          textAlign = TextAlign.Center
        )

        Spacer(Modifier.height(14.dp))

        val desc = when (preset.mode) {
          SosMode.HYPER -> "Location, MediCard and connected family alerts will initialize."
          SosMode.REACH -> "Your trusted contacts will be alerted and ResQ will call you."
          SosMode.CALL -> "ResQ will open the phone calling interface for ${preset.number}."
        }

        Text(
          text = desc,
          fontSize = 15.sp,
          lineHeight = 22.sp,
          fontWeight = FontWeight.Normal,
          color = ResQGreenMuted,
          textAlign = TextAlign.Center,
          modifier = Modifier.padding(horizontal = 16.dp)
        )
      }

      // Bottom Cancel button
      ResQTapButton(
        text = "Cancel",
        onClick = onCancel,
        tone = TapButtonTone.RED_OUTLINE,
        icon = Icons.Default.Close,
        testTag = "countdown_cancel_button"
      )
    }
  }
}
