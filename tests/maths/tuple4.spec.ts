import { expect } from 'chai';
import 'mocha';
import { Tuple4 } from '../../src/maths';

describe('Tuple4', () => {
  it('should construct values', () => {
    const t = new Tuple4(1, 2, 3, 4);
    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
    expect(t.z).to.equal(3);
    expect(t.w).to.equal(4);
  });

  it('should equal same tuple3', () => {
    const t = new Tuple4(1, 2, 3, 4);
    const u = new Tuple4(1, 2, 3, 4);

    expect(t.equals(u)).to.be.true;
  });

  it('should clone', () => {
    const t = new Tuple4(1, 2, 3, 4);
    const u = t.clone();

    t.x = 5;
    t.y = 6;
    t.z = 7;
    t.w = 8;

    expect(u.x).to.equal(1);
    expect(u.y).to.equal(2);
    expect(u.z).to.equal(3);
    expect(u.w).to.equal(4);

    expect(t.x).to.equal(5);
    expect(t.y).to.equal(6);
    expect(t.z).to.equal(7);
    expect(t.w).to.equal(8);
  });

  it('should construct copy', () => {
    const t = new Tuple4(1, 2, 3, 4);
    const u = Tuple4.FromExisting(t);

    expect(u.x).to.equal(1);
    expect(u.y).to.equal(2);
    expect(u.z).to.equal(3);
    expect(u.w).to.equal(4);

    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
    expect(t.z).to.equal(3);
    expect(u.w).to.equal(4);
  });
});
