"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

/* ================== Types ================== */
type ViewKey = "front" | "back" | "left" | "right";
type ModelKey = "af1" | "af1black" | "af1mid" | "aj1";
type Tool = "move" | "erase" | "restore" | "magic" | "brush";

type OverlayLayer = {
  id: string;
  src: string;
  img: HTMLImageElement;
  baseW: number;
  pos: { x: number; y: number };
  scale: number;
  rot: number; // deg
  mask: HTMLCanvasElement;
  comp: HTMLCanvasElement;
  dataURL: string | null;
  visible: boolean;
};

type TextItem = {
  id: string;
  x: number;
  y: number;
  text: string;
  size: number;
  color: string;
  font: string;
  bold: boolean;
  italic: boolean;
};

const uid = () => Math.random().toString(36).slice(2, 9);

/* ================== Assets ================== */
const MODEL_VIEWS: Record<ModelKey, Record<ViewKey, string>> = {
  af1: {
    front: "/sneakers/air-force-1-front.jpg",
    back: "/sneakers/air-force-1-back.jpg",
    left: "/sneakers/air-force-1-left.jpg",
    right: "/sneakers/air-force-1-right.jpg",
  },
  af1black: {
    front: "/sneakers/air-force-1-black-front.webp",
    back: "/sneakers/air-force-1-black-back.webp",
    left: "/sneakers/air-force-1-black-left.PNG",
    right: "/sneakers/air-force-1-black-right.PNG",
  },
  af1mid: {
    front: "/sneakers/air-force-1-mid-front.jpg",
    back: "/sneakers/air-force-1-mid-back.jpg",
    left: "/sneakers/air-force-1-mid-left.jpg",
    right: "/sneakers/air-force-1-mid-right.jpg",
  },
  aj1: {
    front: "/sneakers/air-jordan-1-front.jpg",
    back: "/sneakers/air-jordan-1-back.jpg",
    left: "/sneakers/air-jordan-1-left.jpg",
    right: "/sneakers/air-jordan-1-right.jpg",
  },
};

const VIEW_OPTIONS: { key: ViewKey; label: string }[] = [
  { key: "right", label: "Δεξιά" },
  { key: "left", label: "Αριστερά" },
  { key: "front", label: "Μπροστά" },
  { key: "back", label: "Πίσω" },
];

