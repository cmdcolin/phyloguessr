export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

export interface MrcaInfo {
  taxId: number;
  name: string;
  rank: string;
}
