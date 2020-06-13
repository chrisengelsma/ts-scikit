/**
 * A tuple with 3 components: x, y, and z.
 */
export class Tuple3 {

  /// the x-component
  x: number;
  /// the y-component
  y: number;
  /// the z-component
  z: number;

  /**
   * Creates a new tuple from an existing one.
   * @param t the tuple.
   */
  static FromExisting(t: Tuple3): Tuple3 {
    return t.clone();
  }

  /**
   * Constructs a new tuple with three specified components.
   * @param x the x-component.
   * @param y the y-component.
   * @param z the z-component.
   */
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Copies this tuple.
   * @returns a copy of this tuple.
   */
  public clone(): Tuple3 {
    return new Tuple3(this.x, this.y, this.z);
  }

  /**
   * Determines if the components of this tuple equal those of another tuple.
   * @param o the tuple.
   * @returns true, if equals; false, otherwise.
   */
  public equals(o: Tuple3): boolean {
    return (this.x === o.x && this.y === o.y && this.z === o.z);
  }
}
