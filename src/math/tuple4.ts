/**
 * A tuple with 4 components: x, y, z, and w.
 */
export class Tuple4 {

  // The x-component
  x: number;
  // The y-component
  y: number;
  // The z-component
  z: number;
  // The w-component
  w: number;

  /**
   * Creates a new tuple from an existing one.
   * @param t the tuple.
   */
  static FromExisting(t: Tuple4): Tuple4 {
    return t.clone();
  }

  /**
   * Constructs a new tuple with 4 defined components.
   * @param x the x-component.
   * @param y the y-component.
   * @param z the z-component.
   * @param w the w-component.
   */
  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Copies this tuple.
   * @returns a copy of this tuple.
   */
  public clone(): Tuple4 {
    return new Tuple4(this.x, this.y, this.z, this.w);
  }

  /**
   * Determines if the components of this tuple equal those of another tuple.
   * @param o the tuple.
   * @returns true, if equals; false, otherwise.
   */
  public equals(o: Tuple4): boolean {
    return ( this.x === o.x && this.y === o.y && this.z === o.z && this.w === o.w );
  }
}
