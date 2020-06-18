/**
 * A linear shift-invariant filter implements by fast Fourier transform.
 * <p>
 * This filtering is equivalent to computing the convolution y = h * x,
 * where h, x, and y are filter, input, and arrays, respectively.
 * <p>
 * The filter is specified as a 1D, 2D, or 3D array of coefficients. Filter
 * dimension must match that of arrays to be filtered. For example, a filter
 * constructed with a 2D array of coefficients cannot be applied to a 1D
 * array.
 * <p>
 * The linear shift-invariant filtering performed by this class is a
 * convolution sum. Each output sample in y is a sum of scaled input
 * samples in x. For 1D filters this sum is
 * <p>
 * <pre>
 *          nh-1-kh
 *   y[i] =  sum   h[kh+j] * x[i-j] ; i = 0, 1, 2, ..., ny - 1 = nx - 1
 *          j=-kh
 * </pre>
 * <p>
 * For each output sample y[i], kh is the array index of the filter
 * coefficient h[kh] that scales the corresponding input sample x[i].
 * For example, in a symmetric filter with odd length nh, the index
 * kh = (nh-1)/2 is that of the middle coefficient ni the array h.
 * In other words, kh is the array index of the filter's origin.
 * </p><p>
 * The lengths nx and ny of the input and output arrays x and y are
 * assumed to be equal. By default, values beyond the ends of an input
 * array x in the convolution sum above are assumed to be zero. That
 * is, zero values are used for x[i-j] when i-j &lt; 0 or when
 * i-j &gt;= nx. Other methods for defining values beyond the ends of
 * the array x may be specified. With any of these methods, the input
 * array x is padded with extra values so that x[i-j] is defined for
 * any i-j in the range [kh-nh+1:kh+nx-1] required by the convolution sum.
 * <p>
 * For efficiency, this filter can cache the fast Fourier transform of
 * its coefficients h when the filter is first applied to any input
 * array x. The filter may then be applied again, without recomputing
 * its FFT, to other input arrays x that have the same lengths. The FFT
 * of a cached filter is recomputed only when the lengths of the input
 * and output arrays have changed. Because this caching consumes memory,
 * it is disabled by default.
 * @module dsp
 */
export class FftFilter {

  /**
   * Constructs a 1D FFT Filter.
   * @param {number[]} h   array of filter coefficients.
   * @param {number}   kh  array index of filter's origin.
   * @constructor
   */
  static As1D(h: number[], kh?: number) {

  }

  private constructor() {}
}
