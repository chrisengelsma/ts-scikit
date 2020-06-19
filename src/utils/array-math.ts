/**
 * Utilities for arrays plus math methods
 * @packageDocumentation
 */

///////////////////////////////////////////////////////////////////////////
// math methods

/** @internal */
const N_SMALL_SORT: number = 7;

/** @internal */
const N_LARGE_SORT: number = 40;

/**
 * Takes the cosine of a number by using the sine and an additional angle.
 * @param sin   the sine of an angle.
 * @param angle the angle.
 * @returns the resulting cosine.
 */
export function cosFromSin(sin: number, angle: number): number {
  // sin(x)^2 + cos(x)^2 = 1
  const cos = Math.sqrt(1.0 - sin * sin);
  const a = angle + ( Math.PI / 2 );
  let b = a - Math.floor(a / ( 2 * Math.PI )) * ( 2 * Math.PI );
  if (b < 0) {
    b += ( 2 * Math.PI );
  }
  return ( b >= Math.PI ) ? -cos : cos;
}

/**
 * Converts degrees to radians.
 * @param degrees the angle in degrees
 * @returns the angle in radians.
 */
export function toRadians(degrees: number): number {
  return ( degrees * Math.PI / 180.0 );
}

/**
 * Converts radians to degrees.
 * @param radians the angle in radians.
 * @returns the angle in degrees.
 */
export function toDegrees(radians: number): number {
  return ( radians * 180.0 / Math.PI );
}

/**
 * Determines whether the specified array is increasing.
 * The array is increasing if its elements a[i] increase with array index i,
 * with no equal values.
 * @param a the array.
 * @returns true, if increasing (or a.length &lt; 2); false, otherwise.
 */
