import { LowerThird, colors } from "../components";

const WIDTH = 1080;
const HEIGHT = 1920;
const DURATION = 6;

// PLACEHOLDER: Replace the media path and copy before mounting.
const content = {
  videoSrc: "/path/to/product-capture.mp4",
  name: "Feature name",
  detail: "One clear product detail",
};

export default function ProductDemo() {
  return (
    <scene key="product-demo" name="Product demo" width={WIDTH} height={HEIGHT} fill={colors.background}>
      <video
        name="Product footage"
        src={content.videoSrc}
        width={WIDTH}
        height={HEIGHT}
        start={0}
        end={DURATION}
        objectFit="cover"
      />
      <LowerThird
        width={WIDTH}
        height={HEIGHT}
        start={0}
        end={DURATION}
        name={content.name}
        detail={content.detail}
      />
    </scene>
  );
}
