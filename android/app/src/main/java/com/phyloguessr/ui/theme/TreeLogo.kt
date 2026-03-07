package com.phyloguessr.ui.theme

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

private val TreeGradientColors = listOf(
    Color(0xFFFF3333),
    Color(0xFFFF9000),
    Color(0xFFFFE600),
    Color(0xFF00B0FF),
)

@Composable
fun TreeLogo(
    size: Dp = 64.dp,
    modifier: Modifier = Modifier,
) {
    Canvas(modifier = modifier.size(size)) {
        val w = this.size.width
        val h = this.size.height
        fun sx(v: Float) = v / 32f * w
        fun sy(v: Float) = v / 32f * h

        val brush = Brush.linearGradient(
            colors = TreeGradientColors,
            start = Offset(sx(4f), sy(4f)),
            end = Offset(sx(28f), sy(24f)),
        )
        val strokeWidth = 2.5f / 32f * w
        val dotRadius = 2.5f / 32f * w

        fun line(x1: Float, y1: Float, x2: Float, y2: Float) {
            drawLine(
                brush = brush,
                start = Offset(sx(x1), sy(y1)),
                end = Offset(sx(x2), sy(y2)),
                strokeWidth = strokeWidth,
                cap = StrokeCap.Round,
            )
        }

        // trunk
        line(4f, 16f, 12f, 16f)
        // vertical to top branch
        line(12f, 16f, 12f, 8f)
        // vertical to bottom branch
        line(12f, 16f, 12f, 24f)
        // horizontal to second node
        line(12f, 8f, 20f, 8f)
        // second node vertical up
        line(20f, 8f, 20f, 4f)
        // second node vertical down
        line(20f, 8f, 20f, 12f)
        // top leaf
        line(20f, 4f, 28f, 4f)
        // middle leaf
        line(20f, 12f, 28f, 12f)
        // bottom leaf
        line(12f, 24f, 28f, 24f)

        // leaf dots
        drawCircle(brush = brush, radius = dotRadius, center = Offset(sx(28f), sy(4f)))
        drawCircle(brush = brush, radius = dotRadius, center = Offset(sx(28f), sy(12f)))
        drawCircle(brush = brush, radius = dotRadius, center = Offset(sx(28f), sy(24f)))
    }
}
