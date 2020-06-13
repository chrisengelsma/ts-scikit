import { expect } from 'chai';
import 'mocha';
import { MathsUtils } from '../../src/utils';

describe('Maths Utilities', () => {

  const EPS = 0.000001;

  it('cosFromSin should pass', () => {
    const a = Math.PI / 2;
    const sa = Math.sin(a);
    const ca = Math.cos(a);

    expect(MathsUtils.cosFromSin(sa, a)).to.be.closeTo(ca, EPS);
  });

  it('toRadians should pass', () => {
    const degrees = [ 0, 45, 90, 180, 360 ];
    const radians = [ 0, Math.PI / 4.0, Math.PI / 2.0, Math.PI, 2 * Math.PI ];

    for (let i = 0; i < degrees.length; ++i) {
      expect(MathsUtils.toRadians(degrees[i])).to.be.closeTo(radians[i], EPS);
    }
  });

  it('toDegrees should pass', () => {
    const degrees = [ 0, 45, 90, 180, 360 ];
    const radians = [ 0, Math.PI / 4.0, Math.PI / 2.0, Math.PI, 2 * Math.PI ];

    for (let i = 0; i < radians.length; ++i) {
      expect(MathsUtils.toDegrees(radians[i])).to.be.closeTo(degrees[i], EPS);
    }
  });
});

