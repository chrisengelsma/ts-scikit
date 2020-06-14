import { expect } from 'chai';
import 'mocha';
import { Vector2 } from '../../src/maths';

describe('Vector2', () => {

  const EPS = 0.00001;

  it('should construct values', () => {
    const t = new Vector2(1, 2);
    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
  });

  it('should compute length', () => {
    const v0 = new Vector2(-3.0, 4.0);
    const v1 = new Vector2(3.0, -4.0);
    const e  = 5.0;

    expect(v0.length).to.be.closeTo(e, EPS);
    expect(v1.length).to.be.closeTo(e, EPS);
  });

  it('should compute length squared', () => {
    const v0 = new Vector2(-3.0, 4.0);
    const v1 = new Vector2(3.0, -4.0);
    const e  = 25.0;

    expect(v0.lengthSquared).to.be.closeTo(e, EPS);
    expect(v1.lengthSquared).to.be.closeTo(e, EPS);
  });

  it('should return negated vector', () => {
    const v = new Vector2(1, 2);
    const u = v.negate();

    expect(v.x).to.equal(1); expect(u.x).to.equal(-1);
    expect(v.y).to.equal(2); expect(u.y).to.equal(-2);
  });

  it('should negate itself', () => {
    const v = new Vector2(1, 2);
    const u = v.negateEquals();

    expect(v.x).to.equal(-1); expect(u.x).to.equal(-1);
    expect(v.y).to.equal(-2); expect(u.y).to.equal(-2);
  });

  it('should return normalized vector', () => {
    const vx = 1.0, vy = 2.0;

    const xn = 0.44721;
    const yn = 0.89443;

    const len = 5.0;

    const v = new Vector2(vx, vy);
    const u = v.normalize();

    expect(v.lengthSquared).to.equal(len);
    expect(u.length).to.be.closeTo(1.0, EPS);

    expect(v.x).to.equal(vx); expect(u.x).to.be.closeTo(xn, EPS);
    expect(v.y).to.equal(vy); expect(u.y).to.be.closeTo(yn, EPS);
  });

  it('should normalize itself', () => {
    const vx = 1.0, vy = 2.0;

    const xn = 0.44721;
    const yn = 0.89443;

    const v = new Vector2(vx, vy);
    const u = v.normalizeEquals();

    expect(v.length).to.be.closeTo(1.0, EPS);
    expect(u.length).to.be.closeTo(1.0, EPS);

    expect(v.x).to.be.closeTo(xn, EPS); expect(u.x).to.be.closeTo(xn, EPS);
    expect(v.y).to.be.closeTo(yn, EPS); expect(u.y).to.be.closeTo(yn, EPS);
  });

  it('should compute sum vector', () => {
    const u = new Vector2(1.0, 2.0);
    const v = new Vector2(4.0, 5.0);

    const w = u.plus(v);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(5.0);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal(7.0);
  });

  it('should add from another vector', () => {
    const u = new Vector2(1.0, 2.0);
    const v = new Vector2(4.0, 5.0);

    const w = u.plusEquals(v);

    expect(u.x).to.equal(5.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(5.0);
    expect(u.y).to.equal(7.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal(7.0);
  });

  it('should compute difference vector', () => {
    const u = new Vector2(1.0, 2.0);
    const v = new Vector2(4.0, 5.0);

    const w = u.minus(v);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(-3.0);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal(-3.0);
  });

  it('should subtract from another vector', () => {
    const u = new Vector2(1.0, 2.0);
    const v = new Vector2(4.0, 5.0);

    const w = u.minusEquals(v);

    expect(u.x).to.equal(-3.0); expect(v.x).to.equal(4.0); expect(w.x).to.equal(-3.0);
    expect(u.y).to.equal(-3.0); expect(v.y).to.equal(5.0); expect(w.y).to.equal(-3.0);
  });

  it('should compute scaled vector', () => {
    const u = new Vector2(1.0, 2.0);
    const s = 2.0;

    const v = u.times(s);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(2.0);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(4.0);
  });

  it('should compute scaled vector', () => {
    const u = new Vector2(1.0, 2.0);
    const s = 2.0;

    const v = u.timesEquals(s);

    expect(u.x).to.equal(2.0); expect(v.x).to.equal(2.0);
    expect(u.y).to.equal(4.0); expect(v.y).to.equal(4.0);
  });

  it('should compute dot product', () => {
    const u = new Vector2(1.0, 2.0);
    const v = new Vector2(4.0, 5.0);

    const w = u.dot(v);

    expect(u.x).to.equal(1.0); expect(v.x).to.equal(4.0);
    expect(u.y).to.equal(2.0); expect(v.y).to.equal(5.0);

    expect(w).to.equal(14);
  });

});
