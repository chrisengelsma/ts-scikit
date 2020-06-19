import { FftReal } from './fft-real';
import { FftComplex } from './fft-complex';
import { Sampling } from './sampling';

/**
 * An easy-to-use fast Fourier transform.
 * <p>
 * This class is less flexible than {@link FftComplex} and {@link FftReal}.
 * For example, the user has less control over the sampling of frequency.
 * However, for many applications this class may be simpler to use.
 * <p>
 * For example, the following program shows how to use this class to
 * filter a real-valued sequence in the frequency domain.
 * <pre>
 *   const fft = new Fft(nx); // nx = number of samples of f(x)
 *   const sk = fft.getFrequencySampling1();
 *   const nk = sk.count; // number of frequencies sampled.
 *   const f: number[] = ... // nx real samples of input f(x)
 *   const g: number[] = fft.applyForward(f);
 *   for (let kk=0, kr=0, ki=kr + 1; kk &lt; nk; ++kk, kr+=2, ki+=2 ) {
 *     let k = sk.getValue(kk); // frequency k in cycles/sample.
 *     // modify g[kr], the real part of g(k)
 *     // modify g[ki], the imag part of g(k)
 *   }
 *   const h[] = fft.applyInverse(g); // nk real samples of output h(x)
 * </pre>
 * <p>
 * This example is almost as simple for multi-dimensional transforms.
 * <p>
 * A forward transform computes an output array of complex values g(x)
 * from an input array of real or complex values f(x). An inverse
 * transform computes the corresponding real of complex values f(x)
 * from g(k). For definiteness, in this documentation, the variable x
 * represents spatial coordinates and the variable k represents spatial
 * frequencies (or wavenumbers). For functions of time, simply replace
 * the word "space" with "time" in this documentation.
 * <p>
 * This class enables transforms of 1D, 2D, and 3D arrays. For example,
 * a 2D array f[nx2][nx1] represents nx2*nx1 samples of a function
 * f(x1, x2) of two spatial coordinates x1 and x2. In addition to
 * numbers of samples nx1 and nx2, sampling intervals dx1 and dx2
 * and first sampled coordinates fx1 and fx2 may also be specified.
 * (The default sampling interval is 1.0 and the default first sample
 * coordinate is 0.0.) These sampling parameters may be specified with
 * samplings sx1 and sx2.
 * <p>
 * For each specified spatial sampling sx, this class defines a
 * corresponding frequency sampling sk, in which units of frequency
 * are cycles per unit distance. The number of frequencies sampled
 * is computed so that the Fourier transform is fast, but the number
 * of frequency samples is never less than the number of space samples.
 * Arrays to be transformed may be padded with zeros to obtain the
 * required frequency sampling. Optional additional padding may be
 * specified to sample frequency more finely.
 * <p>
 * A frequency sampling sk may be centered. Such a centered frequency
 * sampling always has an odd number of samples, and zero frequency
 * corresponds to the middle sample in the array of complex transformed
 * values. The default is not centered, so that zero frequency corresponds
 * to the first sample, the one with index 0.
 * <p>
 * Arrays input to forward transforms may contain either real or
 * complex values. If complex, values are packed sequentially as
 * (real, imag) pairs of consecutive numbers. The default input
 * type is real.
 * <p>
 * Signs of the exponents in the complex exponentials used in forward
 * transforms may be specified. The opposite signs are used for inverse
 * transforms. The default signs are -1 for forward transforms and 1 for
 * inverse transforms.
 */
export class Fft {

  private _fft1r: FftReal;

  private _fft1c: FftComplex;
  private _fft2: FftComplex;
  private _fft3: FftComplex;

  private _sx1: Sampling;
  private _sx2: Sampling;
  private _sx3: Sampling;

  private _sk1: Sampling;
  private _sk2: Sampling;
  private _sk3: Sampling;

  private _sign1: number;
  private _sign2: number;
  private _sign3: number;

  private _nfft1: number;
  private _nfft2: number;
  private _nfft3: number;

  private _padding1: number;
  private _padding2: number;
  private _padding3: number;

  private _center1: boolean;
  private _center2: boolean;
  private _center3: boolean;

  private _complex: boolean;

  private _overwrite: boolean;

  static FromData(f: number[] | number[][] | number[][][], complex: boolean = false) {
    if (f[0] instanceof Array) {
      if (f[0][0] instanceof Array) {
        return new Fft(f[0][0].length, f[0].length, f.length, complex);
      }
      return new Fft(f[0].length, f.length, complex);
    }
    return new Fft(f.length, complex);
  }

