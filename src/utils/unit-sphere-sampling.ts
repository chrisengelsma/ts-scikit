import { Check } from './check';

export class UnitSphereSampling {

  private static readonly ALMOST_ONE:  number = 1.0 - 5.0 * Number.EPSILON;
  private readonly _nbits: number;
  private _npoint: number;
  private _mindex: number;
  private _nindex: number;

  private _m: number;
  private _n: number;
  private _d: number;
  private _od: number;

  private _pu: number[][];
  private _pl: number[][];
  private _ip: number[][];

  constructor(nbits: number = 16) {
    this._nbits = nbits;
    this._init(nbits);
  }

  get countSamples(): number { return this._npoint; }

  get maxIndex(): number { return this._mindex; }

  private _init(nbits: number) {
    Check.argument(nbits >= 4, 'nbits >= 4');
    Check.argument(nbits <= 32, 'nbits <= 32');

    // Sampling of the r-s plane with an n-by-n grid. Compute the
    // largest m such that the number of sample indices fits in a
    // signed integer with the specified number of bits. Note that
    // nbits-1 is the number of bits not counting the sign bit. The
    // upper limit on the largest positive index is 2^(nbits-1)-1.
    // The largest positive index is 1+2*m*(1+m), which also equals
    // the number (nindex) of positive indices.
    const indexLimit: number = ( 1 << ( nbits - 1 ) ) - 1;
    let m = 1;
    while (1 + 2 * m * ( 1 + m ) <= indexLimit) { ++m; }

    this._m = --m;
    this._n = 2 * this._m + 1;

    // Sampling interval and its inverse in the r-s plane.
    this._d = 1.0 / this._m;
    this._od = this._m;

    // Maximum positive index.
    this._mindex = 1 + 2 * this._m * ( 1 + this._m );

    // Constant used for negative indices. Points in upper/lower
    // hemispheres are related by pu[index] = -pl[_nindex - index].
    this._nindex = this._mindex + 1;

    // Number of unique sampled points. The number of unique points on the equator
    // is 4 * m; these points (for which z = 0) appear in the tables for both
    // upper and lower hemispheres. They have both positive and negative
    // indices, and are not counted twice here.
    this._npoint = 2 * this._mindex - 4 * this._m; // = 2 + 4 * _m * _m

    // Tables for points in upper and lower hemispheres.
    this._pu = new Array<number[]>(this._nindex);
    this._pl = new Array<number[]>(this._nindex);

    // Table of point indices.
    this._ip = new Array<number[]>(this._n);
    for (let i = 0; i < this._n; ++i) { this._ip[i] = new Array(this._n); }

    // For all sampled s on flattened octahedron...
    for (let is = 0, js = -this._m, index = 0; is < this._n; ++is, ++js) {

      // Planar coordinate s and |s|.
      const s = js * this._d;
      const as = ( s >= 0.0 ) ? s : -s;

      // For all sampled r on flattened octahedron...
      for (let ir = 0, jr = -this._m; ir < this._n; ++ir, ++jr) {

        // Process only samples in the octahedral diamond corresponding
        // to the upper and lower hemispheres. Other points in the table
        // will be null.
        const jrs = Math.abs(jr) + Math.abs(js);
        if (jrs <= this._m) {

          // Increment and store index in table.
          this._ip[is][ir] = ++index;

          // Planar coordinate r and |r|.
          const r = jr * this._d;
          const ar = ( r >= 0.0 ) ? r : -r;

          // Third coordinate t (t >= 0) on octahedron.
          let t = Math.max(0.0, 1.0 - ar - as);
          if (jrs === this._m) { t = 0.0; }

          // Coordinates of point in upper hemisphere (z >= 0)
          const scale = 1.0 / Math.sqrt(s * s + r * r + t * t);
          const x = r * scale;
          const y = s * scale;
          const z = t * scale;

          const pu = this._pu[index] = new Array(3);
          const pl = this._pl[this._nindex - index] = new Array(3);

          pu[0] = x; pu[1] = y; pu[2] = z;
          pl[0] = -x; pl[1] = -y; pl[2] = -z;
        }
      }
    }
  }

