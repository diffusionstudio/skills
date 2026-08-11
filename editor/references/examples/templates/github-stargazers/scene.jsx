// GitHub star-milestone celebration — see README.md next to this file for the
// full workflow (fetching stargazers, downloading avatars, verification).
// Edit only the CONTENT block; everything below it is fixed styling.
import { For, createEffect, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { createTimeline, cubicBezier } from "animejs";
import { useTicker, useFile } from "@diffusionstudio/jsx";
import { FIRST, LAST } from "./stargazers.js";

// ── CONTENT — swap these for your repo ──────────────────────────────────────
const OWNER = "diffusionstudio";
const REPO = "lottie";
const MILESTONE = 5000; // star count the scroll lands on
// Org avatar and stargazer avatars, resolved by the editor (see README.md —
// keep them in folders inside the project directory you `dapi open`).
const ORG_LOGO = "/Movies/github-stargazers/logo.png";
const AVATAR_DIR = "/Movies/github-stargazers/avatars"; // <login>.png per stargazer
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
// surface reads it directly each frame.
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

  // Avatar pixels come from the project's avatars folder; useFile resolves
  // each path through the host, exactly as a node src would.
  const [loaded, setLoaded] = createSignal(0);
  const bitmaps = new Map(); // login -> ImageBitmap
  for (const login of new Set(items)) {
    const [file] = useFile(`${AVATAR_DIR}/${login}.png`);
    createEffect(() => {
      const f = file();
      if (!f) return;
      createImageBitmap(f).then((bmp) => {
        bitmaps.set(login, bmp);
        setLoaded((n) => n + 1);
      });
    });
  }

  const drawStargazers = (el) => {
    const ctx = el.getContext("2d");
    const star = new Path2D(STAR_PATH);
    createEffect(() => {
      loaded(); // redraw as avatars finish decoding
      const tms = time() * 1000;
      const x = xAt(tms);
      ctx.clearRect(0, 0, el.width, el.height);
      const kStart = Math.max(0, Math.floor((x - MARGIN - AVATAR) / PITCH));
      const kEnd = Math.min(TOTAL - 1, Math.ceil((x + W - MARGIN) / PITCH));
      for (let k = kStart; k <= kEnd; k++) {
        const img = bitmaps.get(items[k]);
        const left = MARGIN + k * PITCH - x;
        if (left > W + 20 || left + AVATAR < -20) continue;
        const cx = left + AVATAR / 2;
        ctx.save();
        ctx.shadowColor = "rgba(31,35,40,0.16)";
        ctx.shadowBlur = 28;
        ctx.shadowOffsetY = 12;
        ctx.beginPath();
        ctx.arc(cx, AVATAR / 2, AVATAR / 2, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
        if (img) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, AVATAR / 2, AVATAR / 2, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(img, left, 0, AVATAR, AVATAR);
          ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(cx, AVATAR / 2, AVATAR / 2 - 0.5, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.save();
        ctx.translate(cx - 28, AVATAR + 20);
        ctx.scale(3.5, 3.5);
        ctx.fillStyle = STAR_YELLOW;
        ctx.fill(star);
        ctx.restore();
      }
      // Edge feather: erase to transparent at the frame edges
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      let g = ctx.createLinearGradient(0, 0, FEATHER, 0);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, FEATHER, el.height);
      g = ctx.createLinearGradient(W, 0, W - FEATHER, 0);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(W - FEATHER, 0, FEATHER, el.height);
      ctx.restore();
    });
  };

  return (
    <rect scene="github-stargazers" name="GitHub stargazers" width={W} height={H} fill="#ffffff">
      {/* Stargazer strip: drawn into a canvas surface, below the html layer */}
      <surface
        x={0}
        y={340}
        width={W}
        height={AVATAR + 20 + 56}
        end={DURATION}
        name="Stargazers"
        ref={drawStargazers}
      />

      {/* Single html layer: header, counter, and confetti */}
      <html x={0} y={0} width={W} height={H} end={DURATION} name="UI">
        <div
          style={`position:relative;width:${W}px;height:${H}px;
                overflow:hidden;font-family:Inter;`}
        >
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
    </rect>
  );
}
