export const colors = {
  background: "#000000",
  surface: "#161616",
  text: "#F8F8F8",
  textSecondary: "#A4A4A4",
  brandRed: "#F43535",
} as const;

export const fonts = {
  sans: "Geist",
  mono: "Geist Mono",
} as const;

export const typography = {
  title: { size: 96, weight: 600 },
  subtitle: { size: 60, weight: 400 },
  lowerThirdName: { size: 48, weight: 500 },
  lowerThirdDetail: { size: 30, weight: 400 },
  label: { size: 24, weight: 500 },
} as const;

export const spacing = {
  labelToValue: 16,
  stackedLines: 24,
  separateBlocks: 40,
  margin: 64,
} as const;

export function frameMetrics(width: number, height: number) {
  const scale = Math.min(width, height) / 1080;
  const isNineBySixteen = Math.abs(width / height - 9 / 16) < 0.02;
  const margin = spacing.margin * scale;

  return {
    scale,
    margin,
    left: margin,
    right: isNineBySixteen ? width - 180 * scale : width - margin,
    top: isNineBySixteen ? 200 * scale : margin,
    bottom: isNineBySixteen ? height - 400 * scale : height - margin,
  };
}
