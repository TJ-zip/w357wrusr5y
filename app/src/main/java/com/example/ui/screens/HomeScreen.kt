package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.PatientProfile
import com.example.model.SosMode
import com.example.model.SosPreset
import com.example.ui.theme.ResQGreen
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQGreenSoft
import com.example.ui.theme.ResQLine
import com.example.ui.theme.ResQRed
import com.example.ui.theme.ResQWhite
import kotlin.math.roundToInt

data class EmergencyServiceItem(
  val id: String,
  val label: String,
  val number: String?,
  val icon: ImageVector,
  val urgent: Boolean
)

@Composable
fun HomeScreen(
  profile: PatientProfile,
  location: String,
  onStartPreset: (SosPreset) -> Unit,
  onChangePatient: () -> Unit,
  onLocationClick: () -> Unit,
  onReportBystanderClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  val context = LocalContext.current
  var presetIndex by remember { mutableIntStateOf(0) }

  val presets = remember {
    listOf(
      SosPreset(
        id = "hyper",
        title = "Get ResQ",
        subtitle = "Medical emergency",
        number = "112",
        mode = SosMode.HYPER,
        alerts = true
      ),
      SosPreset(
        id = "reach",
        title = "Reach Me",
        subtitle = "Alert my circle and share location",
        number = null,
        mode = SosMode.REACH,
        alerts = true
      ),
      SosPreset(
        id = "ambulance",
        title = "Ambulance Helpline",
        subtitle = "Call configured ambulance",
        number = "102",
        mode = SosMode.CALL,
        alerts = false
      ),
      SosPreset(
        id = "family",
        title = "Family Emergency",
        subtitle = "Alert family and call contact",
        number = "+919000000002",
        mode = SosMode.CALL,
        alerts = true
      )
    )
  }

  val services = remember {
    listOf(
      EmergencyServiceItem("police", "Police", "112", Icons.Default.Warning, true),
      EmergencyServiceItem("fire", "Fire", "112", Icons.Default.Notifications, true),
      EmergencyServiceItem("medical", "Medical", "112", Icons.Default.Favorite, true),
      EmergencyServiceItem("disaster", "Disaster", "112", Icons.Default.Warning, true),
      EmergencyServiceItem("women", "Women", "1091", Icons.Default.Person, false),
      EmergencyServiceItem("child", "Child", "1098", Icons.Default.Person, false),
      EmergencyServiceItem("elderly", "Elderly", "14567", Icons.Default.Person, false),
      EmergencyServiceItem("bystander", "Report Bystander", null, Icons.Default.Info, false)
    )
  }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ResQWhite)
      .verticalScroll(rememberScrollState())
      .padding(horizontal = 16.dp, vertical = 8.dp)
  ) {
    // 1. Current Location Strip
    Row(
      verticalAlignment = Alignment.CenterVertically,
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = 56.dp)
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
          text = "Your phone's current location",
          fontSize = 12.sp,
          color = ResQGreenMuted
        )
      }
      Box(
        modifier = Modifier
          .heightIn(min = 48.dp)
          .padding(horizontal = 6.dp),
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

    Spacer(Modifier.height(12.dp))

    // 2. Swipeable SOS Preset Area
    SwipeableSosPresetCard(
      presets = presets,
      selectedIndex = presetIndex,
      onSelectIndex = { presetIndex = it },
      onActivate = { preset -> onStartPreset(preset) }
    )

    Spacer(Modifier.height(16.dp))

    // 3. Call 112 Control
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

    Spacer(Modifier.height(18.dp))

    // 4. Contact Emergency Services Grid (4-column by 2-row)
    Row(
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.SpaceBetween,
      modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
    ) {
      Text(
        text = "CONTACT EMERGENCY SERVICES",
        fontSize = 12.sp,
        fontWeight = FontWeight.ExtraBold,
        letterSpacing = 1.2.sp,
        color = ResQGreenMuted
      )
      Text(
        text = "112 India Protocol",
        fontSize = 11.sp,
        color = ResQGreenMuted
      )
    }

    Column(modifier = Modifier.fillMaxWidth()) {
      // Row 1 (Items 0-3)
      Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxWidth()
      ) {
        services.take(4).forEach { svc ->
          EmergencyServiceGridButton(
            service = svc,
            modifier = Modifier.weight(1f),
            onClick = {
              if (svc.number != null) {
                onStartPreset(
                  SosPreset(
                    id = svc.id,
                    title = "${svc.label.uppercase()} · ${svc.number}",
                    subtitle = "Emergency service",
                    number = svc.number,
                    mode = SosMode.CALL,
                    alerts = false
                  )
                )
              }
            }
          )
        }
      }

      Spacer(Modifier.height(8.dp))

      // Row 2 (Items 4-7)
      Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxWidth()
      ) {
        services.drop(4).forEach { svc ->
          EmergencyServiceGridButton(
            service = svc,
            modifier = Modifier.weight(1f),
            onClick = {
              if (svc.id == "bystander") {
                onReportBystanderClick()
              } else if (svc.number != null) {
                onStartPreset(
                  SosPreset(
                    id = svc.id,
                    title = "${svc.label.uppercase()} · ${svc.number}",
                    subtitle = "Support helpline",
                    number = svc.number,
                    mode = SosMode.CALL,
                    alerts = false
                  )
                )
              }
            }
          )
        }
      }
    }

    Spacer(Modifier.height(18.dp))

    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(1.dp)
        .background(ResQLine)
    )

    // 5. Selected Patient Row
    Row(
      verticalAlignment = Alignment.CenterVertically,
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = 72.dp)
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

    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(1.dp)
        .background(ResQLine)
    )

    Spacer(Modifier.height(24.dp))
  }
}

