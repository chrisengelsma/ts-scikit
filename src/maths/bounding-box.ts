import { Point3 } from './point3';
import { Check } from '../utils';
import { BoundingSphere } from './bounding-sphere';

export class BoundingBox {

  private _xmin: number;
  private _xmax: number;
  private _ymin: number;
  private _ymax: number;
  private _zmin: number;
  private _zmax: number;

  /**
   * Constructs an empty bounding box.
   */
  static AsEmpty() {
    const bb: BoundingBox = new BoundingBox(0, 0, 0, 0, 0, 0);
    bb.setEmpty();
    return bb;
  }

  /**
   * Constructs a bounding box defined by two points.
   * The two points represent two of the eight corners of the box.
   * @param p a point.
   * @param q a point.
   */
  static FromCorners(p: Point3, q: Point3) {
    const xmin = Math.min(p.x, q.x);
    const ymin = Math.min(p.y, q.y);
    const zmin = Math.min(p.z, q.z);
    const xmax = Math.max(p.x, q.x);
    const ymax = Math.max(p.y, q.y);
    const zmax = Math.max(p.z, q.z);

    return new BoundingBox(xmin, xmax, ymin, ymax, zmin, zmax);
  }

  /**
   * Constructs a bounding box for a list of points.
   * @param p a list of points.
   */
  static FromPoints(p: Point3[]) {
    const bb = BoundingBox.AsEmpty();
    bb.expandBy(p);
    return bb;
  }

  /**
   * Constructs a new bounding box.
   * @param xmin the minimum x-coordinate of this box.
   * @param xmax the maximum x-coordinate of this box.
   * @param ymin the minimum y-coordinate of this box.
   * @param ymax the maximum y-coordinate of this box.
   * @param zmin the minimum z-coordinate of this box.
   * @param zmax the maximum z-coordinate of this box.
   */
  constructor(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number) {
    Check.argument(xmin <= xmax, 'xmin <= xmax');
    Check.argument(ymin <= ymax, 'ymin <= ymax');
    Check.argument(zmin <= zmax, 'zmin <= zmax');
    this._xmin = xmin;
    this._xmax = xmax;
    this._ymin = ymin;
    this._ymax = ymax;
    this._zmin = zmin;
    this._zmax = zmax;
  }

  get xmin(): number { return this._xmin; }

  get xmax(): number { return this._xmax; }

  get ymin(): number { return this._ymin; }

  get ymax(): number { return this._ymax; }

  get zmin(): number { return this._zmin; }

  get zmax(): number { return this._zmax; }

  get min(): Point3 { return new Point3(this._xmin, this._ymin, this._zmin); }

  get max(): Point3 { return new Point3(this._xmax, this._ymax, this._zmax); }

  /**
   * Determines if this bounding box is empty.
   * @returns true, if empty; false, otherwise.
   */
  get isEmpty(): boolean {
    return ( this._xmin > this._xmax || this._ymin > this._ymax || this._zmin > this._zmax );
  }

  /**
   * Determines if this bounding box is infinite.
   * @returns true, if infinite; false, otherwise.
   */
  get isInfinite(): boolean {
    return (
      this._xmin === Number.NEGATIVE_INFINITY &&
      this._ymin === Number.NEGATIVE_INFINITY &&
      this._zmin === Number.NEGATIVE_INFINITY &&
      this._xmax === Number.POSITIVE_INFINITY &&
      this._ymax === Number.POSITIVE_INFINITY &&
      this._zmax === Number.POSITIVE_INFINITY
    );
  }

  /**
   * Gets the point at a specified corner of this box.
   * <p>
   * The corner is specified by index, an integer between 0 an 7. From
   * least to most significant, the three bits of this index correspond
   * to x, y, and z coordinates of a corner point. A zero bit selects a
   * minimum coordinate; a one bit selects a maximum coordinate.
   * @param index the corner index.
   * @return the corner point.
   */
  getCorner(index: number): Point3 {
    Check.state(!this.isEmpty, 'bounding box is not empty');
    const x = ( ( index & 1 ) === 0 ) ? this._xmin : this._xmax;
    const y = ( ( index & 2 ) === 0 ) ? this._ymin : this._ymax;
    const z = ( ( index & 4 ) === 0 ) ? this._zmin : this._zmax;
    return new Point3(x, y, z);
  }

