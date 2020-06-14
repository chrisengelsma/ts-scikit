import { expect } from 'chai';
import 'mocha';
import { Histogram } from '../../src/dsp';

describe('Histogram', () => {

  it('should construct a default histogram', () => {
    const v: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
    const h: Histogram = new Histogram(v, 5);

    expect(h.min).to.equal(0);
    expect(h.max).to.equal(10);
    expect(h.binDelta).to.equal(2);
    expect(h.binCount).to.equal(5);
    expect(h.binFirst).to.equal(1);

    expect(h.inCount).to.equal(11);
    expect(h.lowCount).to.equal(0);
    expect(h.highCount).to.equal(0);

    expect(h.binSampling.count).to.equal(h.binCount);
    expect(h.binSampling.delta).to.equal(h.binDelta);
    expect(h.binSampling.first).to.equal(h.binFirst);

    const densities = h.densities;
    expect(densities[0]).to.be.closeTo(0.18181818, 0.0000001);
    expect(densities[1]).to.be.closeTo(0.18181818, 0.0000001);
    expect(densities[2]).to.be.closeTo(0.18181818, 0.0000001);
    expect(densities[3]).to.be.closeTo(0.18181818, 0.0000001);
    expect(densities[4]).to.be.closeTo(0.27272727, 0.0000001);

    const counts = h.counts;
    expect(counts[0]).to.equal(2);
    expect(counts[1]).to.equal(2);
    expect(counts[2]).to.equal(2);
    expect(counts[3]).to.equal(2);
    expect(counts[4]).to.equal(3);
  });

  it('should construct with provided min and max', () => {
    const v: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
    const h: Histogram = new Histogram(v, 5, 2, 8);

    expect(h.min).to.equal(2);
    expect(h.max).to.equal(8);
    expect(h.binDelta).to.equal(1.2);
    expect(h.binCount).to.equal(5);
    expect(h.binFirst).to.equal(2.6);

    expect(h.inCount).to.equal(7);
    expect(h.lowCount).to.equal(2);
    expect(h.highCount).to.equal(2);

    const densities = h.densities;
    expect(densities[0]).to.be.closeTo(0.28571428, 0.0000001);
    expect(densities[1]).to.be.closeTo(0.14285714, 0.0000001);
    expect(densities[2]).to.be.closeTo(0.14285714, 0.0000001);
    expect(densities[3]).to.be.closeTo(0.14285714, 0.0000001);
    expect(densities[4]).to.be.closeTo(0.28571428, 0.0000001);

    const counts = h.counts;
    expect(counts[0]).to.equal(2);
    expect(counts[1]).to.equal(1);
    expect(counts[2]).to.equal(1);
    expect(counts[3]).to.equal(1);
    expect(counts[4]).to.equal(2);
  });

  it('should compute number of bins if dbin === 0', () => {
    const h: Histogram = new Histogram([0, 0, 0, 0, 0], 1);
    expect(h.binDelta).to.equal(1.0);
  });

  it('should compute nbins if nbin === 0', () => {
    const h: Histogram = new Histogram([0, 1, 2, 3, 4], 0);
    expect(h.binCount).to.equal(1);
    expect(h.binDelta).to.equal(4);
    expect(h.binFirst).to.equal(2);
    expect(h.counts[0]).to.equal(5);
    expect(h.inCount).to.equal(5);
  });

  it('should trim if no computed min or max', () => {
    const h: Histogram = new Histogram([0, 1, 2, 3, 4], 5, 0, 4);
  });
});
