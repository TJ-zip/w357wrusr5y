package com.example.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.BorderStroke
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
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.ResQGreen
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQGreenSoft
import com.example.ui.theme.ResQLine
import com.example.ui.theme.ResQRed
import com.example.ui.theme.ResQRedDark
import com.example.ui.theme.ResQWhite
import kotlin.math.roundToInt

@Composable
fun ResQLogo(modifier: Modifier = Modifier) {
  Row(
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(10.dp),
    modifier = modifier.semantics { contentDescription = "ResQ brand logo" }
  ) {
    Box(
      modifier = Modifier
        .size(38.dp)
        .border(BorderStroke(2.dp, ResQGreen), shape = RoundedCornerShape(4.dp))
        .background(ResQWhite, shape = RoundedCornerShape(4.dp)),
      contentAlignment = Alignment.Center
    ) {
      Icon(
        imageVector = Icons.Default.Favorite,
        contentDescription = "Medical heartbeat icon",
        tint = ResQGreen,
        modifier = Modifier.size(22.dp)
      )
    }

    Text(
      text = buildAnnotatedString {
        withStyle(
          style = SpanStyle(
            color = ResQGreenDark,
            fontWeight = FontWeight.ExtraBold,
            fontFamily = FontFamily.SansSerif
          )
        ) {
          append("Res")
        }
        withStyle(
          style = SpanStyle(
            color = ResQRed,
            fontWeight = FontWeight.ExtraBold,
            fontFamily = FontFamily.SansSerif
          )
        ) {
          append("Q")
        }
      },
      fontSize = 24.sp,
      letterSpacing = (-0.5).sp
    )
  }
}

enum class TapButtonTone {
  PRIMARY,
  RED,
  RED_OUTLINE,
  PLAIN
}

@Composable
fun ResQTapButton(
  text: String,
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
  tone: TapButtonTone = TapButtonTone.PRIMARY,
  icon: ImageVector? = null,
  enabled: Boolean = true,
  testTag: String? = null
) {
  val buttonModifier = modifier
    .fillMaxWidth()
    .heightIn(min = 56.dp)
    .then(if (testTag != null) Modifier.testTag(testTag) else Modifier)

  when (tone) {
    TapButtonTone.PRIMARY -> {
      Button(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape(4.dp),
        colors = ButtonDefaults.buttonColors(
          containerColor = ResQGreen,
          contentColor = ResQWhite,
          disabledContainerColor = ResQGreen.copy(alpha = 0.4f),
          disabledContentColor = ResQWhite.copy(alpha = 0.7f)
        ),
        modifier = buttonModifier
      ) {
        if (icon != null) {
          Icon(icon, contentDescription = null, modifier = Modifier.size(20.dp))
          Spacer(Modifier.width(8.dp))
        }
        Text(text = text, fontSize = 16.sp, fontWeight = FontWeight.Bold)
      }
    }
    TapButtonTone.RED -> {
      Button(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape(6.dp),
        colors = ButtonDefaults.buttonColors(
          containerColor = ResQRed,
          contentColor = ResQWhite,
          disabledContainerColor = ResQRed.copy(alpha = 0.4f),
          disabledContentColor = ResQWhite.copy(alpha = 0.7f)
        ),
        modifier = buttonModifier
      ) {
        if (icon != null) {
          Icon(icon, contentDescription = null, modifier = Modifier.size(22.dp))
          Spacer(Modifier.width(8.dp))
        }
        Text(text = text, fontSize = 17.sp, fontWeight = FontWeight.ExtraBold)
      }
    }
    TapButtonTone.RED_OUTLINE -> {
      OutlinedButton(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape(4.dp),
        border = BorderStroke(2.dp, ResQRed),
        colors = ButtonDefaults.outlinedButtonColors(
          containerColor = ResQWhite,
          contentColor = ResQRed
        ),
        modifier = buttonModifier
      ) {
        if (icon != null) {
          Icon(icon, contentDescription = null, modifier = Modifier.size(20.dp), tint = ResQRed)
          Spacer(Modifier.width(8.dp))
        }
        Text(text = text, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ResQRed)
      }
    }
    TapButtonTone.PLAIN -> {
      OutlinedButton(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape(4.dp),
        border = BorderStroke(1.dp, ResQLine),
        colors = ButtonDefaults.outlinedButtonColors(
          containerColor = ResQWhite,
          contentColor = ResQGreenDark
        ),
        modifier = buttonModifier
      ) {
        if (icon != null) {
          Icon(icon, contentDescription = null, modifier = Modifier.size(20.dp), tint = ResQGreenDark)
          Spacer(Modifier.width(8.dp))
        }
        Text(text = text, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ResQGreenDark)
      }
    }
  }
}

