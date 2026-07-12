export const SHIRT_SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export type ShirtSize = (typeof SHIRT_SIZE_OPTIONS)[number];

export function isValidShirtSize(value: string): value is ShirtSize {
  return SHIRT_SIZE_OPTIONS.includes(value as ShirtSize);
}
