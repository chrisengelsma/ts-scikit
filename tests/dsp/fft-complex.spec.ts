import { expect } from 'chai';
import 'mocha';
import { FftComplex } from '../../src/dsp';
import { ccopy, czero, fill, ramp } from '../../src/utils';

describe('FFT Complex', () => {

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

  const expectNear = (ca: number[], cb: number[]): void => {
    const n1 = ca.length / 2;
    const tolerance = 0.00000001;
    for (let i1 = 0; i1 < n1; ++i1) {
      expect(ca[2 * i1]).to.be.closeTo(cb[2 * i1], tolerance);
      expect(ca[2 * i1 + 1]).to.be.closeTo(cb[2 * i1 + 1], tolerance);
    }
  };

  it('should make round-trip', () => {
    const nmax = 100;
    for (let n = 31; n < nmax; ++n) {
      const nfft = FftComplex.SmallNFFT(n);
      const fft = new FftComplex(nfft);
      const c1: number[] = czero(nfft);
      c1[2] = 1.0;
      const cx: number[] = ccopy(c1);

      fft.complexToComplex(1, cx, cx);

      const ra = 0.0;
      const rb = 2.0 * Math.PI / nfft;

      const amp: number[] = fill(1.0, nfft);
      const phs: number[] = ramp(ra, rb, nfft);
      const cc: number[] = polar(amp, phs);

      expectNear(cc, cx);

      fft.complexToComplex(-1, cx, cx);
      fft.scale(cx, nfft);

      expectNear(c1, cx);
    }
  });

});

