import { arrayDimensions, Check } from '../utils';
import { FftPfa } from './fft-pfa';

/**
 * A fast Fourier transform of real-valued arrays.
 * <p>
 * The FFT length nfft equals the number of <em>real</em> numbers
 * transformed. The transform of nfft real numbers yields nfft/2+1 complex
 * numbers. (The imaginary parts of the first and last complex numbers
 * are always zero.) For real-to-complex and complex-to-real transforms, nfft
 * is always an even number.
 * <p>
 * Complex numbers are packed into arrays of numbers as [real_0, imag_0,
 * real_1, imag_1, ... ]. Here, real_k and imag_k correspond to the real and
 * imaginary parts of the complex number with index k, respectively.
 * <p>
 * When input and output arrays are the same array, transforms are performed
 * in-place. For example, an input array rx[nfft] of nfft real numbers may be
 * the same as an output array cy[nfft+2] of nfft/2+1 complex numbers. By
 * "the same array", we mean that rx === cy. In this case, both rx.length and
 * cy.length equal nfft+2. When we write rx[nfft] (here and below), we imply
 * that only the first nfft numbers in the input array rx are accessed.
 * <p>
 * Transforms may be performed for any dimension of a multi-dimensional
 * array. For example, we may transform the 1st dimension of an input array
 * rx[n2][nfft] of n2*nfft real numbers to an output array cy[n2][nfft+2] of
 * n2*(nfft/2+1) complex numbers. Or, we may transform the 2nd dimension of
 * an input array rx[nfft][n1] of nfft*n1 real numbers to an output array
 * cy[nfft/2+1][2*n1] of (nfft/2+1)*n1 complex numbers. In either case, the
 * input array rx and the output array cy may be the same array, such that
 * the transform may be performed in-place.
 * <p>
 * In-place transforms are typically used to reduce memory consumption.
 * Note, however, that memory consumption is reduced for only dimension-1
 * in-place transformed. Dimension-2 (and higher) in-place transforms save
 * no memory, because of the contiguous packing of real and imaginary parts
 * of complex number in multi-dimensional array of numbers. (See above.)
 * Therefore, dimension-1 transforms are best when performing real-to-complex
 * of complex-to-real transforms of multi-dimensional arrays.
 *
 */
export class FftReal {

  private readonly _nfft: number;

  /**
   * Returns an FFT length optimized for memory.
   * <p>
   * The FFT length will be the smalled valid length that is not less than
   * the specified length n.
   * @param n the lower bound on FFT length.
   * @returns the FFT length.
   */
  static SmallNFFT(n: number): number {
    Check.argument(n <= 1441440, 'n does not exceed 1441440');
    return 2 * FftPfa.SmallNFFT(Math.floor(( n + 1 ) / 2));
  }

  /**
   * Returns an FFT length optimized for speed.
   * <p>
   * The FFT length will be the fastest valid length that is not less than
   * the specified length n.
   * @param n the lower bound on FFT length.
   * @returns the FFT length.
   */
  static FastNFFT(n: number): number {
    Check.argument(n <= 1441440, 'n does not exceed 1441440');
    return 2 * Math.floor(FftPfa.FastNFFT(Math.floor(n + 1) / 2));
  }

  private static _checkSign(sign: number) {
    Check.argument(sign === 1 || sign === -1, 'sign equals 1 or -1');
  }

  private static _checkArray(a: number[], name: string, n: number);
  private static _checkArray(a: number[][], name: string, n1: number, n2: number);
  private static _checkArray(a: number[][][], name: string, n1: number, n2: number, n3: number);
  private static _checkArray(a: number[] | number[][] | number[][][], name: string, n1: number, n2?: number, n3?: number): void {
    let ok;
    switch (arrayDimensions(a)) {
      case 1:
        a = a as number[];

        Check.argument(a.length >= n1, `dimensions of ${ name } are valid`);
        break;
      case 2:
        a = a as number[][];

        ok = a.length >= n2;
        for (let i2 = 0; i2 < n2 && ok; ++i2) {
          ok = a[i2].length >= n1;
        }
        Check.argument(ok, `dimensions of ${ name } are valid`);
        break;
      default:
        a = a as number[][][];

        ok = a.length >= n3;
        for (let i3 = 0; i3 < n3 && ok; ++i3) {
          ok = a[i3].length >= n2;
          for (let i2 = 0; i2 < n2 && ok; ++i2) {
            ok = a[i3][i2].length >= n1;
          }
        }
        Check.argument(ok, `dimensions of ${ name } are valid`);
    }
  }


