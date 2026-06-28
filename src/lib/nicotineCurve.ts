export const THRESHOLD_LOW = 0.25;
export const THRESHOLD_HIGH = 0.80;
export const PATCH_PLATEAU = 0.45;
export const PATCH_RAMP = 0.1;

export type CurveEvent = { kind: 'cigarette' | 'ponctuel' | 'vapoteuse' | 'patch'; t: number };
export type Zone = 'manque' | 'confort' | 'haut';

function cigaretteKernel(x: number, t0: number): number {
  if (x < t0) return 0;
  return 0.90 * Math.exp(-(x - t0) / 0.03);
}

function ponctuelKernel(x: number, t0: number): number {
  if (x < t0) return 0;
  const v = 0.35 * (Math.exp(-(x - t0) / 0.12) - Math.exp(-(x - t0) / 0.04));
  return Math.max(0, v);
}

function vapoteuseKernel(x: number, t0: number): number {
  if (x < t0) return 0;
  const v = 0.50 * (Math.exp(-(x - t0) / 0.07) - Math.exp(-(x - t0) / 0.03));
  return Math.max(0, v);
}

function patchKernel(x: number, t0: number): number {
  if (x < t0) return 0;
  const dt = x - t0;
  if (dt < PATCH_RAMP) return PATCH_PLATEAU * (dt / PATCH_RAMP);
  return PATCH_PLATEAU;
}

export function sampleCurve(opts: { patch: boolean; events: CurveEvent[]; n?: number }): number[] {
  const n = opts.n ?? 120;
  const ys: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 0 : i / (n - 1);
    let y = opts.patch ? patchKernel(x, 0) : 0;
    for (const event of opts.events) {
      if (event.kind === 'cigarette') y += cigaretteKernel(x, event.t);
      else if (event.kind === 'ponctuel') y += ponctuelKernel(x, event.t);
      else if (event.kind === 'vapoteuse') y += vapoteuseKernel(x, event.t);
      else y += patchKernel(x, event.t);
    }
    ys.push(Math.min(1, Math.max(0, y)));
  }
  return ys;
}

export function classifyZone(y: number): Zone {
  if (y < THRESHOLD_LOW) return 'manque';
  if (y > THRESHOLD_HIGH) return 'haut';
  return 'confort';
}

export function toSvgPath(ys: number[], width: number, height: number): string {
  if (ys.length === 0) return '';
  const n = ys.length;
  const points = ys.map((y, i) => {
    const x = n === 1 ? 0 : (i / (n - 1)) * width;
    const svgY = (1 - y) * height;
    return `${x},${svgY}`;
  });
  const [first, ...rest] = points;
  return rest.length > 0 ? `M${first} L${rest.join(' ')}` : `M${first}`;
}