export function isIncreasing(a: number[]): boolean {
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
export function isDecreasing(a: number[]): boolean {
  const n = a.length;
  if (n > 1) {
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
export function isMonotonic(a: number[]): boolean {
  return isIncreasing(a) || isDecreasing(a);
}

/**
 * Determines if two values are almost equal given a provided tolerance.
 * @param v1 a value.
 * @param v2 a value.
 * @param tiny the tolerance.
 * @returns true, if almost equal; false, otherwise.
 */
export function almostEqual(v1: number, v2: number, tiny: number): boolean {
  const diff = v2 - v1;
  return ( diff < 0.0 ) ? -diff < tiny : diff < tiny;
}

///////////////////////////////////////////////////////////////////////////
// copy

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @returns array copy.
 */
export function copy(rx: number[]): number[];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @returns array copy.
 */
export function copy(rx: number[][]): number[][];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @returns array copy.
 */
export function copy(rx: number[][][]): number[][][];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @returns array copy.
 */
export function copy(rx: number[],
                     n1: number): number[];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @returns array copy.
 */
export function copy(rx: number[][],
                     n1: number, n2: number): number[][];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param n3 number of elements to copy in the 3rd dimension.
 * @returns array copy.
 */
export function copy(rx: number[][][],
                     n1: number, n2: number, n3: number): number[][][];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param j1 offset in 1st dimension of rx.
 * @returns array copy.
 */
export function copy(rx: number[],
                     n1: number,
                     j1: number): number[];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param j1 offset in 1st dimension of rx.
 * @param j2 offset in 2nd dimension of rx.
 * @returns array copy.
 */
export function copy(rx: number[][],
                     n1: number, n2: number,
                     j1: number, j2: number): number[][];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param n3 number of elements to copy in the 3rd dimension.
 * @param j1 offset in 1st dimension of rx.
 * @param j2 offset in 2nd dimension of rx.
 * @param j3 offset in 3rd dimension of rx.
 * @returns array copy.
 */
export function copy(rx: number[][][],
                     n1: number, n2: number, n3: number,
                     j1: number, j2: number, j3: number): number[][][];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param j1 offset in 1st dimension of rx.
 * @param k1 stride in 1st dimension of rx.
 * @returns array copy.
 */
export function copy(rx: number[],
                     n1: number,
                     j1: number,
                     k1: number): number[];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param j1 offset in 1st dimension of rx.
 * @param j2 offset in 2nd dimension of rx.
 * @param k1 stride in 1st dimension of rx.
 * @param k2 stride in 2nd dimension of rx.
 * @returns array copy.
 */
export function copy(rx: number[][],
                     n1: number, n2: number,
                     j1: number, j2: number,
                     k1: number, k2: number): number[][];

/**
 * Returns array copy of elements from the specified array.
 * @param rx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param n3 number of elements to copy in the 3rd dimension.
 * @param j1 offset in 1st dimension of rx.
 * @param j2 offset in 2nd dimension of rx.
 * @param j3 offset in 3rd dimension of rx.
 * @param k1 stride in 1st dimension of rx.
 * @param k2 stride in 2nd dimension of rx.
 * @param k3 stride in 3rd dimension of rx.
 * @returns array copy.
 */
export function copy(rx: number[][][],
                     n1: number, n2: number, n3: number,
                     j1: number, j2: number, j3: number,
                     k1: number, k2: number, k3: number): number[][][];

export function copy(rx: number[] | number[][] | number[][][],
                     p1?: number, p2?: number, p3?: number,
                     p4?: number, p5?: number, p6?: number,
                     p7?: number, p8?: number, p9?: number): number[] | number[][] | number[][][] {
  switch (arrayDimensions(rx)) {
    case 1:
      return _copy1d(rx as number[], p1, p2, p3);
    case 2:
      return _copy2d(rx as number[][], p1, p2, p3, p4, p5, p6);
    default:
      return _copy3d(rx as number[][][], p1, p2, p3, p4, p5, p6, p7, p8, p9);
  }
}


export function arrayDimensions(array: any, dim: number = 0): number {
  return ( array instanceof Array ) ? arrayDimensions(array[0], dim + 1) : dim;
}

/**
 * Performs a quick partial sort.
 * @param k
 * @param arr
 */
export function quickPartialSort(k: number, arr: number[]): void {
  const n = arr.length;
  let p = 0;
  let q = n - 1;
  const m = ( n > N_SMALL_SORT ) ? new Array<number>(2) : null;
  while (q - p >= N_SMALL_SORT) {
    m[0] = p;
    m[1] = q;
    quickPartition(arr, m);
    if (k < m[0]) {
      q = m[0] - 1;
    } else if (k > m[1]) {
      p = m[1] + 1;
    } else {
      return;
    }
  }
  insertionSort(arr, p, q);
}

/**
 * Performs a binary search in a monotonic array of values.
 * <p>
 * Values are assumed to increase or decrease monotonically, with no equal
 * values.
 * <p>
 * Warning: this method does not ensure that the specified array is
 * monotonic; that check would be more costly than this search.
 * @param a the array of values, assumed to be monotonic.
 * @param x the value for which to search.
 * @param i the index at which to begin the search. If negative, this
 *          method interprets this index as if returned from a
 *          previous call.
 * @returns the index at which the specified value is found, or, if not
 *          found, -(i + 1), where i equals the index at which the
 *          specified value would be located if it was inserted into
 *          the monotonic array.
 */
export function binarySearch(a: number[], x: number, i?: number): number {
  if (!i) { i = a.length; }
  const n = a.length;
  let nm1 = n - 1;
  let low = 0;
  let high = nm1;
  const increasing = n < 2 || a[0] < a[1];
  if (i < n) {
    high = ( 0 <= i ) ? i : -( i + 1 );
    low = high - 1;
    let step = 1;
    if (increasing) {
      for (; 0 < low && x < a[low]; low -= step, step += step) { high = low; }
      for (; high < nm1 && a[high] < x; high += step, step += step) { low = high; }
    } else {
      for (; 0 < low && x > a[low]; low -= step, step += step) { high = low; }
      for (; high < nm1 && a[high] > x; high += step, step += step) { low = high; }
    }
    if (low < 0) { low = 0; }
    if (high > nm1) { high = nm1; }
  }
  if (increasing) {
    while (low <= high) {
      let mid = ( low + high ) >> 1;
      let amid = a[mid];
      if (amid < x) {
        low = mid + 1;
      } else if (amid > x) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
  } else {
    while (low <= high) {
      let mid = ( low + high ) >> 1;
      let amid = a[mid];
      if (amid > x) {
        low = mid + 1;
      } else if (amid < x) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
  }
  return -( low + 1 );
}

function med3(a: number[], i: number, j: number, k: number): number {
  return a[i] < a[j] ?
    ( a[j] < a[k] ? j : a[i] < a[k] ? k : i ) :
    ( a[j] > a[k] ? j : a[i] > a[k] ? k : i );
}

function swap(a: number[], i: number, j: number, n: number = 1): void {
  while (n > 0) {
    const ai = a[i];
    a[i++] = a[j];
    a[j++] = ai;
    --n;
  }
}

function insertionSort(a: number[], p: number, q: number): void {
  for (let i = p; i <= q; ++i) {
    for (let j = i; j > p && a[j - 1] > a[j]; --j) {
      swap(a, j, j - 1);
    }
  }
}

function quickPartition(x: number[], m: number[]): void {
  const p = m[0];
  const q = m[1];
  const n = q - p + 1;
  let k = ( p + q ) / 2;
  if (n > N_SMALL_SORT) {
    let j = q;
    let l = q;
    if (n > N_LARGE_SORT) {
      const s = n / 8;
      j = med3(x, j, j + s, j + 2 * s);
      k = med3(x, k - s, k, k + s);
      l = med3(x, l - 2 * s, l - s, l);
    }
    k = med3(x, j, k, l);
  }
  const y = x[k];
  let a = p, b = p;
  let c = q, d = q;
  while (true) {
    while (b <= c && x[b] <= y) {
      if (x[b] === y) { swap(x, a++, b); }
      ++b;
    }
    while (c >= b && x[c] >= y) {
      if (x[c] === y) { swap(x, c, d--); }
      --c;
    }
    if (b > c) { break; }
    swap(x, b, c);
    ++b;
    --c;
  }

  const r = Math.min(a - p, b - a);
  const s = Math.min(d - c, q - d);
  const t = q + 1;
  swap(x, p, b - r, r);
  swap(x, b, t - s, s);
  m[0] = p + ( b - a ); // p --- m[0]-1 | m[0] --- m[1] | m[1]+1 --- q
  m[1] = q - ( d - c ); //   x<y               x=y               x>y
}

/** @internal */
function _copy1d(rx: number[], n1?: number, j1: number = 0, k1: number = 1): number[] {
  n1 = ( !n1 ) ? rx.length : Math.min(rx.length, Math.max(0, n1));
  const ry: number[] = new Array<number>(n1);
  for (let i1 = 0, ix = j1, iy = 0; i1 < n1; ++i1, ix += k1, iy++) {
    ry[iy] = rx[ix];
  }
  return ry;
}

/** @internal */
function _copy2d(rx: number[][],
                 n1?: number, n2?: number,
                 j1: number                 = 0, j2: number = 0,
                 k1: number = 1, k2: number = 1): number[][] {
  n2 = ( !n2 ) ? rx.length : Math.min(rx.length, Math.max(0, n2));
  const ry: number[][] = new Array<number[]>(n2);
  for (let i2 = 0; i2 < n2; ++i2) {
    ry[i2] = _copy1d(rx[j2 + i2 * k2], n1, j1, k1);
  }
  return ry;
}

/** @internal */
function _copy3d(rx: number[][][],
                 n1?: number, n2?: number, n3?: number,
                 j1: number                                 = 0, j2: number = 0, j3: number = 0,
                 k1: number = 1, k2: number = 1, k3: number = 1): number[][][] {
  n3 = ( !n3 ) ? rx.length : Math.min(rx.length, Math.max(0, n3));
  const ry: number[][][] = new Array<number[][]>(n3);
  for (let i3 = 0; i3 < n3; ++i3) {
    ry[i3] = _copy2d(rx[j3 + i3 * k3], n1, n2, j1, j2, k1, k2);
  }
  return ry;
}