@Composable
fun SwipeableSosPresetCard(
  presets: List<SosPreset>,
  selectedIndex: Int,
  onSelectIndex: (Int) -> Unit,
  onActivate: (SosPreset) -> Unit,
  modifier: Modifier = Modifier
) {
  var offsetX by remember { mutableFloatStateOf(0f) }
  val animatedOffset by animateFloatAsState(targetValue = offsetX, label = "preset_drag")

  val currentPreset = presets.getOrNull(selectedIndex) ?: presets[0]

  val draggableState = rememberDraggableState { delta ->
    offsetX = (offsetX + delta).coerceIn(-120f, 120f)
  }

  val isHyper = currentPreset.id == "hyper"
  val isReach = currentPreset.id == "reach"
  val isAmbulance = currentPreset.id == "ambulance"
  val isFamily = currentPreset.id == "family"

  val bgColor = when {
    isHyper -> ResQRed
    isReach -> ResQGreen
    isAmbulance -> ResQWhite
    else -> ResQGreenSoft
  }

  val textColor = when {
    isHyper || isReach -> ResQWhite
    isAmbulance -> ResQRed
    else -> ResQGreenDark
  }

  Column(
    modifier = modifier.fillMaxWidth(),
    horizontalAlignment = Alignment.CenterHorizontally
  ) {
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .heightIn(min = 210.dp)
        .clip(RoundedCornerShape(6.dp))
        .background(bgColor)
        .then(
          if (isAmbulance) Modifier.border(2.dp, ResQRed, RoundedCornerShape(6.dp))
          else if (isFamily) Modifier.border(1.dp, ResQLine, RoundedCornerShape(6.dp))
          else Modifier
        )
        .draggable(
          state = draggableState,
          orientation = Orientation.Horizontal,
          onDragStopped = {
            if (offsetX < -65f && selectedIndex < presets.size - 1) {
              onSelectIndex(selectedIndex + 1)
            } else if (offsetX > 65f && selectedIndex > 0) {
              onSelectIndex(selectedIndex - 1)
            }
            offsetX = 0f
          }
        )
        .padding(18.dp)
    ) {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .offset { IntOffset(animatedOffset.roundToInt(), 0) },
        verticalArrangement = Arrangement.SpaceBetween
      ) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
              imageVector = if (isHyper) Icons.Default.Warning else if (isReach) Icons.Default.Favorite else Icons.Default.Call,
              contentDescription = null,
              tint = textColor,
              modifier = Modifier.size(28.dp)
            )
            Spacer(Modifier.width(8.dp))
            Text(
              text = currentPreset.title.uppercase(),
              fontSize = 22.sp,
              fontWeight = FontWeight.ExtraBold,
              fontFamily = FontFamily.SansSerif,
              color = textColor
            )
          }

          Text(
            text = currentPreset.subtitle,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = if (isHyper || isReach) ResQWhite.copy(alpha = 0.85f) else ResQGreenMuted
          )
        }

        Spacer(Modifier.height(8.dp))

        Text(
          text = when (currentPreset.id) {
            "hyper" -> "Start location, MediCard and family alerts."
            "reach" -> "Share live position with your trusted contacts."
            "ambulance" -> "Prepares phone dialer for ambulance service."
            else -> "Notify family profiles and open primary contact."
          },
          fontSize = 14.sp,
          color = if (isHyper || isReach) ResQWhite.copy(alpha = 0.95f) else ResQGreenMuted
        )

        Spacer(Modifier.height(16.dp))

        Button(
          onClick = { onActivate(currentPreset) },
          shape = RoundedCornerShape(4.dp),
          colors = ButtonDefaults.buttonColors(
            containerColor = if (isHyper || isReach) ResQWhite else if (isAmbulance) ResQRed else ResQGreen,
            contentColor = if (isHyper) ResQRed else if (isReach) ResQGreen else ResQWhite
          ),
          modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 48.dp)
        ) {
          Text(
            text = when (currentPreset.id) {
              "hyper" -> "GET RESQ"
              "reach" -> "START REACH ME"
              "ambulance" -> "CALL AMBULANCE HELPLINE"
              else -> "START FAMILY EMERGENCY"
            },
            fontSize = 15.sp,
            fontWeight = FontWeight.ExtraBold
          )
        }

        Spacer(Modifier.height(6.dp))

        Row(
          horizontalArrangement = Arrangement.Center,
          verticalAlignment = Alignment.CenterVertically,
          modifier = Modifier.fillMaxWidth()
        ) {
          Icon(
            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
            contentDescription = null,
            tint = if (isHyper || isReach) ResQWhite.copy(alpha = 0.8f) else ResQGreenMuted,
            modifier = Modifier.size(12.dp)
          )
          Spacer(Modifier.width(4.dp))
          Text(
            text = "SWIPE TO CHOOSE ANOTHER SOS",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = if (isHyper || isReach) ResQWhite.copy(alpha = 0.8f) else ResQGreenMuted
          )
          Spacer(Modifier.width(4.dp))
          Icon(
            imageVector = Icons.AutoMirrored.Filled.ArrowForward,
            contentDescription = null,
            tint = if (isHyper || isReach) ResQWhite.copy(alpha = 0.8f) else ResQGreenMuted,
            modifier = Modifier.size(12.dp)
          )
        }
      }
    }

    Spacer(Modifier.height(8.dp))

    // Position Indicators: 4 Short Rectangular Marks
    Row(
      horizontalArrangement = Arrangement.spacedBy(6.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      presets.indices.forEach { idx ->
        val isSelected = idx == selectedIndex
        Box(
          modifier = Modifier
            .size(width = if (isSelected) 32.dp else 20.dp, height = 4.dp)
            .background(
              color = if (isSelected) {
                if (idx == 0) ResQRed else ResQGreen
              } else ResQLine,
              shape = RoundedCornerShape(1.dp)
            )
            .clickable { onSelectIndex(idx) }
        )
      }
    }
  }
}

@Composable
fun EmergencyServiceGridButton(
  service: EmergencyServiceItem,
  onClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  Column(
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalArrangement = Arrangement.Center,
    modifier = modifier
      .heightIn(min = 72.dp)
      .clip(RoundedCornerShape(4.dp))
      .border(1.dp, ResQLine, RoundedCornerShape(4.dp))
      .background(ResQWhite)
      .clickable { onClick() }
      .padding(4.dp)
  ) {
    Icon(
      imageVector = service.icon,
      contentDescription = service.label,
      tint = if (service.urgent) ResQRed else ResQGreen,
      modifier = Modifier.size(20.dp)
    )
    Spacer(Modifier.height(4.dp))
    Text(
      text = service.label,
      fontSize = 11.sp,
      fontWeight = FontWeight.Bold,
      color = ResQGreenDark,
      maxLines = 1,
      overflow = TextOverflow.Ellipsis
    )
    Text(
      text = service.number ?: "Report",
      fontSize = 10.sp,
      color = ResQGreenMuted
    )
  }
}
