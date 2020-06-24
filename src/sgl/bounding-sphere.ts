import { Check } from '../utils';
import { BoundingBox } from './bounding-box';
import { Point3 } from './point3';

/**
 * A bounding sphere.
 *
 * A bounding sphere may be empty. An empty sphere contains no points.
 * A non-empty sphere contains at least one point. Some attributes,
 * such as the sphere center and radius, are defined only for spheres
 * that are not empty.
 *
 * A bouding sphere may be infinite. An infinite sphere contains all points.
 */
export class BoundingSphere {

  private _x: number;
  private _y: number;
  private _z: number;
  private _r: number;

  /**
   * Constructs an empty sphere.
   */
  static AsEmpty(): BoundingSphere {
    const bs = new BoundingSphere(0, 0, 0, 0);
    bs.setEmpty();
    return bs;
  }

  /**
   * Constructs an infinite sphere.
   */
  static AsInfinite(): BoundingSphere {
    const bs = BoundingSphere.AsEmpty();
    bs.setInfinite();
    return bs;
  }

  /**
   * Constructs a new bounding sphere from a provided center and radius.
   * @param c the center point.
   * @param r the radius.
   */
  static FromParameters(c: Point3, r: number): BoundingSphere {
    return new BoundingSphere(c.x, c.y, c.z, r);
  }

  /**
   * Constructs a new bounding sphere from a bounding box.
   * @param bbox the bounding box.
   */
  static FromBoundingBox(bbox: BoundingBox): BoundingSphere {
    const sphere = BoundingSphere.AsEmpty();
    sphere.expandBy(bbox);
    return sphere;
  }

  /**
   * Constructs a new bounding sphere.
   * @param x the center x-coordinate.
   * @param y the center y-coordinate.
   * @param z the center z-coordinate.
   * @param r the radius.
   */
  constructor(x: number, y: number, z: number, r: number) {
    Check.argument(r >= 0.0, 'r >= 0.0');
    this._x = x;
    this._y = y;
    this._z = z;
    this._r = r;
  }

  /**
   * Gets the center of this bounding sphere.
   */
  get center(): Point3 { return new Point3(this._x, this._y, this._z); }

  /**
   * Gets the radius fo this bounding sphere.
   */
  get radius(): number { return this._r; }

  /**
   * Determines whether this sphere is infinite or not.
   */
  get isInfinite(): boolean { return this._r === Number.POSITIVE_INFINITY; }

  /**
   * Determines whether this sphere is empty or not.
   */
  get isEmpty(): boolean { return this._r < 0.0; }

  /**
   * Expands this bounding sphere to fit the provided feature.
   * @param b the feature by which to expand this sphere.
   */
  expandBy(b: BoundingBox | BoundingSphere | Point3 | Point3[] | number[]): void {
    if (b instanceof BoundingBox) {
      this.expandByBoundingBox(b as BoundingBox);
    } else if (b instanceof BoundingSphere) {
      this.expandByBoundingSphere(b as BoundingSphere);
    } else if (b instanceof Point3) {
      this.expandByPoint(b);
    } else if (b instanceof Array) {
      const n = b.length;
      if (n > 0) {
        if (typeof n[0] === 'number') {
          const xyz: number[] = ( b as number[] );
          Check.argument(b.length % 3 === 0, 'number array length divisible by 3');
          for (let i = 0; i < n; i += 3) {
            this.expandByPoint(new Point3(xyz[i], xyz[i + 1], xyz[i + 2]));
          }
        } else if (b[0] instanceof Point3) {
          for (const point of ( b as Point3[] )) {
            this.expandByPoint(point);
          }
        }
      }
    }
  }

  /**
   * Expands the radius of this bounding sphere by a specified feature.
   * @param b the feature by which to expand this sphere's radius.
   */
  expandRadiusBy(b: BoundingSphere | BoundingBox | Point3): void {
    if (b instanceof BoundingBox) {
      this.expandRadiusByBoundingBox(b as BoundingBox);
    } else if (b instanceof BoundingSphere) {
      this.expandRadiusByBoundingSphere(b as BoundingSphere);
    } else if (b instanceof Point3) {
      this.expandRadiusByPoint(b);
    }
  }

