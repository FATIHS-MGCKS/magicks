/**
 * Quadrilateral → quadrilateral 2D projective mapping (homography).
 *
 * Given four source points and four destination points, builds a CSS
 * `matrix3d(...)` string that maps the source quad onto the destination
 * quad with correct perspective foreshortening.
 *
 * Used to project a flat iframe onto the photographic laptop screen so
 * that the embedded hero appears with the same tilt/perspective as the
 * physical laptop in the photograph — without any external dependency.
 */

export type V2 = readonly [number, number];

/**
 * Solves the 8×8 linear system `A · x = b` via Gaussian elimination
 * with partial pivoting. The system has 8 unknowns (a, b, c, d, e, f,
 * g, h) — the entries of a 3×3 projective matrix with bottom-right
 * fixed to 1.
 */
function solve8x8(A: number[][], b: number[]): number[] {
  const n = 8;
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[pivot][i])) pivot = k;
    }
    if (pivot !== i) [M[i], M[pivot]] = [M[pivot], M[i]];

    const div = M[i][i];
    if (Math.abs(div) < 1e-12) {
      throw new Error("Singular matrix in homography solve");
    }

    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / div;
      for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
    }
  }

  const x = new Array<number>(n);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) sum -= M[i][j] * x[j];
    x[i] = sum / M[i][i];
  }
  return x;
}

/**
 * Builds the homogeneous 3×3 projective matrix that maps four source
 * points to four destination points. Returns the eight free entries
 * `[a, b, c, d, e, f, g, h]` such that:
 *
 *   x' = (a·x + b·y + c) / (g·x + h·y + 1)
 *   y' = (d·x + e·y + f) / (g·x + h·y + 1)
 */
function quadHomography(
  src: readonly [V2, V2, V2, V2],
  dst: readonly [V2, V2, V2, V2],
): [number, number, number, number, number, number, number, number] {
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    const [sx, sy] = src[i];
    const [dx, dy] = dst[i];
    A.push([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy]);
    b.push(dx);
    A.push([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy]);
    b.push(dy);
  }

  const [a, bb, c, d, e, f, g, h] = solve8x8(A, b);
  return [a, bb, c, d, e, f, g, h];
}

/**
 * Returns a CSS `matrix3d(...)` string that maps the source rectangle
 * `[0..srcW] × [0..srcH]` onto the destination quadrilateral
 * `[tl, tr, br, bl]` (clockwise from top-left). Apply with
 * `transform-origin: 0 0`.
 *
 * The 4×4 matrix is the homogeneous projective 3×3 with the Z column
 * left as identity (we don't transform depth):
 *
 *   | a  b  0  c |
 *   | d  e  0  f |
 *   | 0  0  1  0 |
 *   | g  h  0  1 |
 *
 * CSS `matrix3d()` is column-major.
 */
export function quadToQuadMatrix3d(
  srcW: number,
  srcH: number,
  destination: readonly [V2, V2, V2, V2],
): string {
  const src: [V2, V2, V2, V2] = [
    [0, 0],
    [srcW, 0],
    [srcW, srcH],
    [0, srcH],
  ];
  const [a, b, c, d, e, f, g, h] = quadHomography(src, destination);

  // Column-major flattening for CSS matrix3d.
  const m = [
    a, d, 0, g,
    b, e, 0, h,
    0, 0, 1, 0,
    c, f, 0, 1,
  ];
  return `matrix3d(${m.map((v) => (Number.isFinite(v) ? v : 0)).join(",")})`;
}
