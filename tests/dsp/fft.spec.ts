import { expect } from 'chai';
import 'mocha';
import { Fft, Sampling } from '../../src/dsp';

describe('FFT', () => {

  // const _complex = [ true, false ];
  // const _overwrite = [ true, false ];
  // const _center = [ true, false ];
  // const _padding = [ 0, 4 ];
  // const _count = [ 0, 4, 5 ];
  // const _delta = [ 1.0, 2.0 ];
  // const _first = [ 0.0, 1.0 ];
  const _complex = [ false ];
  const _overwrite = [ true ];
  const _center = [ true ];
  const _padding = [ 0 ];
  const _count = [ 4 ];
  const _delta = [ 1.0 ];
  const _first = [ 0.0 ];

  const randarray = (n: number, complex: boolean): number[] => {
    const m = ( complex ) ? 2 : 1;
    const array = new Array<number>(m * n);
    for (let i = 0; i < m * n; ++i) {
      array[i] = Math.random();
    }
    return array;
  };

  const _test1 = (complex: boolean, overwrite: boolean,
                  center: boolean, padding: number,
                  n1: number, d1: number, f1: number): void => {
    if (n1 <= 0) { return; }
    const s1: Sampling = new Sampling(n1, d1, f1);
    const fft: Fft = new Fft(s1);
    fft.complex = complex;
    fft.overwrite = overwrite;
    fft.center = center;
    fft.padding = padding;
    const f = ( complex ) ? randarray(n1, true) : randarray(n1, false);
    const g = fft.applyForward(f);
    const h = fft.applyInverse(g);
    if (complex) {
      expectComplexEqual(n1, f, h);
    } else {
      expectRealEqual(n1, f, h);
    }
  };

  const expectComplexEqual = (n1: number, ce: number[], ca: number[]): void => {
    const tolerance = n1 * Number.EPSILON;
    for (let i1 = 0; i1 < n1; ++i1) {
      expect(ce[2 * i1]).to.be.closeTo(ca[2 * i1], tolerance);
      expect(ce[2 * i1 + 1]).to.be.closeTo(ca[2 * i1 + 1], tolerance);
    }
  };

  const expectRealEqual = (n1: number, re: number[], ra: number[]): void => {
    const tolerance = n1 * Number.EPSILON;
    for (let i1 = 0; i1 < n1; ++i1) {
      expect(re[i1]).to.be.closeTo(ra[i1], tolerance);
    }
  };

  const label1 = (complex: boolean, overwrite: boolean,
                  center: boolean, padding: number,
                  n1: number, d1: number, f1: number,
                  dim: number): string => {
    let l = 'should apply forward FFT ';
    l += `on a ${ complex ? 'complex' : 'real'},${ center ? ' centered,' : '' } ${ dim }D array `;
    l += `padded with ${ padding } samples, with sampling count ${ n1 }, delta ${ d1 } and first value ${ f1 }`;
    return l;
  }

  describe('1D forward FFT', () => {

    for (const complex of _complex) {
      for (const overwrite of _overwrite) {
        for (const center of _center) {
          for (const padding of _padding) {
            for (const n1 of _count) {
              for (const d1 of _delta) {
                for (const f1 of _first) {
                  xit(label1(complex, overwrite, center, padding, n1, d1, f1, 1), () => {
                    _test1(complex, overwrite, center, padding, n1, d1, f1);
                  });
                }
              }
            }
          }
        }
      }
    }
  });


});

