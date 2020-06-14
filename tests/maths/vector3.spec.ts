import { expect } from 'chai';
import 'mocha';
import { Vector3 } from '../../src/maths';

describe('Vector3', () => {

  const EPS = 0.00001;

  it('should construct values', () => {
    const t = new Vector3(1, 2, 3);
    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
    expect(t.z).to.equal(3);
  });

  it('should compute length', () => {
    const v0 = new Vector3(-3.0, 4.0, 5.0);
    const v1 = new Vector3(3.0, -4.0, 5.0);
    const v2 = new Vector3(3.0, 4.0, -5.0);
    const e  = 7.0710678119;

    expect(v0.length).to.be.closeTo(e, EPS);
    expect(v1.length).to.be.closeTo(e, EPS);
    expect(v2.length).to.be.closeTo(e, EPS);
  });

  it('should compute length squared', () => {
    const v0 = new Vector3(-3.0, 4.0, 5.0);
    const v1 = new Vector3(3.0, -4.0, 5.0);
    const v2 = new Vector3(3.0, 4.0, -5.0);
    const e  = 50.0;

    expect(v0.lengthSquared).to.be.closeTo(e, EPS);
    expect(v1.lengthSquared).to.be.closeTo(e, EPS);
    expect(v2.lengthSquared).to.be.closeTo(e, EPS);
  });

  it('should return negated vector', () => {
    const v = new Vector3(1, 2, 3);
    const u = v.negate();

    expect(v.x).to.equal(1); expect(u.x).to.equal(-1);
    expect(v.y).to.equal(2); expect(u.y).to.equal(-2);
    expect(v.z).to.equal(3); expect(u.z).to.equal(-3);
  });

  it('should negate itself', () => {
    const v = new Vector3(1, 2, 3);
    const u = v.negateEquals();

    expect(v.x).to.equal(-1); expect(u.x).to.equal(-1);
    expect(v.y).to.equal(-2); expect(u.y).to.equal(-2);
    expect(v.z).to.equal(-3); expect(u.z).to.equal(-3);
  });

  it('should return normalized vector', () => {
    const vx = 1.0, vy = 2.0, vz = 3.0;

    const xn = 0.2672612419;
    const yn = 0.5345224838;
    const zn = 0.8017837257;

    const len = 14.0;

    const v = new Vector3(vx, vy, vz);
    const u = v.normalize();

    expect(v.lengthSquared).to.equal(len);
    expect(u.length).to.equal(1.0);

    expect(v.x).to.equal(vx); expect(u.x).to.be.closeTo(xn, EPS);
    expect(v.y).to.equal(vy); expect(u.y).to.be.closeTo(yn, EPS);
    expect(v.z).to.equal(vz); expect(u.z).to.be.closeTo(zn, EPS);
  });

  it('should normalize itself', () => {
    const vx = 1.0, vy = 2.0, vz = 3.0;

    const xn = 0.2672612419;
    const yn = 0.5345224838;
    const zn = 0.8017837257;

    const v = new Vector3(vx, vy, vz);
    const u = v.normalizeEquals();

    expect(v.length).to.equal(1.0);
    expect(u.length).to.equal(1.0);

    expect(v.x).to.be.closeTo(xn, EPS); expect(u.x).to.be.closeTo(xn, EPS);
    expect(v.y).to.be.closeTo(yn, EPS); expect(u.y).to.be.closeTo(yn, EPS);
    expect(v.z).to.be.closeTo(zn, EPS); expect(u.z).to.be.closeTo(zn, EPS);
  });

  it('should compute sum vector', () => {
    const u = new Vector3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const w = u.plus(v);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(5.0);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal(7.0);
    expect(u.z).to.equal(3.0); expect(v.z).to.equal(6.0); expect(w.z).to.equal(9.0);
  });

  it('should add from another vector', () => {
    const u = new Vector3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const w = u.plusEquals(v);

    expect(u.x).to.equal(5.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(5.0);
    expect(u.y).to.equal(7.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal(7.0);
    expect(u.z).to.equal(9.0); expect(v.z).to.equal(6.0); expect(w.z).to.equal(9.0);
  });

  it('should compute difference vector', () => {
    const u = new Vector3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const w = u.minus(v);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(-3.0);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal(-3.0);
    expect(u.z).to.equal(3.0); expect(v.z).to.equal(6.0); expect(w.z).to.equal(-3.0);
  });

  it('should subtract from another vector', () => {
    const u = new Vector3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const w = u.minusEquals(v);

    expect(u.x).to.equal(-3.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(-3.0);
    expect(u.y).to.equal(-3.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal(-3.0);
    expect(u.z).to.equal(-3.0); expect(v.z).to.equal(6.0); expect(w.z).to.equal(-3.0);
  });

  it('should compute scaled vector', () => {
    const u = new Vector3(1.0, 2.0, 3.0);
    const s = 2.0;

    const v = u.times(s);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(2.0);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(4.0);
    expect(u.z).to.equal(3.0); expect(v.z).to.equal(6.0);
  });

  it('should compute scaled vector', () => {
    const u = new Vector3(1.0, 2.0, 3.0);
    const s = 2.0;

    const v = u.timesEquals(s);

    expect(u.x).to.equal(2.0); expect(v.x).to.equal(2.0);
    expect(u.y).to.equal(4.0); expect(v.y).to.equal(4.0);
    expect(u.z).to.equal(6.0); expect(v.z).to.equal(6.0);
  });

  it('should compute dot product', () => {
    const u = new Vector3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const w = u.dot(v);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(4.0);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(5.0);
    expect(u.z).to.equal(3.0); expect(v.z).to.equal(6.0);

    expect(w).to.equal(32);
  });

  it('should compute cross product', () => {
    const u = new Vector3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const w = u.cross(v);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(-3);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal( 6);
    expect(u.z).to.equal(3.0); expect(v.z).to.equal(6.0); expect(w.z).to.equal(-3);
  });

});
