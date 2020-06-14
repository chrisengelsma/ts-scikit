import { Tensors3 } from './tensors3';
import { UnitSphereSampling } from '../utils';
import { EigenSolver } from './eigen-solver';

/**
 * An array of eigen-decomposition of tensors for 3D image processing.
 * Each tensor is a symmetric positive semi-definite 3x3 matrix.
 * <pre>
 *       | a11 a12 a13 |
 *   A = | a12 a22 a23 |
 *       | a13 a23 a33 |
 * </pre>
 * Such tensors can be used to parametrize anisotropic image processing.
 * <p>
 * The eigen-decomposition of the matrix A is
 * <pre>
 *   A = au * u * u' + av * v * v' + aw * w * w'
 *     = (au - av) * u * u' + (aw - av) * w * w' + av * I
 * </pre>
 * where, u, v, and w are orthogonal unit eigenvectors of A. (The notation
 * u' denotes the transpose of u.) The outer products of eigenvectors are
 * scaled by the non-negative eigenvalues au, av and aw. The second
 * equation exploits the identity u * u' + v * v' + w * w' = I, and makes
 * apparent the redundancy of the vector v.
 * <p>
 * Only the 1st and 2nd components of the eigenvectors u and w are stored.
 * Except for a sign, the 3rd components may be computed from the 1st and
 * 2nd. Because the tensors are independent of the choice of the sign, the
 * eigenvectors u and w are stored with an implied non-negative 3rd
 * component.
 * <p>
 * Storage may be further reduced by compression, whereby eigenvalues and
 * eigenvectors are quantized.
 */
export class EigenTensors3 implements Tensors3 {

  private static readonly AS_SET = Number.MAX_SAFE_INTEGER;
  private static readonly AS_GET = 1.0 / EigenTensors3.AS_SET;

  private _uss: UnitSphereSampling;

  private readonly _n1: number;
  private readonly _n2: number;
  private readonly _n3: number;

  private _as: number[][][];  // Sum a1 + a2 + a3
  private _au: number[][][];  // au
  private _aw: number[][][];  // aw
  private _u1: number[][][];  // u1
  private _u2: number[][][];  // u2
  private _w1: number[][][];  // w1
  private _w2: number[][][];  // w2

  private static c3(c1: number, c2: number): number {
    const c3s = 1.0 - c1 * c1 - c2 * c2;
    return ( c3s > 0 ) ? Math.sqrt(c3s) : 0.0;
  }

  /**
   * Constructs tensors for specified array dimensions.
   * <p>
   * All eigenvalues and eigenvectors u and w are not set and are initially
   * zero.
   * @param n1 number of tensors in 1st dimension.
   * @param n2 number of tensors in 2nd dimension.
   * @param n3 number of tensors in 3rd dimension.
   */
  constructor(n1: number, n2: number, n3: number) {
    this._n1 = n1;
    this._n2 = n2;
    this._n3 = n3;
  }

  /**
   * Gets tensor elements for specified indices.
   * <p>
   * Note: If passing in an array, its values are edited in-place and
   * nothing is returned.
   * @param i1 index for 1st dimension.
   * @param i2 index for 2nd dimension.
   * @param i3 index for 3rd dimension.
   * @param a the array { a11, a12, a13, a22, a23, a33 } of tensor elements.
   * @returns the array { a11, a12, a13, a22, a23, a33 } of tensor elements.
   */
  getTensor(i1: number, i2: number, i3: number, a?: number[]): void | number[] {
    const asum: number = this._as[i3][i2][i1];
    let au, av, aw, u1, u2, u3, w1, w2, w3;

    au = this._au[i3][i2][i1];
    aw = this._aw[i3][i2][i1];

    u1 = this._u1[i3][i2][i1];
    u2 = this._u2[i3][i2][i1];
    u3 = EigenTensors3.c3(u1, u2);

    w1 = this._w1[i3][i2][i1];
    w2 = this._w2[i3][i2][i1];
    w3 = EigenTensors3.c3(w1, w2);

    av = asum - au - aw;
    au -= av;
    aw -= av;

    const a11 = au * u1 * u1 + aw * w1 * w1 + av;
    const a12 = au * u1 * u2 + aw * w1 * w1;
    const a13 = au * u1 * u3 + aw * w1 * w3;
    const a22 = au * u2 * u2 + aw * w2 * w2 + av;
    const a23 = au * u2 * u3 + aw * w2 * w3;
    const a33 = au * u3 * u3 + aw * w3 * w3 + av;

    if (a) {
      a[0] = a11;
      a[1] = a12;
      a[2] = a13;
      a[3] = a22;
      a[4] = a23;
      a[5] = a33;
    } else {
      return [ a11, a12, a13, a22, a23, a33 ];
    }
  }