  /**
   * Gets an array { ia, ib, ic } of three sample indices for the spherical
   * triangle that contains the specified point.
   * <p>
   * As viewed from outside the sphere, the sampled points corresponding to
   * the returned indices are ordered counter-clockwise.
   * @param array array { x, y, z } of point coordinates.
   * @returns array of sample indices.
   */
  getTriangle(array: number[]): number[];

  /**
   * Gets an array { ia, ib, ic } of three sample indices for the spherical
   * triangle that contains the specified point.
   * <p>
   * As viewed from outside the sphere, the sampled points corresponding to
   * the returned indices are ordered counter-clockwise.
   * @param x x-coordinate of the point.
   * @param y y-coordinate of the point.
   * @param z z-coordinate of the point.
   * @returns array of sample indices.
   */
  getTriangle(x: number, y: number, z: number): number[];

  /**
   * Gets an array { ia, ib, ic } of three sample indices for the spherical
   * triangle that contains the specified point.
   * <p>
   * As viewed from outside the sphere, the sampled points corresponding to
   * the returned indices are ordered counter-clockwise.
   * @returns array of sample indices.
   */
  getTriangle(x: number | number[], y?: number, z?: number): number[] {
    if (x instanceof Array) {
      y = x[1];
      z = x[2];
      x = x[0];
    }

    // Coordinates in r-s plane in [-1, 1].
    const ax = ( x >= 0.0 ) ? x : -x;
    const ay = ( y >= 0.0 ) ? y : -y;
    const az = ( z >= 0.0 ) ? z : -z;
    const scale = UnitSphereSampling.ALMOST_ONE / ( ax + ay + az );
    const r = x * scale;
    const s = y * scale;

    // Integer grid indices in [0, 2m]. These are the indices of the lower
    // left corner of the square in the grid that contains the point.
    const rn = ( r + 1.0 ) * this._od;
    const sn = ( s + 1.0 ) * this._od;
    let ir = Math.floor(rn);
    let is = Math.floor(sn);

    // Centered integer grid indices in [-m, m]. Useful for determining
    // which quadrant the point lies in, and whether indices lie outside
    // the sampled diamond. Points not outside satisfy |jr| + |js| <= m.
    let jr = ir - this._m;
    let js = is - this._m;

    // Adjust for points exactly on the equator in quadrant 1. The square
    // that contains the point must contain at least one triangle.
    if (jr + js === this._m) {
      if (jr > 0) {
        --jr;
        --ir;
      } else {
        --js;
        --is;
      }
    }

    // Fractional parts in [0, 1). The grid square that contains the point
    // is split into two triangles. Squares in quadrants 1 and 3 have
    // lower-left and upper-right triangles. Squares in quadrants 2 and
    // 4 have upper-left and lower-right triangles. These fractional parts
    // are used to determine which triangle contains the point.
    const fr = rn - ir;
    const fs = sn - is;

    // Indices for sampled points of triangle.
    let ia: number, ib: number, ic: number;

    // If quadrant 1...
    if (jr >= 0 && js >= 0) {
      if (jr + js + 2 > this._m || fr + fs <= 1.0) {
        ia = this._ip[is    ][ir    ]; // lower-left triangle
        ib = this._ip[is    ][ir + 1];
        ic = this._ip[is + 1][ir    ];
      } else {
        ia = this._ip[is + 1][ir + 1]; // upper-right triangle
        ib = this._ip[is + 1][ir    ];
        ic = this._ip[is    ][ir + 1];
      }
    }

    // Else if quadrant 2...
    else if (jr < 0 && js >= 0) {
      if (-jr + js + 1 > this._m || fr >= fs) {
        ia = this._ip[is    ][ir + 1]; // lower-right triangle
        ib = this._ip[is + 1][ir + 1];
        ic = this._ip[is    ][ir    ];
      } else {
        ia = this._ip[is + 1][ir    ]; // upper-left triangle
        ib = this._ip[is    ][ir    ];
        ic = this._ip[is + 1][ir + 1];
      }
    }

    // Else if quadrant 3...
    else if (jr < 0 && js < 0) {
      if (-jr - js > this._m || fr + fs >= 1.0) {
        ia = this._ip[is + 1][ir + 1]; // upper-right triangle
        ib = this._ip[is + 1][ir    ];
        ic = this._ip[is    ][ir + 1];
      } else {
        ia = this._ip[is    ][ir    ]; // lower-left triangle
        ib = this._ip[is    ][ir + 1];
        ic = this._ip[is + 1][ir    ];
      }
    }

    // Else if quadrant 4...
    else {
      if (jr + 1 - js > this._m || fr <= fs) {
        ia = this._ip[is + 1][ir    ]; // upper-left triangle
        ib = this._ip[is    ][ir    ];
        ic = this._ip[is + 1][ir + 1];
      } else {
        ia = this._ip[is    ][ir + 1]; // lower-right triangle
        ib = this._ip[is + 1][ir + 1];
        ic = this._ip[is    ][ir    ];
      }
    }

    // All indices should be non-zero.
    Check.argument(ia !== 0, 'ia !== 0');
    Check.argument(ib !== 0, 'ib !== 0');
    Check.argument(ic !== 0, 'ic !== 0');

    // Signs of indices depend on sign of z. Order the indices so that
    // points are in counter-clockwise order when viewed from outside
    // the sphere.
    return ( z >= 0.0 )
      ? [ ia, ib, ic ]
      : [ ia - this._nindex, ic - this._nindex, ib - this._nindex ];
  }

