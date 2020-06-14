import { Tuple4 } from './tuple4';
import { Point3 } from './point3';
import { Vector3 } from './vector3';

/**
 * A point with 4 coordinates: x, y, z, and w.
 */
export class Point4 extends Tuple4 {

  /**
   * Constructs a new point from a specified 3D point.
   * @param p the 3D point.
   */
  static FromPoint3(p: Point3): Point4 {
    return new Point4(p.x, p.y, p.z, 1.0);
  }

  /**
   * Constructs a new point.
   * @param x the x-coordinate.
   * @param y the y-coordinate.
   * @param z the z-coordinate.
   * @param w the w-coordinate.
   */
  constructor(x: number, y: number, z: number, w: number) {
    super(x, y, z, w);
  }

  /**
   * Returns the point q = p + v for this point p and specified vector v.
   * @param v the vector v.
   * @returns the point q = p + v.
   */
  public plus(v: Vector3): Point4 {
    return new Point4(this.x + v.x, this.y + v.y, this.z + v.z, this.w);
  }

  /**
   * Returns the point q = p - v for this point p and specified vector v.
   * @param v the vector v.
   * @returns the point q = p - v.
   */
  public minus(v: Vector3): Point4 {
    return new Point4(this.x - v.x, this.y - v.y, this.z - v.z, this.w);
  }

  /**
   * Moves this point p by adding the specified vector v.
   * @param v the vector v.
   * @returns a reference to this point q += v, moved.
   */
  public plusEquals(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  /**
   * Moves this point p by subtracting the specified vector v
   * @param v the vector v.
   * @returns a reference to this point q -= v, moved.
   */
  public minusEquals(v: Vector3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  /**
   * Returns the homogenized point equivalent to this point.
   * Homogenization is division of the coordinates (x, y, z, w) by w.
   * @returns the homogenized point.
   */
  public homogenize(): Point4 {
    return new Point4(this.x / this.w, this.y / this.w, this.z / this.w, 1.0);
  }

  /**
   * Homogenizes this point.
   * Homogenization is division of the coordinates (x, y, z, w) by w.
   * @returns a reference to this point, homogenized.
   */
  public homogenizeEquals(): this {
    this.x /= this.w;
    this.y /= this.w;
    this.z /= this.w;
    this.w = 1.0;

    return this;
  }

  /**
   * Returns an affine combination of this point p and the specified point q.
   * @param a the weight of the point q.
   * @param q the point q.
   * @returns the affine combination (1 - a) * p + a * q.
   */
  public affine(a: number, q: Point4): Point4 {
    const b = 1.0 - a;
    const p = this.clone();
    return new Point4(
      b * p.x + a * q.x,
      b * p.y + a * q.y,
      b * p.z + a * q.z,
      b * p.w + a * q.w);
  }
}
