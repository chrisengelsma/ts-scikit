import { expect } from 'chai';
import 'mocha';
import { Tuple3 } from '../../src/maths';

describe('Tuple3', () => {
  it('should construct values', () => {
    const t = new Tuple3(1, 2, 3);
    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
    expect(t.z).to.equal(3);
  });

  it('should equal same tuple3', () => {
    const t = new Tuple3(1, 2, 3);
    const u = new Tuple3(1, 2, 3);

    expect(t.equals(u)).to.be.true;
  });

  it('should clone', () => {
    const t = new Tuple3(1, 2, 3);
    const u = t.clone();

    t.x = 4;
    t.y = 5;
    t.z = 6;

    expect(u.x).to.equal(1);
    expect(u.y).to.equal(2);
    expect(u.z).to.equal(3);

    expect(t.x).to.equal(4);
    expect(t.y).to.equal(5);
    expect(t.z).to.equal(6);
  });

  it('should construct copy', () => {
    const t = new Tuple3(1, 2, 3);
    const u = Tuple3.FromExisting(t);

    expect(u.x).to.equal(1);
    expect(u.y).to.equal(2);
    expect(u.z).to.equal(3);

    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
    expect(t.z).to.equal(3);
  });
});
