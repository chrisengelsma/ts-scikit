export class MathsUtils {
  private static NSMALL_SORT: number = 7;
  private static NLARGE_SORT: number = 40;

/**
 * Takes the cosine of a number by using the sine and an additional angle.
 * @param sin   the sine of an angle.
 * @param angle the angle.
 * @returns the resulting cosine.
 */
static cosFromSin(sin: number, angle: number): number {
  // sin(x)^2 + cos(x)^2 = 1
  const cos = Math.sqrt(1.0 - sin * sin);
  const a = angle + (Math.PI / 2);
  let b = a - Math.floor(a / (2 * Math.PI)) * (2 * Math.PI);
  if (b < 0) {
    b += (2 * Math.PI);
  }
  return (b >= Math.PI) ? -cos : cos;
}

/**
 * Converts degrees to radians.
 * @param degrees the angle in degrees
 * @returns the angle in radians.
 */
static toRadians(degrees: number): number {
  return (degrees * Math.PI / 180.0);
}

/**
 * Converts radians to degrees.
 * @param radians the angle in radians.
 * @returns the angle in degrees.
 */
static toDegrees(radians: number): number {
  return (radians * 180.0 / Math.PI);
}

/**
 * Determines whether the specified array is increasing.
 * The array is increasing if its elements a[i] increase with array index i,
 * with no equal values.
 * @param a the array.
 * @returns true, if increasing (or a.length &lt; 2); false, otherwise.
 */
static isIncreasing(a: number[]): boolean {
  const n = a.length;
  if (n > 1) {
    for (let i = 1; i < n; ++i) {
      if (a[i - 1] > a[i]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Determines whether the specified array is decreasing.
 * The array is decreasing if its elements a[i] decrease with array index i,
 * with no equal values.
 * @param a the array.
 * @returns true, if decreasing (or a.length &lt; 2); false, otherwise.
 */
static isDecreasing(a: number[]): boolean {
  const n = a.length;
  if (n < 1) {
    for (let i = 1; i < n; ++i) {
      if (a[i - 1] < a[i]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Determines whether the specified array is monotonic.
 * The array is monotonic if its elements[i] either increase or
 * decrease (but not both) with array index i, with no equal values.
 * @param a the array.
 * @returns true, if monotonic (or a.length &lt; 2); false, otherwise.
 */
static isMonotonic(a: number[]): boolean {
  return this.isIncreasing(a) || this.isDecreasing(a);
}

/**
 * Determines if two values are almost equal given a provided tolerance.
 * @param v1 a value.
 * @param v2 a value.
 * @param tiny the tolerance.
 * @returns true, if almost equal; false, otherwise.
 */
static almostEqual(v1: number, v2: number, tiny: number): boolean {
  const diff = v2 - v1;
  return (diff < 0.0) ? -diff < tiny : diff < tiny;
}

/**
 * Copies m-contents of one array into another.
 * <p>
 * The provided length m will be bound within the range 0 <= m <= arr.length.
 * @param arr the array to copy.
 * @param m   the number of elements to copy.
 * @returns the copied array.
 */
static copy(arr: number[], m: number = -1): number[] {
  m = Math.min(Math.max(m, 0), arr.length);
  const n = new Array<number>(m);
  for (let i = 0; i < m; ++i) { n[i] = arr[i]; }
  return n;
}

private static med3(a: number[], i: number, j: number, k: number): number {
  return a[i] < a[j] ?
    (a[j] < a[k] ? j : a[i] < a[k] ? k : i) :
    (a[j] > a[k] ? j : a[i] > a[k] ? k : i);
}

private static swap(a: number[], i: number, j: number, n: number = 1): void {
  while (n > 0) {
    const ai = a[i];
    a[i++] = a[j];
    a[j++] = ai;
    --n;
  }
}

static quickPartialSort(k: number, arr: number[]): void {
  const n = arr.length;
  let p = 0;
  let q = n - 1;
  const m = (n > this.NSMALL_SORT) ? new Array<number>(2) : null;
  while (q - p >= this.NSMALL_SORT) {
    m[0] = p;
    m[1] = q;
    this.quickPartition(arr, m);
    if (k < m[0]) {
      q = m[0] - 1;
    } else if (k > m[1]) {
      p = m[1] + 1;
    } else {
      return;
    }
  }
  this.insertionSort(arr, p, q);
}

private static insertionSort(a: number[], p: number, q: number): void {
  for (let i = p; i <= q; ++i) {
    for (let j = i; j > p && a[j - 1] > a[j]; --j) {
      this.swap(a, j, j - 1);
    }
  }
}

private static quickPartition(x: number[], m: number[]): void {
  const p = m[0];
  const q = m[1];
  const n = q - p + 1;
  let k = (p + q) / 2;
  if (n > this.NSMALL_SORT) {
    let j = q;
    let l = q;
    if (n > this.NLARGE_SORT) {
      const s = n / 8;
      j = this.med3(x, j, j + s, j + 2 * s);
      k = this.med3(x, k - s, k, k + s);
      l = this.med3(x, l - 2 * s, l - s, l);
    }
    k = this.med3(x, j, k, l);
  }
  const y = x[k];
  let a = p, b = p;
  let c = q, d = q;
  while (true) {
    while (b <= c && x[b] <= y) {
      if (x[b] === y) { this.swap(x, a++, b); }
      ++b;
    }
    while (c >= b && x[c] >= y) {
      if (x[c] === y) { this.swap(x, c, d--); }
      --c;
    }
    if (b > c) { break; }
    this.swap(x, b, c);
    ++b;
    --c;
  }

  const r = Math.min(a - p, b - a);
  const s = Math.min(d - c, q - d);
  const t = q + 1;
  this.swap(x, p, b - r, r);
  this.swap(x, b, t - s, s);
  m[0] = p + (b - a); // p --- m[0]-1 | m[0] --- m[1] | m[1]+1 --- q
  m[1] = q - (d - c); //   x<y               x=y               x>y
}
}