  /**
   * Sets the eigenvalues for the tensor with specified indices.
   * @param i1 index for the 1st dimension.
   * @param i2 index for the 2nd dimension.
   * @param i3 index for the 3rd dimension.
   * @param au eigenvalue au.
   * @param av eigenvalue av.
   * @param aw eigenvalue aw.
   */
  setEigenvalues(i1: number, i2: number, i3: number, au: number, av: number, aw: number): void {
    this._au[i3][i2][i1] = au;
    this._aw[i3][i2][i1] = aw;
    this._as[i3][i2][i1] = au + av + aw;
  }

  /**
   * Gets eigenvalues for the tensor with specified indices.
   * <p>
   * Note: If passing in an array, its values are edited in-place and
   * nothing is returned.
   * @param i1 index for 1st dimension.
   * @param i2 index for 2nd dimension.
   * @param i3 index for 3rd dimension.
   * @param a the array { au, av, aw } of eigenvalues.
   * @returns the array { au, av, aw } of eigenvalues.
   */
  getEigenvalues(i1: number, i2: number, i3: number, a?: number[]): void | number[] {
    const asum = this._as[i3][i2][i1];
    let au, aw;
    au = this._au[i3][i2][i1];
    aw = this._aw[i3][i2][i1];

    if (a) {
      a[0] = au;
      a[1] = asum - au - aw;
      a[2] = aw;
    } else {
      return [
        au,
        asum - au - aw,
        aw
      ];
    }
  }

  /**
   * Gets eigenvalues for all tensors.
   * @param au array of eigenvalues au.
   * @param av array of eigenvalues av.
   * @param aw array of eigenvalues aw.
   */
  getAllEigenvalues(au: number[][][], av: number[][][], aw: number[][][]): void {
    const auvw = new Array<number>(3);

    for (let i3 = 0; i3 < this._n3; ++i3) {
      for (let i2 = 0; i2 < this._n2; ++i2) {
        for (let i1 = 0; i1 < this._n1; ++i1) {
          this.getEigenvalues(i1, i2, i3, auvw);
          au[i3][i2][i1] = auvw[0];
          av[i3][i2][i1] = auvw[1];
          aw[i3][i2][i1] = auvw[2];
        }
      }
    }
  }

  /**
   * Sets the eigenvector u for the tensor with specified indices.
   * <p>
   * The specified vector is assumed to have length one. If the 3rd
   * component is negative, this method stores the negative of the
   * specified vector, so that the 3rd component is positive.
   * @param i1 index for 1st dimension.
   * @param i2 index for 2nd dimension.
   * @param i3 index for 3rd dimension.
   * @param u1 1st component of u.
   * @param u2 2nd component of u.
   * @param u3 3rd component of u.
   */
  setEigenvectorU(i1: number, i2: number, i3: number, u1: number, u2: number, u3: number): void {
    if (u3 < 0.0) {
      u1 = -u1;
      u2 = -u2;
      u3 = -u3;
    }

    this._u1[i3][i2][i1] = u1;
    this._u2[i3][i2][i1] = u2;
  }

  /**
   * Gets the eigenvector u for the tensor with specified indices.
   * <p>
   * Note: If passing in an array, its values are edited in-place and
   * nothing is returned.
   * @param i1 index for 1st dimension.
   * @param i2 index for 2nd dimension.
   * @param i3 index for 3rd dimension.
   * @param u array { u1, u2, u3 } of eigenvector components.
   */
  getEigenvectorU(i1: number, i2: number, i3: number, u?: number[]): void | number[] {
    let u0, u1, u2;

    u0 = this._u1[i3][i2][i1];
    u1 = this._u2[i3][i2][i1];
    u2 = EigenTensors3.c3(u0, u1);

    if (!u) { return [ u0, u1, u2 ]; }

    u[0] = u0;
    u[1] = u1;
    u[2] = u2;
  }

  /**
   * Sets the eigenvector w for the tensor with specified indices.
   * <p>
   * The specified vector is assumed to have length one. If the 3rd
   * component is negative, this method stores the negative of the
   * specified vector, so that the 3rd component is positive.
   * @param i1 index for 1st dimension.
   * @param i2 index for 2nd dimension.
   * @param i3 index for 3rd dimension.
   * @param w1 1st component of w.
   * @param w2 2nd component of w.
   * @param w3 3rd component of w.
   */
  setEigenvectorW(i1: number, i2: number, i3: number, w1: number, w2: number, w3: number): void {
    if (w3 < 0.0) {
      w1 = -w1;
      w2 = -w2;
      w3 = -w3;
    }

    this._w1[i3][i2][i1] = w1;
    this._w2[i3][i2][i1] = w2;
  }

