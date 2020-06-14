import { Tuple3 } from './tuple3';

/**
 * A vector with 3 components: x, y, and z.
 */
export class Vector3 extends Tuple3 {

  /**
   * Constructs a new vector with three components.
   * @param x the x-component.
   * @param y the y-component.
   * @param z the z-component.
   */
  constructor(x: number, y: number, z: number) {
    super(x, y, z);
  }

  /**
   * The length of this vector.
   * @returns the length of this vector.
   */
  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * The length of this vector, squared.
   * @returns the length of this vector, squared.
   */
  get lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * Computes the negation -u of this vector u.
   * @returns the negation.
   */
  public negate(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  /**
   * Sets this vector to its negation.
   * @returns a reference to this vector.
   */
  public negateEquals(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  /**
   * Computes the unit vector with the same direction as this vector.
   * @returns the unit vector.
   */
  public normalize(): Vector3 {
    const d = this.length;
    const s = (d > 0.0) ? 1.0 / d : 1.0;
    return new Vector3(this.x * s, this.y * s, this.z * s);
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
    this.z *= s;

    return this;
  }

  /**
   * Returns the vector sum u + v for this vector u
   * @param v the other vector.
   * @returns the vector sum u + v.
   */
  public plus(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * Adds a vector v to this vector u.
   * @param v the other vector.
   * @returns a reference to this vector, after adding vector v.
   */
  public plusEquals(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  /**
   * Returns the vector difference u - v for this vector u.
   * @param v the other vector.
   * @returns the vector difference u - v.
   */
  public minus(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  /**
   * Subtracts a vector v from this vector u.
   * @param v the other vector.
   * @returns a reference to this vector, after subtracting vector v.
   */
  public minusEquals(v: Vector3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  /**
   * Returns the scaled vector s * u for this vector u.
   * @param s the scale factor.
   * @returns the scaled vector.
   */
  public times(s: number): Vector3 {
    return new Vector3(this.x * s, this.y * s, this.z * s);
  }

  /**
   * Scales this vector.
   * @param s the scale factor.
   * @returns a reference to this vector, after scaling.
   */
  public timesEquals(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;

    return this;
  }

  /**
   * Computes the dot product of this vector and the specified vector v.
   * @param v the vector v.
   * @returns the dot product.
   */
  public dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Computes the cross product of this vector and the speficied vector v.
   * @param v the vector v.
   * @returns the cross product.
   */
  public cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x);
  }
}
