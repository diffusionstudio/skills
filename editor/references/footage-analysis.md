# Footage analysis

How to understand source material before editing it. Inspect only the modalities the decision turns on — speech, action, music, graphics, or atmosphere may lead, so there is no fixed priority. Sample the picture against what the audio tells you.

1. **Probe first.** `dapi media probe <id|path>` reports the container and its tracks, telling you up front whether the file has a video track, an audio track, or both. Everything after branches on that.
2. **Get the lay of the land.** Render a `dapi media waveform` (audio) and a `dapi media filmstrip` (video) for a fast, cheap overview of where the loud and quiet stretches and the visual scene changes fall. A filmstrip shows coarse structure and scene state, not crop, framing, readability, or an exact cut frame — grab a specific frame for any of those.
3. **Listen to the audio.** Run `dapi media listen` with a prompt tailored to the context (what you actually need to know), and explicitly ask the model to include timestamps in its answer. See [listen-prompts.md](./listen-prompts.md) for prompt patterns.
4. **Transcribe speech.** For speech, `dapi media transcribe` prints word-level start/end times directly and takes `--start`/`--end` to scope a range — read any segment straight from it.
5. **Sample the video against the audio.** Use `dapi media grab` to pull frames. When the audio has already pointed you at specific moments, feed those timestamps straight in from the transcript or listen output, e.g. `-t '00:32' '00:45' ...`. When you need a visual pass without such cues, reach for `--auto`: it scans the footage and keeps only the frames where the picture settles into a new visual state, dropping near-duplicates.

Stop when every consequential decision is supported at the fidelity it needs — often the filmstrip plus a few targeted grabs is enough. Match a claim's strength to the evidence behind it, and name any uncertainty you could not resolve.
