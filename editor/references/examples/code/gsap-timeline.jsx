import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { gsap } from "gsap";
import { useTicker } from "@diffusionstudio/jsx";

const chip = { x: -160, y: 190, rotation: -90, cornerRadius: 12, opacity: 0 };
const card = { rise: 90, opacity: 0, progress: 0, hue: 210 };

export default function GsapTimeline() {
  const { time } = useTicker();
  const [v, setV] = createStore({ chip: { ...chip }, card: { ...card } });

  // lazy: false — GSAP defers a tween's first write to the end of the tick,
  // but the store copy below reads the targets synchronously after seek()
  const tl = gsap.timeline({ paused: true, defaults: { lazy: false } })
    .to(chip, { x: 110, opacity: 1, duration: 1, ease: "elastic.out(1, 0.6)" }, 0)
    .to(chip, { rotation: 270, cornerRadius: 80, duration: 1.4, ease: "power1.inOut" }, 1)
    .to(chip, { cornerRadius: 12, rotation: 360, duration: 0.8, ease: "back.out" }, 2.6)
    .to(card, { rise: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.2)
    .to(card, { progress: 100, duration: 2.8, ease: "sine.inOut" }, 0.5)
    .to(card, { hue: 570, duration: 3.4, ease: "none" }, 0);

  createEffect(() => {
    tl.seek(time() % tl.duration());
    setV("chip", { ...chip });
    setV("card", { ...card });
  });

  const hue = () => Math.round(v.card.hue);

  return (
    <rect scene="example-gsap" name="GSAP timeline" width={960} height={540} fill="#101014">
      <rect
        x={v.chip.x}
        y={v.chip.y}
        width={160}
        height={160}
        rotation={v.chip.rotation}
        cornerRadius={v.chip.cornerRadius}
        opacity={v.chip.opacity}
        fill={`hsl(${hue()} 90% 60%)`}
        end={3.25}
      />

      <html x={380} y={120} width={500} height={300} end={3.25}>
        <div
          style={{
            "font-family": "Inter",
            color: "white",
            padding: "28px 32px",
            transform: `translateY(${v.card.rise}px)`,
            opacity: v.card.opacity,
          }}
        >
          <div style={{ "font-size": "34px", "font-weight": "700", color: `hsl(${hue()} 90% 65%)` }}>
            DOM, meet timeline
          </div>
          {/* rgba text, not a nested `opacity`: fractional opacity inside this
              fading wrapper would blank the whole card in captures */}
          <div style={{ "font-size": "18px", color: "rgba(255,255,255,0.7)", margin: "6px 0 24px" }}>
            GSAP seeked from the playhead at t = {time().toFixed(2)}s
          </div>
          <div style={{ height: "14px", "border-radius": "7px", background: "#ffffff22" }}>
            <div
              style={{
                width: `${v.card.progress}%`,
                height: "100%",
                "border-radius": "7px",
                background: `linear-gradient(90deg, hsl(${hue() - 40} 90% 55%), hsl(${hue()} 90% 65%))`,
              }}
            />
          </div>
          <div style={{ "font-size": "16px", color: "rgba(255,255,255,0.6)", "margin-top": "10px" }}>
            {Math.round(v.card.progress)}% through the loop
          </div>
        </div>
      </html>
    </rect>
  );
}
