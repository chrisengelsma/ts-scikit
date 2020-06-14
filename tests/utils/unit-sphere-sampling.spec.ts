import { expect } from 'chai';
import 'mocha';
import { UnitSphereSampling } from '../../src/utils';

describe('Unit Sphere Sampling', () => {

  let uss: UnitSphereSampling;

  beforeEach(() => {
    this.uss = new UnitSphereSampling(8);
  });

  const randomPoint = (): number[] => {
    let x = -1.0 + 2.0 * Math.random();
    let y = -1.0 + 2.0 * Math.random();
    let z = -1.0 + 2.0 * Math.random();

    const f = Math.random();

    if (f < 0.1) { x = 0.0; }
    if (0.1 <= f && f < 0.2) { y = 0.0; }
    if (0.2 <= f && f < 0.3) { z = 0.0; }

    const s = 1.0 / Math.sqrt(x * x + y * y + z * z);
    return [ x * s, y * s, z * s ];
  };

  const func = (x: number, y: number, z: number): number => {
    return 0.1 * ( 9.0 * x * x * x - 2.0 * x * x * y + 3 * x * y * y - 4.0 * y * y * y + 2.0 * z * z * z - x * y * z );
  };

  it('should get index from point', () => {
    const uss = this.uss;
    const points: number[][] = [
      [ 1, 2, 1 ],
      [ 1.5, 1.5, 1.5 ],
      [ -1, -1, -1 ],
      [ 1, 1, 1 ],
    ];

    const indices: number[] = [ 95, 85, -85, 85 ];

    for (let ipoint = 0; ipoint < points.length; ++ipoint) {
      const p: number[] = points[ipoint];
      const idx: number = indices[ipoint];
      expect(uss.getIndex(p)).to.equal(idx);
      expect(uss.getIndex(p[0], p[1], p[2])).to.equal(idx);
    }
  });

  it('should get point from index', () => {
    const uss = this.uss;
    const indices: number[] = [ 1, 10, 50 ];
    const points: number[][] = [
      [ 0.0, -1.0, 0.0 ],
      [ -0.6, -0.8, 0.0 ],
      [ -1.0, 0.0, 0.0 ]
    ];

    for (let ipoint = 0; ipoint < indices.length; ++ipoint) {
      const idx: number = indices[ipoint];
      const p: number[] = points[ipoint];
      const q: number[] = uss.getPoint(idx);

      expect(q[0]).to.equal(p[0]);
      expect(q[1]).to.equal(p[1]);
      expect(q[2]).to.equal(p[2]);
    }

  });

  it('should be symmetric', () => {
    const uss = this.uss;
    const mi = uss.maxIndex;
    for (let i = 1, j = -i; i <= mi; ++i, j = -i) {
      const p = uss.getPoint(i);
      const q = uss.getPoint(j);

      expect(p[0] === -q[0]).to.be.true;
      expect(p[1] === -q[1]).to.be.true;
      expect(p[2] === -q[2]).to.be.true;
    }

    const npoint = 10000;
    for (let ipoint = 0; ipoint < npoint; ++ipoint) {
      const p: number[] = randomPoint();
      const q: number[] = [ -p[0], -p[1], -p[2] ];
      const i: number = uss.getIndex(p);
      const j: number = uss.getIndex(q);
      if (p[2] === 0.0) {
        expect(i + j).to.equal(mi + 1);
      } else {
        expect(-i).to.equal(j);
      }
    }
  });

  it('should interpolate', () => {
    const uss = this.uss;
    const mi = this.uss.maxIndex;

    // Tabulate function values for sampled points.
    const nf = 1 + 2 * mi;
    const fi = new Array<number>(nf);

    for (let i = 1; i <= mi; ++i) {
      const p: number[] = uss.getPoint(i);
      const q: number[] = uss.getPoint(-i);
      fi[i] = func(p[0], p[1], p[2]);
      fi[nf - i] = func(q[0], q[1], q[2]);
    }

    // Interpolate and track errors
    let emax: number = 0.0;
    let pmax: number[] = null;
    const npoint = 10000;
    for (let ipoint = 0; ipoint < npoint; ++ipoint) {
      const p: number[] = randomPoint();

      const iabc: number[] = uss.getTriangle(p);
      const wabc: number[] = uss.getWeights(p, iabc);

      let ia: number = iabc[0], ib: number = iabc[1], ic: number = iabc[2];
      const wa: number = wabc[0], wb: number = wabc[1], wc: number = wabc[3];

      if (ia < 0) {
        ia = nf + ia;
        ib = nf + ib;
        ic = nf + ic;
      }

      const fa: number = fi[ia];
      const fb: number = fi[ib];
      const fc: number = fi[ic];

      const f: number = func(p[0], p[1], p[2]);
      const g: number = wa * fa + wb * fb + wc * fc;

      const e: number = Math.abs(g - f);
      if (e > emax) {
        emax = e;
        pmax = p;
      }

    }

    expect(emax).to.equal(0);
    expect(pmax).to.be.null;

  });

  it('should compute triangle', () => {
    const uss = this.uss;
    const npoint = 10000;
    for (let ipoint = 0; ipoint < npoint; ++ipoint) {
      const p: number[] = randomPoint();
      const i: number = uss.getIndex(p);

      const abc: number[] = uss.getTriangle(p);

      const ia: number = abc[0];
      const ib: number = abc[1];
      const ic: number = abc[2];

      expect(i !== ia && i !== ib && i !== ic).to.be.false;
    }
  });

  it('should compute weights', () => {
    const uss = this.uss;

    const points: number[][] = [
      [ 1, 1, 1 ],
      [ 2, 1, 2 ],
      [ 1, 2, 1 ],
      [ -1, -1, -1 ],
    ];

    const expectedWeights: number[][] = [
      [ 0.333333, 0.333333, 0.333333 ],
      [ 0.193365, 0.193365, 0.613269 ],
      [ 0.263195, 0.263195, 0.473611 ],
      [ 0.333333, 0.333333, 0.333333 ],
    ];

    for (let ipoint = 0; ipoint < points.length; ++ipoint) {
      const p = points[ipoint];
      const iabc = uss.getTriangle(p);
      const ia = iabc[0];
      const ib = iabc[1];
      const ic = iabc[2];

      const wabc: number[] = uss.getWeights(p, iabc);
      const wa = wabc[0];
      const wb = wabc[1];
      const wc = wabc[2];

      expect(wa).to.be.closeTo(expectedWeights[ipoint][0], 0.00001);
      expect(wb).to.be.closeTo(expectedWeights[ipoint][1], 0.00001);
      expect(wc).to.be.closeTo(expectedWeights[ipoint][2], 0.00001);

    }
  });

});