  /**
   * Gets an array { wa, wb, wc } of three weights for a point in a spherical
   * triangle specified by sample indices of three points.
   * <p>
   * The weights are proportional to volumes of tetrahedra, and are used for
   * interpolation. Weights are non-negative and normalized so that their
   * sum wa + wb + wc = 1.
   * <p>
   * For example, let p denote the specified point with coordinates { x, y, z },
   * and let o denote the center of the sphere with coordinates { 0, 0, 0 }.
   * Then the weight wa is proportional to the volume of the tetrahedron
   * formed by points p, b, c, and o.
   * @param array an array { x, y, z } containing point coordinates.
   * @param iabc array { ia, ib, ic } of sample indices.
   * @returns array { wa, wb, wc } of weights.
   */
  getWeights(array: number[], iabc: number[]): number[];

  /**
   * Gets an array { wa, wb, wc } of three weights for a point in a spherical
   * triangle specified by sample indices of three points.
   * <p>
   * The weights are proportional to volumes of tetrahedra, and are used for
   * interpolation. Weights are non-negative and normalized so that their
   * sum wa + wb + wc = 1.
   * <p>
   * For example, let p denote the specified point with coordinates { x, y, z },
   * and let o denote the center of the sphere with coordinates { 0, 0, 0 }.
   * Then the weight wa is proportional to the volume of the tetrahedron
   * formed by points p, b, c, and o.
   * @param x x-coordinate of the point.
   * @param y y-coordinate of the point.
   * @param z z-coordinate of the point.
   * @param iabc array { ia, ib, ic } of sample indices.
   * @returns array { wa, wb, wc } of weights.
   */
  getWeights(x: number, y: number, z: number, iabc: number[]): number[];

