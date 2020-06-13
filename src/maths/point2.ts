import { Tuple2 } from './tuple2';
import { Vector2 } from './vector2';

/**
 * A point with 2 coordinates: x and y.
 */
export class Point2 extends Tuple2 {

  constructor(x: number, y: number) {
    super(x, y);
  }

  /**
   * Returns the point q = p + v for this point p and the specified vector v.
   * @param v the vector v.
   * @returns the point q = p + v.
   */
  public plus(v: Vector2): Point2 {
    return new Point2(this.x + v.x, this.y + v.y);
  }

  /**
   * Moves this point p by adding the specified vector v.
   * @param v the vector v.
   * @returns a reference to this point, moved along vector v.
   */
  public plusEquals(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Returns the point or vector q = p - v for this point p.
   * If v is a vector, q is a point translated along vector v.
   * If v is a point, q is the vector difference.
   * @param v the point or vector v.
   * @returns the vector or point q = p - v.
   */
  public minus(v: Vector2 | Point2): Point2 | Vector2 {
    if (v instanceof Vector2) {
      return new Point2(this.x - v.x, this.y - v.y);
    } else {
      return new Vector2(this.x - v.x, this.y - v.y);
    }
  }

  /**
   * Moves this point by subtracting the specified vector v
   * @param v the vector v.
   * @returns a reference to this point, moved along vector v.
   */
  public minusEquals(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Returns an affine combination of this point p and the specified point q.
   * @param a the weight of the point q.
   * @param q the point q.
   * @returns the affine combination (1 - a) * p + a * q.
   */
  public affine(a: number, q: Point2): Point2 {
    const b = 1.0 - a;
    const p = this.clone();
    return new Point2(b * p.x + a * q.x, b * p.y + a * q.y);
  }

  /**
   * Computes the distance between this point p and the specified point q.
   * @param q the point q.
   * @returns the distance |q - p|.
   */
  public distanceTo(q: Point2): number {
    const dx = this.x - q.x;
    const dy = this.y - q.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
