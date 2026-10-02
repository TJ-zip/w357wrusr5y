package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
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
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.PageDestination
import com.example.model.PatientProfile
import com.example.ui.components.ResQLogo
import com.example.ui.theme.ResQGreen
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQGreenMuted
import com.example.ui.theme.ResQGreenSoft
import com.example.ui.theme.ResQLine
import com.example.ui.theme.ResQWhite

data class DrawerItem(
  val destination: PageDestination,
  val label: String,
  val icon: ImageVector
)

data class DrawerSection(
  val title: String,
  val items: List<DrawerItem>
)

@Composable
fun ResQDrawerContent(
  currentPage: PageDestination,
  profile: PatientProfile,
  isSosActive: Boolean,
  onNavigate: (PageDestination) -> Unit,
  onCloseDrawer: () -> Unit,
  modifier: Modifier = Modifier
) {
  val emergencyItems = buildList {
    add(DrawerItem(PageDestination.HOME, "Home", Icons.Default.Home))
    if (isSosActive) {
      add(DrawerItem(PageDestination.ACTIVE_SOS, "Active SOS", Icons.Default.Warning))
    }
    add(DrawerItem(PageDestination.HISTORY, "Emergency history", Icons.Default.DateRange))
  }

  val sections = listOf(
    DrawerSection("EMERGENCY", emergencyItems),
    DrawerSection(
      "PEOPLE",
      listOf(
        DrawerItem(PageDestination.MEDICARD, "My MediCard", Icons.Default.Favorite),
        DrawerItem(PageDestination.FAMILY, "Family profiles", Icons.Default.Person),
        DrawerItem(PageDestination.CONTACTS, "Emergency contacts", Icons.Default.Phone)
      )
    ),
    DrawerSection(
      "HEALTH & COVER",
      listOf(
        DrawerItem(PageDestination.MEDICLAIM, "Mediclaim", Icons.Default.Lock),
        DrawerItem(PageDestination.HOSPITALS, "Preferred hospitals", Icons.Default.LocationOn)
      )
    ),
    DrawerSection(
      "SETTINGS",
      listOf(
        DrawerItem(PageDestination.SETTINGS, "Permissions & privacy", Icons.Default.Lock)
      )
    )
  )

  Column(
    modifier = modifier
      .fillMaxWidth()
      .fillMaxHeight()
      .background(ResQWhite)
      .verticalScroll(rememberScrollState())
      .testTag("resq_drawer_content")
  ) {
    // Drawer Top Bar (Logo & Close Button)
    Row(
      verticalAlignment = Alignment.CenterVertically,
      modifier = Modifier
        .fillMaxWidth()
        .height(64.dp)
        .padding(horizontal = 16.dp)
    ) {
      ResQLogo()

      Spacer(Modifier.weight(1f))

      IconButton(
        onClick = onCloseDrawer,
        modifier = Modifier
          .size(48.dp)
          .testTag("drawer_close_button")
      ) {
        Icon(
          imageVector = Icons.Default.Close,
          contentDescription = "Close navigation menu",
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

    // User Profile Card (Tapping navigates to MediCard)
    Row(
      verticalAlignment = Alignment.CenterVertically,
      modifier = Modifier
        .fillMaxWidth()
        .background(ResQGreenSoft)
        .clickable {
          onNavigate(PageDestination.MEDICARD)
          onCloseDrawer()
        }
        .padding(horizontal = 16.dp, vertical = 14.dp)
        .testTag("drawer_profile_header")
    ) {
      Box(
        modifier = Modifier
          .size(44.dp)
          .clip(RoundedCornerShape(4.dp))
          .background(ResQWhite),
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
          text = profile.name,
          fontSize = 16.sp,
          fontWeight = FontWeight.Bold,
          color = ResQGreenDark
        )
        Spacer(Modifier.height(2.dp))
        Text(
          text = "Usual SOS profile",
          fontSize = 12.sp,
          color = ResQGreenMuted
        )
      }

      Icon(
        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
        contentDescription = "Open profile",
        tint = ResQGreen,
        modifier = Modifier.size(18.dp)
      )
    }

    Box(
      modifier = Modifier
        .fillMaxWidth()
        .height(1.dp)
        .background(ResQLine)
    )

    // Drawer Sections and Items
    sections.forEach { section ->
      Column(modifier = Modifier.padding(top = 18.dp)) {
        Text(
          text = section.title,
          fontSize = 11.sp,
          fontWeight = FontWeight.ExtraBold,
          letterSpacing = 1.4.sp,
          color = ResQGreenMuted,
          modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp)
        )

        section.items.forEach { item ->
          val isSelected = currentPage == item.destination
          Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
              .fillMaxWidth()
              .heightIn(min = 54.dp)
              .background(if (isSelected) ResQGreenSoft else ResQWhite)
              .clickable {
                onNavigate(item.destination)
                onCloseDrawer()
              }
              .padding(horizontal = 16.dp)
              .testTag("drawer_item_${item.destination.name.lowercase()}")
          ) {
            Icon(
              imageVector = item.icon,
              contentDescription = null,
              tint = if (isSelected) ResQGreen else ResQGreenDark,
              modifier = Modifier.size(22.dp)
            )

            Spacer(Modifier.width(14.dp))

            Text(
              text = item.label,
              fontSize = 15.sp,
              fontWeight = FontWeight.Bold,
              color = if (isSelected) ResQGreen else ResQGreenDark
            )
          }

          Box(
            modifier = Modifier
              .fillMaxWidth()
              .height(1.dp)
              .background(ResQGreenSoft)
          )
        }
      }
    }

    Spacer(Modifier.height(32.dp))
  }
}
