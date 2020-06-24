/**
 * A 4x4 matrix.
 */
import { Vector3 } from './vector3';
import { Point3 } from './point3';
import { Point4 } from './point4';

export class Matrix44 {

  private _m: number[] = new Array<number>(16);

  /**
   * Constructs an identity matrix.
   */
  static AsIdentity(): Matrix44 {
    return new Matrix44(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1);
  }

  /**
   * Constructs a new matrix from an array(16) of values.
   * @param arr an array of values.
   * @param columnMajorOrder true, if array is organized in column-major order; false, if row-major order.
   */
  static FromArray(arr: number[], columnMajorOrder: boolean = true): Matrix44 {
    if (columnMajorOrder) {
      return new Matrix44(
        arr[0], arr[4], arr[8], arr[12],
        arr[1], arr[5], arr[9], arr[13],
        arr[2], arr[6], arr[10], arr[14],
        arr[3], arr[7], arr[11], arr[15]
      );
    } else {
      return new Matrix44(
        arr[0], arr[1], arr[2], arr[3],
        arr[4], arr[5], arr[6], arr[7],
        arr[8], arr[9], arr[10], arr[11],
        arr[12], arr[13], arr[14], arr[15]
      );
    }
  }

  /**
   * Constructs a new matrix from another.
   * @param mat a matrix.
   */
  static FromMatrix44(mat: Matrix44): Matrix44 {
    return Matrix44.FromArray(mat.m);
  }

  /**
   * Constructs a matrix with specified elements.
   * @param m00 the element with (row, col) indices (0, 0)
   * @param m01 the element with (row, col) indices (0, 1)
   * @param m02 the element with (row, col) indices (0, 2)
   * @param m03 the element with (row, col) indices (0, 3)
   * @param m10 the element with (row, col) indices (1, 0)
   * @param m11 the element with (row, col) indices (1, 1)
   * @param m12 the element with (row, col) indices (1, 2)
   * @param m13 the element with (row, col) indices (1, 3)
   * @param m20 the element with (row, col) indices (2, 0)
   * @param m21 the element with (row, col) indices (2, 1)
   * @param m22 the element with (row, col) indices (2, 2)
   * @param m23 the element with (row, col) indices (2, 3)
   * @param m30 the element with (row, col) indices (3, 0)
   * @param m31 the element with (row, col) indices (3, 1)
   * @param m32 the element with (row, col) indices (3, 2)
   * @param m33 the element with (row, col) indices (3, 3)
   */
  constructor(m00: number, m01: number, m02: number, m03: number,
              m10: number, m11: number, m12: number, m13: number,
              m20: number, m21: number, m22: number, m23: number,
              m30: number, m31: number, m32: number, m33: number) {
    this.set(
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33);
  }

  /**
   * Gets the column-major array of values for this matrix.
   */
  get m(): number[] { return this._m; }

