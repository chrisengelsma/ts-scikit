/**
 * An interface for 3D tensors used in anisotropic 3D image processing.
 * Each tensor is a symmetric positive semi-definite 3x3 matrix:
 * <pre><code>
 *       | a11 a12 a13 |
 *   A = | a12 a22 a23 |
 *       | a13 a13 a33 |
 * </code></pre>
 */
export interface Tensors3 {
  /**
   * Gets tensors elements for specified indices.
   * @param i1 index for 1st dimension.
   * @param i2 index for 1st dimension.
   * @param i3 index for 1st dimension.
   * @param a  array { a11, a12, a13, a22, a23, a33 } of tensor elements.
   */
  getTensor(i1: number, i2: number, i3: number, a: number[]): void;
}
