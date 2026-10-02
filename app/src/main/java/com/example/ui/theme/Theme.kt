package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val ResQColorScheme = lightColorScheme(
  primary = ResQGreen,
  onPrimary = ResQWhite,
  primaryContainer = ResQGreenSoft,
  onPrimaryContainer = ResQGreenDark,
  secondary = ResQGreenDark,
  onSecondary = ResQWhite,
  error = ResQRed,
  onError = ResQWhite,
  errorContainer = ResQRedSoft,
  onErrorContainer = ResQRedDark,
  background = ResQWhite,
  onBackground = ResQGreenDark,
  surface = ResQWhite,
  onSurface = ResQGreenDark,
  surfaceVariant = ResQGreenSoft,
  onSurfaceVariant = ResQGreenMuted,
  outline = ResQLine,
  outlineVariant = ResQLine
)

@Composable
fun ResQTheme(
  content: @Composable () -> Unit,
) {
  MaterialTheme(
    colorScheme = ResQColorScheme,
    typography = Typography,
    content = content
  )
}
