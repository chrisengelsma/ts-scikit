import { expect } from 'chai';
import 'mocha';
import { Sampling } from '../../src/dsp';

describe('Sampling', () => {

  let s: Sampling;

  beforeEach(() => {
    s = new Sampling(5, 0.5, 2.0, 0.01);
  });

  it('should construct a default sampling', () => {
    const s0: Sampling = new Sampling(10);

    expect(s0.count).to.equal(10);
    expect(s0.first).to.equal(0.0);
    expect(s0.delta).to.equal(1.0);
    expect(s0.last).to.equal(9.0);
  });

  it('should throw error when constructing with negative count', () => {
    expect(() => { new Sampling(-10); }).to.throw('required condition: n > 0');
  });

  it('should throw error when constructing with negative delta', () => {
    expect(() => { new Sampling(10, -1.0); }).to.throw('required condition: d > 0.0');
  });

  it('should get the value from a provided index', () => {
    expect(s.valueAt(0)).to.equal(2.0);
    expect(s.valueAt(1)).to.equal(2.5);
    expect(s.valueAt(2)).to.equal(3.0);
    expect(s.valueAt(3)).to.equal(3.5);
    expect(s.valueAt(4)).to.equal(4.0);
  });

  it('should get the values as an array', () => {
    const vals = s.values();

    expect(vals.length).to.equal(5);

    expect(vals[0]).to.equal(2.0);
    expect(vals[1]).to.equal(2.5);
    expect(vals[2]).to.equal(3.0);
    expect(vals[3]).to.equal(3.5);
    expect(vals[4]).to.equal(4.0);
  });

  it('should throw error when index out of bounds', () => {
    expect(() => { s.valueAt(-1); }).to.throw('index i = -1 < 0');
  });

  it('should get index of provided value', () => {
    expect(s.indexOf(2.0)).to.equal(0);
    expect(s.indexOf(2.5)).to.equal(1);
    expect(s.indexOf(3.0)).to.equal(2);
    expect(s.indexOf(3.5)).to.equal(3);
    expect(s.indexOf(4.0)).to.equal(4);

    expect(s.indexOf(1.5)).to.equal(-1);
    expect(s.indexOf(4.5)).to.equal(-1);
  });

  it('should get index of provided close value', () => {
    const d = 1.0e-4;

    expect(s.indexOf(2.0 + d)).to.equal(0);
    expect(s.indexOf(2.5 + d)).to.equal(1);
    expect(s.indexOf(3.0 + d)).to.equal(2);
    expect(s.indexOf(3.5 + d)).to.equal(3);
    expect(s.indexOf(4.0 + d)).to.equal(4);
  });

  it('should get value nearest the provided value', () => {
    expect(s.valueOfNearest(2.5)).to.equal(2.5);
    expect(s.valueOfNearest(2.4)).to.equal(2.5);
    expect(s.valueOfNearest(2.6)).to.equal(2.5);

    expect(s.valueOfNearest(s.first - 100)).to.equal(s.first);
    expect(s.valueOfNearest(s.last + 100)).to.equal(s.last);
  });

  it('should get index of nearest provided value', () => {
    expect(s.indexOfNearest(2.5)).to.equal(1);
    expect(s.indexOfNearest(2.4)).to.equal(1);
    expect(s.indexOfNearest(2.6)).to.equal(1);

    expect(s.indexOfNearest(s.first - 100)).to.equal(0);
    expect(s.indexOfNearest(s.last + 100)).to.equal(4);
  });

  it('should determine if an index is in bounds', () => {
    expect(s.isInBounds(-1)).to.be.false;
    expect(s.isInBounds(0)).to.be.true;
    expect(s.isInBounds(4)).to.be.true;
    expect(s.isInBounds(5)).to.be.false;
  });

  it('should determine if a value is in bounds', () => {
    expect(s.valueIsInBounds(1.9)).to.be.false;
    expect(s.valueIsInBounds(2.0)).to.be.true;
    expect(s.valueIsInBounds(4.0)).to.be.true;
    expect(s.valueIsInBounds(4.1)).to.be.false;

  });

  it('should shift the sampling', () => {
    const t: Sampling = s.shift(20);

    expect(t.count).to.equal(5);
    expect(t.delta).to.equal(0.5);

    expect(t.valueAt(0)).to.equal(22.0);
    expect(t.valueAt(1)).to.equal(22.5);
    expect(t.valueAt(2)).to.equal(23.0);
    expect(t.valueAt(3)).to.equal(23.5);
    expect(t.valueAt(4)).to.equal(24.0);
  });

  it('should prepend values', () => {
    const t: Sampling = s.prepend(2);

    expect(t.count).to.equal(7);
    expect(t.delta).to.equal(0.5);

    expect(t.valueAt(0)).to.equal(1.0);
    expect(t.valueAt(1)).to.equal(1.5);
    expect(t.valueAt(2)).to.equal(2.0);
    expect(t.valueAt(3)).to.equal(2.5);
    expect(t.valueAt(4)).to.equal(3.0);
    expect(t.valueAt(5)).to.equal(3.5);
    expect(t.valueAt(6)).to.equal(4.0);
  });

  it('should append values', () => {
    const t: Sampling = s.append(2);

    expect(t.count).to.equal(7);
    expect(t.delta).to.equal(0.5);

    expect(t.valueAt(0)).to.equal(2.0);
    expect(t.valueAt(1)).to.equal(2.5);
    expect(t.valueAt(2)).to.equal(3.0);
    expect(t.valueAt(3)).to.equal(3.5);
    expect(t.valueAt(4)).to.equal(4.0);
    expect(t.valueAt(5)).to.equal(4.5);
    expect(t.valueAt(6)).to.equal(5.0);
  });

  it('should decimate values', () => {
    const t: Sampling = s.decimate(2);

    expect(t.first).to.equal(2.0);
    expect(t.last).to.equal(4.0);
    expect(t.delta).to.equal(1.0);
    expect(t.count).to.equal(3);

    expect(t.valueAt(0)).to.equal(2.0);
    expect(t.valueAt(1)).to.equal(3.0);
    expect(t.valueAt(2)).to.equal(4.0);
  });

  it('should throw error when decimating with negative factor', () => {
    expect(() => s.decimate(-1)).to.throw('m > 0');
  });

  it('should throw error when decimating with decimal factor', () => {
    expect(() => s.decimate(1.5)).to.throw('m is an integer');
  });

  it('should interpolate values', () => {
    const t: Sampling = s.interpolate(2);

    expect(t.first).to.equal(2.0);
    expect(t.last).to.equal(4.0);
    expect(t.delta).to.equal(0.25);
    expect(t.count).to.equal(9);

    expect(t.valueAt(0)).to.equal(2.0);
    expect(t.valueAt(1)).to.equal(2.25);
    expect(t.valueAt(2)).to.equal(2.5);
    expect(t.valueAt(3)).to.equal(2.75);
    expect(t.valueAt(4)).to.equal(3.0);
    expect(t.valueAt(5)).to.equal(3.25);
    expect(t.valueAt(6)).to.equal(3.5);
    expect(t.valueAt(7)).to.equal(3.75);
    expect(t.valueAt(8)).to.equal(4.0);
  });

  it('should throw error when interpolating with negative factor', () => {
    expect(() => s.interpolate(-1)).to.throw('m > 0');
  });

  it('should throw error when interpolating with decimal factor', () => {
    expect(() => s.interpolate(1.5)).to.throw('m is an integer');
  });

});
