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
 * Returns the number of dimensions for the provided array.
 * @param array the array.
 * @param dim the starting dimension.
 * @returns the number of dimensions.
 */
export function arrayDimensions(array: any, dim: number = 0): number {
  return ( array instanceof Array ) ? arrayDimensions(array[0], dim + 1) : dim;
}

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
///////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////
// complex-copy (ccopy)
///////////////////////////////////////////////////////////////////////////


/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @returns array copy.
 */
export function ccopy(cx: number[]): number[];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @returns array copy.
 */
export function ccopy(cx: number[][]): number[][];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @returns array copy.
 */
export function ccopy(cx: number[][][]): number[][][];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @returns array copy.
 */
export function ccopy(cx: number[],
                      n1: number): number[];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @returns array copy.
 */
export function ccopy(cx: number[][],
                      n1: number, n2: number): number[][];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param n3 number of elements to copy in the 3rd dimension.
 * @returns array copy.
 */
export function ccopy(cx: number[][][],
                      n1: number, n2: number, n3: number): number[][][];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param j1 offset in 1st dimension of cx.
 * @returns array copy.
 */
export function ccopy(cx: number[],
                      n1: number,
                      j1: number): number[];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param j1 offset in 1st dimension of cx.
 * @param j2 offset in 2nd dimension of cx.
 * @returns array copy.
 */
export function ccopy(cx: number[][],
                      n1: number, n2: number,
                      j1: number, j2: number): number[][];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param n3 number of elements to copy in the 3rd dimension.
 * @param j1 offset in 1st dimension of cx.
 * @param j2 offset in 2nd dimension of cx.
 * @param j3 offset in 3rd dimension of cx.
 * @returns array copy.
 */
export function ccopy(cx: number[][][],
                      n1: number, n2: number, n3: number,
                      j1: number, j2: number, j3: number): number[][][];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param j1 offset in 1st dimension of cx.
 * @param k1 stride in 1st dimension of cx.
 * @returns array copy.
 */
export function ccopy(cx: number[],
                      n1: number,
                      j1: number,
                      k1: number): number[];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param j1 offset in 1st dimension of cx.
 * @param j2 offset in 2nd dimension of cx.
 * @param k1 stride in 1st dimension of cx.
 * @param k2 stride in 2nd dimension of cx.
 * @returns array copy.
 */
export function ccopy(cx: number[][],
                      n1: number, n2: number,
                      j1: number, j2: number,
                      k1: number, k2: number): number[][];

/**
 * Returns array copy of elements from the specified array.
 * @param cx source array.
 * @param n1 number of elements to copy in the 1st dimension.
 * @param n2 number of elements to copy in the 2nd dimension.
 * @param n3 number of elements to copy in the 3rd dimension.
 * @param j1 offset in 1st dimension of cx.
 * @param j2 offset in 2nd dimension of cx.
 * @param j3 offset in 3rd dimension of cx.
 * @param k1 stride in 1st dimension of cx.
 * @param k2 stride in 2nd dimension of cx.
 * @param k3 stride in 3rd dimension of cx.
 * @returns array copy.
 */
export function ccopy(cx: number[][][],
                      n1: number, n2: number, n3: number,
                      j1: number, j2: number, j3: number,
                      k1: number, k2: number, k3: number): number[][][];

export function ccopy(cx: number[] | number[][] | number[][][],
                      n1?: number, p2?: number, p3?: number,
                      p4?: number, p5?: number, p6?: number,
                      p7?: number, p8?: number, p9?: number): number[] | number[][] | number[][][] {
  if (!n1) { n1 = cx.length; }
  switch (arrayDimensions(cx)) {
    case 1:
      return _copy1d(cx as number[], n1 * 2, p2, p3, true);
    case 2:
      return _copy2d(cx as number[][], n1 * 2, p2, p3, p4, p5, p6, true);
    default:
      return _copy3d(cx as number[][][], n1 * 2, p2, p3, p4, p5, p6, p7, p8, p9, true);
  }
}


