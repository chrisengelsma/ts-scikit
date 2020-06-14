import { Check, MathsUtils } from '../utils';
import { Sampling } from './sampling';

/**
 * A histogram.
 * <p>
 * A histogram summarizes the distribution of values v in an array.
 * The range (vmax - vmin) of values v in the array is partitioned uniformly
 * into some number of bins. Each bin then contains the number of values
 * that lie closest to the center of that bin.
 * <p>
 * If the values v in the array are assumed to be instances of some random
 * variable, then a probability density function may be estimated for that
 * variable by simply dividing the count in each bin by the total number of
 * values in that array. The resulting functions are called the densities.
 * <p>
 * The number of bins may be specified or computed automatically. In the
 * automatic case, we compute bin width as:
 * <pre><code>
 * w = 2.0 * (v75 - v25) / pow(n, 1.0/3.0),
 * </code></pre>
 * where n denotes the number of values, and v25 and v75 are the 25th and
 * 75th percentiles, respectively. The number of bins is then computed by
 * dividing the range (vmax - vmin) of values by that bin width, rounding
 * down to the nearest integer. In this way, the number of bins grows
 * as the cube root of the number of values n.
 * <p>
 * Minimum and maximum values (vmin and vmax) may also be specified or
 * computed automatically. If specified, then only the values in the range
 * [vmin, vmax] are binned, and values outside this range are ignored.
 * <p>
 * Reference: Izenman, A. J., 1991, Recent developments in nonparametric
 * density estimation: Journal of the American Statistical Association,
 * v. 86, p. 205-224.
 */
export class Histogram {

  private _vmin: number;
  private _vmax: number;
  private _computedMinMax: boolean;
  private _sbin: Sampling;
  private _h: number[];
  private _nin: number;
  private _nlo: number;
  private _nhi: number;

  /**
   * Constructs a new histogram.
   * <p>
   * The min and max bin values are computed automatically, unless the user
   * provides a min and max value.
   * @param v    an array of numbers.
   * @param nbin the number of bins.
   * @param vmin the minimum value (optional).
   * @param vmax the maximum value (optional).
   */
  constructor(v: number[], nbin: number, vmin?: number, vmax?: number) {
    this.initMinMax(v, vmin, vmax);
    this.init(v, nbin);
  }

  /**
   * Gets the min value.
   */
  get min(): number { return this._vmin; }

  /**
   * Gets the max value.
   */
  get max(): number { return this._vmax; }

  /**
   * Gets the bin count.
   */
  get binCount(): number { return this._sbin.count; }

  /**
   * Gets the bin delta.
   */
  get binDelta(): number { return this._sbin.delta; }

  /**
   * Gets the first bin value.
   */
  get binFirst(): number { return this._sbin.first; }

  /**
   * Gets the bin sampling.
   */
  get binSampling(): Sampling { return this._sbin; }

  /**
   * Gets the counts.
   */
  get counts(): number[] { return Object.assign({}, this._h); }

  /**
   * Gets the count of values in the range.
   */
  get inCount(): number { return this._nin; }

  /**
   * Gets the count of values too low.
   */
  get lowCount(): number { return this._nlo; }

  /**
   * Gets the count of values too high.
   */
  get highCount(): number { return this._nhi; }

  /**
   * Gets the densities.
   */
  get densities(): number[] {
    const nbin = this.binCount;
    const d: number[] = new Array<number>(nbin);
    const s = 1.0 / this._nin;
    for (let ibin = 0; ibin < nbin; ++ibin) {
      d[ibin] = s * this._h[ibin];
    }
    return d;
  }

  /**
   * Initializes the histogram. If nbin is zero, then this method computes
   * the number of bins.
   */
  private init(v: number[], nbin: number): void {
    let dbin = ( this._vmax - this._vmin ) / Math.max(1, nbin);
    if (dbin === 0.0) {
      dbin = Math.max(1.0, 2.0 * Math.abs(this._vmin) * Number.EPSILON);
    }

    if (nbin === 0) {
      // Must have at least one bin...
      nbin = 1;

      if (this._vmin < this._vmax) {
        const t: number[] = this.trim(v);
        const n = t.length;
        if (n > 0) {
          const k25 = Math.round(0.25 * ( n - 1 ));
          MathsUtils.quickPartialSort(k25, t);
          const v25 = t[k25];
          const k75 = Math.round(0.75 * ( n - 1 ));
          MathsUtils.quickPartialSort(k75, t);
          const v75 = t[k75];

          if (v25 < v75) {
            dbin = 2.0 * ( v75 - v25 ) * Math.pow(n, -1.0 / 3.0);
            nbin = Math.max(1, Math.floor(( this._vmax - this._vmin ) / dbin));
            dbin = ( this._vmax - this._vmin ) / nbin;
          }
        }
      }
    }
    const fbin = this._vmin + 0.5 * dbin;
    this._sbin = new Sampling(nbin, dbin, fbin);

    // Count binned values.
    const vscl = 1.0 / dbin;
    const n = v.length;
    this._nlo = 0;
    this._nhi = 0;
    this._h = new Array<number>(nbin).fill(0);
    this._nin = 0;

    for (let i = 0; i < n; ++i) {
      const vi = v[i];
      if (vi < this._vmin) {
        this._nlo += 1;
      } else if (vi > this._vmax) {
        this._nhi += 1;
      } else {
        let ibin = Math.round(( vi - fbin ) * vscl);
        if (ibin < 0) {
          ibin = 0;
        } else if (ibin >= nbin) {
          ibin = nbin - 1;
        }
        this._h[ibin] += 1;
        this._nin += 1;
      }
    }
  }

  private initMinMax(v: number[], vmin?: number, vmax?: number): void {
    if (vmin && vmax) {
      Check.argument(vmin <= vmax, 'vmin <= vmax');
      this._vmin = vmin;
      this._vmax = vmax;
      this._computedMinMax = false;
    } else {
      const n = v.length;
      this._vmin = this._vmax = v[0];
      for (let i = 1; i < n; ++i) {
        const vi = v[i];
        if (vi < this._vmin) { this._vmin = vi; }
        if (vi > this._vmax) { this._vmax = vi; }
      }
      this._computedMinMax = true;
    }
  }

  private trim(v: number[]): number[] {
    let t: number[];
    if (this._computedMinMax) {
      t = Object.assign([], v);
    } else {
      const n = v.length;
      t = new Array<number>(n);
      let m = 0;
      for (let i = 0; i < n; ++i) {
        const vi = v[i];
        if (this._vmin <= vi && vi <= this._vmax) {
          t[m++] = vi;
        }
      }
      if (m < n) {
        t = MathsUtils.copy(t, m);
      }
    }
    return t;
  }
}
