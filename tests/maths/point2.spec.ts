import { expect } from 'chai';
import 'mocha';
import { Point2, Vector2 } from '../../src/maths';

describe('Point2', () => {

  it('should construct values', () => {
    const t = new Point2(1, 2);
    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
  });

  it('should add a point to itself', () => {
    const p = new Point2(1.0, 2.0);
    const q = new Vector2(4.0, 5.0);

    const v = p.plusEquals(q);

    expect(p.x).to.equal(5.0);
    expect(p.y).to.equal(7.0);

    expect(v.x).to.equal(5.0);
    expect(v.y).to.equal(7.0);
  });

  it('should return a new point when adding a point', () => {
    const p = new Point2(1.0, 2.0);
    const q = new Vector2(4.0, 5.0);

    const v = p.plus(q);

    expect(p.x).to.equal(1.0);
    expect(p.y).to.equal(2.0);

    expect(v.x).to.equal(5.0);
    expect(v.y).to.equal(7.0);
  });

  it('should subtract a vector from itself', () => {
    const p = new Point2(1.0, 2.0);
    const q = new Vector2(4.0, 5.0);

    const v = p.minusEquals(q);

    expect(v.x).to.equal(-3.0);
    expect(v.y).to.equal(-3.0);
  });

  it('should subtract point and return vector', () => {
    const p = new Point2(1.0, 2.0);
    const q = new Point2(4.0, 5.0);

    const v = p.minus(q);

    expect(v.x).to.equal(-3.0);
    expect(v.y).to.equal(-3.0);

    expect((v instanceof Vector2)).to.be.true;
  });

  it('should subtract vector and return point', () => {
    const p = new Point2(1.0, 2.0);
    const v = new Vector2(4.0, 5.0);

    const q = p.minus(v);

    expect(q.x).to.equal(-3.0);
    expect(q.y).to.equal(-3.0);

    expect((q instanceof Point2)).to.be.true;
  });

  it('should compute affine', () => {
    const px = 1.0, py = 2.0;
    const qx = 3.0, qy = 5.0;
    const a = 0.25;
    const ex = 1.5, ey = 2.75;

    const p = new Point2(px, py);
    const q = new Point2(qx, qy);

    const r = p.affine(a, q);

    expect(r.x).to.equal(ex);
    expect(r.y).to.equal(ey);
  });

  it('should compute distance to another point', () => {
    const px = 1.0, py = 2.0;
    const qx = 5.0, qy = 10.0;
    const ex = 8.9442729;

    const p = new Point2(px, py);
    const q = new Point2(qx, qy);

    const r = p.distanceTo(q);

    expect(r).to.be.closeTo(ex, 0.00001);
  });

});