  /**
   * Sets this sphere to an empty sphere.
   * @returns a reference to this sphere.
   */
  setEmpty(): this {
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._r = -1;
    return this;
  }

  /**
   * Sets this sphere to an infinite sphere.
   * @returns a reference to this sphere.
   */
  setInfinite(): this {
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._r = Number.POSITIVE_INFINITY;
    return this;
  }

  /**
   * Expands this sphere to include the specified bounding sphere.
   * <p>
   * Changes only the radius, if necessary, not the center of the sphere.
   * @param bs the bounding sphere.
   */
  expandRadiusByBoundingSphere(bs: BoundingSphere): void {
    if (!this.isInfinite) {
      if (!bs.isInfinite) {
        if (!bs.isEmpty) {
          if (!this.isEmpty) {
            const dx = bs.center.x - this._x,
              dy = bs.center.y - this._y,
              dz = bs.center.z - this._z;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const r = d + bs.radius;
            if (r > this._r) {
              this._r = r;
            }
          } else {
            this._r = bs.radius;
            this._x = bs.center.x;
            this._y = bs.center.y;
            this._z = bs.center.z;
          }
        }
      } else {
        this.setInfinite();
      }
    }
  }

  /**
   * Expands this sphere to include the specified point.
   * <p>
   * Expands only the radius, if necessary, not the center of this sphere.
   * @param p the point.
   */
  expandRadiusByPoint(p: Point3): void {
    if (!this.isInfinite) {
      if (!this.isEmpty) {
        const dx = p.x - this._x,
          dy = p.y - this._y,
          dz = p.z - this._z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > this._r) {
          this._r = d;
        }
      } else {
        this._x = p.x;
        this._y = p.y;
        this._z = p.z;
        this._r = 0.0;
      }
    }
  }

  /**
   * Expands this sphere to include the specified bounding box.
   * <p>
   * Changes only the radius, if necessary, not the center of this sphere.
   * @param bbox the bounding box.
   */
  expandRadiusByBoundingBox(bbox: BoundingBox): void {
    if (!this.isInfinite) {
      if (!bbox.isInfinite) {
        if (!bbox.isEmpty) {
          const pmin = bbox.min;
          const pmax = bbox.max;

          const xmin = pmin.x, ymin = pmin.y, zmin = pmin.z;
          const xmax = pmax.x, ymax = pmax.y, zmax = pmax.z;
          if (!this.isEmpty) {
            for (let i = 0; i < 8; ++i) {
              const x = ( ( i & 1 ) === 0 ) ? xmin : xmax;
              const y = ( ( i & 2 ) === 0 ) ? ymin : ymax;
              const z = ( ( i & 4 ) === 0 ) ? zmin : zmax;
              this.expandRadiusByPoint(new Point3(x, y, z));
            }
          } else {
            const dx = xmax - xmin,
              dy = ymax - ymin,
              dz = zmax - zmin;
            this._r = 0.5 * Math.sqrt(dx * dx + dy * dy + dz * dz);
            this._x = 0.5 * ( xmin + xmax );
            this._y = 0.5 * ( ymin + ymax );
            this._z = 0.5 * ( zmin + zmax );
          }
        }
      } else {
        this.setInfinite();
      }
    }
  }

  /**
   * Expands this sphere to include the specified bounding sphere.
   * <p>
   * Adjusts the sphere center to minimize any increase in radius.
   * @param bs
   */
  expandByBoundingSphere(bs: BoundingSphere): void {
    if (!this.isInfinite) {
      if (!bs.isInfinite) {
        if (!bs.isEmpty) {
          if (!this.isEmpty) {
            let dx = bs.center.x - this._x,
              dy = bs.center.y - this._y,
              dz = bs.center.z - this._z;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d === 0.0 && bs.radius > this._r) {
              this._r = bs.radius;
            } else if (d + bs.radius > this._r) {
              const da = this._r / d;
              const xa = this._x - dx * da,
                ya = this._y - dy * da,
                za = this._z - dz * da;
              const db = bs.radius / d;
              const xb = bs.center.x + dx * db,
                yb = bs.center.y + dy * db,
                zb = bs.center.z + dz * db;
              dx = xb - this._x;
              dy = yb - this._y;
              dz = zb - this._z;

              this._r = Math.sqrt(dx * dx + dy * dy + dz * dz);
              this._x = 0.5 * ( xa + xb );
              this._y = 0.5 * ( ya + yb );
              this._z = 0.5 * ( za + zb );
            }
          } else {
            this._r = bs.radius;
            this._x = bs.center.x;
            this._y = bs.center.y;
            this._z = bs.center.z;
          }
        }
      } else {
        this.setInfinite();
      }
    }
  }

  /**
   * Expands this bounding sphere to include a specified coordinate.
   * <p>
   * Adjusts the sphere center to minimize any increase in radius.
   * @param p the point.
   */
  expandByPoint(p: Point3): void {
    if (!this.isInfinite) {
      if (!this.isEmpty) {
        const dx = p.x - this._x,
          dy = p.y - this._y,
          dz = p.z - this._z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > this._r) {
          const dr = 0.5 * ( d - this._r );
          const ds = dr / d;
          this._x += dx * ds;
          this._y += dy * ds;
          this._z += dz * ds;
          this._r += dr;
        }
      } else {
        this._x = p.x;
        this._y = p.y;
        this._z = p.z;
        this._r = 0.0;
      }
    }
  }

  /**
   * Expands this sphere to include the specified bounding box.
   * <p>
   * Adjusts the sphere center to minimize any increase in radius.
   * @param bbox the bounding box.
   */
  expandByBoundingBox(bbox: BoundingBox): void {
    if (!this.isInfinite) {
      if (!bbox.isInfinite) {
        if (!bbox.isEmpty) {

          let xmin = bbox.xmin;
          let ymin = bbox.ymin;
          let zmin = bbox.zmin;

          let xmax = bbox.xmax;
          let ymax = bbox.ymax;
          let zmax = bbox.zmax;

          if (!this.isEmpty) {
            for (let i = 0; i < 8; i++) {
              let x = ( ( i & 1 ) === 0 ) ? xmin : xmax;
              let y = ( ( i & 2 ) === 0 ) ? ymin : ymax;
              let z = ( ( i & 4 ) === 0 ) ? zmin : zmax;

              const dx = x - this._x;
              const dy = y - this._y;
              const dz = z - this._z;

              const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
              const ds = ( d > 0.0 ) ? this._r / d : this._r;

              x = this._x - dx * ds;
              y = this._y - dy * ds;
              z = this._z - dz * ds;

              if (x < xmin) { xmin = x; }
              if (y < ymin) { ymin = y; }
              if (z < zmin) { zmin = z; }

              if (x > xmax) { xmax = x; }
              if (y > ymax) { ymax = y; }
              if (z > zmax) { zmax = z; }
            }
          }
          const dx = xmax - xmin;
          const dy = ymax - ymin;
          const dz = zmax - zmin;

          this._r = 0.5 * Math.sqrt(dx * dx + dy * dy + dz * dz);
          this._x = 0.5 * ( xmin + xmax );
          this._y = 0.5 * ( ymin + ymax );
          this._z = 0.5 * ( zmin + zmax );
        }
      } else {
        this.setInfinite();
      }
    }
  }

  /**
   * Determines whether this sphere contains the specified point.
   * @param p the point.
   * @returns true, if this sphere contains the point; false, otherwise.
   */
  contains(p: Point3): boolean {
    if (this.isEmpty) { return false; }
    if (this.isInfinite) { return true; }
    const dx = this._x - p.x,
      dy = this._y - p.y,
      dz = this._z - p.z,
      rs = this._r * this._r;
    return dx * dx + dy * dy + dz * dz <= rs;
  }
}
