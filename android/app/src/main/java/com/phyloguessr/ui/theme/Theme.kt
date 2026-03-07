package com.phyloguessr.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat

val Leaf = Color(0xFF4CAF50)
val LeafDark = Color(0xFF81C784)
val LeafContainer = Color(0xFF1B5E20)
val LeafContainerLight = Color(0xFFC8E6C9)

val Amber = Color(0xFFFFA000)
val AmberLight = Color(0xFFFFE082)
val AmberDark = Color(0xFFFFB300)
val AmberContainer = Color(0xFF5D4037)
val AmberContainerLight = Color(0xFFFFF3E0)

val Coral = Color(0xFFEF5350)
val CoralDark = Color(0xFFEF9A9A)

private val DarkColorScheme = darkColorScheme(
    primary = LeafDark,
    onPrimary = Color(0xFF003300),
    primaryContainer = LeafContainer,
    onPrimaryContainer = Color(0xFFA5D6A7),
    secondary = AmberDark,
    onSecondary = Color(0xFF3E2723),
    secondaryContainer = AmberContainer,
    onSecondaryContainer = AmberLight,
    tertiary = Color(0xFF80CBC4),
    onTertiary = Color(0xFF003735),
    tertiaryContainer = Color(0xFF00695C),
    onTertiaryContainer = Color(0xFFB2DFDB),
    error = CoralDark,
    background = Color(0xFF121212),
    onBackground = Color(0xFFE8E8E8),
    surface = Color(0xFF1E1E1E),
    onSurface = Color(0xFFE8E8E8),
    surfaceVariant = Color(0xFF2D2D2D),
    onSurfaceVariant = Color(0xFFBDBDBD),
    outline = Color(0xFF5C5C5C),
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF2E7D32),
    onPrimary = Color.White,
    primaryContainer = LeafContainerLight,
    onPrimaryContainer = Color(0xFF1B5E20),
    secondary = Amber,
    onSecondary = Color.White,
    secondaryContainer = AmberContainerLight,
    onSecondaryContainer = Color(0xFF5D4037),
    tertiary = Color(0xFF00897B),
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFFB2DFDB),
    onTertiaryContainer = Color(0xFF004D40),
    error = Coral,
    background = Color(0xFFF5F5F0),
    onBackground = Color(0xFF1C1C1C),
    surface = Color(0xFFFFFBF5),
    onSurface = Color(0xFF1C1C1C),
    surfaceVariant = Color(0xFFE8E5DD),
    onSurfaceVariant = Color(0xFF4A4A4A),
    outline = Color(0xFF9E9E9E),
)

private val PhyloTypography = Typography(
    headlineLarge = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        letterSpacing = (-0.5).sp,
    ),
    headlineMedium = TextStyle(
        fontWeight = FontWeight.Bold,
        fontSize = 26.sp,
    ),
    titleLarge = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
    ),
    titleMedium = TextStyle(
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
    ),
    bodyLarge = TextStyle(
        fontSize = 16.sp,
        lineHeight = 24.sp,
    ),
)

@Composable
fun PhyloGuessrTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = PhyloTypography,
        content = content,
    )
}
