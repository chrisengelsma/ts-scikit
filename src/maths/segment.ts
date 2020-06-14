import { Point3 } from './point3';
import { Vector3 } from './vector3';
import { Matrix44 } from './matrix44';

/**
 * A segment of a line.
 */
export class Segment {

  private _a: Point3;
  private _b: Point3;
  private _d: Vector3;

  private static readonly TINY = 1000.0 * Number.EPSILON;

  /**
   * Copies a segment.
   * @param s the segment.
   */
  static FromSegment(s: Segment) {
    return new Segment(s.a, s.b);
  }

  constructor(a: Point3, b: Point3) {
    this._a = a;
    this._b = b;
    this._d = b.minus(a) as Vector3;
  }

  /**
   * Endpoint A.
   */
  get a(): Point3 { return this._a; }

  /**
   * Endpoint B.
   */
  get b(): Point3 { return this._b; }

  /**
   * The vector from endpoint A to B.
   */
  get d(): Vector3 { return this._d; }

  /**
   * The length of this segment.
   */
  get length(): number {
    return this.a.distanceTo(this.b);
  }

  /**
   * Returns a copy of this segment.
   */
  clone(): Segment {
    return Segment.FromSegment(this);
  }

  /**
   * Transforms this segment using matrix M.
   * @param m the matrix.
   */
  transform(m: Matrix44): void {
    this._a = m.times(this._a) as Point3;
    this._b = m.times(this._b) as Point3;
    this._d = this._b.minus(this._a) as Vector3;
  }

  /**
   * Tests this segment for intersection with the specified triangle.
   *
   * If such an intersection exists, this method returns the intersection
   * point.
   * @param xa x-coordinate of triangle vertex a.
   * @param ya y-coordinate of triangle vertex a.
   * @param za z-coordinate of triangle vertex a.
   * @param xb x-coordinate of triangle vertex b.
   * @param yb y-coordinate of triangle vertex b.
   * @param zb z-coordinate of triangle vertex b.
   * @param xc x-coordinate of triangle vertex c.
   * @param yc y-coordinate of triangle vertex c.
   * @param zc z-coordinate of triangle vertex c.
   * @returns the point of intersection; null, if none.
   */
  intersectWithTriangle(xa: number, ya: number, za: number,
                        xb: number, yb: number, zb: number,
                        xc: number, yc: number, zc: number): Point3 {
    const xd = this._d.x,
          yd = this._d.y,
          zd = this._d.z;

    const xba = xb - xa,
          yba = yb - ya,
          zba = zb - za;

    const xca = xc - xa,
          yca = yc - ya,
          zca = zc - za;

    const xp = yd * zca - zd * yca,
          yp = zd * xca - xd * zca,
          zp = xd * yca - yd * xca;

    const a = xba * xp + yba * yp + zba * zp;

    if (-Segment.TINY < a && a < Segment.TINY) { return null; }

    const f = 1.0 / a;

    const xaa = this._a.x - xa,
          yaa = this._a.y - ya,
          zaa = this._a.z - za;

    const u = f * (xaa * xp + yaa * yp + zaa * zp);

    if (u < 0.0 || u > 1.0) { return null; }

    const xq = yaa * zba - zaa * yba,
          yq = zaa * xba - xaa * zba,
          zq = xaa * yba - yaa * xba;

    const v = f * (xd * xq + yd * yq + zd * zq);

    if (v < 0.0 || (u + v) > 1.0) { return null; }

    const t = f * (xca * xq + yca * yq + zca * zq);

    if (t < 0.0 || 1.0 < t) { return null; }

    const w = 1.0 - u - v;

    const xi = w * xa + u * xb + v * xc,
          yi = w * ya + u * yb + v * yc,
          zi = w * za + u * zb + v * zc;

    return new Point3(xi, yi, zi);
  }
}
