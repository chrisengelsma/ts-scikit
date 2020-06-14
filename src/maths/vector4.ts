import { Tuple4 } from './tuple4';

/**
 * A vector with 4 components: x, y, and z.
 */
export class Vector4 extends Tuple4 {

  /**
   * Constructs a new vector with three components.
   * @param x the x-component.
   * @param y the y-component.
   * @param z the z-component.
   * @param w the w-component.
   */
  constructor(x: number, y: number, z: number, w: number) {
    super(x, y, z, w);
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
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  /**
   * Computes the negation -u of this vector u.
   * @returns the negation.
   */
  public negate(): Vector4 {
    return new Vector4(-this.x, -this.y, -this.z, -this.w);
  }

  /**
   * Sets this vector to its negation.
   * @returns a reference to this vector.
   */
  public negateEquals(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }

  /**
   * Computes the unit vector with the same direction as this vector.
   * @returns the unit vector.
   */
  public normalize(): Vector4 {
    const d = this.length;
    const s = (d > 0.0) ? 1.0 / d : 1.0;
    return new Vector4(this.x * s, this.y * s, this.z * s, this.w * s);
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
    this.w *= s;

    return this;
  }

  /**
   * Returns the vector sum u + v for this vector u
   * @param v the other vector.
   * @returns the vector sum u + v.
   */
  public plus(v: Vector4): Vector4 {
    return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
  }

  /**
   * Adds a vector v to this vector u.
   * @param v the other vector.
   * @returns a reference to this vector, after adding vector v.
   */
  public plusEquals(v: Vector4): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;

    return this;
  }

  /**
   * Returns the vector difference u - v for this vector u.
   * @param v the other vector.
   * @returns the vector difference u - v.
   */
  public minus(v: Vector4): Vector4 {
    return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
  }

  /*
   * Subtracts a vector v from this vector u.
   * @param v the other vector.
   * @returns a reference to this vector, after subtracting vector v.
   */
  public minusEquals(v: Vector4): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;

    return this;
  }

  /**
   * Returns the scaled vector s * u for this vector u.
   * @param s the scale factor.
   * @returns the scaled vector.
   */
  public times(s: number): Vector4 {
    return new Vector4(this.x * s, this.y * s, this.z * s, this.w * s);
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
    this.w *= s;

    return this;
  }

  /**
   * Gets the angle between this and the provided vector.
   * @param v the vector.
   * @returns the angle (in radians) between the two vectors.
   */
  public angle(v: Vector4): number {
    let dls = this.dot(v) / (this.length * v.length);
    if (dls < -1) {
      dls = -1;
    } else if (dls > 1) {
      dls = 1;
    }
    return Math.acos(dls);
  }

  /**
   * Computes the dot product of this vector and the specified vector v.
   * @param v the vector v.
   * @returns the dot product.
   */
  public dot(v: Vector4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  /**
   * Returns the absolute of this vector.
   * @returns the absolute of this vector.
   */
  public abs(): Vector4 {
    return new Vector4(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z), Math.abs(this.w));
  }

  /**
   * Computes the squared distance between this and a specified vector.
   * @param v the vector.
   * @returns the distance between the vectors, squared.
   */
  public distanceSquared(v: Vector4): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    const dw = this.w - v.w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
  }

  /**
   * Computes the distance between this and a specified vector.
   * @param v the vector.
   * @returns the distance between the vectors.
   */
  public distance(v: Vector4): number {
    return Math.sqrt(this.distanceSquared(v));
  }

}
