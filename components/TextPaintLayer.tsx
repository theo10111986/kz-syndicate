"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";

type Align = "left" | "center" | "right";
type Tool = "paint" | "erase" | "text" | "move-text";
type MaskStrokeMode = "erase" | "restore";

export type TextPaintHandle = {
  clear: () => void;
  toDataURL: (scale?: number) => string | null;
  drawOnCanvas: (
    ctx: CanvasRenderingContext2D,
    targetW: number,
    targetH: number
  ) => void;
};

type TextItem = {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  rotation: number; // deg
  align: Align;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

type Props = {
  className?: string;
  /** Δώσε mapping από stage coords -> image coords (του overlay) */
  mapStageToImage?: (sx: number, sy: number) =>
    | { ix: number; iy: number; S: number }
    | null;
  /** Κάθε φορά που κάνεις eraser, αυτό θα χτυπάει τη μάσκα της φωτο */
  onMaskStroke?: (
    ix: number,
    iy: number,
    rImg: number,
    mode: MaskStrokeMode
  ) => void;
};

const TextPaintLayer = forwardRef<TextPaintHandle, Props>(function TextPaintLayer(
  { className, mapStageToImage, onMaskStroke },
  ref
) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const paintRef = useRef<HTMLCanvasElement | null>(null);
  const textRef = useRef<HTMLCanvasElement | null>(null);

  const [tool, setTool] = useState<Tool>("paint");
  const [brushSize, setBrushSize] = useState(14);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushColor, setBrushColor] = useState("#ffffff");

  const [texts, setTexts] = useState<TextItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const draggingText = useRef<{ id: string; offx: number; offy: number } | null>(null);
  const painting = useRef(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);

  // Resize to parent
  function resizeAll() {
    const host = hostRef.current;
    const paint = paintRef.current;
    const text = textRef.current;
    if (!host || !paint || !text) return;
    const w = host.clientWidth, h = host.clientHeight;

    for (const c of [paint, text]) {
      const keep = c.toDataURL();
      const img = new Image();
      img.onload = () => {
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d")!;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
      };
      if (c.width !== w || c.height !== h) img.src = keep;
    }
    drawTexts();
  }

  useEffect(() => {
    resizeAll();
    const ro = new ResizeObserver(() => resizeAll());
    if (hostRef.current) ro.observe(hostRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Paint (πάνω από τη φωτο) -----
  function strokeOnPaint(from: { x: number; y: number }, to: { x: number; y: number }) {
    const c = paintRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = brushOpacity;
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = brushColor;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function getLocalXY(e: React.PointerEvent) {
    const host = hostRef.current!;
    const r = host.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onPaintDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    painting.current = true;
    const p = getLocalXY(e);
    lastPt.current = p;

    if (tool === "paint") {
      strokeOnPaint(p, p);
    } else if (tool === "erase") {
      // Εδώ δεν σβήνουμε το paint layer — σβήνουμε τη ΦΩΤΟ (μάσκα) στο parent
      if (mapStageToImage && onMaskStroke) {
        const map = mapStageToImage(p.x, p.y);
        if (map) {
          const rImg = Math.max(1, (brushSize / 2) / map.S);
          onMaskStroke(map.ix, map.iy, rImg, "erase");
        }
      }
    }
  }
  function onPaintMove(e: React.PointerEvent) {
    if (!painting.current || !lastPt.current) return;
    const p = getLocalXY(e);

    if (tool === "paint") {
      strokeOnPaint(lastPt.current, p);
    } else if (tool === "erase") {
      if (mapStageToImage && onMaskStroke) {
        const map = mapStageToImage(p.x, p.y);
        if (map) {
          const rImg = Math.max(1, (brushSize / 2) / map.S);
          onMaskStroke(map.ix, map.iy, rImg, "erase");
        }
      }
    }

    lastPt.current = p;
  }
  function onPaintUp(e: React.PointerEvent) {
    painting.current = false;
    lastPt.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  // ----- Text -----
  function addTextAtCenter() {
    const host = hostRef.current!;
    const t: TextItem = {
      id: uid(),
      x: host.clientWidth / 2,
      y: host.clientHeight / 2,
      text: "Your text",
      fontSize: 48,
      color: "#ffffff",
      bold: true,
      italic: false,
      rotation: 0,
      align: "center",
    };
    setTexts((s) => [...s, t]);
    setSelectedId(t.id);
    drawTexts();
  }

  function drawTexts() {
    const host = hostRef.current, canvas = textRef.current;
    if (!host || !canvas) return;
    const w = host.clientWidth, h = host.clientHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, w, h);
    for (const t of texts) {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate((t.rotation * Math.PI) / 180);
      let font = "";
      if (t.italic) font += "italic ";
      if (t.bold) font += "700 ";
      font += `${t.fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;
      ctx.font = font;
      ctx.fillStyle = t.color;
      ctx.textAlign = t.align as CanvasTextAlign;
      ctx.textBaseline = "middle";
      const lines = t.text.split("\n");
      const lh = Math.round(t.fontSize * 1.25);
      const startY = -((lines.length - 1) * lh) / 2;
      lines.forEach((line, i) => ctx.fillText(line, 0, startY + i * lh));
      ctx.restore();
    }
  }

  useEffect(() => {
    drawTexts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts]);

  function onHostDown(e: React.PointerEvent) {
    if (tool !== "move-text" && tool !== "text") return;

    const { x, y } = getLocalXY(e);

    if (tool === "text") {
      const t: TextItem = {
        id: uid(),
        x, y,
        text: "Your text",
        fontSize: 40,
        color: "#ffffff",
        bold: true,
        italic: false,
        rotation: 0,
        align: "center",
      };
      setTexts((s) => [...s, t]);
      setSelectedId(t.id);
      drawTexts();
      return;
    }

    // move-text
    const hit = hitTest(x, y);
    if (hit) {
      setSelectedId(hit.id);
      draggingText.current = { id: hit.id, offx: x - hit.x, offy: y - hit.y };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } else {
      setSelectedId(null);
    }
  }

  function onHostMove(e: React.PointerEvent) {
    if (!draggingText.current) return;
    const { x, y } = getLocalXY(e);
    setTexts((arr) =>
      arr.map((t) =>
        t.id === draggingText.current!.id
          ? { ...t, x: x - draggingText.current!.offx, y: y - draggingText.current!.offy }
          : t
      )
    );
  }

  function onHostUp(e: React.PointerEvent) {
    if (draggingText.current) {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
    draggingText.current = null;
  }

  function hitTest(x: number, y: number): { id: string; x: number; y: number } | null {
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i];
      const lines = t.text.split("\n");
      const height = Math.max(1, Math.round(t.fontSize * 1.25) * lines.length);
      const maxLen = Math.max(...lines.map((l) => l.length), 1);
      const width = Math.max(1, Math.round(t.fontSize * 0.6 * maxLen));
      let left = t.x, top = t.y - height / 2;
      if (t.align === "center") left = t.x - width / 2;
      if (t.align === "right") left = t.x - width;
      if (x >= left && x <= left + width && y >= top && y <= top + height) {
        return { id: t.id, x: t.x, y: t.y };
      }
    }
    return null;
  }

  // Public API
  useImperativeHandle(ref, () => ({
    clear() {
      const host = hostRef.current!;
      const w = host.clientWidth, h = host.clientHeight;
      paintRef.current!.getContext("2d")!.clearRect(0, 0, w, h);
      textRef.current!.getContext("2d")!.clearRect(0, 0, w, h);
      setTexts([]);
      setSelectedId(null);
    },
    toDataURL(scale = 1) {
      const host = hostRef.current!;
      const w = Math.max(1, Math.floor(host.clientWidth * scale));
      const h = Math.max(1, Math.floor(host.clientHeight * scale));
      const out = document.createElement("canvas");
      out.width = w; out.height = h;
      const ctx = out.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(paintRef.current!, 0, 0, w, h);
      ctx.drawImage(textRef.current!, 0, 0, w, h);
      try {
        return out.toDataURL("image/png");
      } catch {
        return null;
      }
    },
    drawOnCanvas(ctx, targetW, targetH) {
      const host = hostRef.current!;
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      ctx.save();
      ctx.drawImage(paintRef.current!, 0, 0, w, h, 0, 0, targetW, targetH);
      ctx.drawImage(textRef.current!, 0, 0, w, h, 0, 0, targetW, targetH);
      ctx.restore();
    },
  }));

  // UI styles
  const C = {
    wrap: {
      position: "absolute" as const, inset: 0, pointerEvents: "none" as const,
    },
    canvas: {
      position: "absolute" as const, inset: 0,
    },
    bar: {
      position: "absolute" as const, left: 12, bottom: 12,
      pointerEvents: "auto" as const,
      display: "flex", gap: 8, alignItems: "center",
      background: "#0b0f12", border: "1px solid #0f2b2c",
      borderRadius: 12, padding: "8px 10px", boxShadow: "0 10px 24px rgba(0,0,0,.4)",
    },
    btn: (active = false) => ({
      padding: "8px 10px",
      borderRadius: 10,
      border: "1px solid " + (active ? "#13e4e7" : "rgba(0,255,255,.25)"),
      background: active ? "#0ff" : "transparent",
      color: active ? "#002224" : "#89ffff",
      fontWeight: 800,
      cursor: "pointer",
    }),
    color: {
      width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(0,255,255,.35)",
      background: "#000", overflow: "hidden",
    },
    small: { color: "#9ff", fontSize: 12 },
    range: { verticalAlign: "middle" as const },
    select: {
      padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(0,255,255,.35)",
      background: "transparent", color: "#89ffff", fontWeight: 700, cursor: "pointer",
    },
    input: {
      background: "#050708", border: "1px solid #113", color: "#c8ffff",
      padding: "8px 10px", borderRadius: 10, outline: "none" as const, width: 100,
    },
  };

  const selected = texts.find((t) => t.id === selectedId) || null;

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ position: "absolute", inset: 0 }}
      // Text drag events layer
      onPointerDown={onHostDown}
      onPointerMove={onHostMove}
      onPointerUp={onHostUp}
      onPointerCancel={onHostUp}
    >
      {/* Paint layer (πάνω από τη φωτο) */}
      <canvas
        ref={paintRef}
        style={C.canvas}
        onPointerDown={onPaintDown}
        onPointerMove={onPaintMove}
        onPointerUp={onPaintUp}
        onPointerCancel={onPaintUp}
      />

      {/* Text raster layer */}
      <canvas ref={textRef} style={C.canvas} />

      {/* Controls */}
      <div style={C.bar}>
        <button style={C.btn(tool === "paint")} onClick={() => setTool("paint")}>Brush</button>
        <button style={C.btn(tool === "erase")} onClick={() => setTool("erase")}>Eraser (photo)</button>
        <button style={C.btn(tool === "text")} onClick={() => setTool("text")}>Add Text</button>
        <button style={C.btn(tool === "move-text")} onClick={() => setTool("move-text")}>Move Text</button>

        <span style={C.small}>Size</span>
        <input type="range" min={4} max={160} value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} style={C.range} />

        <span style={{ ...C.small, marginLeft: 8 }}>Opacity</span>
        <input type="range" min={0.1} max={1} step={0.05} value={brushOpacity} onChange={(e) => setBrushOpacity(parseFloat(e.target.value))} style={C.range} />

        <div style={C.color}>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            title="Brush color"
            style={{ width: "100%", height: "100%", padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
          />
        </div>

        {selected && (
          <>
            <select
              value={selected.align}
              onChange={(e) =>
                setTexts((arr) =>
                  arr.map((t) => (t.id === selected.id ? { ...t, align: e.target.value as Align } : t))
                )
              }
              style={C.select as any}
              title="Align"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>

            <input
              value={selected.text}
              onChange={(e) =>
                setTexts((arr) =>
                  arr.map((t) => (t.id === selected.id ? { ...t, text: e.target.value } : t))
                )
              }
              placeholder="Edit text"
              style={C.input}
            />

            <input
              type="number"
              value={selected.fontSize}
              min={8}
              max={200}
              onChange={(e) =>
                setTexts((arr) =>
                  arr.map((t) => (t.id === selected.id ? { ...t, fontSize: parseInt(e.target.value) || t.fontSize } : t))
                )
              }
              title="Font size"
              style={{ ...C.input, width: 70 }}
            />

            <button
              style={C.btn(selected.bold)}
              onClick={() =>
                setTexts((arr) => arr.map((t) => (t.id === selected.id ? { ...t, bold: !t.bold } : t)))
              }
            >
              B
            </button>
            <button
              style={C.btn(selected.italic)}
              onClick={() =>
                setTexts((arr) => arr.map((t) => (t.id === selected.id ? { ...t, italic: !t.italic } : t)))
              }
            >
              i
            </button>

            <input
              type="color"
              value={selected.color}
              onChange={(e) =>
                setTexts((arr) =>
                  arr.map((t) => (t.id === selected.id ? { ...t, color: e.target.value } : t))
                )
              }
              title="Text color"
              style={{ width: 36, height: 36, border: "1px solid rgba(0,255,255,.35)", borderRadius: 10 }}
            />

            <input
              type="range"
              min={-180}
              max={180}
              value={selected.rotation}
              onChange={(e) =>
                setTexts((arr) =>
                  arr.map((t) => (t.id === selected.id ? { ...t, rotation: parseInt(e.target.value) } : t))
                )
              }
              title="Rotate"
            />
          </>
        )}

        <button style={C.btn()} onClick={addTextAtCenter}>+ Center Text</button>
        <button style={C.btn()} onClick={() => setTexts([])}>Clear Texts</button>
        <button style={C.btn()} onClick={() => {
          const w = hostRef.current?.clientWidth || 1;
          const h = hostRef.current?.clientHeight || 1;
          paintRef.current?.getContext("2d")?.clearRect(0, 0, w, h);
        }}>Clear Paint</button>
      </div>
    </div>
  );
});

export default TextPaintLayer;
