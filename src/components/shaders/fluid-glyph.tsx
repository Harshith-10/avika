"use client";

import { useEffect, useRef, useState } from "react";

const vertexShaderSource = `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2  iResolution;
uniform float iTime;
uniform vec2  iMouse;
uniform float iMouseActive;
uniform float uVariant;
uniform float uTransparent;
uniform vec3  uGlyphColor;
uniform int   uPattern;

// Dynamically injected from Tailwind/shadcn classes
uniform vec3  uBgColor; 
uniform vec3  uFgColor;

out vec4 fragColor;

const float kBayer[16] = float[16](
     0.0,  8.0,  2.0, 10.0,
    12.0,  4.0, 14.0,  6.0,
     3.0, 11.0,  1.0,  9.0,
    15.0,  7.0, 13.0,  5.0
);

float box(vec2 p, vec2 c, vec2 h) {
    vec2 q = abs(p - c) - h;
    return (1.0 - step(0.0, q.x)) * (1.0 - step(0.0, q.y));
}

float synthesizeCharacter(vec2 uv, float lum) {
    vec2 p = uv * 2.0 - 1.0;
    int tier = int(clamp(lum * 5.0, 0.0, 4.0));

    if (tier == 0) return 0.0;
    if (tier == 1) return 1.0 - step(0.2, length(p));
    if (tier == 2) return box(p, vec2(0.0), vec2(0.6, 0.2));
    if (tier == 3) {
      return max(box(p, vec2(0.0), vec2(0.6, 0.2)),
                 box(p, vec2(0.0), vec2(0.2, 0.6)));
    }
    float bounds = box(p, vec2(0.0), vec2(0.8));
    float bars = max(
      max(box(p, vec2(0.0,  0.3), vec2(1.0, 0.15)),
          box(p, vec2(0.0, -0.3), vec2(1.0, 0.15))),
      max(box(p, vec2( 0.3, 0.0), vec2(0.15, 1.0)),
          box(p, vec2(-0.3, 0.0), vec2(0.15, 1.0)))
    );
    return bars * bounds;
}

float computeBayer(vec2 cell) {
    ivec2 q = ivec2(mod(cell, 4.0));
    return kBayer[q.x + q.y * 4] / 16.0;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;

    float gridResolution = mix(10.0, 14.0, uVariant);
    vec2 cellIndex = floor(fragCoord / gridResolution);
    vec2 localUV   = fract(fragCoord / gridResolution);

    float aspect = iResolution.x / iResolution.y;
    vec2 uv = (cellIndex * gridResolution) / iResolution.xy * 2.0 - 1.0;
    uv.x *= aspect;

    vec2 m = iMouse / iResolution.xy * 2.0 - 1.0;
    m.x *= aspect;

    vec2  d = uv - m;
    float r = length(d);
    vec2  perp = vec2(-d.y, d.x);
    float shear = exp(-r * 2.2) * (1.0 - exp(-r * 6.0)) * iMouseActive;
    vec2  warped = uv + normalize(perp + 1e-5) * shear * 0.35;

    float timeScale  = mix(0.5, 0.22, uVariant);
    float waveFreq   = mix(5.0, 3.4,  uVariant);
    float radialFreq = mix(10.0, 6.0, uVariant);
    float time = iTime * timeScale;
    
    float baseLuminance = 0.0;

    if (uPattern == 0) {
        baseLuminance = (
          sin(warped.x * waveFreq + time) +
          sin(warped.y * waveFreq + time) +
          sin(warped.x * warped.y * radialFreq - time) +
          sin(length(warped) * radialFreq - time * 2.0)
        ) * 0.25 + 0.5;
    } else if (uPattern == 1) {
        float angle = atan(warped.y, warped.x);
        baseLuminance = sin(angle * waveFreq * 1.5 + length(warped) * radialFreq - time * 3.0) * 0.5 + 0.5;
    } else if (uPattern == 2) {
        float p1 = length(warped - vec2(0.5, 0.2));
        float p2 = length(warped + vec2(-0.5, -0.2));
        baseLuminance = (sin(p1 * radialFreq * 1.5 - time * 2.0) + sin(p2 * radialFreq * 1.5 - time * 2.0)) * 0.25 + 0.5;
    } else if (uPattern == 3) {
        float scanner = sin(warped.y * waveFreq * 2.0 - time * 4.0);
        float gridLine = sin(warped.x * waveFreq * 3.0);
        baseLuminance = (scanner * gridLine) * 0.5 + 0.5;
    }

    baseLuminance = pow(smoothstep(0.15, 0.95, baseLuminance), 0.75);
    baseLuminance *= 1.0 - smoothstep(0.45, 0.0, r) * iMouseActive * 0.85;

    float adjustedLuminance = clamp(
      baseLuminance + (computeBayer(cellIndex) - 0.5) * 0.5,
      0.0, 1.0
    );

    float mask = synthesizeCharacter(localUV, adjustedLuminance);
    
    vec3 themedColor = mix(uBgColor, uFgColor, mask);
    vec3 finalColor = mix(themedColor, uGlyphColor, uTransparent);
    float alpha = mix(1.0, mask, uTransparent);

    // FIX: Premultiply alpha. WebGL needs (color * alpha, alpha) to composite transparency correctly in the DOM.
    fragColor = vec4(finalColor * alpha, alpha);
}`;

interface FluidGlyphProps {
  showControls?: boolean;
}

