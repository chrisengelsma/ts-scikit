import { Check } from '../utils';
import { FftPfa } from './fft-pfa';
import { ccopy } from '../utils/array-math';

/**
 * A fast Fourier transform of complex-valued arrays.
 * <p>
 * The FFT length nfft equals the number of <em>complex</em> numbers
 * transformed. The transform of nfft complex numbers yields nfft compplex
 * numbers. Those complex numbers are packed into arrays as [real_0, imag_0,
 * real-1, imag_1, ...]. Here, real_k and imag_k correspond to the real and
 * imaginary parts, respectively, of the complex number with array index k.
 * <p>
 * When input and output arrays are the same array, transforms are
 * performed in-place. For example, an input array cx[2*nfft] of nfft
 * complex numbers may be the same as an output array cy[2*nfft] of
 * nfft complex numbers. By "the same array", we mean that cx==cy.
 * <p>
 * Transforms may be performed for any dimension of a multi-dimensional
 * array. For example, we may transform the 1st dimension of an input
 * array cx[n2][2*nfft] of n2*nfft complex numbers to an output array
 * cy[n2][2*nfft] of n2*nfft complex numbers. Or, we may transform the
 * 2nd dimension of an input array cx[nfft][2*n1] of nfft*n1 complex
 * numbers to an output array cy[nfft][2*n1] of nfft*n1 complex numbers.
 * In either case, the input array cx and the output array cy may be the
 * same array, such that the transform may be performed in-place.
 */
export class FftComplex {

  private readonly _nfft: number;

  /**
   * Returns an FFT length optimized for speed.
   * <p>
   * The FFT length will be the fastest valid length that is not less than
   * the specified length n.
   * @param n the lower bound on FFT length.
   * @returns the FFT length.
   */
  static FastNFFT(n: number): number {
    Check.argument(n <= 720720, 'n does not exceed 720720');
    return FftPfa.FastNFFT(n);
  }

  /**
   * Returns an FFT length optimized for memory.
   * <p>
   * The FFT length will be the smallest valid length that is not less than
   * the specified length n.
   * @param n the lower bound on FFT length.
   * @return the FFT length.
   */
  static SmallNFFT(n: number): number {
    Check.argument(n <= 720720, 'n does not exceed 720720');
    return FftPfa.SmallNFFT(n);
  }

  private static _checkSign(sign: number) {
    Check.argument(sign === 1 || sign === -1, 'sign equals 1 or -1');
  }

  private static _checkArray(a: number[], name: string, n: number);
  private static _checkArray(a: number[][], name: string, n1: number, n2: number);
  private static _checkArray(a: number[][][], name: string, n1: number, n2: number, n3: number);
  private static _checkArray(a: number[] | number[][] | number[][][], name: string, n1: number, n2?: number, n3?: number): void {
    if (a[0] instanceof Array) {
      if (a[0][0] instanceof Array) {
        let ok = a.length >= n3;
        for (let i3 = 0; i3 < n3 && ok; ++i3) {
          ok = ( a[i3] as number[][] ).length >= n2;
          for (let i2 = 0; i2 < n2 && ok; ++i2) {
            ok = ( a[i3][i2] as number[] ).length >= n1;
          }
        }
        Check.argument(ok, `dimensions of ${ name } are valid`);
      } else {
        let ok = a.length >= n2;
        for (let i2 = 0; i2 < n2 && ok; ++i2) {
          ok = ( a[i2] as number[] ).length >= n1;
        }
        Check.argument(ok, `dimensions of ${ name } are valid`);
      }
    } else {
      Check.argument(a.length >= n1, `dimensions of ${ name } are valid`);
    }
  }


  /**
   * Constructs a new FFT, with specified length.
   * <p>
   * Valid FFT lengths an be obtained by calling the methods
   * {@link SmallNFFT} and {@link FastNFFT}.
   * @param nfft the FFT length, which must be valid.
   */
  constructor(nfft: number) {
    Check.argument(FftPfa.IsValidNFFT(nfft), `nfft = ${ nfft } is valid FFT length`);
    this._nfft = nfft;
  }

  /**
   * The FFT length for this FFT.
   */
  get nfft(): number { return this._nfft; }

