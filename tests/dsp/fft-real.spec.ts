import { expect } from 'chai';
import 'mocha';
import { FftReal } from '../../src/dsp';
import { ccopy, czero, fill, ramp } from '../../src/utils';

describe('FFT Real', () => {

  const polar = (amp: number[], phase: number[]): number[] => {
    const n1 = amp.length;
    const cz: number[] = czero(n1);
    for (let i1 = 0, ir = 0, ii = 1; i1 < n1; ++i1, ir += 2, ii += 2) {
      const r = amp[i1];
      const a = phase[i1];
      cz[ir] = r * Math.cos(a);
      cz[ii] = r * Math.sin(a);
    }
    return cz;
  };

  const assertComplexEqual = (n1: number, ce: number[], ca: number[]): void => {
    const tolerance = n1 * Number.EPSILON;
    for (let i1 = 0; i1 < n1; ++i1) {
      expect(ce[2 * i1    ]).to.be.closeTo(ca[2 * i1    ], tolerance);
      expect(ce[2 * i1 + 1]).to.be.closeTo(ca[2 * i1 + 1], tolerance);
    }
  };

  const assertRealEqual = (n1: number, re: number[], ra: number[]): void => {
    const tolerance = n1 * Number.EPSILON;
    for (let i1 = 0; i1 < n1; ++i1) {
      expect(re[i1]).to.be.closeTo(ra[i1], tolerance);
    }
  };


  it('should make round-trip', () => {
    const nmax = 100;
    for (let n = 2; n < nmax; ++n) {
      const nfft = FftReal.SmallNFFT(n);
      const fft = new FftReal(nfft);

      const nw = Math.floor(nfft / 2) + 1;

      const c1: number[] = czero(nw);
      const r1: number[] = c1;

      r1[1] = 1.0;

      const rx: number[] = ccopy(r1);
      const cx: number[] = rx;

      fft.realToComplex(1, rx, cx);

      const ra = 0.0;
      const rb = 2.0 * Math.PI / nfft;

      const amp: number[] = fill(1.0, nw);
      const phs: number[] = ramp(ra, rb, nw);
      const cc: number[] = polar(amp, phs);

      assertComplexEqual(nw, cc, cx);

      fft.complexToReal(-1, cx, rx);
      fft.scale(rx, nfft);

      assertRealEqual(nfft, r1, rx);
    }
  });

});

