import { Matrix44 } from './matrix44';
import { Vector3 } from './vector3';
import { Tuple4 } from './tuple4';
import { Check, cosFromSin } from '../utils';
import { Tuple3 } from './tuple3';
import { EulerAngleOrderType } from '../types';

/**
 * A quaternion.
 *
 * Quaternions are vector-like objects of the form w + xi + yj + zk, where
 * w, x, y, and z are real numbers and i, j, and k are imaginary units.
 */
export class Quaternion extends Tuple4 {

  /**
   * Constructs a new quaternion from euler angles of rotation.
   * @param angleX the angle of rotation in the x-axis.
   * @param angleY the angle of rotation in the y-axis.
   * @param angleZ the angle of rotation in the z-axis.
   */
  static FromEulerAngles(angleX: number, angleY: number, angleZ: number): Quaternion {
    const sx = Math.sin(angleX * 0.5);
    const sy = Math.sin(angleY * 0.5);
    const sz = Math.sin(angleZ * 0.5);

    const cx = cosFromSin(sx, angleX * 0.5);
    const cy = cosFromSin(sy, angleY * 0.5);
    const cz = cosFromSin(sz, angleZ * 0.5);

    const cycz = cy * cz;
    const sysz = sy * sz;
    const sycz = sy * cz;
    const cysz = cy * sz;

    return new Quaternion(
      sx * cycz + cx * sysz,
      cx * sycz - sx * cysz,
      cx * cysz + sx * sycz,
      cx * cycz - sx * sysz,
    );
  }

  /**
   * Constructs a new quaternion from a specified matrix.
   * @param mat the matrix.
   */
  static FromMatrix(mat: Matrix44): Quaternion {
    const m = mat.m;
    const trace = m[ 0 ] + m[ 5 ] + m[ 10 ];

    let qx: number;
    let qy: number;
    let qz: number;
    let qw: number;

    if (trace > 0.0) {
      const w4 = Math.sqrt(trace + 1.0) * 2.0;
      qw = w4 / 4.0;
      qx = ( m[ 6 ] - m[ 9 ] ) / w4;
      qy = ( m[ 8 ] - m[ 2 ] ) / w4;
      qz = ( m[ 1 ] - m[ 4 ] ) / w4;
    } else if (( m[ 0 ] > m[ 5 ] ) && ( m[ 0 ] > m[ 10 ] )) {
      const x4 = Math.sqrt(1.0 + m[ 0 ] - m[ 5 ] - m[ 10 ]) * 2.0;
      qw = ( m[ 6 ] - m[ 9 ] ) / x4;
      qx = x4 / 4.0;
      qy = ( m[ 4 ] + m[ 1 ] ) / x4;
      qz = ( m[ 8 ] + m[ 2 ] ) / x4;
    } else if (m[ 5 ] > m[ 10 ]) {
      const y4 = Math.sqrt(1.0 + m[ 5 ] - m[ 0 ] - m[ 10 ]) * 2.0;
      qw = ( m[ 8 ] - m[ 2 ] ) / y4;
      qx = ( m[ 4 ] + m[ 1 ] ) / y4;
      qy = y4 / 4.0;
      qz = ( m[ 9 ] + m[ 6 ] ) / y4;
    } else {
      const z4 = Math.sqrt(1.0 + m[ 10 ] - m[ 0 ] - m[ 5 ]) * 2.0;
      qw = ( m[ 1 ] - m[ 4 ] ) / z4;
      qx = ( m[ 8 ] + m[ 2 ] ) / z4;
      qy = ( m[ 9 ] + m[ 6 ] ) / z4;
      qz = z4 / 4.0;
    }

    return new Quaternion(qx, qy, qz, qw);
  }

  /**
   * Constructs a copy of a specified quaternion.
   * @param q the quaternion.
   */
  static FromQuaternion(q: Quaternion): Quaternion {
    return new Quaternion(q.x, q.y, q.z, q.w);
  }

  /**
   * Constructs a new quaternion.
   * @param x the x-component.
   * @param y the y-component.
   * @param z the z-component.
   * @param w the w-component.
   */
  constructor(x: number, y: number, z: number, w: number) {
    super(x, y, z, w);
  }

  /**
   * Gets the length of this quaternion, squared.
   * @returns the length of this quaternion, squared.
   */
  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  /**
   * Gets the length of this quaternion.
   * @returns the length of this quaternion.
   */
  get length(): number {
    return Math.sqrt(this.lengthSquared);
  }

