import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { createTimeline } from "animejs";
import { useTicker } from "@diffusionstudio/jsx";

const chip = { x: -160, y: 190, rotation: -90, cornerRadius: 12, opacity: 0 };
const card = { rise: 90, opacity: 0, progress: 0, hue: 210 };

export default function AnimeTimeline() {
  const { time } = useTicker();
  const [v, setV] = createStore({ chip: { ...chip }, card: { ...card } });

  const tl = createTimeline({ autoplay: false })
    .add(chip, { x: 110, opacity: 1, duration: 1000, ease: "outElastic(1, .6)" }, 0)
    .add(chip, { rotation: 270, cornerRadius: 80, duration: 1400, ease: "inOutQuad" }, 1000)
    .add(chip, { cornerRadius: 12, rotation: 360, duration: 800, ease: "outBack" }, 2600)
    .add(card, { rise: 0, opacity: 1, duration: 800, ease: "outCubic" }, 200)
    .add(card, { progress: 100, duration: 2800, ease: "inOutSine" }, 500)
    .add(card, { hue: 570, duration: 3400, ease: "linear" }, 0);

  createEffect(() => {
    tl.seek((time() * 1000) % tl.duration);
    setV("chip", { ...chip });
    setV("card", { ...card });
  });

  const hue = () => Math.round(v.card.hue);

  return (
    <rect scene="example-anime" name="Anime timeline" width={960} height={540} fill="#101014">
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
          <div style={{ "font-size": "18px", opacity: 0.7, margin: "6px 0 24px" }}>
            anime.js seeked from the playhead at t = {time().toFixed(2)}s
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
          <div style={{ "font-size": "16px", opacity: 0.6, "margin-top": "10px" }}>
            {Math.round(v.card.progress)}% through the loop
          </div>
        </div>
      </html>
    </rect>
  );
}