  /**
   * Constructs an FFT for the specified 1D array of real values.
   * <p>
   * Spatial dimensions are determined from the dimensions of the
   * specified array. Spatial sampling intervals are 1.0, and first
   * sample coordinates are 0.0.
   * @param f an array with dimensions like those to be transformed.
   * @param complex true, for complex values; false, for real values.
   */
  constructor(f: number[], complex?: boolean);

  /**
   * Constructs an FFT for the specified 2D array of real values.
   * <p>
   * Spatial dimensions are determined from the dimensions of the
   * specified array. Spatial sampling intervals are 1.0, and first
   * sample coordinates are 0.0.
   * @param f an array with dimensions like those to be transformed.
   * @param complex true, for complex values; false, for real values.
   */
  constructor(f: number[][], complex?: boolean);

  /**
   * Constructs an FFT for the specified 3D array of real values.
   * <p>
   * Spatial dimensions are determined from the dimensions of the
   * specified array. Spatial sampling intervals are 1.0, and first
   * sample coordinates are 0.0.
   * @param f an array with dimensions like those to be transformed.
   * @param complex true, for complex values; false, for real values.
   */
  constructor(f: number[][][], complex?: boolean);

  /**
   * Constructs an FFT with specified space sampling.
   * @param sx1 space sampling for the 1st dimension.
   */
  constructor(sx1: Sampling);

  /**
   * Constructs an FFT with specified space sampling.
   * @param sx1 space sampling for the 1st dimension.
   * @param sx2 space sampling for the 2nd dimension.
   */
  constructor(sx1: Sampling, sx2: Sampling);

  /**
   * Constructs an FFT with specified space sampling.
   * @param sx1 space sampling for the 1st dimension.
   * @param sx2 space sampling for the 2nd dimension.
   * @param sx3 space sampling for the 3rd dimension.
   */
  constructor(sx1: Sampling, sx2: Sampling, sx3: Sampling);

  /**
   * Constructs a 1D FFT with specified number of space samples.
   * <p>
   * The sampling interval is 1.0 and the first sample coordinate is 0.0.
   * @param {number} n1 number of samples in the first dimension.
   * @param {boolean} complex true, for complex values; false, for real values.
   */
  constructor(n1: number, complex?: boolean);

  /**
   * Constructs a 2D FFT with specified number of space samples.
   * <p>
   * Sampling intervals are 1.0 and first sample coordinates are 0.0.
   * @param {number} n1 number of samples in the first dimension.
   * @param {number} n2 number of samples in the second dimension.
   * @param {boolean} complex true, for complex values; false, for real values.
   */
  constructor(n1: number, n2: number, complex?: boolean);

  /**
   * Constructs a 3D FFT with specified number of space samples.
   * <p>
   * Sampling intervals are 1.0 and first sample coordinates are 0.0.
   * @param {number} n1 number of samples in the first dimension.
   * @param {number} n2 number of samples in the second dimension.
   * @param {number} n3 number of samples in the third dimension.
   * @param {boolean} complex true, for complex values; false, for real values.
   */
  constructor(n1: number, n2: number, n3: number, complex?: boolean);

  constructor(n1: Sampling | number | number[] | number[][] | number[][][],
              n2?: Sampling | number | number[] | boolean,
              n3?: Sampling | number | number[] | boolean,
              complex?: boolean) {
    if (n1 instanceof Sampling && n2 instanceof Sampling && n3 instanceof Sampling) {
      this._init(n1, n2, n3);
    } else if (n1 instanceof Sampling && n2 instanceof Sampling) {
      this._init(n1, n2);
    } else if (n1 instanceof Sampling) {
      this._init(n1);
      if (typeof n1 === 'number' && typeof n2 === 'number' && typeof n3 === 'number') {
        this._init(
          new Sampling(n1),
          new Sampling(n2),
          new Sampling(n3)
        );
      } else if (typeof n1 === 'number' && typeof n2 === 'number') {
        this._init(
          new Sampling(n1),
          new Sampling(n2)
        );
      } else if (typeof n1 === 'number') {
        this._init(
          new Sampling(n1)
        );
      } else if (n1[0] instanceof Array) {

        if (n1[0][0] instanceof Array) {
          n1 = n1 as unknown as number[][][];
          this._init(
            new Sampling(n1[0][0].length / 2),
            new Sampling(n1[0].length),
            new Sampling(n1.length)
          );
        } else {
          n1 = n1 as unknown as number[][];
          this._init(
            new Sampling(n1[0].length / 2),
            new Sampling(n1.length)
          );
        }
      } else if (n1 instanceof Array) {
        this._init(new Sampling(n1.length / 2));
      }
    }
  }

