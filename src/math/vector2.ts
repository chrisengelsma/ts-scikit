import { Tuple2 } from './tuple2';

/**
 * A vector with 2 components: x and y.
 */
export class Vector2 extends Tuple2 {

  /**
   * Constructs a new vector with two components.
   * @param x the x-component.
   * @param y the y-component.
   */
  constructor(x: number, y: number) {
    super(x, y);
  }

  /**
   * The length of this vector.
   * @returns the length of this vector.
   */
  get length(): number {
    return Math.sqrt(this.lengthSquared);
  }

  /**
   * The length of this vector, squared.
   * @returns the length of this vector, squared.
   */
  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Computes the negation -u of this vector u.
   * @returns the negation.
   */
  public negate(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  /**
   * Sets this vector to its negation.
   * @returns a reference to this vector.
   */
  public negateEquals(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * Computes the unit vector with the same direction as this vector.
   * @returns the unit vector.
   */
  public normalize(): Vector2 {
    const d = this.length;
    const s = (d > 0.0) ? 1.0 / d : 1.0;
    return new Vector2(this.x * s, this.y * s);
  }

  /**
   * Sets this vector to its unit vector.
   * @returns a reference to this vector.
   */
  public normalizeEquals(): this {
    const d = this.length;
    const s = (d > 0.0) ? 1.0 / d : 1.0;

    this.x *= s;
    this.y *= s;

    return this;
  }

  /**
   * Returns the vector sum u + v for this vector u
   * @param v the other vector.
   * @returns the vector sum u + v.
   */
  public plus(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Adds a vector v to this vector u.
   * @param v the other vector.
   * @returns a reference to this vector, after adding vector v.
   */
  public plusEquals(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  /**
   * Returns the vector difference u - v for this vector u.
   * @param v the other vector.
   * @returns the vector difference u - v.
   */
  public minus(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Subtracts a vector v from this vector u.
   * @param v the other vector.
   * @returns a reference to this vector, after subtracting vector v.
   */
  public minusEquals(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  /**
   * Returns the scaled vector s * u for this vector u.
   * @param s the scale factor.
   * @returns the scaled vector.
   */
  public times(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  /**
   * Scales this vector.
   * @param s the scale factor.
   * @returns a reference to this vector, after scaling.
   */
  public timesEquals(s: number): this {
    this.x *= s;
    this.y *= s;

    return this;
  }

  /**
   * Computes the dot product of this vector and the specified vector v.
   * @param v the vector v.
   * @returns the dot product.
   */
  public dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }
}