  /**
   * Adds a specified quaternion to this quaternion.
   * @param q the quaternion to add.
   * @returns a reference to this quaternion, updated.
   */
  public plusEquals(q: Quaternion): this {
    this.x += q.x;
    this.y += q.y;
    this.z += q.z;
    this.w += q.w;
    return this;
  }

  /**
   * Returns the quaternion y = x + q for this quaternion x and specified quaternion q.
   * @param q the quaternion q.
   * @returns the quaternion y = x + q.
   */
  public plus(q: Quaternion): Quaternion {
    return new Quaternion(q.x + this.x, q.y + this.y, q.z + this.z, q.w + this.w);
  }

  /**
   * Subtracts a specified quaternion from this quaternion.
   * @param q the quaternion to subtract.
   * @returns a reference to this quaternion, updated.
   */
  public minusEquals(q: Quaternion): this {
    this.x -= q.x;
    this.y -= q.y;
    this.z -= q.z;
    this.w -= q.w;
    return this;
  }

  /**
   * Returns the quaternion y = x - q for this quaternion x and specified quaternion q.
   * @param q the quaternion q.
   * @returns the quaternion y = x - q.
   */
  public minus(q: Quaternion): Quaternion {
    return new Quaternion(this.x - q.x, this.y - q.y, this.z - q.z, this.w - q.w);
  }

  /**
   * Computes the multiplicative inverse with another quaternion.
   * @param q the quaternion.
   * @returns the multiplicative inverse.
   */
  public timesInverse(q: Quaternion): Quaternion {
    let n = this.lengthSquared;
    n = ( n === 0 ) ? n : 1.0 / n;
    return new Quaternion(
      ( this.x * q.w - this.w * q.x - this.y * q.z + this.z * q.y ) * n,
      ( this.y * q.w - this.w * q.y - this.z * q.x + this.x * q.z ) * n,
      ( this.z * q.w - this.w * q.z - this.x * q.y + this.y * q.x ) * n,
      ( this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z ) * n
    );
  }

  /**
   * Scales this quaternion by a specified value.
   * @param s the scalar value.
   * @returns this quaternion, scaled.
   */
  public times(s: number): Quaternion;

  /**
   * Multiplies this quaternion by a specified quaternion.
   * @param q the quaternion.
   * @returns the product.
   */
  public times(q: Quaternion): Quaternion;

  /**
   * Multiples this quaternion by a vector.
   * <p>
   * The result is the vector rotated by this quaternion.
   * @param v the vector
   * @returns the vector v rotated by this quaternion.
   */
  public times(v: Vector3): Vector3;

  public times(q: Quaternion | Vector3 | number): ( Quaternion | Vector3 ) {
    if (typeof q === 'number') {
      return new Quaternion(this.x * q, this.y * q, this.z * q, this.w * q);
    } else {
      if (q instanceof Quaternion) {
        return new Quaternion(
          this.x * q.w + this.w * q.x + this.y * q.z - this.z * q.y,
          this.y * q.w + this.w * q.y + this.z * q.x - this.x * q.z,
          this.z * q.w + this.w * q.z + this.x * q.y - this.y * q.x,
          this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
        );
      }
      if (q instanceof Vector3) {
        return this.rotateVector(q as Vector3);
      }
    }
  }

  /**
   * Normalizes this quaternion.
   * @returns a reference to this quaternion, normalized.
   */
  public normalizeEquals(): this {
    const l = this.length;
    this.x /= l;
    this.y /= l;
    this.z /= l;
    this.w /= l;
    return this;
  }

  /**
   * Returns the normalized version of this quaternion.
   * @returns this quaternion, normalized.
   */
  public normalize(): Quaternion {
    const l = this.length;
    return new Quaternion(this.x / l, this.y / l, this.z / l, this.w / l);
  }

  /**
   * Computes the dot product of this quaternion with a specified quaternion.
   * @param q the quaternion.
   * @returns the dot product.
   */
  public dot(q: Quaternion): number {
    return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
  }

  /**
   * Returns Euler angles of this quaternion.
   * @param order the order of angles to return (default is XYZ).
   * @returns this quaternion as an Euler vector.
   */
  public toEuler(order: EulerAngleOrderType = 'XYZ'): Tuple3 {
    const x = Math.atan2(2.0 * ( this.x * this.w - this.y * this.z ), 1.0 - 2.0 * ( this.x * this.x + this.y * this.y ));
    const y = Math.asin(2.0 * ( this.x * this.z + this.y * this.w ));
    const z = Math.atan2(2.0 * ( this.z * this.w - this.x * this.y ), 1.0 - 2.0 * ( this.y * this.y + this.z * this.z ));
    switch (order) {
      case 'XYZ':
        return new Tuple3(x, y, z);
      case 'ZYX':
        return new Tuple3(z, y, x);
      default:
        return new Tuple3(y, z, x);
    }
  }

