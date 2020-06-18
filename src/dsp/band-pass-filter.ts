import { ExtrapolationType } from '../types';
import { Check } from '../utils';
import { FftFilter } from './fft-filter';

/**
 * A multi-dimensional band-pass filter.
 * <p>
 * Filtering is performed using fast Fourier transforms. The result is
 * equivalent to convolution with an ideal symmetric (zero-phase) band-pass
 * filter that has been smoothly tapered to zero.
 * <p>
 * Filter parameters include lower and upper frequencies that define the
 * pass band, the width of the transition from pass band to stop bands,
 * and the maximum error for amplitude in both pass and stop bands.
 * <p>
 * For efficiency, the Fourier transform of the filter may be cached for
 * repeated application to multiple input arrays. A cached transform
 * can be reused while the length of input and output arrays do not
 * change. Because caching consumes memory, it is disabled by default.
 * @module dsp
 */
export class BandPassFilter {

  private _kLower: number;
  private _kUpper: number;
  private _kWidth: number;
  private _amplitudeError: number;

  private _ff1: FftFilter;
  private _ff2: FftFilter;
  private _ff3: FftFilter;

  private _h1: number[];
  private _h2: number[][];
  private _h3: number[][][];

  private _extrapolation: ExtrapolationType = 'ZeroValue';

  private _filterCaching: boolean = false;

  /**
   * Constructs a band-pass filter with specified parameters.
   * @param kLower the lower pass band frequency, in cycles per sample.
   * @param kUpper the upper pass band frequency, in cycles per sample.
   * @param kWidth width of the transition between pass and stop bands.
   * @param amplitudeError approximate bound on amplitude error, a positive fraction.
   */
  constructor(kLower: number, kUpper: number, kWidth: number, amplitudeError: number) {
    Check.argument(0 <= kLower, '0 <= kLower');
    Check.argument(kLower <= kUpper, 'kLower <= kUpper');
    Check.argument(kUpper <= 0.5, 'kUpper <= 0.5');
    Check.argument(kWidth <= kUpper - kLower, 'kWidth <= kUpper - kLower');
    Check.argument(0 < amplitudeError, '0 < amplitudeError');
    Check.argument(amplitudeError < 1, 'amplitudeError < 1');

    this._kLower = kLower;
    this._kUpper = kUpper;
    this._kWidth = kWidth;
    this._amplitudeError = amplitudeError;
  }

  set extrapolation(extrapolation: ExtrapolationType) {
    if (this._extrapolation !== extrapolation) {
      this._extrapolation = extrapolation;
      this._ff1 = null;
      this._ff2 = null;
      this._ff3 = null;
    }
  }

}