  /**
   * Computes the matrix product C = AB.
   * The product may be computed in place.
   */
  private mul(a: number[], b: number[], c: number[]): number[] {

    const a00 = a[0], a01 = a[4], a02 = a[8], a03 = a[12];
    const a10 = a[1], a11 = a[5], a12 = a[9], a13 = a[13];
    const a20 = a[2], a21 = a[6], a22 = a[10], a23 = a[14];
    const a30 = a[3], a31 = a[7], a32 = a[11], a33 = a[15];

    const b00 = b[0], b01 = b[4], b02 = b[8], b03 = b[12];
    const b10 = b[1], b11 = b[5], b12 = b[9], b13 = b[13];
    const b20 = b[2], b21 = b[6], b22 = b[10], b23 = b[14];
    const b30 = b[3], b31 = b[7], b32 = b[11], b33 = b[15];

    c[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    c[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    c[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    c[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    c[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    c[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    c[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    c[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    c[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    c[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    c[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    c[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    c[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    c[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    c[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    c[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

    return c;
  }

  /**
   * Computes the matrix product C = AB'.
   * The product may be computed in place.
   */
  private mult(a: number[], b: number[], c: number[]): number[] {
    const a00 = a[0], a01 = a[4], a02 = a[8], a03 = a[12];
    const a10 = a[1], a11 = a[5], a12 = a[9], a13 = a[13];
    const a20 = a[2], a21 = a[6], a22 = a[10], a23 = a[14];
    const a30 = a[3], a31 = a[7], a32 = a[11], a33 = a[15];

    const b00 = b[0], b01 = b[4], b02 = b[8], b03 = b[12];
    const b10 = b[1], b11 = b[5], b12 = b[9], b13 = b[13];
    const b20 = b[2], b21 = b[6], b22 = b[10], b23 = b[14];
    const b30 = b[3], b31 = b[7], b32 = b[11], b33 = b[15];

    c[0] = a00 * b00 + a01 * b01 + a02 * b02 + a03 * b03;
    c[1] = a10 * b00 + a11 * b01 + a12 * b02 + a13 * b03;
    c[2] = a20 * b00 + a21 * b01 + a22 * b02 + a23 * b03;
    c[3] = a30 * b00 + a31 * b01 + a32 * b02 + a33 * b03;
    c[4] = a00 * b10 + a01 * b11 + a02 * b12 + a03 * b13;
    c[5] = a10 * b10 + a11 * b11 + a12 * b12 + a13 * b13;
    c[6] = a20 * b10 + a21 * b11 + a22 * b12 + a23 * b13;
    c[7] = a30 * b10 + a31 * b11 + a32 * b12 + a33 * b13;
    c[8] = a00 * b20 + a01 * b21 + a02 * b22 + a03 * b23;
    c[9] = a10 * b20 + a11 * b21 + a12 * b22 + a13 * b23;
    c[10] = a20 * b20 + a21 * b21 + a22 * b22 + a23 * b23;
    c[11] = a30 * b20 + a31 * b21 + a32 * b22 + a33 * b23;
    c[12] = a00 * b30 + a01 * b31 + a02 * b32 + a03 * b33;
    c[13] = a10 * b30 + a11 * b31 + a12 * b32 + a13 * b33;
    c[14] = a20 * b30 + a21 * b31 + a22 * b32 + a23 * b33;
    c[15] = a30 * b30 + a31 * b31 + a32 * b32 + a33 * b33;

    return c;
  }

  /**
   * Computes the matrix product C = A'B.
   * The product may be computed in place.
   */
  private tmul(a: number[], b: number[], c: number[]): number[] {
    const a00 = a[0], a01 = a[4], a02 = a[8], a03 = a[12];
    const a10 = a[1], a11 = a[5], a12 = a[9], a13 = a[13];
    const a20 = a[2], a21 = a[6], a22 = a[10], a23 = a[14];
    const a30 = a[3], a31 = a[7], a32 = a[11], a33 = a[15];

    const b00 = b[0], b01 = b[4], b02 = b[8], b03 = b[12];
    const b10 = b[1], b11 = b[5], b12 = b[9], b13 = b[13];
    const b20 = b[2], b21 = b[6], b22 = b[10], b23 = b[14];
    const b30 = b[3], b31 = b[7], b32 = b[11], b33 = b[15];

    c[0] = a00 * b00 + a10 * b10 + a20 * b20 + a30 * b30;
    c[1] = a01 * b00 + a11 * b10 + a21 * b20 + a31 * b30;
    c[2] = a02 * b00 + a12 * b10 + a22 * b20 + a32 * b30;
    c[3] = a03 * b00 + a13 * b10 + a23 * b20 + a33 * b30;
    c[4] = a00 * b01 + a10 * b11 + a20 * b21 + a30 * b31;
    c[5] = a01 * b01 + a11 * b11 + a21 * b21 + a31 * b31;
    c[6] = a02 * b01 + a12 * b11 + a22 * b21 + a32 * b31;
    c[7] = a03 * b01 + a13 * b11 + a23 * b21 + a33 * b31;
    c[8] = a00 * b02 + a10 * b12 + a20 * b22 + a30 * b32;
    c[9] = a01 * b02 + a11 * b12 + a21 * b22 + a31 * b32;
    c[10] = a02 * b02 + a12 * b12 + a22 * b22 + a32 * b32;
    c[11] = a03 * b02 + a13 * b12 + a23 * b22 + a33 * b32;
    c[12] = a00 * b03 + a10 * b13 + a20 * b23 + a30 * b33;
    c[13] = a01 * b03 + a11 * b13 + a21 * b23 + a31 * b33;
    c[14] = a02 * b03 + a12 * b13 + a22 * b23 + a32 * b33;
    c[15] = a03 * b03 + a13 * b13 + a23 * b23 + a33 * b33;

    return c;
  }

  /**
   * Compute the inverse of matrix A.
   *
   * This method is based off of Cramer's Rule for the inverse of a matrix
   * and its implementation follows that described by Streaming SIMD
   * Extensions - Inverse of 4x4 Matrix, Intel Corporation, Techncial
   * Report AP-928.
   * @param a array of matrix A.
   * @returns the inverse of array A.
   */
  private invert(a: number[]): number[] {
    const b: number[] = new Array<number>(16);

    // transpose
    const t00 = a[0], t01 = a[4], t02 = a[8], t03 = a[12];
    const t04 = a[1], t08 = a[2], t12 = a[3], t05 = a[5];
    const t09 = a[6], t13 = a[7], t06 = a[9], t10 = a[10];
    const t14 = a[11], t07 = a[13], t11 = a[14], t15 = a[15];

    // pairs for first 8 elements (cofactors)
    let u00 = t10 * t15,
        u01 = t11 * t14,
        u02 = t09 * t15,
        u03 = t11 * t13,
        u04 = t09 * t14,
        u05 = t10 * t13,
        u06 = t08 * t15,
        u07 = t11 * t12,
        u08 = t08 * t14,
        u09 = t10 * t12,
        u10 = t08 * t13,
        u11 = t09 * t12;

    // first 8 elements (cofactors)
    b[0] = u00 * t05 + u03 * t06 + u04 * t07 - u01 * t05 - u02 * t06 - u05 * t07;
    b[1] = u01 * t04 + u06 * t06 + u09 * t07 - u00 * t04 - u07 * t06 - u08 * t07;
    b[2] = u02 * t04 + u07 * t05 + u10 * t07 - u03 * t04 - u06 * t05 - u11 * t07;
    b[3] = u05 * t04 + u08 * t05 + u11 * t06 - u04 * t04 - u09 * t05 - u10 * t06;
    b[4] = u01 * t01 + u02 * t02 + u05 * t03 - u00 * t01 - u03 * t02 - u04 * t03;
    b[5] = u00 * t00 + u07 * t02 + u08 * t03 - u01 * t00 - u06 * t02 - u09 * t03;
    b[6] = u03 * t00 + u06 * t01 + u11 * t03 - u02 * t00 - u07 * t01 - u10 * t03;
    b[7] = u04 * t00 + u09 * t01 + u10 * t02 - u05 * t00 - u08 * t01 - u11 * t02;

    // pairs for second 8 elements (cofactors)
    u00 = t02 * t07;
    u01 = t03 * t06;
    u02 = t01 * t07;
    u03 = t03 * t05;
    u04 = t01 * t06;
    u05 = t02 * t05;
    u06 = t00 * t07;
    u07 = t03 * t04;
    u08 = t00 * t06;
    u09 = t02 * t04;
    u10 = t00 * t05;
    u11 = t01 * t04;


    // second 8 elements (cofactors)
    b[8] = u00 * t13 + u03 * t14 + u04 * t15 - u01 * t13 - u02 * t14 - u05 * t15;
    b[9] = u01 * t12 + u06 * t14 + u09 * t15 - u00 * t12 - u07 * t14 - u08 * t15;
    b[10] = u02 * t12 + u07 * t13 + u10 * t15 - u03 * t12 - u06 * t13 - u11 * t15;
    b[11] = u05 * t12 + u08 * t13 + u11 * t14 - u04 * t12 - u09 * t13 - u10 * t14;
    b[12] = u02 * t10 + u05 * t11 + u01 * t09 - u04 * t11 - u00 * t09 - u03 * t10;
    b[13] = u08 * t11 + u00 * t08 + u07 * t10 - u06 * t10 - u09 * t11 - u01 * t08;
    b[14] = u06 * t09 + u11 * t11 + u03 * t08 - u10 * t11 - u02 * t08 - u07 * t09;
    b[15] = u10 * t10 + u04 * t08 + u09 * t09 - u08 * t09 - u11 * t10 - u05 * t08;


    // determinant
    let d = t00 * b[0] + t01 * b[1] + t02 * b[2] + t03 * b[3];

    // inverse
    d = 1.0 / d;
    b[0] *= d;
    b[1] *= d;
    b[2] *= d;
    b[3] *= d;
    b[4] *= d;
    b[5] *= d;
    b[6] *= d;
    b[7] *= d;
    b[8] *= d;
    b[9] *= d;
    b[10] *= d;
    b[11] *= d;
    b[12] *= d;
    b[13] *= d;
    b[14] *= d;
    b[15] *= d;
    return b;
  }

  /**
   * Returns a copy (by value) of this matrix.
   * @returns a copy of this matrix.
   */
  clone(): Matrix44 {
    return Matrix44.FromMatrix44(this);
  }

  /**
   * Returns the transpose of this matrix.
   * @returns the transpose of this matrix.
   */
  transpose(): Matrix44 {
    const t: number[] = [
      this._m[0], this._m[4], this._m[8], this._m[12],
      this._m[1], this._m[5], this._m[9], this._m[13],
      this._m[2], this._m[6], this._m[10], this._m[14],
      this._m[3], this._m[7], this._m[11], this._m[15]
    ];
    return Matrix44.FromArray(t);
  }

  /**
   * Replaces this matrix with its transpose.
   * @returns the transpose of this matrix.
   */
  transposeEquals(): Matrix44 {
    this._m = this.transpose().m;
    return this;
  }

  /**
   * Returns the inverse of this matrix.
   * @returns the inverse of this matrix.
   */
  inverse(): Matrix44 {
    return Matrix44.FromArray(this.invert(this._m));
  }

  /**
   * Inverts this matrix.
   * @returns the inverse of this matrix.
   */
  inverseEquals(): Matrix44 {
    this._m = this.invert(Object.assign({}, this._m));
    return this;
  }

  /**
   * Returns the product MA of this matrix M and matrix A.
   * @param a the matrix A.
   * @returns the product MA.
   */
  times(a: Matrix44 | Vector3 | Point3 | Point4): Matrix44 | Vector3 | Point3 | Point4 {
    if (a instanceof Matrix44) {
      return this.timesMatrix44(a);
    } else if (a instanceof Vector3) {
      return this.timesVector3(a);
    } else if (a instanceof Point3) {
      return this.timesPoint3(a);
    } else if (a instanceof Point4) {
      return this.timesPoint4(a);
    } else {
      return this;
    }
  }

  /**
   * Replaces this matrix M with the product MA.
   * @param a the matrix A.
   * @returns the product MA.
   */
  timesEquals(a: Matrix44): Matrix44 {
    this.mul(this.m, a.m, this.m);
    return this;
  }

  /**
   * Sets all elements of this matrix.
   * @param m00 the element with (row, col) indices (0, 0)
   * @param m01 the element with (row, col) indices (0, 1)
   * @param m02 the element with (row, col) indices (0, 2)
   * @param m03 the element with (row, col) indices (0, 3)
   * @param m10 the element with (row, col) indices (1, 0)
   * @param m11 the element with (row, col) indices (1, 1)
   * @param m12 the element with (row, col) indices (1, 2)
   * @param m13 the element with (row, col) indices (1, 3)
   * @param m20 the element with (row, col) indices (2, 0)
   * @param m21 the element with (row, col) indices (2, 1)
   * @param m22 the element with (row, col) indices (2, 2)
   * @param m23 the element with (row, col) indices (2, 3)
   * @param m30 the element with (row, col) indices (3, 0)
   * @param m31 the element with (row, col) indices (3, 1)
   * @param m32 the element with (row, col) indices (3, 2)
   * @param m33 the element with (row, col) indices (3, 3)
   */
  set(m00: number, m01: number, m02: number, m03: number,
      m10: number, m11: number, m12: number, m13: number,
      m20: number, m21: number, m22: number, m23: number,
      m30: number, m31: number, m32: number, m33: number): void {
    this._m[0] = m00;
    this._m[4] = m01;
    this._m[8] = m02;
    this._m[12] = m03;
    this._m[1] = m10;
    this._m[5] = m11;
    this._m[9] = m12;
    this._m[13] = m13;
    this._m[2] = m20;
    this._m[6] = m21;
    this._m[10] = m22;
    this._m[14] = m23;
    this._m[3] = m30;
    this._m[7] = m31;
    this._m[11] = m32;
    this._m[15] = m33;
  }

  /**
   * Returns the product MA of this matrix M and a matrix A.
   * @param a the matrix A.
   * @return the product MA.
   */
  timesMatrix44(a: Matrix44): Matrix44 {
    return Matrix44.FromArray(this.mul(this.m, a.m, new Array<number>(16)), true);
  }

  /**
   * Returns the product Mv of this matrix M and a vector v.
   * Uses only the upper-left 3-by-3 elements of this matrix.
   * @param v the vector v.
   * @return the product Mv.
   */
  timesVector3(v: Vector3): Vector3 {
    const vx = v.x,
          vy = v.y,
          vz = v.z;

    const ux = this.m[0] * vx + this.m[4] * vy + this.m[8] * vz,
          uy = this.m[1] * vx + this.m[5] * vy + this.m[9] * vz,
          uz = this.m[2] * vx + this.m[6] * vy + this.m[10] * vz;

    return new Vector3(ux, uy, uz);
  }

  /**
   * Returns the product Mp of this matrix M and a point p.
   * The coordinate w of the specified point is assume to equal 1.0,
   * and the returned point is homogenized,
   * @param p the point p.
   * @returns the product Mp.
   */
  timesPoint3(p: Point3): Point3 {
    const px = p.x,
          py = p.y,
          pz = p.z;

    let qx = this.m[0] * px + this.m[4] * py + this.m[8] * pz + this.m[12];
    let qy = this.m[1] * px + this.m[5] * py + this.m[9] * pz + this.m[13];
    let qz = this.m[2] * px + this.m[6] * py + this.m[10] * pz + this.m[14];
    const qw = this.m[3] * px + this.m[7] * py + this.m[11] * pz + this.m[15];

    if (qw !== 1.0) {
      const s = 1.0 / qw;
      qx *= s;
      qy *= s;
      qz *= s;
    }
    return new Point3(qx, qy, qz);
  }

  /**
   * Returns the product Mp of this matrix M and a point p.
   * @param p the point p.
   * @returns the  product Mp.
   */
  timesPoint4(p: Point4): Point4 {
    const px = p.x,
          py = p.y,
          pz = p.z,
          pw = p.w;

    const qx = this.m[0] * px + this.m[4] * py + this.m[8] * pz + this.m[12] * pw,
          qy = this.m[1] * px + this.m[5] * py + this.m[9] * pz + this.m[13] * pw,
          qz = this.m[2] * px + this.m[6] * py + this.m[10] * pz + this.m[14] * pw,
          qw = this.m[3] * px + this.m[7] * py + this.m[11] * pz + this.m[15] * pw;

    return new Point4(qx, qy, qz, qw);
  }
}
