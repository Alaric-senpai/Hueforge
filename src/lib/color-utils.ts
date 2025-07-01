export function generateRandomHex(): string {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
}

export function getContrastingTextColor(hex: string): 'text-white' | 'text-black' {
  if (!hex || hex.length < 7) return 'text-black';
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'text-black' : 'text-white';
  } catch (e) {
    return 'text-black';
  }
}

export function isValidHex(hex: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(hex);
}
