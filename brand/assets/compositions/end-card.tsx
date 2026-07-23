import { TitleCard, colors } from "../components";

const WIDTH = 1080;
const HEIGHT = 1920;
const DURATION = 4;

// PLACEHOLDER: Replace both strings and get the end-card treatment approved before use.
const content = {
  title: "End-card title",
  cta: "Call to action",
};

export default function EndCard() {
  return (
    <scene key="end-card" name="End card" width={WIDTH} height={HEIGHT} fill={colors.background}>
      <TitleCard
        width={WIDTH}
        height={HEIGHT}
        start={0}
        end={DURATION}
        title={content.title}
        subtitle={content.cta}
      />
    </scene>
  );
}
