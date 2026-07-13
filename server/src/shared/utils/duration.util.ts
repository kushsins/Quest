const DURATION_PATTERN = /^(\d+)([smhd])$/;

const MULTIPLIERS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export function parseDurationToMs(duration: string): number {
  const match = DURATION_PATTERN.exec(duration);

  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = Number(match[1]);
  const unit = match[2] as string;
  const multiplier = MULTIPLIERS[unit];

  if (multiplier === undefined) {
    throw new Error(`Unsupported duration unit: ${unit}`);
  }

  return value * multiplier;
}

export function parseDurationToSeconds(duration: string): number {
  return Math.floor(parseDurationToMs(duration) / 1000);
}
