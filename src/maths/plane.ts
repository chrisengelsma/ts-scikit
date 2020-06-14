import { Point3 } from './point3';
import { Vector3 } from './vector3';
import { Matrix44 } from './matrix44';

/**
 * A plane.
 * A plane divides a 3D space into points above it, points below it, and
 * points within it. The signed distance s from a point (x, y, z) to a plane
 * is s = a*x + b*y + c*z + d, where (a, b, c, d) are coefficients that
 * define the plane. Points within the plane satisfy the equation s = 0.
 */
export class Plane {

  // The a-coefficient
  a: number;
  // The b-coefficient
  b: number;
  // The c-coefficient
  c: number;
  // The d-coefficient
  d: number;

  /**
   * Constructs a plane.
   * The plane will contain the specified point p and the orthogonal
   * to the specified normal vector n, which points toward the space above
   * the plane.
   * @param p the point in the plane.
   * @param n the normal vector.
   */
  static FromPointAndNormal(p: Point3, n: Vector3): Plane {
    return new Plane(n.x, n.y, n.z, -(n.x * p.x + n.y * p.y + n.z * p.z));
  }

  /**
   * Constructs a plane with specified coefficients.
   * @param a the coefficient a.
   * @param b the coefficient b.
   * @param c the coefficient c.
   * @param d the coefficient d.
   */
  static FromPlanarCoefficients(a: number, b: number, c: number, d: number): Plane {
    return new Plane(a, b, c, d);
  }

  /**
   * Constructs a copy of the specified plane.
   * @param p the plane.
   */
  static FromPlane(p: Plane): Plane {
    return p.clone();
  }

  constructor(a: number, b: number, c: number, d: number) {
    this.set(a, b, c, d);
  }

  /**
   * The unit-vector normal to this plane.
   * The vector poitns toward the space above the plane.
   */
  get normal(): Vector3 {
    return new Vector3(this.a, this.b, this.c);
  }

  /**
   * Clones this plane.
   * @returns a copy of this plane.
   */
  clone(): Plane {
    return new Plane(this.a, this.b, this.c, this.d);
  }


  /**
   * Returns the signed distnace from this plane to a specified point.
   * Distance is negative for points below the plane, zero for points
   * within the plane, and positive for points above the plane.
   * @param p the point.
   * @returns the signed distance.
   */
  distanceToPoint(p: Point3): number {
    return this.distanceTo(p.x, p.y, p.z);
  }

  /**
   * Returns the signed distnace from this plane to a specified point.
   * Distance is negative for points below the plane, zero for points
   * within the plane, and positive for points above the plane.
   * @param x the x-coordinate of the point.
   * @param y the y-coordinate of the point.
   * @param z the z-coordinate of the point.
   * @returns the signed distance.
   */
  distanceTo(x: number, y: number, z: number): number {
    return this.a * x + this.b * y + this.c * z + this.d;
  }

  /**
   * Transforms this plane, given the specified transform matrix.
   * If the inverse of the transform matrix is konwn, the method
   * {@link #transformWithInverse()} is more efficient.
   *
   * Let M denote the matrix that transforms points p from old to new
   * coordinates; i.e., p' = M*p, where p' denotes a transformed point.
   * In old coordinates, the plane P = (a, b, c, d) satisfies the equation
   * a*x + b*y + c*z + d = 0, for all points p = (x, y, z) within the plane.
   * This method returns a new transformed plane P' = (a',b',c',d') that
   * satisfies the equation a'*x' + b'*y' + c'*z' + d' = 0 for all
   * transformed points p' = (x',y',z') within the transformed plane.
   * @param m the transform matrix.
   */
  transform(m: Matrix44): void {
    this.transformWithInverse(m.inverse());
  }

  /**
   * Transforms this plane, given the inverse of the transform matrix.
   * If the inverse of the transform matrix is known, this method is more
   * more efficient than the method {@link #transform(Matrix44)}.
   * @param inv the inverse of the transform matrix.
   */
  transformWithInverse(inv: Matrix44): void {
    const m = inv.m;
    const a = m[0] * this.a + m[1] * this.b + m[2] * this.c + m[3] * this.d;
    const b = m[4] * this.a + m[5] * this.b + m[6] * this.c + m[7] * this.d;
    const c = m[8] * this.a + m[9] * this.b + m[10] * this.c + m[11] * this.d;
    const d = m[12] * this.a + m[13] * this.b + m[14] * this.c + m[15] * this.d;

    this.set(a, b, c, d);
  }

  /**
   * Sets the coefficients of this plane.
   * @param a the coefficient a.
   * @param b the coefficient b.
   * @param c the coefficient c.
   * @param d the coefficient d.
   */
  public set(a: number, b: number, c: number, d: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;

    this.normalize();
  }

  /**
   * Normalizes this plane's coefficients.
   */
  public normalize(): void {
    const s = 1.0 / Math.sqrt(this.a * this.a + this.b * this.b + this.c * this.c);
    this.a *= s;
    this.b *= s;
    this.c *= s;
    this.d *= s;
  }
}
