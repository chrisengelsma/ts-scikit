import { FftReal } from './fft-real';

/**
 * An easy-to-use fast Fourier transform.
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

  /**
   * Returns a new fast Fourier transform for the specified array of real values.
   * <p>
   * Spatial dimensions are determined from the dimension of the specified
   * array. Spatial sampling intervals are 1.0, and the first sample coordinates
   * are 0.0.
   * @param {number[]|number[][]|number[][][]} f an array of real values.
   * @param {boolean} complex true, for complex values; false, for real values.
   * @constructor
   */
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
  constructor(n1: number, n2?: number | boolean, n3?: number | boolean, complex?: boolean) {
  }

  private _fftReal: FftReal;

}
