package com.phyloguessr.ui.theme

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import com.phyloguessr.R

val TitanOne = FontFamily(Font(R.font.titan_one))

val RainbowColors = listOf(
    Color(0xFFFF4ECD),
    Color(0xFFFF9000),
    Color(0xFFFFE600),
    Color(0xFF00E676),
    Color(0xFF00B0FF),
    Color(0xFFAA00FF),
)

@Composable
fun RainbowTitle(
    text: String,
    modifier: Modifier = Modifier,
) {
    Text(
        text = text,
        modifier = modifier.graphicsLayer {
            rotationZ = -2f
        },
        style = TextStyle(
            fontFamily = TitanOne,
            fontSize = 42.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = (-0.5).sp,
            brush = Brush.linearGradient(
                colors = RainbowColors,
                start = Offset(0f, 0f),
                end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY),
            ),
        ),
    )
}

@Composable
fun RainbowSubtitle(
    text: String,
    modifier: Modifier = Modifier,
) {
    Text(
        text = text,
        modifier = modifier.graphicsLayer {
            rotationZ = -2f
        },
        textAlign = TextAlign.Center,
        style = TextStyle(
            fontFamily = TitanOne,
            fontSize = 20.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = 0.5.sp,
            brush = Brush.linearGradient(
                colors = RainbowColors,
                start = Offset(0f, 0f),
                end = Offset(Float.POSITIVE_INFINITY, Float.POSITIVE_INFINITY),
            ),
        ),
    )
}

val CorrectColors = listOf(
    Color(0xFF00C853),
    Color(0xFF00E676),
    Color(0xFF69F0AE),
    Color(0xFF00B0FF),
    Color(0xFF69F0AE),
    Color(0xFF00E676),
    Color(0xFF00C853),
)

val WrongColors = listOf(
    Color(0xFFFF1744),
    Color(0xFFFF5252),
    Color(0xFFFF8A80),
)

@Composable
fun AnimatedResultText(
    text: String,
    correct: Boolean,
    modifier: Modifier = Modifier,
) {
    val transition = rememberInfiniteTransition(label = "shimmer")
    val offset by transition.animateFloat(
        initialValue = 0f,
        targetValue = 2000f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse,
        ),
        label = "shimmer",
    )

    val colors = if (correct) CorrectColors else WrongColors

    Text(
        text = text,
        modifier = modifier,
        style = TextStyle(
            fontFamily = TitanOne,
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = (-0.5).sp,
            brush = Brush.linearGradient(
                colors = colors,
                start = Offset(offset, 0f),
                end = Offset(offset + 500f, 500f),
            ),
        ),
    )
}