///////////////////////////////////////////////////////////////////////////
// czeros
///////////////////////////////////////////////////////////////////////////

/**
 * Returns an array of zeros.
 * @param n1 1st array dimension.
 * @returns an array[2 * n1] of zero complex numbers.
 */
export function czero(n1: number): number[];

/**
 * Returns an array of zeros.
 * @param n1 1st array dimension.
 * @param n2 2nd array dimension.
 * @returns an array[n2][2 * n1] of zero complex numbers.
 */
export function czero(n1: number, n2: number): number[][];

/**
 * Returns an array of zeros.
 * @param n1 1st array dimension.
 * @param n2 2nd array dimension.
 * @param n3 3rd array dimension.
 * @returns an array[n3][n2][2 * n1] of zero complex numbers.
 */
export function czero(n1: number, n2: number, n3: number): number[][][];

/**
 * Zeros the specified array.
 * @param cx the array.
 */
export function czero(cx: number[]): void;

/**
 * Zeros the specified array.
 * @param cx the array.
 */
export function czero(cx: number[][]): void;

/**
 * Zeros the specified array.
 * @param cx the array.
 */
export function czero(cx: number[][][]): void;

export function czero(cxn1: number | number[] | number[][] | number[][][],
                      n2?: number, n3?: number): void | number[] | number[][] | number[][][] {
  switch (arrayDimensions(cxn1)) {
    case 1:
      _fill1D(cxn1 as number[], 0);
      return;
    case 2:
      _fill2D(cxn1 as number[][], 0);
      return;
    case 3:
      _fill3D(cxn1 as number[][][], 0);
      return;
  }

  if (n3) {
    const rx = new Array<number[][]>(n3);
    for (let i3 = 0; i3 < n3; ++i3) {
      rx[i3] = new Array<number[]>(n2);
      for (let i2 = 0; i2 < n2; ++i2) {
        rx[i3][i2] = Array.from({ length: 2 * (cxn1 as number) }, () => 0);
      }
    }
    return rx;
  } else if (n2) {
    const rx = new Array<number[]>(n2);
    for (let i2 = 0; i2 < n2; ++i2) {
      rx[i2] = Array.from({ length: 2 * (cxn1 as number) }, () => 0);
    }
    return rx;
  } else {
    return Array.from({ length: 2 * (cxn1 as number) }, () => 0);
  }
}

///////////////////////////////////////////////////////////////////////////
// zeros
///////////////////////////////////////////////////////////////////////////

/**
 * Returns an array of zeros.
 * @param n1 1st array dimension.
 */
export function zero(n1: number): number[];

/**
 * Returns an array of zeros.
 * @param n1 1st array dimension.
 * @param n2 2nd array dimension.
 */
export function zero(n1: number, n2: number): number[][];

/**
 * Returns an array of zeros.
 * @param n1 1st array dimension.
 * @param n2 2nd array dimension.
 * @param n3 3rd array dimension.
 */
export function zero(n1: number, n2: number, n3: number): number[][][];

/**
 * Zeros the specified array.
 * @param rx the array.
 */
export function zero(rx: number[]): void;

/**
 * Zeros the specified array.
 * @param rx the array.
 */
export function zero(rx: number[][]): void;

/**
 * Zeros the specified array.
 * @param rx the array.
 */
export function zero(rx: number[][][]): void;

export function zero(rxn1: number | number[] | number[][] | number[][][],
                     n2?: number, n3?: number): void | number[] | number[][] | number[][][] {
  switch (arrayDimensions(rxn1)) {
    case 1:
      _fill1D(rxn1 as number[], 0);
      return;
    case 2:
      _fill2D(rxn1 as number[][], 0);
      return;
    case 3:
      _fill3D(rxn1 as number[][][], 0);
      return;
  }

  if (n3) {
    const rx = new Array<number[][]>(n3);
    for (let i3 = 0; i3 < n3; ++i3) {
      rx[i3] = new Array<number[]>(n2);
      for (let i2 = 0; i2 < n2; ++i2) {
        rx[i3][i2] = Array.from({ length: rxn1 as number }, () => 0);
      }
    }
    return rx;
  } else if (n2) {
    const rx = new Array<number[]>(n2);
    for (let i2 = 0; i2 < n2; ++i2) {
      rx[i2] = Array.from({ length: rxn1 as number }, () => 0);
    }
    return rx;
  } else {
    return Array.from({ length: rxn1 as number }, () => 0);
  }
}