/* ================== Component ================== */
export default function CustomizerSneakerPage() {
  const { data: session } = useSession();

  // Base
  const [model, setModel] = useState<ModelKey>("af1");
  const [view, setView] = useState<ViewKey>("right");

  // Overlays (πολλαπλές φωτογραφίες)
  const [overlays, setOverlays] = useState<OverlayLayer[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Tools
  const [tool, setTool] = useState<Tool>("move");
  const [brush, setBrush] = useState<number>(36);
  const [brushColor, setBrushColor] = useState<string>("#ffffff");
  const [paintAboveOverlay, setPaintAboveOverlay] = useState<boolean>(true);

  // Text layer (κάτω σειρά)
  const textCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("Your text");
  const [textFont, setTextFont] = useState("Inter, system-ui, Arial, sans-serif");
  const [textSize, setTextSize] = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);

  // Request helpers
  const [note, setNote] = useState("");

  // Stage
  const frameRef = useRef<HTMLDivElement | null>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement | null>(null); // ΕΝΑΣ καμβάς (brush layer)
  const [mouseInStage, setMouseInStage] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const pointer = useRef({
    dragging: false,
    draggingText: false as boolean,
    paintingMask: false,
    paintingBrush: false,
    startX: 0,
    startY: 0,
    textOffX: 0,
    textOffY: 0,
  });

  // ✨ Pinch-to-zoom & pan
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<null | {
    startDist: number;
    startCx: number;
    startCy: number;
    overlayId: string | null;
    startScale: number;
    startPos: { x: number; y: number };
  }>(null);

  // ✨ Προσαρμογή σε rotate/resize
  const lastSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // ✨ **THROTTLE** για Eraser/Restore (πολύ πιο γρήγορο)
  const touchedMaskIdsRef = useRef<Set<string>>(new Set());
  const lastUrlUpdateRef = useRef<number>(0);
  const URL_UPDATE_MS = 90; // ~11 fps για dataURL (αρκετό για ομαλότητα)

  /* ================== Effects ================== */
  useEffect(() => {
    ensureCanvasSizes();
    rasterizeText();
  }, [model, view]);

  useEffect(() => {
    rasterizeText();
  }, [texts, textFont, textSize, textColor, textBold, textItalic]);

  useEffect(() => {
    const order = VIEW_OPTIONS.map((v) => v.key);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const i = order.indexOf(view);
      setView(
        (e.key === "ArrowRight"
          ? order[(i + 1) % order.length]
          : order[(i - 1 + order.length) % order.length]) as ViewKey
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  // Προσαρμογή σε resize/orientation change (κρατά θέσεις)
  useEffect(() => {
    const onResize = () => {
      if (!frameRef.current) return;
      const wNew = frameRef.current.clientWidth;
      const hNew = frameRef.current.clientHeight;
      const { w: wPrev, h: hPrev } = lastSizeRef.current;

      if (wPrev && hPrev && (wPrev !== wNew || hPrev !== hNew)) {
        const sx = wNew / wPrev;
        const sy = hNew / hPrev;
        setOverlays((prev) =>
          prev.map((L) => ({
            ...L,
            pos: { x: L.pos.x * sx, y: L.pos.y * sy },
          }))
        );
      }
      lastSizeRef.current = { w: wNew, h: hNew };
      ensureCanvasSizes();
    };
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  /* ================== Upload (ΠΡΟΣΘΗΚΗ overlay) ================== */
  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/image\/(png|jpeg|jpg|webp)$/i.test(file.type)) {
      alert("PNG/JPG/WEBP μόνο.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const id = uid();
      const img = new Image();
      img.onload = () => {
        const mask = document.createElement("canvas");
        mask.width = img.naturalWidth;
        mask.height = img.naturalHeight;
        const m = mask.getContext("2d")!;
        m.fillStyle = "#fff";
        m.fillRect(0, 0, mask.width, mask.height);

        const comp = document.createElement("canvas");
        comp.width = img.naturalWidth;
        comp.height = img.naturalHeight;

        const host = frameRef.current;
        const cx = host ? host.clientWidth / 2 : 0;
        const cy = host ? host.clientHeight / 2 : 0;

        // αρχικό πλάτος ~60% του καμβά (χωράει σε κινητό)
        const fw = host ? host.clientWidth : 800;
        const baseW = Math.min(Math.max(160, Math.round(fw * 0.6)), img.naturalWidth);

        const newLayer: OverlayLayer = {
          id,
          src: dataUrl,
          img,
          baseW,
          pos: { x: cx, y: cy },
          scale: 1,
          rot: 0,
          mask,
          comp,
          dataURL: dataUrl,
          visible: true,
        };

        const hasPaint = paintCanvasRef.current ? !isCanvasEmpty(paintCanvasRef.current) : false;
        setPaintAboveOverlay(!hasPaint ? true : false);

        setOverlays((prev) => [...prev, newLayer]);
        setActiveId(id);
        ensureCanvasSizes();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  /* ================== Helpers ================== */
  function isCanvasEmpty(c: HTMLCanvasElement) {
    const g = c.getContext("2d")!;
    const d = g.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) return false;
    return true;
  }

  function ensureCanvasSizes() {
    if (!frameRef.current) return;
    const w = frameRef.current.clientWidth;
    const h = frameRef.current.clientHeight;

    const keep = (c: HTMLCanvasElement | null) => {
      if (!c) return;
      const prev = c.toDataURL();
      const img = new Image();
      img.onload = () => {
        c.width = w;
        c.height = h;
        const g = c.getContext("2d")!;
        g.clearRect(0, 0, w, h);
        g.drawImage(img, 0, 0, w, h);
      };
      if (c.width !== w || c.height !== h) img.src = prev;
    };
    keep(paintCanvasRef.current);
    keep(textCanvasRef.current);
  }

  function setActiveByHit(stageX: number, stageY: number) {
    for (let i = overlays.length - 1; i >= 0; i--) {
      const L = overlays[i];
      if (!L.visible) continue;
      if (hitOverlay(L, stageX, stageY)) {
        setActiveId(L.id);
        return L;
      }
    }
    return null;
  }

  function hitOverlay(L: OverlayLayer, stageX: number, stageY: number) {
    const S = (L.baseW / L.img.naturalWidth) * L.scale;
    return Math.abs(stageX - L.pos.x) <= (L.img.naturalWidth * S) / 2 &&
           Math.abs(stageY - L.pos.y) <= (L.img.naturalHeight * S) / 2;
  }

  function toImageSpace(L: OverlayLayer, stageX: number, stageY: number) {
    const S = (L.baseW / L.img.naturalWidth) * L.scale;
    const theta = (-L.rot * Math.PI) / 180;
    const dx = stageX - L.pos.x;
    const dy = stageY - L.pos.y;
    const u = Math.cos(theta) * dx - Math.sin(theta) * dy;
    const v = Math.sin(theta) * dx + Math.cos(theta) * dy;
    const ix = u / S + L.img.naturalWidth / 2;
    const iy = v / S + L.img.naturalHeight / 2;
    return { ix, iy, S };
  }

  // Σπάσαμε το recomposite σε 2 φάσεις για απόδοση:
  function applyMaskOnly(L: OverlayLayer) {
    const c = L.comp.getContext("2d")!;
    c.clearRect(0, 0, L.comp.width, L.comp.height);
    c.drawImage(L.img, 0, 0);
    c.globalCompositeOperation = "destination-in";
    c.drawImage(L.mask, 0, 0);
    c.globalCompositeOperation = "source-over";
  }
  function updateOverlayDataURL(L: OverlayLayer) {
    try {
      L.dataURL = L.comp.toDataURL("image/png");
    } catch {
      L.dataURL = L.src;
    }
  }
  function recompositeLayer(L: OverlayLayer) {
    applyMaskOnly(L);
    updateOverlayDataURL(L);
  }

  // απλά κουμπιά scale για ενεργό overlay
  function nudgeScale(step: number) {
    const L = overlays.find((o) => o.id === activeId);
    if (!L) return;
    L.scale = Math.max(0.1, Math.min(3, +(L.scale + step).toFixed(3)));
    setOverlays((prev) => [...prev]);
  }

  /* ================== Brush / Eraser ================== */
  function brushStroke(from: { x: number; y: number }, to: { x: number; y: number }) {
    const c = paintCanvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brush;
    ctx.strokeStyle = brushColor;
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function erasePaintAtCircle(x: number, y: number) {
    const c = paintCanvasRef.current;
    if (!c) return;
    const g = c.getContext("2d")!;
    g.save();
    g.globalCompositeOperation = "destination-out";
    g.beginPath();
    g.arc(x, y, brush / 2, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  // Σβήνει/Επαναφέρει ΜΑΣΚΕΣ σε ΟΛΑ τα overlays στο πέρασμα — throttle για τα dataURLs
  function eraseAllMasksAt(stageX: number, stageY: number, mode: "erase" | "restore") {
    const now = performance.now();
    let didTouch = false;

    for (const L of overlays) {
      const map = toImageSpace(L, stageX, stageY);
      if (!map) continue;
      const { ix, iy, S } = map;
      const m = L.mask.getContext("2d")!;
      const rImg = Math.max(1, (brush / 2) / S);

      m.save();
      m.beginPath();
      m.arc(ix, iy, rImg, 0, Math.PI * 2);
      m.globalCompositeOperation = mode === "erase" ? "destination-out" : "source-over";
      m.fillStyle = "#fff";
      m.fill();
      m.restore();

      // ΜΟΝΟ σύνθεση στο comp (γρήγορο)
      applyMaskOnly(L);
      touchedMaskIdsRef.current.add(L.id);
      didTouch = true;
    }

    // Αν δεν πείραξε τίποτα, φύγαμε
    if (!didTouch) return;

    // Κάνε ακριβό toDataURL το ΠΟΛΥ κάθε ~90ms (ομαλές «ριπές» ενημέρωσης)
    if (now - lastUrlUpdateRef.current >= URL_UPDATE_MS) {
      lastUrlUpdateRef.current = now;
      const ids = Array.from(touchedMaskIdsRef.current);
      if (ids.length) {
        for (const id of ids) {
          const L = overlays.find((o) => o.id === id);
          if (L) updateOverlayDataURL(L);
        }
        touchedMaskIdsRef.current.clear();
        setOverlays((prev) => [...prev]);
      }
    }
  }

  function colorDist(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
    const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function magicCleanAtPointer(L: OverlayLayer, stageX: number, stageY: number) {
    const tol = 45; const feather = 1;
    const map = toImageSpace(L, stageX, stageY);
    if (!map) return;
    const { ix, iy } = map;

    const tmp = document.createElement("canvas");
    tmp.width = L.img.naturalWidth; tmp.height = L.img.naturalHeight;
    const t = tmp.getContext("2d")!;
    t.drawImage(L.img, 0, 0);
    const src = t.getImageData(0, 0, tmp.width, tmp.height);
    const data = src.data, W = src.width, H = src.height;

    const x0 = Math.max(0, Math.min(W - 1, Math.round(ix)));
    const y0 = Math.max(0, Math.min(H - 1, Math.round(iy)));
    const i0 = 4 * (y0 * W + x0);
    const r0 = data[i0], g0 = data[i0 + 1], b0 = data[i0 + 2];

    const mctx = L.mask.getContext("2d")!;
    const mimg = mctx.getImageData(0, 0, W, H);
    const md = mimg.data;

    const q: number[] = [];
    const visited = new Uint8Array(W * H);
    q.push(y0 * W + x0);
    visited[y0 * W + x0] = 1;

    while (q.length) {
      const idx = q.pop()!;
      const ii = 4 * idx;
      const r = data[ii], g = data[ii + 1], b = data[ii + 2], a = data[ii + 3];
      if (a < 10 || colorDist(r, g, b, r0, g0, b0) <= tol) {
        md[ii] = 255; md[ii + 1] = 255; md[ii + 2] = 255; md[ii + 3] = 0;
        const nb = [idx + 1, idx - 1, idx + W, idx - W];
        for (const n of nb) {
          if (n < 0 || n >= W * H) continue;
          if (visited[n]) continue;
          visited[n] = 1;
          q.push(n);
        }
      }
    }

    if (feather > 0) {
      const tmp2 = document.createElement("canvas");
      tmp2.width = W; tmp2.height = H;
      const c2 = tmp2.getContext("2d")!;
      c2.putImageData(new ImageData(md, W, H), 0, 0);
      const blurred = document.createElement("canvas");
      blurred.width = W; blurred.height = H;
      const bctx = blurred.getContext("2d")!;
      bctx.filter = `blur(${feather}px)`;
      bctx.drawImage(tmp2, 0, 0);
      const bimg = bctx.getImageData(0, 0, W, H);
      mctx.putImageData(bimg, 0, 0);
    } else {
      mctx.putImageData(mimg, 0, 0);
    }
    // ίδιο throttle για ενημέρωση εικόνας
    applyMaskOnly(L);
    touchedMaskIdsRef.current.add(L.id);
    const now = performance.now();
    if (now - lastUrlUpdateRef.current >= URL_UPDATE_MS) {
      lastUrlUpdateRef.current = now;
      const ids = Array.from(touchedMaskIdsRef.current);
      if (ids.length) {
        for (const id of ids) {
          const OL = overlays.find((o) => o.id === id);
          if (OL) updateOverlayDataURL(OL);
        }
        touchedMaskIdsRef.current.clear();
        setOverlays((prev) => [...prev]);
      }
    }
  }

  /* ================== Text ================== */
  function rasterizeText() {
    const host = frameRef.current, canvas = textCanvasRef.current;
    if (!host || !canvas) return;
    const w = host.clientWidth, h = host.clientHeight;
    const g = canvas.getContext("2d")!;
    g.clearRect(0, 0, w, h);
    for (const t of texts) {
      g.save();
      g.translate(t.x, t.y);
      const weight = t.bold ? "700 " : "";
      const style = t.italic ? "italic " : "";
      g.font = `${style}${weight}${t.size}px ${t.font}`;
      g.fillStyle = t.color;
      g.textAlign = "center";
      g.textBaseline = "middle";
      const lines = t.text.split("\n");
      const lh = Math.round(t.size * 1.25);
      const startY = -((lines.length - 1) * lh) / 2;
      for (let i = 0; i < lines.length; i++) g.fillText(lines[i], 0, startY + i * lh);
      g.restore();
    }
  }

  function addTextCenter() {
    if (!frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    const item: TextItem = {
      id: uid(),
      x: r.width / 2,
      y: r.height / 2,
      text: textInput || "Your text",
      size: textSize,
      color: textColor,
      font: textFont,
      bold: textBold,
      italic: textItalic,
    };
    setTexts((arr) => [...arr, item]);
    setSelectedTextId(item.id);
  }

  function hitTextAt(x: number, y: number) {
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i];
      const lines = t.text.split("\n");
      const height = Math.max(1, Math.round(t.size * 1.25) * lines.length);
      const maxLen = Math.max(...lines.map((l) => l.length), 1);
      const width = Math.max(1, Math.round(t.size * 0.6 * maxLen));
      const left = t.x - width / 2;
      const top = t.y - height / 2;
      if (x >= left && x <= left + width && y >= top && y <= top + height) return t;
    }
    return null;
  }

  /* ================== Pointer ================== */
  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const rect = frameRef.current!.getBoundingClientRect();
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setMousePos(p);

    // pointers για pinch
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // 1) Text hit → drag text
    const tHit = hitTextAt(p.x, p.y);
    if (tHit) {
      setSelectedTextId(tHit.id);
      pointer.current.dragging = true;
      pointer.current.draggingText = true;
      pointer.current.textOffX = p.x - tHit.x;
      pointer.current.textOffY = p.y - tHit.y;
      return;
    }

    // 2) Overlay hit → active
    setActiveByHit(p.x, p.y);

    if (pointersRef.current.size === 2) {
      // αρχή pinch (scale + pan) στο ενεργό overlay
      const pts = [...pointersRef.current.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const cx = (pts[0].x + pts[1].x) * 0.5 - rect.left;
      const cy = (pts[0].y + pts[1].y) * 0.5 - rect.top;

      let L = overlays.find((o) => o.id === activeId);
      if (!L) {
        L = setActiveByHit(cx, cy) || null;
      }
      pinchRef.current = L
        ? { startDist: dist, startCx: cx, startCy: cy, overlayId: L.id, startScale: L.scale, startPos: { ...L.pos } }
        : { startDist: dist, startCx: cx, startCy: cy, overlayId: null, startScale: 1, startPos: { x: 0, y: 0 } };
      return;
    }

    if (tool === "move") {
      pointer.current.dragging = true;
      return;
    }

    if (tool === "erase" || tool === "restore") {
      pointer.current.paintingMask = true;
      erasePaintAtCircle(p.x, p.y);
      eraseAllMasksAt(p.x, p.y, tool === "erase" ? "erase" : "restore");
      return;
    }

    if (tool === "magic") {
      const A = overlays.find((o) => o.id === activeId);
      if (A) magicCleanAtPointer(A, p.x, p.y);
      return;
    }

    if (tool === "brush") {
      pointer.current.paintingBrush = true;
      lastPoint.current = { ...p };
      brushStroke(p, p);
      return;
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setMousePos(p);

    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // 2 δάχτυλα → pinch (scale) + pan (χωρίς ζωγραφική)
    if (pointersRef.current.size === 2 && pinchRef.current) {
      const pts = [...pointersRef.current.values()];
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const cx = (pts[0].x + pts[1].x) * 0.5 - rect.left;
      const cy = (pts[0].y + pts[1].y) * 0.5 - rect.top;

      const pin = pinchRef.current;
      const L = overlays.find((o) => o.id === pin.overlayId);
      if (L) {
        const factor = Math.max(0.1, Math.min(3, pin.startScale * (dist / pin.startDist)));
        L.scale = factor;
        L.pos = { x: pin.startPos.x + (cx - pin.startCx), y: pin.startPos.y + (cy - pin.startCy) };
        setOverlays((prev) => [...prev]);
      }
      return;
    }

    // drag text
    if (pointer.current.draggingText && selectedTextId) {
      setTexts((arr) =>
        arr.map((t) =>
          t.id === selectedTextId ? { ...t, x: p.x - pointer.current.textOffX, y: p.y - pointer.current.textOffY } : t
        )
      );
      return;
    }

    // move overlay
    if (tool === "move" && pointer.current.dragging) {
      const A = overlays.find((o) => o.id === activeId);
      if (A) {
        const dx = e.movementX;
        const dy = e.movementY;
        A.pos.x = Math.max(0, Math.min(rect.width, A.pos.x + dx));
        A.pos.y = Math.max(0, Math.min(rect.height, A.pos.y + dy));
        setOverlays((prev) => [...prev]);
      }
      return;
    }

    // με 2 δάχτυλα δεν ζωγραφίζουμε
    if (pointersRef.current.size >= 2) return;

    if ((tool === "erase" || tool === "restore") && pointer.current.paintingMask) {
      erasePaintAtCircle(p.x, p.y);
      eraseAllMasksAt(p.x, p.y, tool === "erase" ? "erase" : "restore");
      return;
    }

    if (tool === "brush" && pointer.current.paintingBrush) {
      if (!lastPoint.current) lastPoint.current = { ...p };
      brushStroke(lastPoint.current, p);
      lastPoint.current = { ...p };
      return;
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointer.current.dragging = false;
    pointer.current.draggingText = false;
    pointer.current.paintingMask = false;
    pointer.current.paintingBrush = false;
    lastPoint.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // καθάρισε pointers pinch
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
    }

    // ΤΕΛΙΚΟ update των overlays που πειράξαμε (ώστε να μην μείνει πίσω κανένα)
    if (touchedMaskIdsRef.current.size) {
      const ids = Array.from(touchedMaskIdsRef.current);
      for (const id of ids) {
        const L = overlays.find((o) => o.id === id);
        if (L) {
          applyMaskOnly(L);
          updateOverlayDataURL(L);
        }
      }
      touchedMaskIdsRef.current.clear();
      setOverlays((prev) => [...prev]);
    }
  }

  function onWheel(e: React.WheelEvent) {
    // zoom στο active overlay
    const L = overlays.find((o) => o.id === activeId);
    if (!L) return;
    e.preventDefault();
    const ns = Math.max(0.1, Math.min(3, L.scale + -Math.sign(e.deltaY) * 0.05));
    L.scale = ns;
    setOverlays((prev) => [...prev]);
  }

  function centerOverlay() {
    const L = overlays.find((o) => o.id === activeId);
    if (!L || !frameRef.current) return;
    const r = frameRef.current.getBoundingClientRect();
    L.pos = { x: r.width / 2, y: r.height / 2 };
    setOverlays((prev) => [...prev]);
  }
  function removeOverlay() {
    if (!activeId) return;
    setOverlays((prev) => prev.filter((o) => o.id !== activeId));
    setActiveId((prev) => {
      const rest = overlays.filter((o) => o.id !== prev);
      return rest.length ? rest[rest.length - 1].id : null;
    });
  }

  /* ================== Export ================== */
  function scaleToContain(sw: number, sh: number, dw: number, dh: number) {
    const s = Math.min(dw / sw, dh / sh);
    return { width: sw * s, height: sh * s, x: (dw - sw * s) / 2, y: (dh - sh * s) / 2 };
  }
  function loadImage(src: string) {
    return new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = src;
    });
  }
  async function renderToCanvas(exportScale = 2) {
    if (!frameRef.current) return null;
    const { clientWidth: w, clientHeight: h } = frameRef.current;
    const cw = Math.max(1, Math.floor(w * exportScale));
    const ch = Math.max(1, Math.floor(h * exportScale));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // bg
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cw, ch);

    // base sneaker
    const base = await loadImage(MODEL_VIEWS[model][view]);
    const fit = scaleToContain(base.naturalWidth, base.naturalHeight, cw, ch);
    ctx.drawImage(base, fit.x, fit.y, fit.width, fit.height);

    // paint κάτω
    if (!paintAboveOverlay && paintCanvasRef.current) {
      ctx.drawImage(paintCanvasRef.current, 0, 0, w, h, 0, 0, cw, ch);
    }

    // overlays με τη σειρά
    for (const L of overlays) {
      if (!L.visible || !L.dataURL) continue;
      const overlay = await loadImage(L.dataURL);
      const natW = L.img.naturalWidth;
      const baseS = L.baseW / natW;
      ctx.save();
      ctx.translate(L.pos.x * exportScale, L.pos.y * exportScale);
      ctx.rotate((L.rot * Math.PI) / 180);
      ctx.scale(baseS * L.scale * exportScale, baseS * L.scale * exportScale);
      ctx.drawImage(overlay, -overlay.width / 2, -overlay.height / 2);
      ctx.restore();
    }

    // paint πάνω
    if (paintAboveOverlay && paintCanvasRef.current) {
      ctx.drawImage(paintCanvasRef.current, 0, 0, w, h, 0, 0, cw, ch);
    }

    // text
    if (textCanvasRef.current) {
      ctx.drawImage(textCanvasRef.current, 0, 0, w, h, 0, 0, cw, ch);
    }

    return canvas;
  }

  async function renderPNGDataURL() {
    const canvas = await renderToCanvas(2);
    return canvas ? canvas.toDataURL("image/png") : null;
  }

  /* ================== Request Price / Copy message ================== */
  function buildRequestText() {
    const ts = new Date().toLocaleString();
    const modelName = { af1: "Air Force 1", af1black: "Air Force 1 Black", af1mid: "Air Force 1 Mid", aj1: "Air Jordan 1" }[model];
    const viewName = { right: "Δεξιά", left: "Αριστερά", front: "Μπροστά", back: "Πίσω" }[view];

    return [
      `Γεια σας, θα ήθελα προσφορά για custom ζωγραφική.`,
      `Μοντέλο: ${modelName}`,
      `Λήψη mockup: ${viewName}`,
      note ? `Σημείωση: ${note}` : undefined,
      `Έκανα Save/επισυνάπτω το mockup PNG.`,
      `Ημ/νία: ${ts}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  async function requestByEmail() {
    try {
      if (!session?.user?.email) {
        alert("Συνδέσου για να κάνεις αίτημα τιμής.");
        return;
      }
      const png = await renderPNGDataURL();
      const payload = {
        subject: "Request Price – Sneaker Custom",
        text: buildRequestText(),
        toEmail: "info@kzsyndicate.com",
        fromEmail: session.user.email,
        attachmentDataURL: png || undefined,
        filename: `mockup-sneaker-${model}-${view}.png`,
      };
      const res = await fetch("/api/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        alert("Συνδέσου για να κάνεις αίτημα τιμής.");
        return;
      }
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok || (json && json.ok === false)) {
        const msg = json?.error || `Αποτυχία αποστολής (status ${res.status}).`;
        throw new Error(msg);
      }
      alert("Στάλθηκε! Θα σου απαντήσουμε στο email.");
    } catch (err) {
      console.error(err);
      alert("Δεν στάλθηκε. Δοκίμασε ξανά ή πάτα Copy message και στείλε μας DM/email.");
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(buildRequestText());
      alert("Το κείμενο αντιγράφηκε!");
    } catch {
      alert("Δεν μπόρεσα να αντιγράψω. Δοκίμασε από desktop.");
    }
  }

  /* ================== Styles ================== */
  const C = {
    page: { background: "#000", minHeight: "100vh", padding: "90px 16px 80px", color: "#e8ffff" },
    h1: { textAlign: "center" as const, color: "#00f0ff", margin: "0 0 16px", fontSize: "26px" },

    topBar: {
      maxWidth: 1120,
      margin: "0 auto 8px",
      display: "flex",
      gap: 8,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      flexWrap: "wrap" as const,
    },
    select: {
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid rgba(0,255,255,.35)",
      background: "#0b0f12",
      color: "#89ffff",
      cursor: "pointer",
    },

    card: { maxWidth: 1120, margin: "0 auto", background: "#070a0c", border: "1px solid #0d2b2c", borderRadius: 16, padding: 14 },
    stage: {
      position: "relative" as const,
      width: "100%",
      aspectRatio: "16/9",
      background: "#000",
      borderRadius: 12,
      border: "1px solid #0c2",
      overflow: "hidden",
      touchAction: "none" as const,
    },

    actions: { maxWidth: 1120, margin: "10px auto 14px", display: "flex", gap: 10, justifyContent: "center" as const, flexWrap: "wrap" as const },
    fillBtn: { padding: "10px 14px", borderRadius: 12, border: "none", background: "#00ffff", color: "#001214", fontWeight: 900, cursor: "pointer" },
    ghostBtn: { padding: "10px 8px", borderRadius: 12, border: "1px solid rgba(0,255,255,.35)", background: "transparent", color: "#89ffff", cursor: "pointer", minWidth: 36 },

    advBar: { maxWidth: 1120, margin: "0 auto 8px", display: "flex", gap: 8, justifyContent: "center" as const, alignItems: "center" as const, flexWrap: "wrap" as const },
    pill: (active: boolean) => ({
      padding: "8px 12px",
      borderRadius: 10,
      border: "1px solid " + (active ? "#13e4e7" : "rgba(0,255,255,.35)"),
      background: active ? "#0ff" : "#111",
      color: active ? "#002224" : "#c8ffff",
      fontWeight: 800,
      cursor: "pointer",
    }),
    smallNote: { color: "#9ff", fontSize: 12 },

    textRow: { maxWidth: 1120, margin: "8px auto 0", display: "flex", gap: 8, justifyContent: "center" as const, alignItems: "center" as const, flexWrap: "wrap" as const },
    input: { background: "#050708", border: "1px solid #113", color: "#c8ffff", padding: "8px 10px", borderRadius: 10, outline: "none" as const },
    btn: { padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(0,255,255,.35)", background: "transparent", color: "#89ffff", cursor: "pointer" },

    footerBanner: {
      marginTop: "28px",
      textAlign: "center" as const,
      fontSize: "1.6rem",
      fontWeight: 900,
      color: "#00ffff",
      textShadow: "0 0 10px #0ff, 0 0 22px rgba(0,255,255,.6)",
      letterSpacing: ".3px",
    },
    footnote: { marginTop: "8px", textAlign: "center" as const, fontSize: "0.95rem", color: "#c8d0d0" },

    reqWrap: { maxWidth: 1120, margin: "16px auto 0", padding: "0 8px" },
    textarea: {
      width: "100%",
      minHeight: 100,
      background: "#080c0f",
      color: "#c8ffff",
      border: "1px solid #113",
      borderRadius: 10,
      padding: 12,
      outline: "none",
    },
    reqRow: { display: "flex", gap: 10, flexWrap: "wrap" as const, justifyContent: "center" as const, alignItems: "center" as const },
    bigBtn: {
      padding: "14px 22px",
      borderRadius: 12,
      fontWeight: 900,
      fontSize: "1.05rem",
      cursor: "pointer",
      border: "none",
      background: "#00ffff",
      color: "#002224",
    },
    bigBtnGhost: {
      padding: "14px 22px",
      borderRadius: 12,
      fontWeight: 700,
      fontSize: "1rem",
      cursor: "pointer",
      border: "1px solid rgba(0,255,255,.35)",
      background: "transparent",
      color: "#89ffff",
    },
    helper: { color: "#bff", marginTop: 10, marginBottom: 12, fontSize: 14, textAlign: "center" as const },
  };

  /* ================== UI ================== */
  return (
    <main style={{ ...C.page, overflowY: "auto" }}>

      <h1 style={C.h1}>Customizer – Sneakers</h1>

      {/* Επιλογές μοντέλου/όψης + Upload */}
      <div style={C.topBar}>
        <span style={{ color: "#89ffff" }}>Μοντέλο</span>
        <select value={model} onChange={(e) => setModel(e.target.value as ModelKey)} style={C.select as any}>
          <option value="af1">Air Force 1</option>
          <option value="af1black">Air Force 1 Black</option>
          <option value="af1mid">Air Force 1 Mid</option>
          <option value="aj1">Air Jordan 1</option>
        </select>

        <span style={{ color: "#89ffff" }}>Όψη</span>
        <select value={view} onChange={(e) => setView(e.target.value as ViewKey)} style={C.select as any}>
          {VIEW_OPTIONS.map((v) => (
            <option key={v.key} value={v.key}>
              {v.label}
            </option>
          ))}
        </select>

        <label style={C.fillBtn as any}>
          Add a Photo (JPG/PNG/WEBP)
          <input type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
        </label>
        <button onClick={centerOverlay} style={C.ghostBtn as any} title="Κεντράρισμα">⤢</button>
        <button onClick={removeOverlay} style={C.ghostBtn as any} title="Αφαίρεση">🗑</button>

        {/* Μικρά κουμπιά zoom + ένδειξη % */}
        <button onClick={() => nudgeScale(-0.1)} style={C.ghostBtn as any} aria-label="Zoom out">−</button>
        <button onClick={() => nudgeScale(+0.1)} style={C.ghostBtn as any} aria-label="Zoom in">+</button>
        <span style={{ color: "#89ffff" }}>
          {Math.round(((overlays.find(o => o.id === activeId)?.scale) || 1) * 100)}%
        </span>
      </div>

      {/* Stage */}
      <section style={C.card as any}>
        <div
          ref={frameRef}
          style={C.stage}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => setMouseInStage(true)}
          onPointerLeave={() => {
            setMouseInStage(false);
            pointer.current.dragging = false;
            pointer.current.draggingText = false;
            pointer.current.paintingMask = false;
            pointer.current.paintingBrush = false;
            lastPoint.current = null;
            pointersRef.current.clear();
            pinchRef.current = null;
          }}
          onWheel={(e) => {
            const L = overlays.find((o) => o.id === activeId);
            if (!L) return;
            e.preventDefault();
            const ns = Math.max(0.1, Math.min(3, L.scale + -Math.sign(e.deltaY) * 0.05));
            L.scale = ns;
            setOverlays((prev) => [...prev]);
          }}
        >
          {/* Βάση: sneaker */}
          <img
            src={MODEL_VIEWS[model][view]}
            alt={`${model} ${view}`}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", zIndex: 0 }}
            draggable={false}
          />

          {/* Paint: ΕΝΑΣ καμβάς */}
          <canvas
            ref={paintCanvasRef}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: paintAboveOverlay ? 5 : 1,
            }}
          />

          {/* Overlays */}
          {overlays.map((L) =>
            L.visible ? (
              <div
                key={L.id}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transform: `translate(calc(${L.pos.x}px - 50%), calc(${L.pos.y}px - 50%)) rotate(${L.rot}deg) scale(${L.scale})`,
                  transformOrigin: "center center",
                  pointerEvents: "none",
                  userSelect: "none",
                  zIndex: 3,
                }}
              >
                <img
                  src={L.dataURL || L.src}
                  alt="overlay"
                  style={{ display: "block", width: L.baseW, height: "auto", filter: "drop-shadow(0 0 6px rgba(0,255,255,.2))" }}
                  draggable={false}
                />
              </div>
            ) : null
          )}

          {/* Text layer */}
          <canvas ref={textCanvasRef} style={{ position: "absolute", inset: 0, zIndex: 9 }} />

          {/* Brush / Eraser preview dots */}
          {mouseInStage && tool === "brush" && (
            <div
              style={{
                position: "absolute",
                left: mousePos.x - brush / 2,
                top: mousePos.y - brush / 2,
                width: brush,
                height: brush,
                borderRadius: "50%",
                border: "1px solid rgba(0,255,255,.9)",
                pointerEvents: "none",
                mixBlendMode: "difference",
                zIndex: 10,
              }}
            />
          )}
          {mouseInStage && (tool === "erase" || tool === "restore") && (
            <div
              style={{
                position: "absolute",
                left: mousePos.x - brush / 2,
                top: mousePos.y - brush / 2,
                width: brush,
                height: brush,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,.8)",
                background: "rgba(255,255,255,.12)",
                pointerEvents: "none",
                zIndex: 10,
              }}
            />
          )}
        </div>
      </section>

      {/* ΠΑΝΩ ΣΕΙΡΑ ΕΡΓΑΛΕΙΩΝ */}
      <div style={C.advBar}>
        <button onClick={() => setTool("move")} style={C.pill(tool === "move")}>Move</button>
        <button onClick={() => setTool("erase")} style={C.pill(tool === "erase")} title="Γόμα (σβήνει paint & εικόνες)">Eraser</button>
        <button onClick={() => setTool("restore")} style={C.pill(tool === "restore")} title="Επαναφορά (μάσκες & paint)">Restore</button>
        <button onClick={() => {
          const A = overlays.find((o) => o.id === activeId);
          if (A) setTool("magic");
        }} style={C.pill(tool === "magic")} title="Αυτόματο καθάρισμα (Magic Wand)">Magic</button>
        <button onClick={() => setTool("brush")} style={C.pill(tool === "brush")}>Brush</button>

        <span style={C.smallNote}>Brush</span>
        <input type="range" min={6} max={160} step={2} value={brush} onChange={(e) => setBrush(parseInt(e.target.value))} />

        <span style={{ ...C.smallNote, marginLeft: 8 }}>Color</span>
        <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />

        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
          <input type="checkbox" checked={paintAboveOverlay} onChange={(e) => setPaintAboveOverlay(e.target.checked)} />
          <span style={C.smallNote}>Paint above image</span>
        </label>
      </div>

      {/* ΚΑΤΩ ΣΕΙΡΑ – Μόνο Text */}
      <div style={C.textRow}>
        <span style={C.smallNote}>Text</span>
        <input style={{ ...C.input, width: 220 }} value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Your text" />
        <span style={C.smallNote}>Font</span>
        <select value={textFont} onChange={(e) => setTextFont(e.target.value)} style={C.input as any}>
          <option value="Inter, system-ui, Arial, sans-serif">Inter / Default</option>
          <option value="Arial, Helvetica, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="'Comic Sans MS', 'Comic Sans', cursive">Comic Sans MS</option>
          <option value="Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif">Impact</option>
        </select>
        <span style={C.smallNote}>Size</span>
        <input type="range" min={12} max={160} step={2} value={textSize} onChange={(e) => setTextSize(parseInt(e.target.value))} />
        <span style={C.smallNote}>Color</span>
        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={textBold} onChange={(e) => setTextBold(e.target.checked)} />
          <span style={C.smallNote}>Bold</span>
        </label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" checked={textItalic} onChange={(e) => setTextItalic(e.target.checked)} />
          <span style={C.smallNote}>Italic</span>
        </label>
        <button onClick={addTextCenter} style={{ ...C.btn, borderColor: "#00ffff", color: "#00ffff", fontWeight: 800 }}>
          Add Text
        </button>
        <button
          onClick={() => {
            if (!selectedTextId) return;
            setTexts((arr) => arr.filter((t) => t.id !== selectedTextId));
            setSelectedTextId(null);
          }}
          style={C.btn as any}
        >
          Remove Selected
        </button>
      </div>

      {/* ——— Simple Request Price ——— */}
      <div style={C.reqWrap as any}>
        <textarea
          placeholder="Γράψε σχόλια για το σχέδιό σου…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={C.textarea as any}
        />
        <div style={C.helper as any}>
          Δεν βρίσκεις το sneaker σου; Δεν πειράζει — επίλεξε αυτό που μοιάζει περισσότερο
          ή κάνε το mockup σε άλλο και γράψε μας στο mail ποιο είναι το δικό σου μοντέλο/χρώμα.
        </div>
        <div style={C.reqRow as any}>
          <button onClick={requestByEmail} title="Θα σταλεί mail με συνημμένο PNG του mockup" style={C.bigBtn as any}>
            Request Price (Email)
          </button>
          <button onClick={copyMessage} title="Αντιγραφή κειμένου για DM/email" style={C.bigBtnGhost as any}>
            Copy message
          </button>
        </div>
      </div>

      <p style={C.footerBanner}>
        Αν θέλεις, στείλε μας το μοντέλο του παπουτσιού σου και το σχεδιό σου στο email μας και αναλαμβανουμε εμεις!
      </p>
    </main>
  );
}