export default function FluidGlyph({ showControls = false }: FluidGlyphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    activeTarget: 0.0,
    activeCurrent: 0.0,
  });
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const [pattern, setPattern] = useState(0);
  const [variant, setVariant] = useState(0.5);
  const [transparent, setTransparent] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL 2 is not supported by your browser.");
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    // biome-ignore lint/correctness/useHookAtTopLevel: Canvas context relies on DOM.
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      iResolution: gl.getUniformLocation(program, "iResolution"),
      iTime: gl.getUniformLocation(program, "iTime"),
      iMouse: gl.getUniformLocation(program, "iMouse"),
      iMouseActive: gl.getUniformLocation(program, "iMouseActive"),
      uVariant: gl.getUniformLocation(program, "uVariant"),
      uTransparent: gl.getUniformLocation(program, "uTransparent"),
      uGlyphColor: gl.getUniformLocation(program, "uGlyphColor"),
      uPattern: gl.getUniformLocation(program, "uPattern"),
      uBgColor: gl.getUniformLocation(program, "uBgColor"),
      uFgColor: gl.getUniformLocation(program, "uFgColor"),
    };

    // Cached colors for performance
    let cachedBgColor = [0.0, 0.0, 0.0];
    let cachedFgColor = [1.0, 1.0, 1.0];

    // Create an invisible 1x1 canvas to act as our universal CSS parser
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = 1;
    colorCanvas.height = 1;
    const colorCtx = colorCanvas.getContext("2d", { willReadFrequently: true });

    const getComputedColor = (
      element: HTMLElement,
      property: string,
      fallback: [number, number, number],
    ): [number, number, number] => {
      const style = getComputedStyle(element);
      // Property can be accessed dynamically
      const colorStr =
        // biome-ignore lint/suspicious/noExplicitAny: Dynamic CSS property access
        style.getPropertyValue(property) || (style as any)[property];

      if (!colorCtx || !colorStr || colorStr === "transparent") return fallback;

      // Force the browser to evaluate complex color-mix() or oklch() functions
      colorCtx.clearRect(0, 0, 1, 1);
      colorCtx.fillStyle = colorStr;
      colorCtx.fillRect(0, 0, 1, 1);
      const data = colorCtx.getImageData(0, 0, 1, 1).data;

      // If alpha is 0, the color was invalid. Return fallback.
      if (data[3] === 0) return fallback;

      return [data[0] / 255, data[1] / 255, data[2] / 255];
    };

    const updateColors = () => {
      if (!canvas) return;
      // requested fallback: background black [0,0,0], glyphs white [1,1,1]
      cachedBgColor = getComputedColor(
        canvas,
        "background-color",
        [0.0, 0.0, 0.0],
      );
      cachedFgColor = getComputedColor(canvas, "color", [1.0, 1.0, 1.0]);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * window.devicePixelRatio;
        canvas.height = parent.clientHeight * window.devicePixelRatio;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Update theme colors when the canvas resizes (e.g., initialization or layout shifts)
      updateColors();
    };

    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      mouse.x = e.clientX - rect.left;
      mouse.y = rect.height - (e.clientY - rect.top);
      mouse.activeTarget = 1.0;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        mouse.activeTarget = 0.0;
      }, 500);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = (time: number) => {
      const mouse = mouseRef.current;
      mouse.activeCurrent += (mouse.activeTarget - mouse.activeCurrent) * 0.1;

      gl.uniform2f(locs.iResolution, canvas.width, canvas.height);
      gl.uniform1f(locs.iTime, time / 1000.0);

      gl.uniform2f(
        locs.iMouse,
        mouse.x * window.devicePixelRatio,
        mouse.y * window.devicePixelRatio,
      );
      gl.uniform1f(locs.iMouseActive, mouse.activeCurrent);

      gl.uniform1f(locs.uVariant, variant);
      gl.uniform1f(locs.uTransparent, transparent ? 1.0 : 0.0);
      gl.uniform1i(locs.uPattern, pattern);

      // Default green for transparent mode fallbacks, can be adjusted
      gl.uniform3f(locs.uGlyphColor, 0.2, 0.9, 0.3);

      // Inject cached Tailwind theme colors parsed by the 2D canvas
      gl.uniform3f(
        locs.uBgColor,
        cachedBgColor[0],
        cachedBgColor[1],
        cachedBgColor[2],
      );
      gl.uniform3f(
        locs.uFgColor,
        cachedFgColor[0],
        cachedFgColor[1],
        cachedFgColor[2],
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      gl.deleteProgram(program);
      // Clean up the 2D parser canvas
      colorCanvas.width = 0;
      colorCanvas.height = 0;
    };
  }, [variant, transparent, pattern]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Controls UI matching shadcn styling */}
      {showControls && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 rounded-xl border border-border bg-background/80 p-4 text-sm text-foreground shadow-sm backdrop-blur-md w-64 pointer-events-auto">
          <label className="flex flex-col gap-2 font-medium">
            Pattern Preset
            <select
              value={pattern}
              onChange={(e) => setPattern(Number(e.target.value))}
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="0">Fluid Waves</option>
              <option value="1">Hypnotic Vortex</option>
              <option value="2">Dual Interference</option>
              <option value="3">Digital Scanner</option>
            </select>
          </label>

          <div className="h-px w-full bg-border" />

          <label className="flex flex-col gap-2 font-medium">
            Variant (Grid Scale & Speed)
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={variant}
              onChange={(e) => setVariant(Number(e.target.value))}
              className="w-full cursor-pointer accent-primary"
            />
          </label>

          <label className="flex items-center gap-2 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-primary accent-primary"
            />
            Transparent Background
          </label>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="block w-full h-full bg-background text-foreground"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
