// GitHub star-milestone celebration — see README.md next to this file for the
// full workflow (fetching stargazers, downloading avatars, verification).
// Edit only the CONTENT block; everything below it is fixed styling.
import { For, createEffect, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { createTimeline, cubicBezier } from "animejs";
import { useTicker } from "@diffusionstudio/jsx";
import { FIRST, LAST } from "./stargazers.js";

// ── CONTENT — swap these for your repo ──────────────────────────────────────
const OWNER = "diffusionstudio";
const REPO = "lottie";
const MILESTONE = 5000; // star count the scroll lands on
// Org avatar and stargazer avatars, as library paths — drop the files under
// the project's `assets/` folder and they resolve by that path (see README.md).
const ORG_LOGO = "logo.png";
const AVATAR_DIR = "avatars"; // <login>.png per stargazer
// ────────────────────────────────────────────────────────────────────────────

// GitHub light-mode palette (deliberate brand exception: the scene replicates GitHub UI)
const INK = "#1f2328";
const STAR_YELLOW = "#eac54f";

// Geometry
const W = 1920;
const H = 1080;
const MARGIN = 128;
const HEADER_LEFT = 96;
const HEADER_TOP = 112;
const COUNTER_RIGHT = 96;
const COUNTER_BOTTOM = 128;
const FEATHER = 280;
const AVATAR = 224;
const GAP = 72;
const PITCH = AVATAR + GAP;
const TOTAL = MILESTONE;
const ROW_WIDTH = TOTAL * AVATAR + (TOTAL - 1) * GAP;
// End state: last avatar's right edge sits on the right margin
const SCROLL = ROW_WIDTH - (W - 2 * MARGIN);

// Timing (ms): five staggered slide-ins; the scroll (and with it the profiles)
// starts together with the footer's entrance.
const ENTER_MS = 450;
const STAGGER = 80;
const SCROLL_START = 3 * STAGGER;
const SCROLL_MS = 8400;
const DURATION = 10; // s
const RISE = 60;
// Strip starts fully off-screen right; the scroll itself is its entrance
const X_START = MARGIN - W;

// Closed-form scroll position, mirrors the timeline's row tween — the strip
// strip reads it directly each frame.
const SCROLL_EASE = cubicBezier(0.16, 1, 0.3, 1);
const xAt = (tms) => {
  const p = Math.min(Math.max((tms - SCROLL_START) / SCROLL_MS, 0), 1);
  return X_START + (SCROLL - X_START) * SCROLL_EASE(p);
};

// The ends are real, the middle cycles: the first items are the actual first
// stargazers in order, the last items the actual final ones (so the last
// avatar is the true milestone star), and everything between repeats the
// fetched pool — at full scroll speed nobody can tell.
const POOL = [...FIRST, ...LAST];
const items = Array.from({ length: TOTAL }, (_, i) =>
  i < FIRST.length ? FIRST[i]
    : i >= TOTAL - LAST.length ? LAST[i - (TOTAL - LAST.length)]
    : POOL[i % POOL.length]
);

// Confetti: bursts the moment the scroll lands on the milestone. Particle
// parameters come from a seeded PRNG so every re-execution (scrub, export) is
// identical; motion is pure ballistics evaluated from composition time.
const CONFETTI_T0 = 8.3; // fires as the scroll glides into the landing
const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rng = mulberry32(MILESTONE);
const CONFETTI_COLORS = ["#eac54f", "#0969da", "#2da44e", "#F43535", "#8250df", "#fd8c73"];
const CONFETTI = Array.from({ length: 520 }, (_, i) => {
  const cannon = i % 3; // 0 = left, 1 = right, 2 = center
  const ang =
    ((cannon === 0 ? -68 + rng() * 44
      : cannon === 1 ? -112 - rng() * 44
      : -60 - rng() * 60) * Math.PI) / 180;
  const speed = cannon === 2 ? 1800 + rng() * 1600 : 1400 + rng() * 1500;
  return {
    x0: cannon === 0 ? 180 : cannon === 1 ? 1740 : 960,
    y0: cannon === 2 ? 1120 : 1010,
    vx: Math.cos(ang) * speed,
    vy: Math.sin(ang) * speed,
    w: 10 + rng() * 12,
    h: 8 + rng() * 10,
    color: CONFETTI_COLORS[Math.floor(rng() * CONFETTI_COLORS.length)],
    r0: rng() * 360,
    vr: -720 + rng() * 1440,
    delay: rng() * 0.45,
    round: rng() < 0.25,
  };
});
const GRAVITY = 2600;

// Octicon star-fill
const STAR_PATH =
  "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z";

const logo = { opacity: 0, y: RISE };
const owner = { opacity: 0, y: RISE };
const repo = { opacity: 0, y: RISE };
const num = { opacity: 0, y: RISE };
const word = { opacity: 0, y: RISE };
const row = { x: X_START };

export default function GithubStargazers() {
  const { time } = useTicker();
  const [v, setV] = createStore({
    logo: { ...logo },
    owner: { ...owner },
    repo: { ...repo },
    num: { ...num },
    word: { ...word },
    row: { ...row },
  });

  const enter = cubicBezier(0.22, 1, 0.36, 1);
  const tl = createTimeline({ autoplay: false })
    .add(logo, { opacity: 1, y: 0, duration: ENTER_MS, ease: enter }, 0)
    .add(owner, { opacity: 1, y: 0, duration: ENTER_MS, ease: enter }, STAGGER)
    .add(repo, { opacity: 1, y: 0, duration: ENTER_MS, ease: enter }, 2 * STAGGER)
    .add(num, { opacity: 1, y: 0, duration: ENTER_MS, ease: enter }, 3 * STAGGER)
    .add(word, { opacity: 1, y: 0, duration: ENTER_MS, ease: enter }, 4 * STAGGER)
    .add(row, { x: SCROLL, duration: SCROLL_MS, ease: cubicBezier(0.16, 1, 0.3, 1) }, SCROLL_START);

  createEffect(() => {
    tl.seek(Math.min(time() * 1000, tl.duration));
    setV("logo", { ...logo });
    setV("owner", { ...owner });
    setV("repo", { ...repo });
    setV("num", { ...num });
    setV("word", { ...word });
    setV("row", { ...row });
  });

  // Number of avatars that have fully scrolled into the frame
  const count = () => {
    const entered = Math.floor((v.row.x + W - 2 * MARGIN - AVATAR) / PITCH) + 1;
    return Math.max(0, Math.min(TOTAL, entered));
  };

  // The strip is virtualized: only the handful of avatars overlapping the frame
  // is rendered, addressed by index from the same closed-form scroll position
  // the timeline tweens, so it stays exact under scrubbing and export.
  const visible = createMemo(() => {
    const x = xAt(time() * 1000);
    const kStart = Math.max(0, Math.floor((x - MARGIN - AVATAR) / PITCH));
    const kEnd = Math.min(TOTAL - 1, Math.ceil((x + W - MARGIN) / PITCH));
    const slice = [];
    for (let k = kStart; k <= kEnd; k++) {
      const left = MARGIN + k * PITCH - x;
      if (left > W + 20 || left + AVATAR < -20) continue;
      slice.push({ k, login: items[k], left });
    }
    return slice;
  });


  return (
    <stage background="#161616" camera={[0.3, 0, 0, 0.3, 85, 150]}>
      <scene name="GitHub stargazers" width={W} height={H} fill="#ffffff" active>
        <html x={0} y={0} width={W} height={H} end={DURATION} name="UI">
          <div
            style={`position:relative;width:${W}px;height:${H}px;
                  overflow:hidden;font-family:Inter;`}
          >
            {/* Stargazer strip, beneath the UI: the visible slice only */}
            <div style={`position:absolute;left:0;top:340px;width:${W}px;height:${AVATAR + 20 + 56}px;`}>
              <For each={visible()}>
                {(item) => (
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      transform: `translateX(${item.left}px)`,
                    }}
                  >
                    <img
                      src={`${AVATAR_DIR}/${item.login}.png`}
                      style={{
                        width: `${AVATAR}px`,
                        height: `${AVATAR}px`,
                        "border-radius": "50%",
                        background: "#ffffff",
                        border: "1px solid rgba(0,0,0,0.06)",
                        "box-shadow": "0 12px 28px rgba(31,35,40,0.16)",
                      }}
                    />
                    <svg
                      viewBox="0 0 16 16"
                      width="56"
                      height="56"
                      style={`display:block;margin:20px auto 0;fill:${STAR_YELLOW};`}
                    >
                      <path d={STAR_PATH} />
                    </svg>
                  </div>
                )}
              </For>

              {/* Edge feather: the scene's white background, faded over the ends */}
              <div
                style={`position:absolute;left:0;top:0;width:${FEATHER}px;height:100%;
                      background:linear-gradient(90deg,#ffffff,rgba(255,255,255,0));`}
              />
              <div
                style={`position:absolute;right:0;top:0;width:${FEATHER}px;height:100%;
                      background:linear-gradient(270deg,#ffffff,rgba(255,255,255,0));`}
              />
            </div>

            {/* Repo header, GitHub style */}
            <div
              style={{
                position: "absolute",
                left: `${HEADER_LEFT}px`,
                top: `${HEADER_TOP}px`,
                display: "flex",
                "align-items": "center",
                gap: "40px",
              }}
            >
              <img
                src={ORG_LOGO}
                width="135"
                height="135"
                style={{
                  width: "135px",
                  height: "135px",
                  "border-radius": "36px",
                  opacity: v.logo.opacity,
                  transform: `translateY(${v.logo.y}px)`,
                }}
              />
              <div style="font-size:96px;line-height:1;display:flex;align-items:baseline;">
                <span
                  style={{
                    color: INK,
                    "font-weight": "400",
                    opacity: v.owner.opacity,
                    transform: `translateY(${v.owner.y}px)`,
                  }}
                >
                  {OWNER}<span style="color:#b1bac4;"> / </span>
                </span>
                <span
                  style={{
                    color: INK,
                    "font-weight": "700",
                    "margin-left": "0.27em",
                    opacity: v.repo.opacity,
                    transform: `translateY(${v.repo.y}px)`,
                  }}
                >
                  {REPO}
                </span>
              </div>
            </div>

            {/* Star counter */}
            <div
              style={{
                position: "absolute",
                right: `${COUNTER_RIGHT}px`,
                bottom: `${COUNTER_BOTTOM}px`,
                display: "flex",
                "align-items": "baseline",
                gap: "56px",
              }}
            >
              <span
                style={{
                  "font-family": "Inter",
                  "font-size": "200px",
                  "font-weight": "700",
                  "line-height": "1",
                  color: INK,
                  "font-variant-numeric": "tabular-nums",
                  opacity: v.num.opacity,
                  transform: `translateY(${v.num.y}px)`,
                }}
              >
                {count().toLocaleString("en-US")}
              </span>
              <span
                style={{
                  "font-size": "200px",
                  "font-weight": "400",
                  "line-height": "1",
                  color: INK,
                  opacity: v.word.opacity,
                  transform: `translateY(${v.word.y}px)`,
                }}
              >
                stars
              </span>
            </div>

            {/* Confetti overlay: time-driven ballistics, fires at the milestone landing */}
            <For each={CONFETTI}>
              {(p) => {
                const t = createMemo(() => Math.max(0, time() - CONFETTI_T0 - p.delay));
                const opacity = createMemo(() => {
                  const tv = time() - CONFETTI_T0 - p.delay;
                  if (tv <= 0) return 0;
                  const y = p.y0 + p.vy * tv + 0.5 * GRAVITY * tv * tv;
                  if (y > H + 40) return 0;
                  return tv > 0.9 ? Math.max(0, 1 - (tv - 0.9) / 0.4) : 1;
                });
                return (
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      width: `${p.w}px`,
                      height: `${p.h}px`,
                      "border-radius": p.round ? "50%" : "2px",
                      background: p.color,
                      opacity: opacity(),
                      transform: `translate(${p.x0 + p.vx * t()}px, ${p.y0 + p.vy * t() + 0.5 * GRAVITY * t() * t()}px)
                                rotate(${p.r0 + p.vr * t()}deg)
                                scaleY(${0.35 + 0.65 * Math.abs(Math.cos(t() * 9 + p.r0))})`,
                    }}
                  />
                );
              }}
            </For>
          </div>
        </html>
      </scene>
    </stage>
  );
}
