import { Check, MathsUtils } from '../utils';

export class Sampling {

  private static readonly DEFAULT_TOLERANCE = 1.0e-6;

  private readonly _n: number;
  private readonly _d: number;
  private readonly _f: number;
  private readonly _t: number;
  private readonly _td: number;

  constructor(n: number, d: number = 1.0, f: number = 0.0, t: number = Sampling.DEFAULT_TOLERANCE) {
    Check.argument(n > 0, 'n > 0');
    Check.argument(d > 0.0, 'd > 0.0');

    this._n = n;
    this._d = d;
    this._f = f;
    this._t = t;
    this._td = t * d;
  }

  /**
   * This sampling's count.
   */
  get count(): number { return this._n; }

  /**
   * This sampling's delta.
   */
  get delta(): number { return this._d; }

  /**
   * The first value of this sampling.
   */
  get first(): number { return this._f; }

  /**
   * The last value of this sampling.
   */
  get last(): number { return this._f + ( this._n - 1 ) * this._d; }

  /**
   * Gets the value v[i] of this sampling at a given index.
   * @param i the index.
   * @returns the value at index i.
   */
  valueAt(i: number): number {
    Check.index(this._n, i);
    return this._f + i * this._d;
  }

  /**
   * Gets this sampling represented as an array of values.
   * @returns this sampling as an array.
   */
  values(): number[] {
    const v = [];
    for (let i = 0; i < this._n; ++i) {
      v.push(this._f + i * this._d);
    }
    return v;
  }

  /**
   * Returns the index of the sample with the specified value.
   * If this sampling has a sample value that equals (to within the sampling
   * tolerance) the specified value, then this method returns the
   * index of that sample. Otherwise, this method returns -1.
   * @param x the value.
   * @returns the index of the matching sample; -1, if none.
   */
  indexOf(x: number): number {
    let i = -1;
    const j = Math.floor(Math.round(( x - this._f ) / this._d));
    if (0 <= j && j < this.count && MathsUtils.AlmostEqual(x, this._f + j * this._d, this._td)) {
      i = j;
    }
    return i;
  }

  /**
   * Returns the index of the sample nearest to the specified value.
   * @param x the value.
   * @returns the index of the nearest sample.
   */
  indexOfNearest(x: number): number {
    let i = Math.round(( x - this._f ) / this._d);
    if (i < 0) { i = 0; }
    if (i >= this._n) { i = this._n - 1; }
    return i;
  }

  /**
   * Returns the value of the sample nearest to the specified value.
   * @param x the value.
   * @returns the value of the nearest sample.
   */
  valueOfNearest(x: number): number {
    return this.valueAt(this.indexOfNearest(x));
  }

  /**
   * Determines whether the specified index is in the bounds of this sampling.
   * An index is in bounds if in the range [0, count - 1] of the first and last
   * sample indices.
   * @param i the index.
   * @returns true, if in bounds; false, otherwise.
   */
  isInBounds(i: number): boolean {
    return 0 <= i && i < this._n;
  }

  /**
   * Determines whether the specified value is in the bounds of this samplineg.
   * A value is in bounds if in the range [first, last] defined by the first and
   * last sample values.
   * @param x the value.
   * @returns true, if in bounds; false, otherwise.
   */
  valueIsInBounds(x: number): boolean {
    return this.first <= x && x <= this.last;
  }

  /**
   * Shifts this sampling.
   * This method returns a new sampling; it does not modify this sampling.
   * @param s the value (shift) to add to this sampling's values.
   * @returns the new sampling.
   */
  shift(s: number): Sampling {
    return new Sampling(this._n, this._d, this._f + s, this._t);
  }

  /**
   * Prepends samples to this sampling.
   * <p>
   * This method returns a new sampling; it does not modify this sampling.
   * @param m the number of new samples
   * @returns the new sampling.
   */
  prepend(m: number): Sampling {
    const n = this._n + m;
    const f = this._f - m * this._d;
    return new Sampling(n, this._d, f, this._t);
  }

  /**
   * Appends samples to this sampling.
   * <p>
   * This method returns a new sampling; it does not modify this sampling.
   * @param m the number of new samples
   * @returns the new sampling.
   */
  append(m: number): Sampling {
    const n = this._n + m;
    return new Sampling(n, this._d, this._f, this._t);
  }

  /**
   * Decimates this sampling.
   * Beginning with the first sample, keeps only every m'th sample, while
   * discarding the others in this sampling. If this sampling has n-values,
   * the new sampling with have 1 + (n - 1) / m values.
   * <p>
   * This method returns a new sampling; it does not modify this sampling.
   * @param m the factor by which to decimate; must be a positive integer.
   * @returns the new sampling.
   */
  decimate(m: number): Sampling {
    Check.argument(Math.floor(m) === m, 'm is an integer');
    Check.argument(m > 0, 'm > 0');
    const n = 1 + ( this._n - 1 ) / m;
    return new Sampling(n, m * this._d, this._f, this._t);
  }

  /**
   * Interpolates this sampling.
   * Inserts m - 1 evenly-spaced samples between each of the samples in this
   * sampling. If this sampling has n-values, the new sampling will have
   * 1 + (n - 1) * m values.
   * <p>
   * This method returns a new sampling; it does not modify this sampling.
   * @param m the factory by which to interpolate, must be a positive integer.
   * @returns the new sampling.
   */
  interpolate(m: number): Sampling {
    Check.argument(Math.floor(m) === m, 'm is an integer');
    Check.argument(m > 0, 'm > 0');
    const n = this._n + ( this._n - 1 ) * ( m - 1 );
    return new Sampling(n, this._d / m, this._f, this._t);
  }
}
