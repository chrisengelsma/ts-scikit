import { expect } from 'chai';
import 'mocha';
import { Tuple2 } from '../../src/maths';

describe('Tuple2', () => {
  it('should construct values', () => {
    const t = new Tuple2(1, 2);
    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
  });

  it('should equal same tuple3', () => {
    const t = new Tuple2(1, 2);
    const u = new Tuple2(1, 2);

    expect(t.equals(u)).to.be.true;
  });

  it('should clone', () => {
    const t = new Tuple2(1, 2);
    const u = t.clone();

    t.x = 4;
    t.y = 5;

    expect(u.x).to.equal(1);
    expect(u.y).to.equal(2);

    expect(t.x).to.equal(4);
    expect(t.y).to.equal(5);
  });

  it('should construct copy', () => {
    const t = new Tuple2(1, 2);
    const u = Tuple2.FromExisting(t);

    expect(u.x).to.equal(1);
    expect(u.y).to.equal(2);

    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
  });
});