///////////////////////////////////////////////////////////////////////////
// fill
///////////////////////////////////////////////////////////////////////////

/**
 * Returns an array initialized to a specified value.
 * @param ra the value.
 * @param n1 1st array dimension.
 * @returns the array.
 */
export function fill(ra: number, n1: number): number[];

/**
 * Returns an array initialized to a specified value.
 * @param ra the value.
 * @param n1 1st array dimension.
 * @param n2 2nd array dimension.
 * @returns the array.
 */
export function fill(ra: number, n1: number, n2: number): number[][];

/**
 * Returns an array initialized to a specified value.
 * @param ra the value.
 * @param n1 1st array dimension.
 * @param n2 2nd array dimension.
 * @param n3 3rd array dimension.
 * @returns the array.
 */
export function fill(ra: number, n1: number, n2: number, n3: number): number[][][];

/**
 * Fills an array to a specified value.
 * @param rx the array.
 * @param ra the value.
 */
export function fill(rx: number[], ra: number): void;

/**
 * Fills an array to a specified value.
 * @param rx the array.
 * @param ra the value.
 */
export function fill(rx: number[][], ra: number): void;

/**
 * Fills an array to a specified value.
 * @param rx the array.
 * @pram ra the value.
 */
export function fill(rx: number[][][], ra: number): void;

export function fill(p1?: number | number[] | number[][] | number[][][],
                     p2?: number, p3?: number, p4?: number): void | number[] | number[][] | number[][][] {
  switch (arrayDimensions(p1)) {
    case 1:
      _fill1D(p1 as number[], p2);
      return;
    case 2:
      _fill2D(p1 as number[][], p2);
      return;
    case 3:
      _fill3D(p1 as number[][][], p2);
      return;
  }

  if (p4) {
    const rx = new Array<number[][]>(p4);
    for (let i3 = 0; i3 < p4; ++i3) {
      rx[i3] = new Array<number[]>(p3);
      for (let i2 = 0; i2 < p3; ++i2) {
        rx[i3][i2] = Array.from({ length: p2 }, () => p1 as number);
      }
    }
    return rx;
  } else if (p3) {
    const rx = new Array<number[]>(p3);
    for (let i2 = 0; i2 < p3; ++i2) {
      rx[i2] = Array.from({ length: p2 }, () => p1 as number);
    }
    return rx;
  } else {
    return Array.from({ length: p2 }, () => p1 as number);
  }
}

/** @internal */
function _fill1D(rx: number[], fill: number): void {
  const n1 = rx.length;
  for (let i1 = 0; i1 < n1; ++i1) {
    rx[i1] = fill;
  }
}

/** @internal */
function _fill2D(rx: number[][], fill: number): void {
  const n2 = rx.length;
  for (let i2 = 0; i2 < n2; ++i2) {
    _fill1D(rx[i2], fill);
  }
}

/** @internal */
function _fill3D(rx: number[][][], fill: number): void {
  const n3 = rx.length;
  for (let i3 = 0; i3 < n3; ++i3) {
    _fill2D(rx[i3], fill);
  }
}

///////////////////////////////////////////////////////////////////////////
// ramp
///////////////////////////////////////////////////////////////////////////

/**
 * Returns an array initialized to a specified linear ramp.
 * @param ra value of the first element.
 * @param rb1 gradient in the 1st dimension.
 * @param n1 1st array dimension.
 */
export function ramp(ra: number, rb1: number, n1: number): number[];