  /**
   * Computes a complex-to-complex fast Fourier transform.
   * Transforms a 1-D input array cx[2*nfft] of nfft complex numbers
   * to a 1-D output array cy[2*nfft] of nfft complex numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param cx the input array.
   * @param cy the output array.
   */
  complexToComplex(sign: number, cx: number[], cy: number[]): void {
    FftComplex._checkSign(sign);
    FftComplex._checkArray(cx, 'cx', 2 * this._nfft);
    FftComplex._checkArray(cy, 'cy', 2 * this._nfft);
    if (cx !== cy) { cy = ccopy(cx, this._nfft); }
    FftPfa.Transform(sign, this._nfft, cy);
  }

  /**
   * Computes a complex-to-complex dimension-1 fast Fourier transform.
   * <p>
   * Transforms a 2-D input array cx[n2][2*nfft] of n2*nfft complex numbers
   * to a 2-D output array cy[n2][2*nfft] of n2*nfft complex numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n2 the 2nd dimension of arrays.
   * @param cx the input array.
   * @param cy the output array.
   */
  complexToComplex1(sign: number, cx: number[][], cy: number[][], n2: number): void;

  /**
   * Computes a complex-to-complex dimension-1 fast Fourier transform.
   * <p>
   * Transforms a 3-D input array cx[n3][n2][2*nfft] of n3*n2*nfft complex
   * numbers to a 3-D output array cy[n3][n2][2*nfft] of n3*n2*nfft complex
   * numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n2 the 2nd dimension of arrays.
   * @param n3 the 3rd dimension of arrays.
   * @param cx the input array.
   * @param cy the output array.
   */
  complexToComplex1(sign: number, cx: number[][][], cy: number[][][], n2: number, n3: number): void;
  complexToComplex1(sign: number, cx: number[][] | number[][][], cy: number[][] | number[][][], n2: number, n3?: number): void {
    FftComplex._checkSign(sign);

    if (cx[0] instanceof Array) {
      if (cx[0][0] instanceof Array) {
        cx = cx as number[][][];
        cy = cy as number[][][];

        FftComplex._checkArray(cx, 'cx', 2 * this._nfft, n2, n3);
        FftComplex._checkArray(cy, 'cy', 2 * this._nfft, n2, n3);

        for (let i3 = 0; i3 < n3; ++i3) { this.complexToComplex1(sign, cx[i3], cy[i3], n2); }
      } else {
        cx = cx as number[][];
        cy = cy as number[][];

        FftComplex._checkArray(cx, 'cx', 2 * this._nfft, n2);
        FftComplex._checkArray(cy, 'cy', 2 * this._nfft, n2);

        for (let i2 = 0; i2 < n3; ++i2) { this.complexToComplex(sign, cx[i2], cy[i2]); }
      }
    }
  }

  /**
   * Computes a complex-to-complex dimension-2 fast Fourier transform.
   * <p>
   * Transforms a 2-D input array cx[nfft][2*n1] of nfft*n1 complex numbers
   * to a 2-D output array cy[nfft][2*n1] of nfft*n1 complex numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n1 the 1st dimension of arrays.
   * @param cx the input array.
   * @param cy the output array.
   */
  complexToComplex2(sign: number, cx: number[][], cy: number[][], n1: number): void;

  /**
   * Computes a complex-to-complex dimension-2 fast Fourier transform.
   * <p>
   * Transforms a 3-D input array cx[n3][nfft][2*n1] of n3*nfft*n1 complex
   * numbers to a 3-D output array cy[n3][nfft][2*n1] of n3*nfft*n1 complex
   * numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n1 the 1st dimension of arrays.
   * @param n3 the 3rd dimension of arrays.
   * @param cx the input array.
   * @param cy the output array.
   */
  complexToComplex2(sign: number, cx: number[][][], cy: number[][][], n1: number, n3: number): void;
  complexToComplex2(sign: number, cx: number[][] | number[][][], cy: number[][] | number[][][], n1: number, n3?: number): void {
    FftComplex._checkSign(sign);

    if (cx[0] instanceof Array) {
      if (cx[0][0] instanceof Array) {
        cx = cx as number[][][];
        cy = cy as number[][][];

        FftComplex._checkArray(cx, 'cx', 2 * n1, this._nfft, n3);
        FftComplex._checkArray(cy, 'cy', 2 * n1, this._nfft, n3);

        for (let i3 = 0; i3 < n3; ++i3) { this.complexToComplex2(sign, cx[i3], cy[i3], n1); }
      } else {
        cx = cx as number[][];
        cy = cy as number[][];

        FftComplex._checkArray(cx, 'cx', 2 * n1, this._nfft);
        FftComplex._checkArray(cy, 'cy', 2 * n1, this._nfft);

        if (cx !== cy) {
          for (let i1 = 0; i1 < 2 * this._nfft; ++i1) { cy[i1] = cx[i1]; }
        }

        FftPfa.Transform2a(sign, n1, this._nfft, cy);
      }

    }
  }

