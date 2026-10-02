package com.example

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Scaffold
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.core.content.ContextCompat
import com.example.data.ResQRepository
import com.example.model.PageDestination
import com.example.model.SosMode
import com.example.model.SosPreset
import com.example.ui.components.ResQAppHeader
import com.example.ui.screens.ActiveSosScreen
import com.example.ui.screens.CountdownScreen
import com.example.ui.screens.EmergencyContactsScreen
import com.example.ui.screens.EmergencyHistoryScreen
import com.example.ui.screens.FamilyProfilesScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.LocationManagementScreen
import com.example.ui.screens.MediCardScreen
import com.example.ui.screens.MediclaimScreen
import com.example.ui.screens.PermissionsSettingsScreen
import com.example.ui.screens.PersonPickerSheet
import com.example.ui.screens.PreferredHospitalsScreen
import com.example.ui.screens.ResQDrawerContent
import com.example.ui.theme.ResQGreenDark
import com.example.ui.theme.ResQTheme
import com.example.ui.theme.ResQWhite
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      ResQTheme {
        ResQApp()
      }
    }
  }
}

@Composable
fun ResQApp() {
  val context = LocalContext.current
  val coroutineScope = rememberCoroutineScope()

  val selectedProfile by ResQRepository.selectedProfile.collectAsState()
  val allProfiles by ResQRepository.profiles.collectAsState()
  val locationString by ResQRepository.location.collectAsState()
  val activeSession by ResQRepository.activeSession.collectAsState()
  val emergencyHistory by ResQRepository.history.collectAsState()

  var currentPage by remember { mutableStateOf(PageDestination.HOME) }
  var countdownPreset by remember { mutableStateOf<SosPreset?>(null) }
  var showPersonPicker by remember { mutableStateOf(false) }

  val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)

  // Location Permission Request
  val locationPermissionLauncher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.RequestMultiplePermissions()
  ) { permissions ->
    val fineGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true
    val coarseGranted = permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
    if (fineGranted || coarseGranted) {
      try {
        val lm = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
        val lastGps = lm?.getLastKnownLocation(LocationManager.GPS_PROVIDER)
          ?: lm?.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
        if (lastGps != null) {
          val lat = String.format(java.util.Locale.US, "%.4f", lastGps.latitude)
          val lon = String.format(java.util.Locale.US, "%.4f", lastGps.longitude)
          ResQRepository.updateLocation("$lat, $lon · GPS active")
        }
      } catch (_: SecurityException) {
      }
    }
  }

  LaunchedEffect(Unit) {
    val fineGranted = ContextCompat.checkSelfPermission(
      context,
      Manifest.permission.ACCESS_FINE_LOCATION
    ) == PackageManager.PERMISSION_GRANTED

    if (fineGranted) {
      try {
        val lm = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
        val lastGps = lm?.getLastKnownLocation(LocationManager.GPS_PROVIDER)
          ?: lm?.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
        if (lastGps != null) {
          val lat = String.format(java.util.Locale.US, "%.4f", lastGps.latitude)
          val lon = String.format(java.util.Locale.US, "%.4f", lastGps.longitude)
          ResQRepository.updateLocation("$lat, $lon · Current position")
        }
      } catch (_: SecurityException) {
      }
    }
  }

  // Drawer gestures enabled only when no overlay/countdown/active SOS is ongoing
  val drawerGesturesEnabled = countdownPreset == null && activeSession == null && !showPersonPicker

  ModalNavigationDrawer(
    drawerState = drawerState,
    gesturesEnabled = drawerGesturesEnabled,
    scrimColor = ResQGreenDark.copy(alpha = 0.25f), // Translucent deep green overlay per spec
    drawerContent = {
      ResQDrawerContent(
        currentPage = currentPage,
        profile = selectedProfile,
        isSosActive = activeSession != null,
        onNavigate = { destination ->
          currentPage = destination
        },
        onCloseDrawer = {
          coroutineScope.launch { drawerState.close() }
        }
      )
    }
  ) {
    Scaffold(
      modifier = Modifier.fillMaxSize(),
      containerColor = ResQWhite,
      topBar = {
        if (activeSession == null && countdownPreset == null) {
          ResQAppHeader(
            onOpenMenu = {
              coroutineScope.launch { drawerState.open() }
            },
            location = locationString,
            onLocationClick = { currentPage = PageDestination.LOCATION }
          )
        }
      }
    ) { innerPadding ->
      Box(
        modifier = Modifier
          .fillMaxSize()
          .background(ResQWhite)
          .padding(innerPadding)
      ) {
        if (activeSession != null) {
          ActiveSosScreen(
            session = activeSession!!,
            location = locationString,
            onCancelSos = {
              ResQRepository.cancelActiveSession("User ended SOS")
              currentPage = PageDestination.HOME
            },
            onChangePatient = { showPersonPicker = true },
            onAddDetail = { detail ->
              ResQRepository.addSessionDetail(detail)
            },
            onFixLocation = { currentPage = PageDestination.LOCATION },
            onViewFamily = { currentPage = PageDestination.FAMILY }
          )
        } else {
          when (currentPage) {
            PageDestination.HOME -> {
              HomeScreen(
                profile = selectedProfile,
                location = locationString,
                onStartPreset = { preset ->
                  countdownPreset = preset
                },
                onChangePatient = { showPersonPicker = true },
                onLocationClick = { currentPage = PageDestination.LOCATION },
                onReachMeClick = {
                  countdownPreset = SosPreset(
                    id = "reach",
                    title = "Reach Me",
                    subtitle = "Call me and alert my circle",
                    number = null,
                    mode = SosMode.REACH,
                    alerts = true
                  )
                }
              )
            }
            PageDestination.ACTIVE_SOS -> {
              // Fallback to home if no active session
              currentPage = PageDestination.HOME
            }
            PageDestination.MEDICARD -> {
              MediCardScreen(
                profile = selectedProfile,
                onUpdateProfile = { updated ->
                  ResQRepository.updateProfile(updated)
                },
                onBack = { currentPage = PageDestination.HOME }
              )
            }
            PageDestination.FAMILY -> {
              FamilyProfilesScreen(
                profiles = allProfiles,
                onAddProfile = { newProfile ->
                  ResQRepository.addFamilyMember(newProfile)
                },
                onRemoveProfile = { id ->
                  ResQRepository.removeFamilyMember(id)
                },
                onSelectProfile = { chosen ->
                  ResQRepository.selectProfile(chosen)
                },
                onBack = { currentPage = PageDestination.HOME }
              )
            }
            PageDestination.CONTACTS -> {
              EmergencyContactsScreen(
                profile = selectedProfile,
                onUpdateProfile = { updated ->
                  ResQRepository.updateProfile(updated)
                },
                onBack = { currentPage = PageDestination.HOME }
              )
            }
            PageDestination.MEDICLAIM -> {
              MediclaimScreen(
                profile = selectedProfile,
                onUpdateProfile = { updated ->
                  ResQRepository.updateProfile(updated)
                },
                onBack = { currentPage = PageDestination.HOME }
              )
            }
            PageDestination.HOSPITALS -> {
              PreferredHospitalsScreen(
                profile = selectedProfile,
                onUpdateProfile = { updated ->
                  ResQRepository.updateProfile(updated)
                },
                onBack = { currentPage = PageDestination.HOME }
              )
            }
            PageDestination.HISTORY -> {
              EmergencyHistoryScreen(
                historyItems = emergencyHistory,
                onBack = { currentPage = PageDestination.HOME }
              )
            }
            PageDestination.SETTINGS -> {
              PermissionsSettingsScreen(
                location = locationString,
                onToggleLocation = {
                  locationPermissionLauncher.launch(
                    arrayOf(
                      Manifest.permission.ACCESS_FINE_LOCATION,
                      Manifest.permission.ACCESS_COARSE_LOCATION
                    )
                  )
                },
                onBack = { currentPage = PageDestination.HOME }
              )
            }
            PageDestination.LOCATION -> {
              LocationManagementScreen(
                currentLocation = locationString,
                onRefreshLocation = {
                  locationPermissionLauncher.launch(
                    arrayOf(
                      Manifest.permission.ACCESS_FINE_LOCATION,
                      Manifest.permission.ACCESS_COARSE_LOCATION
                    )
                  )
                },
                onSetCustomLocation = { customLoc ->
                  ResQRepository.updateLocation(customLoc)
                },
                onBack = { currentPage = PageDestination.HOME }
              )
            }
          }
        }

        // 5-second Countdown Overlay
        countdownPreset?.let { preset ->
          CountdownScreen(
            preset = preset,
            onCancel = { countdownPreset = null },
            onComplete = {
              val currentPreset = countdownPreset
              countdownPreset = null
              if (currentPreset != null) {
                ResQRepository.startSession(currentPreset)
              }
            }
          )
        }

        // Patient selection bottom sheet
        if (showPersonPicker) {
          PersonPickerSheet(
            profiles = allProfiles,
            selected = selectedProfile,
            onChoose = { chosen ->
              ResQRepository.selectProfile(chosen)
              showPersonPicker = false
            },
            onDismiss = { showPersonPicker = false }
          )
        }
      }
    }
  }
}