/**
 * Returns an array initialized to a specified linear ramp.
 * @param ra value of the first element.
 * @param rb1 gradient in the 1st dimension.
 * @param rb2 gradient in the 2nd dimension.
 * @param n1 1st array dimension.
 * @param n2 2nd array dimension.
 */
export function ramp(ra: number, rb1: number, rb2: number, n1: number, n2: number): number[][];

/**
 * Returns an array initialized to a specified linear ramp.
 * @param ra value of the first element.
 * @param rb1 gradient in the 1st dimension.
 * @param rb2 gradient in the 2nd dimension.
 * @param rb3 gradient in the 3rd dimension.
 * @param n1 1st array dimension.
 * @param n2 2nd array dimension.
 * @param n3 3rd array dimension.
 */
export function ramp(ra: number, rb1: number, rb2: number, rb3: number, n1: number, n2: number, n3: number): number[][][];

/**
 * Replaces an array values with a specified linear ramp.
 * @param rx the array.
 * @param ra value of the first element.
 * @param rb1 gradient in the 1st dimension.
 */
export function ramp(rx: number[], ra: number, rb1: number): void;

/**
 * Replaces an array values with a specified linear ramp.
 * @param rx the array.
 * @param ra value of the first element.
 * @param rb1 gradient in the 1st dimension.
 * @param rb2 gradient in the 2nd dimension.
 */
export function ramp(rx: number[][], ra: number, rb1: number, rb2: number): void;

/**
 * Replaces an array values with a specified linear ramp.
 * @param rx the array.
 * @param ra value of the first element.
 * @param rb1 gradient in the 1st dimension.
 * @param rb2 gradient in the 2nd dimension.
 * @param rb3 gradient in the 3rd dimension.
 */
export function ramp(rx: number[][][], ra: number, rb1: number, rb2: number, rb3: number): void;

export function ramp(rxa: number | number[] | number[][] | number[][][],
                     p1: number, p2?: number, p3?: number,
                     p4?: number, p5?: number, p6?: number): void | number[] | number[][] | number[][][] {
  // If passing in an array, return reference
  switch (arrayDimensions(rxa)) {
    case 1:
      _ramp1d(rxa as number[], p1, p2);
      return;
    case 2:
      _ramp2d(rxa as number[][], p1, p2, p3);
      return;
    case 3:
      _ramp3d(rxa as number[][][], p1, p2, p3, p4);
      return;
  }

  // Otherwise, create new and return
  if (p6) {
    const rx: number[][][] = zero(p4, p5, p6);
    _ramp3d(rx, rxa as number, p1, p2, p3);
    return rx;
  } else if (p4) {
    const rx: number[][] = zero(p3, p4);
    _ramp2d(rx, rxa as number, p1, p2);
    return rx;
  } else {
    const rx: number[] = zero(p2);
    _ramp1d(rx, rxa as number, p1);
    return rx;
  }
}

/** @internal */
function _ramp1d(rx: number[], ra: number, rb1: number): void {
  const n1 = rx.length;
  for (let i1 = 0; i1 < n1; ++i1) {
    rx[i1] = ra + rb1 * i1;
  }
}

/** @internal */
function _ramp2d(rx: number[][], ra: number, rb1: number, rb2: number): void {
  const n2 = rx.length;
  for (let i2 = 0; i2 < n2; ++i2) {
    _ramp1d(rx[i2], ra + rb2 * i2, rb1);
  }
}

/** @internal */
function _ramp3d(rx: number[][][], ra: number, rb1: number, rb2: number, rb3: number): void {
  const n3 = rx.length;
  for (let i3 = 0; i3 < n3; ++i3) {
    _ramp2d(rx[i3], ra + rb3 * i3, rb1, rb2);
  }
}


///////////////////////////////////////////////////////////////////////////
// real-to-complex
///////////////////////////////////////////////////////////////////////////

/** @internal */
abstract class RealToComplex {

