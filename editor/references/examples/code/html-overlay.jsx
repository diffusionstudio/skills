import { createEffect, createSignal, onMount } from "solid-js";
import { gsap } from "gsap";
import { useTicker } from "@diffusionstudio/jsx";

const PROMPT = "Cut a 30 second teaser from these clips, punchy captions, synthwave score";

export default function PromptBox() {
  const { time } = useTicker();
  const [chars, setChars] = createSignal(0);

  // The paused timeline owns every moving value inside the markup: DOM refs
  // for the cursor and send button, a plain object for the typewriter. The
  // box itself enters via the built-in slideUp animation on the <html> tag.
  const typing = { chars: 0 };
  let cursor;
  let send;
  let tl;

  // GSAP resolves targets when a tween is created, and refs are only assigned
  // during render — build the timeline in onMount, after they exist.
  onMount(() => {
    // lazy: false — the paint snapshot samples right after seek(), so a
    // tween's first write must not be deferred to the end of the tick
    tl = gsap.timeline({ paused: true, defaults: { lazy: false } })
      .to(typing, { chars: PROMPT.length, duration: 6.2, ease: "none", snap: "chars" }, 0.6)
      .fromTo(cursor, { opacity: 0.9 }, { opacity: 0, duration: 0.5, repeat: 13, yoyo: true, ease: "steps(1)" }, 0.6)
      .fromTo(send, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" }, 6.6);
  });

  createEffect(() => {
    tl.seek(time());
    setChars(typing.chars);
  });

  return (
    <rect scene="example-html" name="Prompt box" width={1920} height={1080} fill="#0b0d12">
      <html
        x={460}
        y={400}
        width={1000}
        height={280}
        animations={[{ type: "slideUp", duration: 0.6 }]}
        end={8}
      >
        <div
          style={`height:100%;box-sizing:border-box;display:flex;flex-direction:column;
                  justify-content:space-between;padding:28px 32px;border-radius:24px;
                  border:1px solid #ffffff22;background:linear-gradient(180deg,#171a22,#101218);
                  font-family:Inter;color:white;`}
        >
          <div style="font-size:15px;letter-spacing:2px;opacity:0.5;">ASK THE EDITOR</div>

          <div style="font-size:30px;line-height:1.4;min-height:84px;">
            {PROMPT.slice(0, chars())}
            <span ref={cursor} style="color:#7c9cff;">▍</span>
          </div>

          <div style="display:flex;align-items:center;gap:12px;">
            <span style="padding:6px 14px;border-radius:999px;background:#ffffff14;font-size:14px;opacity:0.8;">
              gen-video-pro
            </span>
            <span style="font-size:14px;opacity:0.4;">1080p / 30 fps</span>
            <div
              ref={send}
              style={`margin-left:auto;width:48px;height:48px;border-radius:50%;background:#7c9cff;
                      display:flex;align-items:center;justify-content:center;font-size:24px;color:#0b0d12;`}
            >
              ↑
            </div>
          </div>
        </div>
      </html>
    </rect>
  );
}