  /**
   * Gets the eigenvector w for the tensor with specified indices.
   * <p>
   * Note: If passing in an array, its values are edited in-place and
   * nothing is returned.
   * @param i1 index for 1st dimension.
   * @param i2 index for 2nd dimension.
   * @param i3 index for 3rd dimension.
   * @param w array { w1, w2, w3 } of eigenvector components.
   */
  getEigenvectorW(i1: number, i2: number, i3: number, w?: number[]): void | number[] {
    let w0, w1, w2;

    w0 = this._w1[i3][i2][i1];
    w1 = this._w2[i3][i2][i1];
    w2 = EigenTensors3.c3(w0, w1);

    if (!w) { return [ w0, w1, w2 ]; }

    w[0] = w0;
    w[1] = w1;
    w[2] = w2;
  }

  /**
   * Gets the eigenvector v for the tensor with specified indices.
   * <p>
   * Note: If passing in an array, its values are edited in-place and
   * nothing is returned.
   * @param i1 index for 1st dimension.
   * @param i2 index for 2nd dimension.
   * @param i3 index for 3rd dimension.
   * @param v array { v1, v2, v3 } of eigenvector components.
   */
  getEigenvectorV(i1: number, i2: number, i3: number, v?: number[]): void | number[] {
    const u = this.getEigenvectorU(i1, i2, i3);
    const w = this.getEigenvectorW(i1, i2, i3);

    // v = w cross u
    const v0 = w[1] * u[2] - w[2] * u[1];
    const v1 = w[2] * u[0] - w[0] * u[2];
    const v2 = w[0] * u[1] - w[1] * u[0];

    if (!v) { return [ v0, v1, v2 ]; }

    v[0] = v0;
    v[1] = v1;
    v[2] = v2;
  }

  /**
   * Sets tensor elements for specified indices.
   * <p>
   * This method first computes an eigen-decomposition of the specified
   * tensor, and then stores the computed eigenvectors and eigenvalues.
   * The eigenvalues are ordered such that au &gt;= av &gt;= aw &gt;= 0.
   * @param i1 index for 1st dimension.
   * @param i2 index for 2nd dimension.
   * @param i3 index for 3rd dimension.
   * @param a array { a11, a12, a13, a22, a23, a33 } of tensor elements.
   */
  setTensor(i1: number, i2: number, i3: number, a: number);

  /**
   * Sets tensor elements for specified indices.
   * <p>
   * This method first computes an eigen-decomposition of the specified
   * tensor, and then stores the computed eigenvectors and eigenvalues.
   * The eigenvalues are ordered such that au &gt;= av &gt;= aw &gt;= 0.
   * @param i1 index for the 1st dimension.
   * @param i2 index for the 2nd dimension.
   * @param i3 index for the 3rd dimension.
   * @param a11 tensor element a11.
   * @param a12 tensor element a12.
   * @param a13 tensor element a13.
   * @param a22 tensor element a22.
   * @param a23 tensor element a23.
   * @param a33 tensor element a33.
   */
  setTensor(i1: number, i2: number, i3: number, a11: number, a12: number, a13: number, a22: number, a23: number, a33: number);

  /**
   * Sets tensor elements for specified indices.
   * <p>
   * This method first computes an eigen-decomposition of the specified
   * tensor, and then stores the computed eigenvectors and eigenvalues.
   * The eigenvalues are ordered such that au &gt;= av &gt;= aw &gt;= 0.
   */
  setTensor(i1: number, i2: number, i3: number, a11: number | number[], a12?: number, a13?: number, a22?: number, a23?: number, a33?: number): void {
    if (a11 instanceof Array) {
      a12 = a11[1];
      a13 = a11[2];
      a22 = a11[3];
      a23 = a11[4];
      a33 = a11[5];
      a11 = a11[0];
    }

    const aa: number[][] = [
      [ a11, a12, a13 ],
      [ a12, a22, a23 ],
      [ a13, a23, a33 ]
    ];

    const vv: number[][] = new Array<number[]>(3);
    for (let i = 0; i < 3; ++i) { vv[i] = new Array<number>(3); }
    const ev: number[] = new Array<number>(3);

    EigenSolver.SolveSymmetric3x3(aa, vv, ev, true);

    const u: number[] = vv[0];
    const w: number[] = vv[2];

    const u1: number = u[0];
    const u2: number = u[1];
    const u3: number = u[2];

    const w1: number = w[0];
    const w2: number = w[1];
    const w3: number = w[2];

    const au = ( ev[0] < 0.0 ) ? 0.0 : ev[0];
    const av = ( ev[1] < 0.0 ) ? 0.0 : ev[1];
    const aw = ( ev[2] < 0.0 ) ? 0.0 : ev[2];

    this.setEigenvectorU(i1, i2, i3, u1, u2, u3);
    this.setEigenvectorW(i1, i2, i3, w1, w2, w3);
    this.setEigenvalues(i1, i2, i3, au, av, aw);
  }
}
