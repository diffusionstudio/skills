import { createMemo } from "solid-js";
import { useTicker } from "@diffusionstudio/jsx";

const DURATION = 6; // seconds
const TARGET = 128; // final count-up value

export default function HtmlScene() {
  const { time } = useTicker();

  const t = createMemo(() => Math.min(time() / DURATION, 1)); // 0..1 clamped
  const count = createMemo(() => Math.round(t() * TARGET));

  return (
    <html scene="html-scene" name="HTML scene" width={1920} height={1080}>
      <div
        style={`width:1920px;height:1080px;box-sizing:border-box;
                display:flex;flex-direction:column;justify-content:center;gap:48px;
                padding:160px;font-family:Inter;color:white;
                background:radial-gradient(120% 120% at 20% 0%,#1a2030,#0b0d12);`}
      >
        <div style="font-size:22px;letter-spacing:6px;opacity:0.5;">DIFFUSION STUDIO</div>

        <div style="display:flex;align-items:baseline;gap:24px;">
          <div style="font-size:220px;font-weight:800;line-height:1;">{count()}</div>
          <div style="font-size:40px;opacity:0.6;">frames composed</div>
        </div>

        <div style="width:100%;height:14px;border-radius:999px;background:#ffffff1a;overflow:hidden;">
          <div
            style={`width:${(t() * 100).toFixed(2)}%;height:100%;border-radius:999px;
                    background:linear-gradient(90deg,#7c9cff,#c07cff);`}
          />
        </div>
      </div>
    </html>
  );
}