  apply(rx: number[], ry: number[]): number[];
  apply(rx: number[][], ry: number[][]): number[][];
  apply(rx: number[][][], ry: number[][][]): number[][][];
  apply(rx: number[], ry: number[], cz: number[]): void;
  apply(rx: number[][], ry: number[][][], cz: number[][]): void;
  apply(rx: number[][][], ry: number[][][], cz: number[][][]): void;

  apply(rx: number[] | number[][] | number[][][],
        ry: number[] | number[][] | number[][][],
        cz?: number[] | number[][] | number[][][]): void | number[] | number[][] | number[][][] {
    const cdim = arrayDimensions(cz);
    const rdim = arrayDimensions(rx);

    switch (arrayDimensions(rx)) {
      case 1:
      case 2:
      default:

    }
  }
}

///////////////////////////////////////////////////////////////////////////
// misc algorithms
///////////////////////////////////////////////////////////////////////////

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
  const nm1 = n - 1;
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
      const mid = ( low + high ) >> 1;
      const amid = a[mid];
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
      const mid = ( low + high ) >> 1;
      const amid = a[mid];
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

/**
 * Returns the integer value of a number.
 * @param value a value.
 * @returns the value as an integer.
 */
export function int(value: number): number {
  return Math.floor(value);
}

/** @internal */
function med3(a: number[], i: number, j: number, k: number): number {
  return a[i] < a[j] ?
    ( a[j] < a[k] ? j : a[i] < a[k] ? k : i ) :
    ( a[j] > a[k] ? j : a[i] > a[k] ? k : i );
}

/** @internal */
function swap(a: number[], i: number, j: number, n: number = 1): void {
  while (n > 0) {
    const ai = a[i];
    a[i++] = a[j];
    a[j++] = ai;
    --n;
  }
}

/** @internal */
function insertionSort(a: number[], p: number, q: number): void {
  for (let i = p; i <= q; ++i) {
    for (let j = i; j > p && a[j - 1] > a[j]; --j) {
      swap(a, j, j - 1);
    }
  }
}

/** @internal */
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
function _copy1d(x: number[],
                 n1?: number, j1: number = 0, k1: number = 1,
                 complex: boolean = false): number[] {
  const m = ( complex ) ? 2.0 : 1.0;
  const c = ( complex ) ? 1.0 : 0.0;
  const k1xm = k1 * m;
  const k1ym = ( complex ) ? 2.0 : 1.0;
  const xdm = x.length / m;

  n1 = ( !n1 ) ? xdm : Math.min(xdm, Math.max(0, n1 / m));
  const y: number[] = new Array<number>(n1);

  for (let i1 = 0, ix = m * j1, iy = 0; i1 < n1; ++i1, ix += k1xm, iy += k1ym) {
    y[iy] = x[ix];
    y[iy + c] = x[ix + c];
  }
  return y;
}

/** @internal */
function _copy2d(x: number[][],
                 n1?: number, n2?: number,
                 j1: number = 0, j2: number = 0,
                 k1: number = 1, k2: number = 1,
                 complex: boolean = false): number[][] {
  n2 = ( !n2 ) ? x.length : Math.min(x.length, Math.max(0, n2));

  const y: number[][] = new Array<number[]>(n2);
  for (let i2 = 0; i2 < n2; ++i2) {
    y[i2] = _copy1d(x[j2 + i2 * k2], n1, j1, k1, complex);
  }
  return y;
}

/** @internal */
function _copy3d(x: number[][][],
                 n1?: number, n2?: number, n3?: number,
                 j1: number = 0, j2: number = 0, j3: number = 0,
                 k1: number = 1, k2: number = 1, k3: number = 1,
                 complex: boolean = false): number[][][] {
  n3 = ( !n3 ) ? x.length : Math.min(x.length, Math.max(0, n3));

  const y: number[][][] = new Array<number[][]>(n3);
  for (let i3 = 0; i3 < n3; ++i3) {
    y[i3] = _copy2d(x[j3 + i3 * k3], n1, n2, j1, j2, k1, k2, complex);
  }
  return y;
}
