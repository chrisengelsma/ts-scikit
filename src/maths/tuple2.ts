/**
 * A tuple with 2 components: x and y.
 */
export class Tuple2 {

  /// the x-component
  x: number;
  /// the y-component
  y: number;

  /**
   * Creates a new tuple from an existing one.
   * @param t the tuple.
   */
  static FromExisting(t: Tuple2): Tuple2 {
    return t.clone();
  }

  /**
   * Constructs a new tuple with two specified components.
   * @param x the x-component.
   * @param y the y-component.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Copies this tuple.
   * @returns a copy of this tuple.
   */
  public clone(): Tuple2 {
    return new Tuple2(this.x, this.y);
  }

  /**
   * Determines if the components of this tuple equal those of another tuple.
   * @param o the tuple.
   * @returns true, if equals; false, otherwise.
   */
  public equals(o: Tuple2): boolean {
    return (this.x === o.x && this.y === o.y);
  }
}