  /**
   * Constructs a new FFT with the specified length.
   * <p>
   * Valid FFT lengths an be obtained by calling the methods
   * {@link SmallNFFT} and {@link FastNFFT}.
   * @param nfft the FFT length, which must be valid.
   */
  constructor(nfft: number) {
    Check.argument(
      nfft % 2 === 0 && FftPfa.IsValidNFFT(Math.floor(nfft / 2)),
      'nfft = ' + nfft + ' is valid FFT length');
    this._nfft = nfft;
  }

  /**
   * The FFT length.
   */
  get nfft(): number { return this._nfft; }

  /**
   * Computes a real-to-complex fast Fourier transform.
   * <p>
   * Transforms a 1-D input array rx[nfft] of nfft real numbers to
   * a 1-D output array cy[nfft+2] of nfft/2 + 1 complex numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param rx the input array.
   * @param cy the output array.
   */
  realToComplex(sign: number, rx: number[], cy: number[]): void {
    FftReal._checkSign(sign);
    FftReal._checkArray(rx, 'rx', this._nfft);
    FftReal._checkArray(cy, 'cy', this._nfft + 2);
    const nfft = this._nfft;

    let n = nfft;
    while (--n >= 0) { cy[n] = 0.5 * rx[n]; }

    FftPfa.Transform(sign, Math.floor(nfft / 2), cy);

    cy[nfft] = 2.0 * ( cy[0] - cy[1] );
    cy[0] = 2.0 * ( cy[0] + cy[1] );
    cy[nfft + 1] = 0.0;
    cy[1] = 0.0;

    const theta = sign * 2.0 * Math.PI / nfft;
    let wt = Math.sin(0.5 * theta);
    const wpr = -2.0 * wt * wt;
    const wpi = Math.sin(theta);
    let wr = 1.0 + wpr;
    let wi = wpi;

    let sumr, sumi, difr, difi, tmpr, tmpi;

    for (let j = 2, k = nfft - 2; j <= k; j += 2, k -= 2) {
      sumr = cy[j    ] + cy[k    ];
      sumi = cy[j + 1] + cy[k + 1];
      difr = cy[j    ] - cy[k    ];
      difi = cy[j + 1] - cy[k + 1];
      tmpr = wi * difr + wr * sumi;
      tmpi = wi * sumi - wr * difr;

      cy[j    ] = sumr + tmpr;
      cy[j + 1] = tmpi + difi;
      cy[k    ] = sumr - tmpr;
      cy[k + 1] = tmpi - difi;
      wt = wr;
      wr += wr * wpr - wi * wpi;
      wi += wi * wpr + wt * wpi;
    }
  }

  /**
   * Computes a complex-to-real fast Fourier transform.
   * <p>
   * Transforms a 1-D input array cx[nfft+2] of nfft/2+1 complex numbers
   * to a 1-D output array cy[nfft] of nfft real numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param cx the input array.
   * @param ry the output array.
   */
  complexToReal(sign: number, cx: number[], ry: number[]): void {
    FftReal._checkSign(sign);
    FftReal._checkArray(cx, 'cx', this._nfft + 2);
    FftReal._checkArray(ry, 'ry', this._nfft);
    const nfft = this._nfft;

    if (cx !== ry) {
      let n = nfft;
      while (--n >= 2) { ry[n] = cx[n]; }
    }

    ry[1] = cx[0] - cx[nfft];
    ry[0] = cx[0] + cx[nfft];
    const theta = -sign * 2.0 * Math.PI / nfft;
    let wt = Math.sin(0.5 * theta);
    let wpr = -2.0 * wt * wt;  // = cos(theta) - 1, with less rounding error
    let wpi = Math.sin(theta); // = sin(theta)
    let wr = 1.0 + wpr;
    let wi = wpi;

    let sumr, sumi, difr, difi, tmpr, tmpi;

    for (let j = 2, k = nfft - 2; j <= k; j += 2, k -= 2) {
      sumr = ry[j    ] + ry[k    ];
      sumi = ry[j + 1] + ry[k + 1];
      difr = ry[j    ] - ry[k    ];
      difi = ry[j + 1] - ry[k + 1];
      tmpr = wi * difr - wr * sumi;
      tmpi = wi * sumi + wr * difr;

      ry[j    ] = sumr + tmpr;
      ry[j + 1] = tmpi + difi;
      ry[k    ] = sumr - tmpr;
      ry[k + 1] = tmpi - difi;
      wt = wr;
      wr += wr * wpr - wi * wpi;
      wi += wi * wpr + wt * wpi;
    }
    FftPfa.Transform(sign, Math.floor(nfft / 2), ry);
  }