  /**
   * Computes a complex-to-complex dimension-3 fast Fourier transform.
   * <p>
   * Transforms a 3-D input array cx[nfft][n2][2*n1] of nfft*n2*n1 complex
   * numbers to a 3-D output array cy[nfft][n2][2*n1] of nfft*n2*n1 complex
   * numbers.
   * @param sign the sign (1 or -1) of the exponent used in the FFT.
   * @param n1 the 1st dimension of arrays.
   * @param n2 the 2nd dimension of arrays.
   * @param cx the input array.
   * @param cy the output array.
   */
  complexToComplex3(sign: number, cx: number[][][], cy: number[][][], n1: number, n2: number): void {
    FftComplex._checkSign(sign);
    FftComplex._checkArray(cx, 'cx', 2 * n1, n2, this._nfft);
    FftComplex._checkArray(cy, 'cy', 2 * n1, n2, this._nfft);

    const cxi2: number[][] = new Array<number[]>(this._nfft);
    const cyi2: number[][] = new Array<number[]>(this._nfft);
    for (let i2 = 0; i2 < n2; ++i2) {
      for (let i3 = 0; i3 < this._nfft; ++i3) {
        cxi2[i3] = cx[i3][i2];
        cyi2[i3] = cy[i3][i2];
      }
      this.complexToComplex2(sign, cxi2, cyi2, n1);
    }
  }

  /**
   * Scales n1 complex numbers in the specified array by 1/nfft.
   * The inverse of a complex-to-complex FFT is a complex-to-complex
   * FFT (with opposite sign) followed by this scaling.
   * @param n1 1st (only) dimension of the array cx.
   * @param cx the input/output array[2*n1].
   */
  scale(cx: number[], n1: number): void;

  /**
   * Scales n1*n2 complex numbers in the specified array by 1/nfft.
   * The inverse of a complex-to-complex FFT is a complex-to-complex
   * FFT (with opposite sign) followed by this scaling.
   * @param n1 the 1st dimension of the array cx.
   * @param n2 the 2nd dimension of the array cx.
   * @param cx the input/output array[n2][2*n1].
   */
  scale(cx: number[][], n1: number, n2: number): void;

  /**
   * Scales n1*n2*n3 complex numbers in the specified array by 1/nfft.
   * The inverse of a complex-to-complex FFT is a complex-to-complex
   * FFT (with opposite sign) followed by this scaling.
   * @param n1 the 1st dimension of the array cx.
   * @param n2 the 2nd dimension of the array cx.
   * @param n3 the 3rd dimension of the array cx.
   * @param cx the input/output array[n3][n2][2*n1].
   */
  scale(cx: number[][][], n1: number, n2: number, n3: number): void;

  scale(cx: number[] | number[][] | number[][][], n1: number, n2?: number, n3?: number): void {
    if (cx[0] instanceof Array) {
      if (cx[0][0] instanceof Array) {
        cx = cx as number[][][];
        for (let i3 = 0; i3 < n3; ++i3) { this.scale(cx[i3], n1, n2); }
      } else {
        cx = cx as number[][];
        for (let i2 = 0; i2 < n2; ++i2) { this.scale(cx[i2], n1); }
      }
    } else {
      cx = cx as number[];
      const s = 1.0 / this._nfft;
      let n = 2 * n1;
      while (--n >= 0) { cx[n] *= s; }
    }
  }

}