  /**
   * Expands this box to include the specified features.
   * @param p the features to include in this box.
   */
  expandBy(p: BoundingBox | BoundingSphere | Point3 | Point3[] | number[]): void {
    if (p instanceof Point3) {
      this.expandByPoint(p);
    } else if (p instanceof BoundingSphere) {
      this.expandByBoundingSphere(p as BoundingSphere);
    } else if (p instanceof BoundingBox) {
      this.expandByPoint(new Point3(p.xmin, p.ymin, p.zmin));
      this.expandByPoint(new Point3(p.xmax, p.ymax, p.zmax));
    } else if (p instanceof Array) {
      const n: number = p.length;
      if (n > 0) {
        if (typeof p[0] === 'number') {
          const xyz: number[] = ( p as number[] );
          Check.argument(p.length % 3 === 0, 'number array length divisible by 3');
          for (let i = 0; i < n; i += 3) {
            this.expandByPoint(new Point3(xyz[i], xyz[i + 1], xyz[i + 2]));
          }
        } else if (p[0] instanceof Point3) {
          for (const point of ( p as Point3[] )) {
            this.expandByPoint(point);
          }
        }
      }
    }
  }

  /**
   * Sets this box to an empty box.
   */
  setEmpty(): void {
    this._xmin = Number.POSITIVE_INFINITY;
    this._ymin = Number.POSITIVE_INFINITY;
    this._zmin = Number.POSITIVE_INFINITY;
    this._xmax = Number.NEGATIVE_INFINITY;
    this._ymax = Number.NEGATIVE_INFINITY;
    this._zmax = Number.NEGATIVE_INFINITY;
  }

  /**
   * Sets this box to be an infinite box.
   */
  setInfinite(): void {
    this._xmin = Number.NEGATIVE_INFINITY;
    this._ymin = Number.NEGATIVE_INFINITY;
    this._zmin = Number.NEGATIVE_INFINITY;
    this._xmax = Number.POSITIVE_INFINITY;
    this._ymax = Number.POSITIVE_INFINITY;
    this._zmax = Number.POSITIVE_INFINITY;
  }

  /**
   * Expands thix box to include the specified point.
   * @param p the point.
   */
  expandByPoint(p: Point3): void {
    if (this._xmin > p.x) this._xmin = p.x;
    if (this._ymin > p.y) this._ymin = p.y;
    if (this._zmin > p.z) this._zmin = p.z;

    if (this._xmax < p.x) this._xmax = p.x;
    if (this._ymax < p.y) this._ymax = p.y;
    if (this._zmax < p.z) this._zmax = p.z;
  }

  /**
   * Expands this box by the specified bounding sphere.
   * @param bs the bounding sphere.
   */
  expandByBoundingSphere(bs: BoundingSphere): void {
    if (!bs.isInfinite) {
      if (!bs.isEmpty) {
        const r = bs.radius;
        const c = bs.center;
        const x = c.x;
        const y = c.y;
        const z = c.z;
        if (this._xmin > x - r) { this._xmin = x - r; }
        if (this._ymin > y - r) { this._xmin = y - r; }
        if (this._zmin > z - r) { this._xmin = z - r; }
        if (this._xmax < x + r) { this._xmax = x + r; }
        if (this._ymax < y + r) { this._xmax = y + r; }
        if (this._zmax < z + r) { this._xmax = z + r; }
      }
    } else {
      this.setInfinite();
    }
  }

  /**
   * Determines whether this box contains the specified feature.
   * @param v the feature.
   * @returns true, if this box contains the feature; false, otherwise.
   */
  contains(v: BoundingBox | Point3): boolean {
    if (v instanceof Point3) {
      this.containsPoint(v as Point3);
    } else if (v instanceof BoundingBox) {
      this.containsBoundingBox(v as BoundingBox);
    }
    return false;
  }

  /**
   * Determines whether this box contains the specified point.
   * @param p the point.
   * @returns true, if this box contains the point; false, otherwise.
   */
  containsPoint(p: Point3): boolean {
    return this._xmin <= p.x && p.x <= this._xmax &&
      this._ymin <= p.y && p.y <= this._ymax &&
      this._zmin <= p.z && p.z <= this._zmax;
  }

  /**
   * Determines whether this box contains the specified bounding box.
   * @param bbox the bounding box.
   * @returns true, if this box contains the bounding box; false, otherwise.
   */
  containsBoundingBox(bbox: BoundingBox): boolean {
    return this.containsPoint(bbox.min) && this.containsPoint(bbox.max);
  }

  /**
   * Determines whether this box intersects the specified bounding box.
   * @param bbox the bounding box.
   * @returns true, if intersects; false, otherwise.
   */
  intersects(bbox: BoundingBox): boolean {
    return Math.max(this.xmin, bbox.xmin) <= Math.min(this._xmax, bbox.xmax) &&
      Math.max(this.ymin, bbox.ymin) <= Math.min(this._ymax, bbox.ymax) &&
      Math.max(this.zmin, bbox.zmin) <= Math.min(this._zmax, bbox.zmax);
  }

}