  /**
   * Computes a real-to-complex dimension-1 fast Fourier transform.
   * <p>
   * Transforms a 2-D input array rx[n2][nfft] of n2*nfft real numbers to
   * a 2-D output array cy[n2][nfft+2] of n2*(nfft/2+1) complex numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param rx the input array.
   * @param cy the output array.
   * @param n2 the 2nd dimension of arrays.
   */
  realToComplex1(sign: number, rx: number[][], cy: number[][], n2: number): void;

  /**
   * Computes a real-to-complex dimension-1 fast Fourier transform.
   * <p>
   * Transforms a 3-D input array rx[n3][n2][nfft] of n3*n2*nfft real numbers to
   * a 3-D output array cy[n3][n2][nfft+2] of n3*n2*(nfft/2+1) complex numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param rx the input array.
   * @param cy the output array.
   * @param n2 the 2nd dimension of arrays.
   * @param n3 the 3rd dimension of arrays.
   */
  realToComplex1(sign: number, rx: number[][][], cy: number[][][], n2: number, n3?: number): void;

  realToComplex1(sign: number, rx: number[][] | number[][][], cy: number[][] | number[][][], n2: number, n3?: number): void {
    FftReal._checkSign(sign);

    if (rx[0] instanceof Array) {
      if (rx[0][0] instanceof Array) {
        rx = rx as number[][][];
        cy = cy as number[][][];

        FftReal._checkArray(rx, 'rx', this._nfft, n2, n3);
        FftReal._checkArray(cy, 'cy', this._nfft + 2, n2, n3);

        for (let i3 = 0; i3 < n3; ++i3) { this.realToComplex1(sign, rx[i3], cy[i3], n2); }
      } else {
        rx = rx as number[][];
        cy = cy as number[][];

        FftReal._checkArray(rx, 'rx', this._nfft, n2);
        FftReal._checkArray(cy, 'cy', this._nfft + 2, n2);

        for (let i2 = 0; i2 < n2; ++i2) { this.realToComplex(sign, rx[i2], cy[i2]); }
      }
    }
  }

  /**
   * Computes a real-to-complex dimension-1 fast Fourier transform.
   * <p>
   * Transforms a 2-D input array cx[n2][nfft+2] of n2*(nfft/2+1) complex
   * numbers to a 2-D output array ry[n2][nfft] of n2*nfft real numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n2 the 2nd dimension of arrays.
   * @param cx the input array.
   * @param ry the output array.
   */
  complexToReal1(sign: number, cx: number[][], ry: number[][], n2: number): void;

  /**
   * Computes a real-to-complex dimension-1 fast Fourier transform.
   * <p>
   * Transforms a 2-D input array cx[n2][nfft+2] of n2*(nfft/2+1) complex
   * numbers to a 2-D output array ry[n2][nfft] of n2*nfft real numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n2 the 2nd dimension of arrays.
   * @param cx the input array.
   * @param ry the output array.
   */
  complexToReal1(sign: number, cx: number[][][], ry: number[][][], n2: number, n3: number): void;

  complexToReal1(sign: number, cx: number[][] | number[][][], ry: number[][] | number[][][], n2: number, n3?: number): void {
    FftReal._checkSign(sign);

    if (cx[0][0] instanceof Array) {
      cx = cx as number[][][];
      ry = ry as number[][][];

      FftReal._checkArray(cx, 'cx', this._nfft + 2, n2, n3);
      FftReal._checkArray(ry, 'ry', this._nfft, n2, n3);

      for (let i3 = 0; i3 < n3; ++i3) { this.complexToReal1(sign, cx[i3], ry[i3], n2); }

    } else if (cx[0] instanceof Array) {
      cx = cx as number[][];
      ry = ry as number[][];

      FftReal._checkArray(cx, 'cx', this._nfft + 2, n2);
      FftReal._checkArray(ry, 'ry', this._nfft, n2);

      for (let i2 = 0; i2 < n2; ++i2) { this.complexToReal(sign, cx[i2], ry[i2]); }
    }
  }