@Composable
fun ResQRowItem(
  label: String,
  value: String,
  modifier: Modifier = Modifier,
  action: String? = null,
  onClick: (() -> Unit)? = null,
  urgent: Boolean = false,
  icon: ImageVector? = null,
  testTag: String? = null
) {
  val baseModifier = modifier
    .fillMaxWidth()
    .heightIn(min = 72.dp)
    .background(ResQWhite)
    .then(if (testTag != null) Modifier.testTag(testTag) else Modifier)
    .then(
      if (onClick != null) Modifier.clickable { onClick() }
      else Modifier
    )
    .padding(horizontal = 16.dp, vertical = 12.dp)

  Row(
    verticalAlignment = Alignment.CenterVertically,
    modifier = baseModifier
  ) {
    if (urgent) {
      Box(
        modifier = Modifier
          .padding(end = 12.dp)
          .size(width = 4.dp, height = 48.dp)
          .background(ResQRed)
      )
    }

    if (icon != null) {
      Icon(
        imageVector = icon,
        contentDescription = null,
        tint = if (urgent) ResQRed else ResQGreen,
        modifier = Modifier
          .padding(end = 14.dp)
          .size(22.dp)
      )
    }

    Column(
      modifier = Modifier
        .weight(1f)
        .padding(end = 8.dp)
    ) {
      Text(
        text = label,
        fontSize = 13.sp,
        fontWeight = FontWeight.SemiBold,
        color = ResQGreenMuted
      )
      Spacer(Modifier.height(3.dp))
      Text(
        text = value,
        fontSize = 16.sp,
        fontWeight = FontWeight.Bold,
        color = ResQGreenDark,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis
      )
    }

    if (action != null) {
      Box(
        modifier = Modifier
          .heightIn(min = 48.dp)
          .padding(horizontal = 6.dp),
        contentAlignment = Alignment.Center
      ) {
        Text(
          text = action,
          fontSize = 14.sp,
          fontWeight = FontWeight.Bold,
          color = if (urgent) ResQRed else ResQGreen
        )
      }
    }
  }

  // 1px flat divider line
  Box(
    modifier = Modifier
      .fillMaxWidth()
      .height(1.dp)
      .background(ResQLine)
  )
}

@Composable
fun ResQAppHeader(
  onOpenMenu: () -> Unit,
  location: String,
  onLocationClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  Row(
    verticalAlignment = Alignment.CenterVertically,
    modifier = modifier
      .fillMaxWidth()
      .height(64.dp)
      .background(ResQWhite)
      .padding(horizontal = 12.dp)
  ) {
    IconButton(
      onClick = onOpenMenu,
      modifier = Modifier
        .size(48.dp)
        .testTag("hamburger_menu_button")
    ) {
      Icon(
        imageVector = Icons.Default.Menu,
        contentDescription = "Open navigation menu",
        tint = ResQGreen,
        modifier = Modifier.size(26.dp)
      )
    }

    ResQLogo(modifier = Modifier.padding(start = 2.dp))

    Spacer(Modifier.weight(1f))

    Row(
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.End,
      modifier = Modifier
        .clickable { onLocationClick() }
        .padding(horizontal = 6.dp, vertical = 8.dp)
        .testTag("header_location_button")
    ) {
      Icon(
        imageVector = Icons.Default.Place,
        contentDescription = "Location pin",
        tint = ResQGreen,
        modifier = Modifier.size(16.dp)
      )
      Spacer(Modifier.width(4.dp))
      Text(
        text = location.split("·").lastOrNull()?.trim() ?: location,
        fontSize = 12.sp,
        fontWeight = FontWeight.SemiBold,
        color = ResQGreenMuted,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis
      )
    }
  }

  // Header bottom border
  Box(
    modifier = Modifier
      .fillMaxWidth()
      .height(1.dp)
      .background(ResQLine)
  )
}

@Composable
fun ResQLaunchRail(
  onHyper: () -> Unit,
  modifier: Modifier = Modifier
) {
  var offsetX by remember { mutableFloatStateOf(0f) }
  val animatedOffset by animateFloatAsState(targetValue = offsetX, label = "swipe_offset")

  val draggableState = rememberDraggableState { delta ->
    val newOffset = (offsetX + delta).coerceIn(-140f, 0f)
    offsetX = newOffset
  }

  Box(
    modifier = modifier
      .fillMaxWidth()
      .heightIn(min = 210.dp)
      .clip(RoundedCornerShape(6.dp))
      .background(ResQRed)
      .draggable(
        state = draggableState,
        orientation = Orientation.Horizontal,
        onDragStopped = {
          if (offsetX < -70f) {
            onHyper()
          }
          offsetX = 0f
        }
      )
      .semantics { contentDescription = "Swipe left to Get ResQ" }
      .testTag("hyper_sos_launch_rail"),
    contentAlignment = Alignment.Center
  ) {
    Column(
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.Center,
      modifier = Modifier
        .offset { IntOffset(animatedOffset.roundToInt(), 0) }
        .padding(horizontal = 20.dp, vertical = 20.dp)
    ) {
      Icon(
        imageVector = Icons.Default.Warning,
        contentDescription = "Emergency siren",
        tint = ResQWhite,
        modifier = Modifier.size(38.dp)
      )

      Spacer(Modifier.height(10.dp))

      Text(
        text = "SOS",
        fontSize = 46.sp,
        fontWeight = FontWeight.ExtraBold,
        fontFamily = FontFamily.SansSerif,
        color = ResQWhite,
        lineHeight = 46.sp
      )

      Spacer(Modifier.height(8.dp))

      Text(
        text = "Swipe left to Get ResQ",
        fontSize = 18.sp,
        fontWeight = FontWeight.Bold,
        color = ResQWhite
      )

      Spacer(Modifier.height(16.dp))

      Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
      ) {
        Icon(
          imageVector = Icons.AutoMirrored.Filled.ArrowBack,
          contentDescription = null,
          tint = ResQWhite.copy(alpha = 0.9f),
          modifier = Modifier.size(18.dp)
        )
        Spacer(Modifier.width(6.dp))
        Text(
          text = "Medical help · location · family alerts",
          fontSize = 13.sp,
          fontWeight = FontWeight.SemiBold,
          color = ResQWhite.copy(alpha = 0.95f)
        )
      }
    }
  }
}