  /**
   * Gets an array { wa, wb, wc } of three weights for a point in a spherical
   * triangle specified by sample indices of three points.
   * <p>
   * The weights are proportional to volumes of tetrahedra, and are used for
   * interpolation. Weights are non-negative and normalized so that their
   * sum wa + wb + wc = 1.
   * <p>
   * For example, let p denote the specified point with coordinates { x, y, z },
   * and let o denote the center of the sphere with coordinates { 0, 0, 0 }.
   * Then the weight wa is proportional to the volume of the tetrahedron
   * formed by points p, b, c, and o.
   * @returns array { wa, wb, wc } of weights.
   */
  getWeights(x: number | number[], y: number | number[], z?: number, iabc?: number[]): number[] {
    if (x instanceof Array && y instanceof Array) {
      iabc = Object.assign([], y);
      y = x[1];
      z = x[2];
      x = x[0];
    }

    const pa: number[] = this.getPoint(iabc[0]);
    const pb: number[] = this.getPoint(iabc[1]);
    const pc: number[] = this.getPoint(iabc[2]);

    const xa: number = pa[0], ya: number = pa[1], za: number = pa[2];
    const xb: number = pb[0], yb: number = pb[1], zb: number = pb[2];
    const xc: number = pc[0], yc: number = pc[1], zc: number = pc[2];

    let wa: number = (x as number) * (yb * zc - yc * zb) + (y as number) * (zb * xc - zc * xb) + z * (xb * yc - xc * yb);
    let wb: number = (x as number) * (yc * za - ya * zc) + (y as number) * (zc * xa - za * xc) + z * (xc * ya - xa * yc);
    let wc: number = (x as number) * (ya * zb - yb * za) + (y as number) * (za * xb - zb * xa) + z * (xa * yb - xb * ya);

    if (wa < 0.0) { wa = 0.0; }
    if (wb < 0.0) { wb = 0.0; }
    if (wc < 0.0) { wc = 0.0; }

    const ws: number = 1.0 / (wa + wb + wc);

    return [ wa * ws, wb * ws, wc * ws ];
  }

  /**
   * Gets the index of the sampled point nearest to the specified point.
   * <p>
   * Here, the nearest sampled point is that nearest on the octahedron.
   * Returns a positive index for points in the upper hemisphere (z &gt;= 0),
   * including points on the equator (z = 0). Returns a negative index for
   * points in the lower hemisphere not on the equator (z &lt; 0).
   * @param array an array of coordinates.
   * @returns the sample index.
   */
  getIndex(array: number[]): number;

  /**
   * Gets the index of the sampled point nearest to the specified point.
   * @param x x-coordinate of the point.
   * @param y y-coordinate of the point.
   * @param z z-coordinate of the point.
   * @returns the sample index.
   */
  getIndex(x: number, y: number, z: number): number;

  /**
   * Gets the index of the sampled point nearest to the specified point.
   * @returns the sample index.
   */
  getIndex(x: number | number[], y?: number, z?: number): number {
    if (x instanceof Array) {
      y = x[1];
      z = x[2];
      x = x[0];
    }

    const ax: number = ( x >= 0.0 ) ? x : -x;
    const ay: number = ( y >= 0.0 ) ? y : -y;
    const az: number = ( z >= 0.0 ) ? z : -z;
    const scale: number = UnitSphereSampling.ALMOST_ONE / (ax + ay + az);
    const r: number = x * scale;
    const s: number = y * scale;
    const ir: number = Math.floor(0.5 + (r + 1.0) * this._od);
    const is: number = Math.floor(0.5 + (s + 1.0) * this._od);
    const index: number = this._ip[is][ir];

    Check.argument(index > 0, 'index > 0');

    return (z >= 0.0) ? index : index - this._nindex;

  }

  /**
   * Gets the sampled point for the specified index, which must be non-zero.
   * <p>
   * For efficiency, returns the array { x, y, z } of point coordinates
   * by reference, not by copy. These coordinates must not be modified.
   * @param index the index of the sampled point; must be non-zero.
   * @returns array { x, y, z } of point coordinates; by reference, not by copy.
   */
  getPoint(index: number): number[] {
    Check.argument(index !== 0, 'index !== 0');
    return ( index >= 0 ) ? this._pu[index] : this._pl[index + this._nindex];
  }

}
