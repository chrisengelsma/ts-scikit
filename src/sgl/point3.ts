import { Tuple3 } from './tuple3';
import { Vector3 } from './vector3';

/**
 * A point with 3 coordinates: x, y, and z.
 */
export class Point3 extends Tuple3 {

  /**
   * Constructs a new point.
   * @param x the x-coordinate.
   * @param y the y-coordinate.
   * @param z the z-coordinate.
   */
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }

  /**
   * Returns the point q = p + v for this point p and the specified vector v.
   * @param v the vector v.
   * @returns the point q = p + v.
   */
  public plus(v: Vector3): Point3 {
    return new Point3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * Moves this point p by adding the specified vector v.
   * @param v the vector v.
   * @returns a reference to this point, moved along vector v.
   */
  public plusEquals(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  /**
   * Returns the point or vector q = p - v for this point p.
   * If v is a vector, q is a point translated along vector v.
   * If v is a point, q is the vector difference.
   * @param v the point or vector v.
   * @returns the vector or point q = p - v.
   */
  public minus(v: Vector3 | Point3): Point3 | Vector3 {
    if (v instanceof Vector3) {
      return new Point3(this.x - v.x, this.y - v.y, this.z - v.z);
    } else {
      return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
  }

  /**
   * Moves this point by subtracting the specified vector v
   * @param v the vector v.
   * @returns a reference to this point, moved along vector v.
   */
  public minusEquals(v: Vector3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  /**
   * Returns an affine combination of this point p and the specified point q.
   * @param a the weight of the point q.
   * @param q the point q.
   * @returns the affine combination (1 - a) * p + a * q.
   */
  public affine(a: number, q: Point3): Point3 {
    const b = 1.0 - a;
    const p = this.clone();
    return new Point3(b * p.x + a * q.x,
      b * p.y + a * q.y,
      b * p.z + a * q.z);
  }

  /**
   * Computes the distance between this point p and the specified point q.
   * @param q the point q.
   * @returns the distance |q - p|.
   */
  public distanceTo(q: Point3): number {
    const dx = this.x - q.x;
    const dy = this.y - q.y;
    const dz = this.z - q.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
