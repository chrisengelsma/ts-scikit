import { FftReal } from './fft-real';
import { FftComplex } from './fft-complex';
import { Sampling } from './sampling';
import { arrayDimensions, ccopy, Check, copy } from '../utils';

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

  private _padding1: number = 0;
  private _padding2: number = 0;
  private _padding3: number = 0;

  private _center1: boolean;
  private _center2: boolean;
  private _center3: boolean;

  private _complex: boolean;

  private _overwrite: boolean;

  static FromData(f: number[] | number[][] | number[][][], complex: boolean = false) {
    switch (arrayDimensions(f)) {
      case 1:
        f = f as number[];
        return new Fft(f.length, complex);
      case 2:
        f = f as number[][];
        return new Fft(f[0].length, f.length, complex);
      default:
        f = f as number[][][];
        return new Fft(f[0][0].length, f[0].length, f.length, complex);
    }
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
   * @param n1 number of samples in the first dimension.
   * @param complex true, for complex values; false, for real values.
   */
  constructor(n1: number, complex?: boolean);

  /**
   * Constructs a 2D FFT with specified number of space samples.
   * <p>
   * Sampling intervals are 1.0 and first sample coordinates are 0.0.
   * @param n1 number of samples in the first dimension.
   * @param n2 number of samples in the second dimension.
   * @param complex true, for complex values; false, for real values.
   */
  constructor(n1: number, n2: number, complex?: boolean);

  /**
   * Constructs a 3D FFT with specified number of space samples.
   * <p>
   * Sampling intervals are 1.0 and first sample coordinates are 0.0.
   * @param n1 number of samples in the first dimension.
   * @param n2 number of samples in the second dimension.
   * @param n3 number of samples in the third dimension.
   * @param complex true, for complex values; false, for real values.
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

    if (complex) { this.complex = complex };
  }

  /**
   * Sets the type of input (output) values for forward (inverse) transforms.
   * <p>
   * The default type is real.
   * @param complex true, for complex values; false, for real values.
   */
  set complex(complex: boolean) {
    if (this._complex !== complex) {
      this._complex = complex;
      this._updateSampling1();
    }
  }

  /**
   * Sets the ability of this transform to overwrite specified arrays.
   * <p>
   * The array specified in an inverse transform is either copied or
   * overwritten internally by the inverse transform. Copying preserves
   * the values in the specified array, but wastes memory in the case
   * when those values are no longer needed. If overwrite is true, then
   * the inverse transform will be performed in place, so that no copy
   * is necessary. The default is false.
   * @param overwrite true, to overwrite; false, to copy.
   */
  set overwrite(overwrite: boolean) {
    if (this._overwrite !== overwrite) {
      this._overwrite = overwrite;
    }
  }

  /**
   * Sets the centering of frequency samplings for all dimensions.
   * <p>
   * If centered, the number of frequency samples is always odd,
   * and zero frequency corresponds to the middle sample. The
   * default center is false, so that zero frequency corresponds to
   * the sample with index zero in the output transformed array.
   * @param center true, for centering; false, otherwise.
   */
  set center(center: boolean) {
    this.center1 = center;
    this.center2 = center;
    this.center3 = center;
  }

  /**
   * Sets the centering of frequency sampling for the 1st dimension.
   * <p>
   * If centered, the number of frequency samples is always odd,
   * and zero frequency corresponds to the middle sample. The
   * default center is false, so that zero frequency corresponds to
   * the sample with index zero in the output transformed array.
   * @param center true, for centering; false, otherwise.
   */
  set center1(center: boolean) {
    if (this._center1 !== center) {
      this._center1 = center;
      this._updateSampling1();
    }
  }

  /**
   * Sets the centering of frequency sampling for the 2nd dimension.
   * <p>
   * If centered, the number of frequency samples is always odd,
   * and zero frequency corresponds to the middle sample. The
   * default center is false, so that zero frequency corresponds to
   * the sample with index zero in the output transformed array.
   * @param center true, for centering; false, otherwise.
   */
  set center2(center: boolean) {
    if (this._center2 !== center) {
      this._center2 = center;
      this._updateSampling2();
    }
  }

  /**
   * Sets the centering of frequency sampling for the 3rd dimension.
   * <p>
   * If centered, the number of frequency samples is always odd,
   * and zero frequency corresponds to the middle sample. The
   * default center is false, so that zero frequency corresponds to
   * the sample with index zero in the output transformed array.
   * @param center true, for centering; false, otherwise.
   */
  set center3(center: boolean) {
    if (this._center3 !== center) {
      this._center3 = center;
      this._updateSampling3();
    }
  }

  /**
   * Sets the minimum padding with zeros for all array dimensions.
   * <p>
   * The default minimum is zero. However, some amount of padding
   * may be required by the FFT.
   * @param padding the minimum padding.
   */
  set padding(padding: number) {
    this.padding1 = padding;
    this.padding2 = padding;
    this.padding3 = padding;
  }

  /**
   * Sets the minimum padding with zeros for the 1st array dimension.
   * <p>
   * The default minimum is zero. However, some amount of padding may
   * be required by the FFT.
   * @param padding the minimum padding.
   */
  set padding1(padding: number) {
    if (this._padding1 !== padding) {
      this._padding1 = padding;
      this._updateSampling1();
    }
  }

  /**
   * Sets the minimum padding with zeros for the 2nd array dimension.
   * <p>
   * The default minimum is zero. However, some amount of padding may
   * be required by the FFT.
   * @param padding the minimum padding.
   */
  set padding2(padding: number) {
    if (this._padding2 !== padding) {
      this._padding2 = padding;
      this._updateSampling2();
    }
  }

  /**
   * Sets the minimum padding with zeros for the 3rd array dimension.
   * <p>
   * The default minimum is zero. However, some amount of padding may
   * be required by the FFT.
   * @param padding the minimum padding.
   */
  set padding3(padding: number) {
    if (this._padding3 !== padding) {
      this._padding3 = padding;
      this._updateSampling3();
    }
  }

  /**
   * Gets the frequency sampling for the 1st dimension.
   * @returns the frequency sampling.
   */
  get frequencySampling1(): Sampling { return this._sk1; }

  /**
   * Gets the frequency sampling for the 2nd dimension.
   * @returns the frequency sampling.
   */
  get frequencySampling2(): Sampling { return this._sk2; }

  /**
   * Gets the frequency sampling for the 3rd dimension.
   * @returns the frequency sampling.
   */
  get frequencySampling3(): Sampling { return this._sk3; }

  /**
   * Sets the sign used for forward transforms in all dimensions.
   * <p>
   * The opposite sign is used for inverse transforms.
   * The default sign is -1.
   * @param sign the sign, -1 or 1.
   */
  set sign(sign: number) {
    this.sign1 = sign;
    this.sign2 = sign;
    this.sign3 = sign;
  }

  /**
   * Sets the sign used for forward transforms in the 1st dimension.
   * <p>
   * The opposite sign is used for inverse transforms.
   * The default sign is -1.
   * @param sign the sign, -1 or 1.
   */
  set sign1(sign: number) {
    this._sign1 = (sign > 0) ? 1 : -1;
  }

  /**
   * Sets the sign used for forward transforms in the 2nd dimension.
   * <p>
   * The opposite sign is used for inverse transforms.
   * The default sign is -1.
   * @param sign the sign, -1 or 1.
   */
  set sign2(sign: number) {
    this._sign2 = (sign > 0) ? 1 : -1;
  }

  /**
   * Sets the sign used for forward transforms in the 3rd dimension.
   * <p>
   * The opposite sign is used for inverse transforms.
   * The default sign is -1.
   * @param sign the sign, -1 or 1.
   */
  set sign3(sign: number) {
    this._sign3 = (sign > 0) ? 1 : -1;
  }

  /**
   * Applies a forward space-to-frequency transform of a 1D array.
   * @param f the array to be transformed, a sampled function of space.
   * @returns the transformed array, a sample function fo frequency.
   */
  applyForward(f: number[]): number[];

  /**
   * Applies a forward space-to-frequency transform of a 2D array.
   * @param f the array to be transformed, a sampled function of space.
   * @returns the transformed array, a sample function fo frequency.
   */
  applyForward(f: number[][]): number[][];

  /**
   * Applies a forward space-to-frequency transform of a 3D array.
   * @param f the array to be transformed, a sampled function of space.
   * @returns the transformed array, a sample function fo frequency.
   */
  applyForward(f: number[][][]): number[][][];

  applyForward(f: number[] | number[][] | number[][][]): number[] | number[][] | number[][][] {
    const dim = arrayDimensions(f);
    switch (dim) {
      case 1:
        return this._applyForward1(f as number[]);
      case 2:
        return this._applyForward2(f as number[][]);
      default:
        return this._applyForward3(f as number[][][]);
    }
  }

  /**
   * Applies an inverse frequency-to-space transform of a 1D array.
   * @param g the array to be transformed, a sampled function of frequency.
   * @returns the transformed array, a sampled function of space.
   */
  applyInverse(g: number[]): number[];

  /**
   * Applies an inverse frequency-to-space transform of a 2D array.
   * @param g the array to be transformed, a sampled function of frequency.
   * @returns the transformed array, a sampled function of space.
   */
  applyInverse(g: number[][]): number[][];

  /**
   * Applies an inverse frequency-to-space transform of a 3D array.
   * @param g the array to be transformed, a sampled function of frequency.
   * @returns the transformed array, a sampled function of space.
   */
  applyInverse(g: number[][][]): number[][][];

  applyInverse(g: number[] | number[][] | number[][][]): number[] | number[][] | number[][][] {
    const dim = arrayDimensions(g);
    switch (dim) {
      case 1:
        return this._applyInverse1(g as number[]);
      case 2:
        return this._applyInverse2(g as number[][]);
      default:
        return this._applyInverse3(g as number[][][]);
    }
  }

  /** @internal */
  private _applyInverse1(g: number[]): number[] {
    this._ensureSamplingK1(g);
    const nx1 = this._sx1.count;
    const gpad = ( this._overwrite ) ? g : copy(g);
    this._uncenter(gpad, 1);
    this._unphase(gpad, 1);
    if (this._complex) {
      this._fft1c.complexToComplex(-this._sign1, gpad, gpad);
      this._fft1c.scale(gpad, nx1);
      return ccopy(gpad, nx1);
    } else {
      this._fft1r.complexToReal(-this._sign1, gpad, gpad);
      this._fft1r.scale(gpad, nx1);
      return copy(gpad, nx1);
    }
  }

  /** @internal */
  private _applyInverse2(g: number[][]): number[][] {
    this._ensureSamplingK2(g);
    const gpad = ( this._overwrite ) ? g : copy(g);
    const nx1 = this._sx1.count;
    const nx2 = this._sx2.count;
    this._uncenter(gpad, 2);
    this._unphase(gpad, 2);
    if (this._complex) {
      this._fft2.complexToComplex2(-this._sign2, gpad, gpad, this._nfft1);
      this._fft2.scale(gpad, this._nfft1, nx2);
      this._fft1c.complexToComplex1(-this._sign1, gpad, gpad, nx2);
      this._fft1c.scale(gpad, nx1, nx2);
      return ccopy(gpad, nx1, nx2);
    } else {
      this._fft2.complexToComplex2(-this._sign2, gpad, gpad, this._nfft1 / 2 + 1);
      this._fft2.scale(gpad, this._nfft1 / 2 + 1, nx2);
      this._fft1r.complexToReal1(-this._sign1, gpad, gpad, nx2);
      this._fft1r.scale(gpad, nx1, nx2);
      return copy(gpad, nx1, nx2);
    }
  }

  /** @internal */
  private _applyInverse3(g: number[][][]): number[][][] {
    this._ensureSamplingK3(g);
    const gpad: number[][][] = ( this._overwrite ) ? g : copy(g);
    const nx1 = this._sx1.count;
    const nx2 = this._sx2.count;
    const nx3 = this._sx3.count;
    this._uncenter(gpad, 3);
    this._unphase(gpad, 3);
    if (this._complex) {
      this._fft3.complexToComplex3(-this._sign3, gpad, gpad, this._nfft1, this._nfft2);
      this._fft3.scale(gpad, this._nfft1, this._nfft2, nx3);
      this._fft2.complexToComplex2(-this._sign2, gpad, gpad, this._nfft1, nx3);
      this._fft2.scale(gpad, this._nfft1, nx2, nx3);
      this._fft1c.complexToComplex1(-this._sign1, gpad, gpad, nx2, nx3);
      this._fft1c.scale(gpad, nx1, nx2, nx3);
      return ccopy(gpad, nx1, nx2, nx3);
    } else {
      this._fft3.complexToComplex3(-this._sign3, gpad, gpad, this._nfft1 / 2 + 1, this._nfft2);
      this._fft3.scale(gpad, this._nfft1 / 2 + 1, this._nfft2, nx3);
      this._fft2.complexToComplex2(-this._sign2, gpad, gpad, this._nfft1 / 2 + 1, nx3);
      this._fft2.scale(gpad, this._nfft1 / 2 + 1, nx2, nx3);
      this._fft1r.complexToReal1(-this._sign1, gpad, gpad, nx2, nx3);
      this._fft1r.scale(gpad, nx1, nx2, nx3);
      return copy(gpad, nx1, nx2, nx3);
    }
  }

  /** @internal */
  private _applyForward1(f: number[]): number[] {
    this._ensureSamplingX1(f);
    const fpad = this._pad1(f);
    if (this._complex) {
      this._fft1c.complexToComplex(this._sign1, fpad, fpad);
    } else {
      this._fft1r.realToComplex(this._sign1, fpad, fpad);
    }
    this._phase(fpad, 1);
    this._center(fpad, 1);
    return fpad;
  }

  /** @interal */
  private _applyForward2(f: number[][]): number[][] {
    this._ensureSamplingX2(f);
    const fpad = this._pad2(f);
    const nx2 = this._sx2.count;
    if (this._complex) {
      this._fft1c.complexToComplex1(this._sign1, fpad, fpad, nx2);
      this._fft2.complexToComplex2(this._sign2, fpad, fpad, this._nfft1);
    } else {
      this._fft1r.realToComplex1(this._sign1, fpad, fpad, nx2);
      this._fft2.complexToComplex2(this._sign2, fpad, fpad, this._nfft1 / 2 + 1);
    }
    this._phase(fpad, 2);
    this._center(fpad, 2);
    return fpad;
  }

  /** @internal */
  private _applyForward3(f: number[][][]): number[][][] {
    this._ensureSamplingX3(f);
    const fpad: number[][][] = this._pad3(f);
    const nx2 = this._sx2.count;
    const nx3 = this._sx3.count;
    if (this._complex) {
      this._fft1c.complexToComplex1(this._sign1, fpad, fpad, nx2, nx3);
      this._fft2.complexToComplex2(this._sign2, fpad, fpad, this._nfft1, nx3);
      this._fft3.complexToComplex3(this._sign3, fpad, fpad, this._nfft1, this._nfft2);
    } else {
      this._fft1r.realToComplex1(this._sign1, fpad, fpad, nx2, nx3);
      this._fft2.complexToComplex2(this._sign2, fpad, fpad, this._nfft1 / 2 + 1, nx3);
      this._fft3.complexToComplex3(this._sign3, fpad, fpad, this._nfft1 / 2 + 1, this._nfft2);
    }
    this._phase(fpad, 3);
    this._center(fpad, 3);
    return fpad;
  }

  /** @internal */
  private _cswap(f: number[] | number[][] | number[][][], n: number, i: number, j: number, dim: number): void {
    switch (dim) {
      case 1:
        this._doCswap1(f as number[], n, i, j);
        break;
      case 2:
        this._doCswap2(f as number[][], n, i, j);
        break;
      default:
        this._doCswap3(f as number[][][], n, i, j);
    }
  }

  /** @internal */
  private _doCswap1(f: number[], n: number, i: number, j: number): void {
    let ir = 2 * i, ii = ir + 1;
    let jr = 2 * j, ji = jr + 1;
    for (let k = 0; k < n; ++i, ir += 2, ii += 2, jr += 2, ji += 2) {
      const fir = f[ir];
      f[ir] = f[jr];
      f[jr] = fir;

      const fii = f[ii];
      f[ii] = f[ji];
      f[ji] = fii;
    }
  }

  /** @internal */
  private _doCswap2(f: number[][], n: number, i: number, j: number): void {
    for (let k = 0; k < n; ++k, ++i, ++j) {
      const fi = f[i];
      f[i] = f[j];
      f[j] = fi;
    }
  }

  /** @internal */
  private _doCswap3(f: number[][][], n: number, i: number, j: number): void {
    for (let k = 0; k < n; ++k, ++i, ++j) {
      const fi: number[][] = f[i];
      f[i] = f[j];
      f[j] = fi;
    }
  }


  /** @internal */
  private _cshift(f: number[], n: number, i: number, j: number): void {
    if (i < j) {
      let ir = 2 * ( i + n - 1 ), ii = ir + 1;
      let jr = 2 * ( j + n - 1 ), ji = jr + 1;
      for (let k = 0; k < n; ++k, ir -= 2, ii -= 2, jr -= 2, ji -= 2) {
        f[jr] = f[ir];
        f[ji] = f[ii];
      }
    } else {
      let ir = 2 * i, ii = ir + 1;
      let jr = 2 * j, ji = jr + 1;
      for (let k = 0; k < n; ++k, ir += 2, ii += 2, jr += 2, ji += 2) {
        f[jr] = f[ir];
        f[ji] = f[ii];
      }
    }
  }

  /** @internal */
  private _crotateLeft(f: number[] | number[][] | number[][][], n: number, j: number, dim: number): void {
    switch (dim) {
      case 1:
        this._doCrotateLeft1(f as number[], n, j);
        break;
      case 2:
        this._doCrotateLeft2(f as number[][], n, j);
        break;
      default:
        this._doCrotateLeft3(f as number[][][], n, j);

    }
  }

  /** @internal */
  private _doCrotateLeft1(f: number[], n: number, j: number): void {
    let fjr = f[j * 2];
    let fji = f[j * 2 + 1];
    const i = j + 1;
    let ir = 2 * i;
    let ii = ir + 1;
    for (let k = 1; k < n; ++k, ir += 2, ii += 2) {
      f[ir - 2] = f[ir];
      f[ii - 2] = f[ii];
    }
    f[ir - 2] = fjr;
    f[ii - 2] = fji;
  }

  /** @internal */
  private _doCrotateLeft2(f: number[][], n: number, j: number): void {
    // nfft odd
    // 4 5 6 3 0 1 2
    // 4 5 6 0 1 2 3
    // _doCrotateLeft(f,n=4,j=3);
    const fj: number[] = f[j];
    const m = j + n;
    let i = j + 1;
    for (; i < m; ++i)
      f[i - 1] = f[i];
    f[i - 1] = fj;
  }

  /** @internal */
  private _doCrotateLeft3(f: number[][][], n: number, j: number): void {
    // nfft odd
    // 4 5 6 3 0 1 2
    // 4 5 6 0 1 2 3
    // _doCrotateLeft(f, n=4,j=3);
    const fj: number[][] = f[j];
    const m = j + n;
    let i = j + 1;
    for (; i < m; ++i)
      f[i - 1] = f[i];
    f[i - 1] = fj;
  }

  /** @internal */
  private _crotateRight(f: number[] | number[][] | number[][][], n: number, j: number, dim: number): void {
    switch (dim) {
      case 1:
        this._doCrotateRight1(f as number[], n, j);
        break;
      case 2:
        this._doCrotateRight2(f as number[][], n, j);
        break;
      default:
        this._doCrotateRight3(f as number[][][], n, j);
    }
  }

  /** @internal */
  private _doCrotateRight1(f: number[], n: number, j: number): void {
    const m = j + n - 1;
    const fmr = f[m * 2];
    const fmi = f[m * 2 + 1];
    let i = m;
    let ir = 2 * i;
    let ii = ir + 1;
    for (let k = 1; k < n; ++k, ir -= 2, ii -= 2) {
      f[ir] = f[ir - 2];
      f[ii] = f[ii - 2];
    }
    f[ir] = fmr;
    f[ii] = fmi;
  }


  /** @internal */
  private _doCrotateRight2(f: number[][], n: number, j: number): void {
    const m = j + n - 1;
    const fm: number[] = f[m];
    let i = m;
    for (; i > j; --i) { f[i] = f[i - 1]; }
    f[i] = fm;
  }


  /** @internal */
  private _doCrotateRight3(f: number[][][], n: number, j: number): void {
    const m = j + n - 1;
    const fm: number[][] = f[m];
    let i = m;
    for (; i > j; --i) { f[i] = f[i - 1]; }
    f[i] = fm;
  }

  /** @internal */
  private _creflect(f: number[] | number[][] | number[][][], n: number, i: number, dim: number): void {

    switch (dim) {
      case 1:
        this._doCreflect1(f as number[], n, i);
        break;
      case 2:
        this._doCreflect2(f as number[][], n, i);
        break;
      default:
        this._doCreflect3(f as number[][][], n, i);
    }
  }

  /** @internal */
  private _doCreflect1(f: number[], n: number, i: number): void {
    let ir = 2 * ( i + 1 ), ii = ir + 1;
    let jr = 2 * ( i - 1 ), ji = jr + 1;
    for (let k = 0; k < n; ++k, ir += 2, ii += 2, jr -= 2, ji -= 2) {
      f[jr] = f[ir];
      f[ji] = -f[ii];
    }
  }


  /** @internal */
  private _doCreflect2(f: number[][], n: number, i: number): void {
    const n2 = f.length;
    for (let i2 = 0, j2 = n2 - 1; i2 < n2; ++i2, --j2) {
      let ir = 2 * ( i + 1 ), ii = ir + 1;
      let jr = 2 * ( i - 1 ), ji = jr + 1;
      const fj2 = f[j2];
      const fi2 = f[i2];
      for (let k = 0; k < n; ++k, ir += 2, ii += 2, jr -= 2, ji -= 2) {
        fj2[jr] = fi2[ir];
        fj2[ji] = -fi2[ii];
      }
    }
  }

  /** @internal */
  private _doCreflect3(f: number[][][], n: number, i: number): void {
    const n2 = f[0].length;
    const n3 = f.length;
    for (let i3 = 0, j3 = n3 - 1; i3 < n3; ++i3, --j3) {
      for (let i2 = 0, j2 = n2 - 1; i2 < n2; ++i2, --j2) {
        let ir = 2 * ( i + 1 ), ii = ir + 1;
        let jr = 2 * ( i - 1 ), ji = jr + 1;
        const fj3j2 = f[j3][j2];
        const fi3i2 = f[i3][i2];
        for (let k = 0; k < n; ++k, ir += 2, ii += 2, jr -= 2, ji -= 2) {
          fj3j2[jr] = fi3i2[ir];
          fj3j2[ji] = -fi3i2[ii];
        }
      }
    }
  }

  /** @internal */
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
    if (!this._sx1) { return; }
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
      if (!this._fft1c || this._nfft1 !== nfft) {
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
      if (!this._fft1r || this._nfft1 !== nfft) {
        this._fft1r = new FftReal(nfft);
        this._fft1c = null;
        this._nfft1 = nfft;
      }
    }
    this._sk1 = new Sampling(nk, dk, fk);
  }

  private _updateSampling2(): void {
    if (!this._sx2) { return; }
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
    if (!this._fft2 || this._nfft2 !== nfft) {
      this._fft2 = new FftComplex(nfft);
      this._nfft2 = nfft;
    }
    this._sx2 = new Sampling(nk, dk, fk);
  }

  private _updateSampling3(): void {
    if (!this._sx3) { return; }
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
    if (!this._fft3 || this._nfft3 !== nfft) {
      this._fft3 = new FftComplex(nfft);
      this._nfft3 = nfft;
    }
    this._sk3 = new Sampling(nk, dk, fk);
  }

  private _pad1(f: number[]): number[] {
    const nk1 = this._sk1.count;
    return ( this._complex )
      ? copy(f, f.length).concat(Array(nk1).fill(0.0))
      : ccopy(f, f.length / 2).concat(Array(nk1).fill(0.0));
  }

  private _pad2(f: number[][]): number[][] {
    const nk2 = this._sk2.count;
    const g = copy(f);
    for (let i2 = 0; i2 < nk2; ++i2) { g[i2] = this._pad1(g[i2]); }
    return g;
  }

  private _pad3(f: number[][][]): number[][][] {
    const nk3 = this._sk3.count;
    const g = copy(f);
    for (let i3 = 0; i3 < nk3; ++i3) { g[i3] = this._pad2(g[i3]); }
    return g;
  }

  private _ensureSamplingX1(f: number[]): void {
    Check.state(this._sx1 !== null, 'sampling sx1 exists for 1st dimension');
    const l1 = f.length;
    let n1 = this._sx1.count;
    if (this._complex) { n1 *= 2; }
    Check.argument(n1 === l1, 'array length consistent with sampling sx1');
  }

  private _ensureSamplingX2(f: number[][]): void {
    Check.state(this._sx2 !== null, 'sampling sx2 exists for 2nd dimension');
    this._ensureSamplingX1(f[0]);
    const l2 = f.length;
    const n2 = this._sx2.count;
    Check.argument(n2 === l2, 'array length consistent with sampling sx2');
  }

  private _ensureSamplingX3(f: number[][][]): void {
    Check.state(this._sx3 !== null, 'sampling sx3 exists for 3rd dimension');
    this._ensureSamplingX2(f[0]);
    const l3 = f.length;
    const n3 = this._sx3.count;
    Check.argument(n3 === l3, 'array length consistent with sampling sx3');
  }

  private _ensureSamplingK1(f: number[]): void {
    Check.state(this._sk1 !== null, 'sampling sk1 exists for 1st dimension');
    const l1 = f.length;
    const n1 = this._sk1.count;
    console.log(l1, n1);
    Check.argument(2 * n1 === l1, 'array length consistent with sampling sk1');
  }

  private _ensureSamplingK2(f: number[][]): void {
    Check.state(this._sk2 !== null, 'sampling sk2 exists for 2nd dimension');
    const l2 = f.length;
    const n2 = this._sk2.count;
    Check.argument(n2 === l2, 'array length consistent with sampling sk2');
  }

  private _ensureSamplingK3(f: number[][][]): void {
    Check.state(this._sk3 !== null, 'sampling sk3 exists for 3rd dimension');
    this._ensureSamplingK2(f[0]);
    const l3 = f.length;
    const n3 = this._sk3.count;
    Check.argument(n3 === l3, 'array length consistent with sampling sk3');
  }

  /** @ignore */
  private _center(f: number[] | number[][] | number[][][], dim: number): void {
    switch (dim) {
      case 1:
        this._doCenter1(f as number[]);
        break;
      case 2:
        this._doCenter2(f as number[][]);
        break;
      default:
        this._doCenter3(f as number[][][]);
    }
  }

  /** @internal */
  private _doCenter1(f: number[]): void {
    this._center1d(f);
    if (this._center1 && !this._complex) {
      // real, nfft = 8
      // x x x x 0 1 2 3 4
      // 4 3 2 1 0 1 2 3 4
      this._creflect(f, this._nfft1 / 2, this._nfft1 / 2, 1);
    }
  }

  /** @ignore */
  private _doCenter2(f: number[][]): void {
    if (this._center1) {
      for (let i2 = 0; i2 < this._nfft2; ++i2) {
        this._center1d(f[i2]);
      }
      this._center2d(f);
      if (this._center1 && !this._complex) {
        this._creflect(f, this._nfft1 / 2, this._nfft1 / 2, 2);
      }
    }
  }

  /** @ignore */
  private _doCenter3(f: number[][][]): void {
    if (this._center3) { return; }
    const nk3 = this._sk3.count;
    const nfft3 = this._nfft3;
    const even3 = nfft3 % 2 === 0;
    if (even3) {
      // nfft even
      // 0 1 2 3 4 5 6 7 | 8
      // 4 5 6 7 0 1 2 3 | 4
      this._cswap(f, nfft3 / 2, 0, nfft3 / 2, 3);
      f[nk3 - 1] = ccopy(f[0]);
    } else {
      // nfft odd
      // 0 1 2 3 4 5 6
      // 4 5 6 3 0 1 2
      // 4 5 6 0 1 2 3
      this._cswap(f, ( nfft3 - 1 ) / 2, 0, ( nfft3 + 1 ) / 2, 3);
      this._crotateLeft(f, ( nfft3 + 1 ) / 2, ( nfft3 - 1 ) / 2, 3);
    }
  }

  /** @internal */
  private _phase(f: number[] | number[][] | number[][][], dim: number): void {
    switch (dim) {
      case 1:
        this._doPhase1(f as number[], this._sign1);
        break;
      case 2:
        this._doPhase2(f as number[][], this._sign1, this._sign2);
        break;
      default:
        this._doPhase3(f as number[][][], this._sign1, this._sign2, this._sign3);
    }
  }

  /** @internal */
  private _unphase(f: number[] | number[][] | number[][][], dim: number): void {
    switch (dim) {
      case 1:
        this._doPhase1(f as number[], -this._sign1);
        break;
      case 2:
        this._doPhase2(f as number[][], -this._sign1, -this._sign2);
        break;
      default:
        this._doPhase3(f as number[][][], -this._sign1, -this._sign2, -this._sign3);
    }
  }

  /** @internal */
  private _doPhase1(f: number[], sign1: number = this._sign1): void {
    const fx = this._sx1.first;
    if (fx === 0.0) { return; }
    const nk = ( this._complex ) ? this._nfft1 : this._nfft1 / 2 + 1;
    const dp = sign1 * 2.0 * Math.PI * this._sk1.delta * fx;
    let p, cosp, sinp, fr, fi;
    for (let i = 0, ir = 0, ii = 1; i < nk; ++i, ir += 2, ii += 2) {
      p = i * dp;
      cosp = Math.cos(p);
      sinp = Math.sin(p);
      fr = f[ir];
      fi = f[ii];
      f[ir] = fr * cosp - fi * sinp;
      f[ii] = fi * cosp + fr * sinp;
    }
  }

  /** @internal */
  private _doPhase2(f: number[][], sign1: number = this._sign1, sign2: number = this._sign2): void {
    const fx1 = this._sx1.first;
    const fx2 = this._sx2.first;
    let p, cosp, sinp, fr, fi;
    let p2, f2;
    if (fx1 === 0.0 && fx2 === 0.0) { return; }
    const nk1 = ( this._complex ) ? this._nfft1 : this._nfft1 / 2 + 1;
    const nk2 = this._nfft2;
    const dp1 = sign1 * 2.0 * Math.PI * this._sk1.delta * fx1;
    const dp2 = sign2 * 2.0 * Math.PI * this._sk1.delta * fx2;
    for (let i2 = 0; i2 < nk2; ++i2) {
      p2 = i2 * dp2;
      f2 = f[i2];
      for (let i1 = 0, ir = 0, ii = 1; i1 < nk1; ++i1, ir += 2, ii += 2) {
        p = i1 * dp1 * p2;
        cosp = Math.cos(p);
        sinp = Math.sin(p);
        fr = f2[ir];
        fi = f2[ii];
        f2[ir] = fr * cosp - fi * sinp;
        f2[ii] = fi * cosp + fr * sinp;
      }
    }
  }

  /** @internal */
  private _doPhase3(f: number[][][], sign1: number = this._sign1, sign2: number = this._sign2, sign3: number = this._sign3): void {
    const fx1 = this._sx1.first;
    const fx2 = this._sx2.first;
    const fx3 = this._sx3.first;
    let p, cosp, sinp, fr, fi;
    if (fx1 === 0.0 && fx2 === 0.0 && fx3 === 0.0) { return; }
    const nk1 = ( this._complex ) ? this._nfft1 : this._nfft1 / 2 + 1;
    const nk2 = this._nfft2;
    const nk3 = this._nfft3;
    let dp1 = sign1 * 2.0 * Math.PI * this._sk1.delta * fx1;
    let dp2 = sign2 * 2.0 * Math.PI * this._sk2.delta * fx2;
    let dp3 = sign3 * 2.0 * Math.PI * this._sk3.delta * fx3;
    for (let i3 = 0; i3 < nk3; ++i3) {
      for (let i2 = 0; i2 < nk2; ++i2) {
        const p23 = i2 * dp2 + i3 * dp3;
        let f32 = f[i3][i2];
        for (let i1 = 0, ir = 0, ii = 1; i1 < nk1; ++i1, ir += 2, ii += 2) {
          p = i1 * dp1 * p23;
          cosp = Math.cos(p);
          sinp = Math.sin(p);
          fr = f32[ir];
          fi = f32[ii];
          f32[ir] = fr * cosp - fi * sinp;
          f32[ii] = fi * cosp + fr * sinp;
        }
      }
    }
  }

  /** @internal */
  private _center1d(f: number[]): void {
    if (!this._center1) { return; }
    const nk1 = this._sk1.count;
    const nfft1 = this._nfft1;
    const even1 = nfft1 % 2 === 0;
    if (this._complex) {
      if (even1) {
        // complex, nfft = 8
        // 0 1 2 3 4 5 6 7 | 8
        // 4 5 6 7 0 1 2 3 | 4
        this._cswap(f, nfft1 / 2, 0, nfft1 / 2, 1);
        f[2 * ( nk1 - 1 )] = f[0];
        f[2 * ( nk1 - 1 ) + 1] = f[1];
      } else {
        // complex, nfft = 7
        // 0 1 2 3 4 5 6
        // 4 5 6 3 0 1 2
        // 4 5 6 0 1 2 3
        this._cswap(f, ( nfft1 - 1 ) / 2, 0, ( nfft1 + 1 ) / 2, 1);
        this._crotateLeft(f, ( nfft1 + 1 ) / 2, ( nfft1 - 1 ) / 2, 1);
      }
    } else {
      // real, nfft = 8
      // 0 1 2 3 4
      // 0 1 2 3 0 1 2 3 4
      this._cshift(f, nfft1 / 2 + 1, 0, nfft1 / 2);
    }
  }

  /** @internal */
  private _center2d(f: number[][]): void {
    if (!this._center2) { return; }
    const nk2 = this._sk2.count;
    const nfft2 = this._nfft2;
    const even2 = nfft2 % 2 == 0;
    if (even2) {
      // nfft even
      // 0 1 2 3 4 5 6 7 | 8
      // 4 5 6 7 0 1 2 3 | 4
      this._cswap(f, nfft2 / 2, 0, nfft2 / 2, 2);
      f[nk2 - 1] = ccopy(f[0]);
    } else {
      // nfft odd
      // 0 1 2 3 4 5 6
      // 4 5 6 3 0 1 2
      // 4 5 6 0 1 2 3
      this._cswap(f, ( nfft2 - 1 ) / 2, 0, ( nfft2 + 1 ) / 2, 2);
      this._crotateLeft(f, ( nfft2 + 1 ) / 2, ( nfft2 - 1 ) / 2, 2);
    }
  }

  /** @ignore */
  private _center3d(f: number[][][]): void {
    if (!this._center3) { return; }
    const nk3 = this._sk3.count;
    const nfft3 = this._nfft3;
    const even3 = nfft3 % 2 === 0;
    if (even3) {
      // nfft even
      // 0 1 2 3 4 5 6 7 | 8
      // 4 5 6 7 0 1 2 3 | 4
      this._cswap(f, nfft3 / 2, 0, nfft3 / 2, 3);
      f[nk3 - 1] = ccopy(f[0]);
    } else {
      // nfft odd
      // 0 1 2 3 4 5 6
      // 4 5 6 3 0 1 2
      // 4 5 6 0 1 2 3
      this._cswap(f, ( nfft3 - 1 ) / 2, 0, ( nfft3 + 1 ) / 2, 3);
      this._crotateLeft(f, ( nfft3 + 1 ) / 2, ( nfft3 - 1 ) / 2, 3);
    }
  }

  /** @internal */
  private _uncenter(f: number[] | number[][] | number[][][], dims: number): void {
    switch (dims) {
      case 1:
        this._uncenter1(f as number[]);
      case 2:
        this._uncenter2(f as number[][]);
      default:
        this._uncenter3(f as number[][][]);
    }
  };

  /** @internal */
  private _uncenter1(f: number[]): void {
    if (!this._center1) { return; }
    const nfft1 = this._nfft1;
    const even1 = nfft1 % 2 === 0;
    if (this._complex) {
      if (even1) {
        // complex, nfft = 8
        // 4 5 6 7 0 1 2 3 | 8
        // 0 1 2 3 4 5 6 7 | 8
        this._cswap(f, nfft1 / 2, 0, nfft1 / 2, 1);
      } else {
        // complex, nfft = 7
        // 4 5 6 0 1 2 3
        // 4 5 6 3 0 1 2
        // 0 1 2 3 4 5 6
        this._crotateRight(f, ( nfft1 + 1 ) / 2, ( nfft1 - 1 ) / 2, 1);
        this._cswap(f, ( nfft1 - 1 ) / 2, 0, ( nfft1 + 1 ) / 2, 1);
      }
    } else {
      // real, nfft = 8
      // 4 3 2 1 0 1 2 3 4
      // 0 1 2 3 4 1 2 3 4
      this._cshift(f, nfft1 / 2 + 1, nfft1 / 2, 0);
    }
  }

  /** @internal */
  private _uncenter2(f: number[][]): void {
    if (!this._center2) { return; }
    const nfft2 = this._nfft2;
    const even2 = nfft2 % 2 === 0;
    if (even2) {
      // nfft even
      // 4 5 6 7 0 1 2 3 | 8
      // 0 1 2 3 4 5 6 7 | 8
      this._cswap(f, nfft2 / 2, 0, nfft2 / 2, 2);
    } else {
      // nfft odd
      // 4 5 6 0 1 2 3
      // 4 5 6 3 0 1 2
      // 0 1 2 3 4 5 6
      this._crotateRight(f, ( nfft2 + 1 ) / 2, ( nfft2 - 1 ) / 2, 2);
      this._cswap(f, ( nfft2 - 1 ) / 2, 0, ( nfft2 + 1 ) / 2, 2);
    }
  }

  /** @internal */
  private _uncenter3(f: number[][][]): void {
    if (!this._center3) { return; }
    const nfft3 = this._nfft3;
    const even3 = nfft3 % 2 == 0;
    if (even3) {
      // nfft even
      // 4 5 6 7 0 1 2 3 | 8
      // 0 1 2 3 4 5 6 7 | 8
      this._cswap(f, nfft3 / 2, 0, nfft3 / 2, 3);
    } else {
      // nfft odd
      // 4 5 6 0 1 2 3
      // 4 5 6 3 0 1 2
      // 0 1 2 3 4 5 6
      this._crotateRight(f, ( nfft3 + 1 ) / 2, ( nfft3 - 1 ) / 2, 3);
      this._cswap(f, ( nfft3 - 1 ) / 2, 0, ( nfft3 + 1 ) / 2, 3);
    }
  }
}