  /**
   * Sets the type of input (output) values for forward (inverse) transforms.
   * <p>
   * The default type is real.
   * @param complex true, for complex values; false, for real values.
   */
  setComplex(complex: boolean): void {
    if (this._complex !== complex) {
      this._complex = complex;
      this._updateSampling1();
    }
  }

  private _init(sx1: Sampling, sx2?: Sampling, sx3?: Sampling): void {
    this._sx1 = sx1;
    this._sx2 = sx2;
    this._sx3 = sx3;

    this._sign1 = -1;
    this._sign2 = -1;
    this._sign3 = -1;

    this._updateSampling1();
    this._updateSampling2();
    this._updateSampling3();
  }

  private _updateSampling1(): void {
    if (this._sx1 === null) { return; }
    const nx = this._sx1.count;
    const dx = this._sx1.delta;
    const npad = nx + this._padding1;
    let nfft, nk, dk, fk;
    if (this._complex) {
      nfft = FftComplex.SmallNFFT(npad);
      dk = 1.0 / ( nfft * dx );
      if (this._center1) {
        const even = nfft % 2 === 0;
        nk = even ? nfft + 1 : nfft;
        fk = even ? -0.5 / dx : -0.5 / dx + 0.5 * dk;
      } else {
        nk = nfft;
        fk = 0.0;
      }
      if (this._fft1c === null || this._nfft1 !== nfft) {
        this._fft1c = new FftComplex(nfft);
        this._fft1r = null;
        this._nfft1 = nfft;
      }
    } else {
      nfft = FftReal.SmallNFFT(npad);
      dk = 1.0 / ( nfft * dx );
      if (this._center1) {
        nk = nfft + 1;
        fk = -0.5 / dx;
      } else {
        nk = nfft / 2 + 1;
        fk = 0.0;
      }
      if (this._fft1r === null || this._nfft1 !== nfft) {
        this._fft1r = new FftReal(nfft);
        this._fft1c = null;
        this._nfft1 = nfft;
      }
    }
    this._sk1 = new Sampling(nk, dk, fk);
  }

  private _updateSampling2(): void {
    if (this._sx2 === null) { return; }
    const nx = this._sx2.count;
    const dx = this._sx2.delta;
    const npad = nx + this._padding2;
    const nfft = FftComplex.SmallNFFT(npad);
    const dk = 1.0 / ( nfft * dx );
    let fk, nk;
    if (this._center2) {
      const even = nfft % 2 === 0;
      nk = even ? nfft + 1 : nfft;
      fk = even ? -0.5 / dx : -0.5 / dx + 0.5 * dk;
    } else {
      nk = nfft;
      fk = 0.0;
    }
    if (this._fft2 === null || this._nfft2 !== nfft) {
      this._fft2 = new FftComplex(nfft);
      this._nfft2 = nfft;
    }
    this._sx2 = new Sampling(nk, dk, fk);
  }

  private _updateSampling3(): void {
    if (this._sx3 === null) { return; }
    const nx = this._sx3.count;
    const dx = this._sx3.delta;
    const npad = nx + this._padding3;
    const nfft = FftComplex.SmallNFFT(npad);
    const dk = 1.0 / ( nfft * dx );
    let fk, nk;
    if (this._center3) {
      const even = nfft % 2 === 0;
      nk = even ? nfft + 1 : nfft;
      fk = even ? -0.5 / dx : -0.5 / dx + 0.5 * dk;
    } else {
      nk = nfft;
      fk = 0.0;
    }
    if (this._fft3 === null || this._nfft3 !== nfft) {
      this._fft3 = new FftComplex(nfft);
      this._nfft3 = nfft;
    }
    this._sk3 = new Sampling(nk, dk, fk);
  }

  private _pad(f: number[]): number[] {
    const nk1 = this._sk1.count;
    const fpad: number[] = new Array<number>(2 * nk1);
    if (this._complex) {

    } else {

    }
    return fpad;
  }

}