  /**
   * Computes a real-to-complex dimension-2 fast Fourier transform.
   * <p>
   * Transform a 2-D input array rx[nfft][n1] of nfft*n1 real numbers to a
   * 2-D output array cy[nfft/2+1][2*n1] of (nfft/2+1)*n1 complex number.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n1 the 1st dimension of arrays.
   * @param rx the input array.
   * @param cy the output array.
   */
  realToComplex2(sign: number, n1: number, rx: number[][], cy: number[][]): void {
    FftReal._checkSign(sign);
    FftReal._checkArray(rx, 'rx', this._nfft, n1);
    FftReal._checkArray(cy, 'cy', 2 * n1, this._nfft / 2 + 1);

    // Pack real input rx into complex output cy. This is complicated
    // so that it works when input and output arrays are the same.
    for (let i1 = n1 - 1, j1 = i1 * 2; i1 >= 0; --i1, j1 -= 2) {
      for (let i2 = this._nfft - 2, j2 = i2 / 2; i2 >= 0; i2 -= 2, --j2) {
        cy[j2][j1] = 0.5 * rx[i2][i1];
        cy[j2][j1 + 1] = 0.5 * rx[i2 + 1][i1];
      }
    }

    // Dimension-2 complex-to-complex transform.
    FftPfa.Transform2a(sign, n1, this._nfft / 2, cy);

    // Finish transform.
    const cy0: number[] = cy[0];
    const cyn: number[] = cy[this._nfft / 2];

    for (let i1 = 2 * n1 - 2; i1 >= 0; i1 -= 2) {
      cyn[i1] = 2.0 * ( cy0[i1] - cy0[i1 + 1] );
      cy0[i1] = 2.0 * ( cy0[i1] + cy0[i1 + 1] );
      cyn[i1 + 1] = 0.0;
      cy0[i1 + 1] = 0.0;
    }

    const theta = sign * 2.0 * Math.PI / this._nfft;
    let wt = Math.sin(0.5 * theta);
    let wpr = -2.0 * wt * wt;  // = cos(theta) - 1, with less rounding error
    let wpi = Math.sin(theta); // = sin(theta)
    let wr = 1.0 + wpr;
    let wi = wpi;
    let sumr, sumi, difr, difi, tmpr, tmpi;

    for (let j2 = 1, k2 = this._nfft / 2 - 1; j2 <= k2; ++j2, --k2) {
      let cyj2: number[] = cy[j2];
      let cyk2: number[] = cy[k2];
      for (let i1 = 0, j1 = 0; i1 < n1; ++i1, j1 += 2) {
        sumr = cyj2[j1] + cyk2[j1];
        sumi = cyj2[j1 + 1] + cyk2[j1 + 1];
        difr = cyj2[j1] - cyk2[j1];
        difi = cyj2[j1 + 1] - cyk2[j1 + 1];
        tmpr = wi * difr + wr * sumi;
        tmpi = wi * sumi - wr * difr;
        cyj2[j1] = sumr + tmpr;
        cyj2[j1 + 1] = tmpi + difi;
        cyk2[j1] = sumr - tmpr;
        cyk2[j1 + 1] = tmpi - difi;
      }
      wt = wr;
      wr += wr * wpr - wi * wpi;
      wi += wi * wpr + wt * wpi;
    }
  }

