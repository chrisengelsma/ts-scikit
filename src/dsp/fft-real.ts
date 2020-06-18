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

}