  /**
   * Returns this quaternion as a matrix.
   * @returns the matrix.
   */
  public toMatrix(): Matrix44 {
    const w2 = this.w * this.w,
      x2 = this.x * this.x,
      y2 = this.y * this.y,
      z2 = this.z * this.z,
      zw = this.z * this.w,
      xy = this.x * this.y,
      xz = this.x * this.z,
      yw = this.y * this.w,
      yz = this.y * this.z,
      xw = this.x * this.w;

    const m00 = w2 + x2 - z2 - y2,
      m01 = xy + zw + zw + xy,
      m02 = xz - yw + xz - yw,
      m03 = 0.0,
      m10 = -zw + xy - zw + xy,
      m11 = y2 - z2 + w2 - x2,
      m12 = yz + yz + xw + xw,
      m13 = 0.0,
      m20 = yw + xz + xz + yw,
      m21 = yz + yz - xw - xw,
      m22 = z2 - y2 - x2 + w2,
      m23 = 0.0,
      m30 = 0.0,
      m31 = 0.0,
      m32 = 0.0,
      m33 = 0.0;

    return new Matrix44(
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33);
  }

  /**
   * Returns this quaternion as a rotational matrix.
   * @returns the rotational matrix.
   */
  public toRotationMatrix(): Matrix44 {
    const xy = this.x * this.y,
      xz = this.x * this.z,
      xw = this.x * this.w,
      yz = this.y * this.z,
      yw = this.y * this.w,
      zw = this.z * this.w,
      x2 = this.x * this.x,
      y2 = this.y * this.y,
      z2 = this.z * this.z;

    const m00 = 1.0 - 2.0 * ( y2 + z2 ),
      m01 = 2.0 * ( xy - zw ),
      m02 = 2.0 * ( xz + yw ),
      m03 = 0.0,
      m10 = 2.0 * ( xy + zw ),
      m11 = 1.0 - 2.0 * ( x2 + z2 ),
      m12 = 2.0 * ( yz - xw ),
      m13 = 0.0,
      m20 = 2.0 * ( xz - yw ),
      m21 = 2.0 * ( yz + xw ),
      m22 = 1.0 - 2.0 * ( x2 + y2 ),
      m23 = 0.0,
      m30 = 0.0,
      m31 = 0.0,
      m32 = 0.0,
      m33 = 0.0;

    return new Matrix44(
      m00, m01, m02, m03,
      m10, m11, m12, m13,
      m20, m21, m22, m23,
      m30, m31, m32, m33
    );
  }

  /**
   * Computes the spherical linear interpolation with a specified quaternion.
   * <p>
   * Slerp refers to constant-speed motion along a unit-radius great circle
   * arc, given the ends and an interpolation parameter between 0 and 1.
   * @param q a quaternion.
   * @param t an interpolation parameter in the range [0, 1]
   */
  public slerp(q: Quaternion, t: number): Quaternion {
    Check.argument(t >= 0 && t <= 1, 't is in range [0, 1]');

    const q0 = this.normalize();
    const q1 = q.normalize();

    const cosom = q0.x * q1.x + q0.y * q1.y + q0.z * q1.z + q0.w * q1.w;
    const absCosom = Math.abs(cosom);

    let scale0, scale1;

    if (1.0 - absCosom > 1E-6) {
      const sinSqr = 1.0 - absCosom * absCosom;
      const sinom = 1.0 / Math.sqrt(sinSqr);
      const omega = Math.atan2(sinSqr * sinom, absCosom);
      scale0 = Math.sin(( 1.0 - t ) * omega) * sinom;
      scale1 = Math.sin(t * omega) * sinom;
    } else {
      scale0 = 1.0 - t;
      scale1 = t;
    }

    scale1 = cosom >= 0.0 ? scale1 : -scale1;
    return new Quaternion(
      scale0 * q0.x + scale1 * q1.x,
      scale0 * q0.y + scale1 * q1.y,
      scale0 * q0.z + scale1 * q1.z,
      scale0 * q0.w + scale1 * q1.w
    );

  }

  private rotateVector(other: Vector3): Vector3 {
    const q = new Vector3(this.x, this.y, this.z);
    const cross1 = q.cross(other);
    const cross2 = q.cross(cross1);
    const c1w = cross1.times(this.w);
    const c1w2 = c1w.plus(cross2);
    const c1w22 = c1w2.times(2.0);
    return other.plus(c1w22);
  }

}