  /**
   * Computes a complex-to-real dimension-2 fast Fourier transform.
   * <p>
   * Transforms a 2-D input array cx[nfft/2+1][2*n1] of (nfft/2+1)*n1 complex
   * numbers to a 2-D output array ry[nfft][n1] of nfft*n1 real numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n1 the 1st dimension of arrays.
   * @param cx the input array.
   * @param ry the output array.
   */
  complexToReal2(sign: number, n1: number, cx: number[][], ry: number[][]): void {
    FftReal._checkSign(sign);
    FftReal._checkArray(cx, 'cx', 2 * n1, this._nfft / 2 + 1);
    FftReal._checkArray(ry, 'ry', n1, this._nfft);

    // Unpack complex input cx into real output ry. This is complicated
    // so that it works when input and output arrays are the same.
    for (let i1 = 0, j1 = 0; j1 < n1; i1 += 2, ++j1) {
      let cx0 = cx[0][i1];
      let cxn = cx[this._nfft / 2][i1];
      for (let i2 = this._nfft / 2 - 1, j2 = 2 * i2; i2 > 0; --i2, j2 -= 2) {
        ry[j2][j1] = cx[i2][i1];
        ry[j2 + 1][j1] = cx[i2][i1 + 1];
      }
      ry[1][j1] = cx0 - cxn;
      ry[0][j1] = cx0 + cxn;
    }

    // Begin transform.
    const theta = -sign * 2.0 * Math.PI / this._nfft;
    let wt = Math.sin(0.5 * theta);
    let wpr = -2.0 * wt * wt;  // = cos(theta)-1, with less rounding error
    let wpi = Math.sin(theta); // = sin(theta)
    let wr = 1.0 + wpr;
    let wi = wpi;
    for (let j2 = 2, k2 = this._nfft - 2; j2 <= k2; j2 += 2, k2 -= 2) {
      let ryj2r: number[] = ry[j2];
      let ryj2i: number[] = ry[j2 + 1];
      let ryk2r: number[] = ry[k2];
      let ryk2i: number[] = ry[k2 + 1];
      for (let i1 = 0; i1 < n1; ++i1) {
        let sumr = ryj2r[i1] + ryk2r[i1];
        let sumi = ryj2i[i1] + ryk2i[i1];
        let difr = ryj2r[i1] - ryk2r[i1];
        let difi = ryj2i[i1] - ryk2i[i1];
        let tmpr = wi * difr - wr * sumi;
        let tmpi = wi * sumi + wr * difr;
        ryj2r[i1] = sumr + tmpr;
        ryj2i[i1] = tmpi + difi;
        ryk2r[i1] = sumr - tmpr;
        ryk2i[i1] = tmpi - difi;
      }
      wt = wr;
      wr += wr * wpr - wi * wpi;
      wi += wi * wpr + wt * wpi;
    }

    // Dimension-2 complex-to-complex transform.
    FftPfa.Transform2b(sign, n1, this._nfft / 2, ry);
  }

  /**
   * Scales n1 real numbers in the specified array by 1/nfft.
   * The inverse of a real-to-complex FFT is a complex-to-real FFT
   * (with opposite sign) followed by this scaling.
   * @param n1 1st (only) dimension of the array rx.
   * @param rx the input/output array[n1].
   */
  scale(rx: number[], n1: number): void;

  /**
   * Scales n1*n2 real numbers in the specified array by 1/nfft.
   * The inverse of a real-to-complex FFT is a complex-to-real FFT
   * (with opposite sign) followed by this scaling.
   * @param n1 the 1st dimension of the array rx.
   * @param n2 the 2nd dimension of the array rx.
   * @param rx the input/output array[n2][n1].
   */
  scale(rx: number[][], n1: number, n2: number): void;

  /**
   * Scales n1*n2*n3 real numbers in the specified array by 1/nfft.
   * The inverse of a real-to-complex FFT is a complex-to-real FFT
   * (with opposite sign) followed by this scaling.
   * @param n1 the 1st dimension of the array rx.
   * @param n2 the 2nd dimension of the array rx.
   * @param n3 the 3rd dimension of the array rx.
   * @param rx the input/output array[n3][n2][n1].
   */
  scale(rx: number[][][], n1: number, n2: number, n3: number): void;

  scale(rx: number[] | number[][] | number[][][], n1: number, n2?: number, n3?: number): void {
    const dim = arrayDimensions(rx);
    switch (dim) {
      case 1:
        rx = rx as number[];
        const s = 1.0 / this._nfft;
        while (--n1 >= 0) { rx[n1] *= s; }
        break;
      case 2:
        rx = rx as number[][];
        for (let i2 = 0; i2 < n2; ++i2) { this.scale(rx[i2], n1); }
        break;
      default:
        rx = rx as number[][][];
        for (let i3 = 0; i3 < n3; ++i3) { this.scale(rx[i3], n1, n2); }
    }
  }
}

