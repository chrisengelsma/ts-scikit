import { expect } from 'chai';
import 'mocha';
import { Point3, Vector3 } from '../../src/maths';

describe('Point3', () => {

  it('should construct values', () => {
    const t = new Point3(1, 2, 3);
    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
    expect(t.z).to.equal(3);
  });

  it('should subtract point and return vector', () => {
    const p = new Point3(1.0, 2.0, 3.0);
    const q = new Point3(4.0, 5.0, 6.0);

    const v = p.minus(q);

    expect(v.x).to.equal(-3.0);
    expect(v.y).to.equal(-3.0);
    expect(v.z).to.equal(-3.0);

    expect((v instanceof Vector3)).to.be.true;
  });

  it('should subtract vector and return point', () => {
    const p = new Point3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const q = p.minus(v);

    expect(q.x).to.equal(-3.0);
    expect(q.y).to.equal(-3.0);
    expect(q.z).to.equal(-3.0);

    expect((q instanceof Point3)).to.be.true;
  });

  it('should subtract another vector from itself', () => {
    const p = new Point3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const q = p.minusEquals(v);

    expect(p.x).to.equal(-3.0);
    expect(p.y).to.equal(-3.0);
    expect(p.z).to.equal(-3.0);

    expect(q.x).to.equal(-3.0);
    expect(q.y).to.equal(-3.0);
    expect(q.z).to.equal(-3.0);
  });

  it('should add another vector to itself', () => {
    const p = new Point3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const q = p.plusEquals(v);

    expect(p.x).to.equal(5.0);
    expect(p.y).to.equal(7.0);
    expect(p.z).to.equal(9.0);

    expect(q.x).to.equal(5.0);
    expect(q.y).to.equal(7.0);
    expect(q.z).to.equal(9.0);
  });

  it('should add another vector', () => {
    const p = new Point3(1.0, 2.0, 3.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const q = p.plus(v);

    expect(p.x).to.equal(1.0);
    expect(p.y).to.equal(2.0);
    expect(p.z).to.equal(3.0);

    expect(q.x).to.equal(5.0);
    expect(q.y).to.equal(7.0);
    expect(q.z).to.equal(9.0);
  });

  it('should compute affine', () => {
    const px = 1.0, py = 2.0, pz = 3.0;
    const qx = 3.0, qy = 5.0, qz = 10.0;
    const a = 0.25;
    const ex = 1.5, ey = 2.75, ez = 4.75;

    const p = new Point3(px, py, pz);
    const q = new Point3(qx, qy, qz);

    const r = p.affine(a, q);

    expect(r.x).to.equal(ex);
    expect(r.y).to.equal(ey);
    expect(r.z).to.equal(ez);

  });

  it('should compute distance to another point', () => {
    const px = 1.0, py = 2.0, pz = 3.0;
    const qx = 5.0, qy = 10.0, qz = 7.0;
    const ex = 9.7979589711;

    const p = new Point3(px, py, pz);
    const q = new Point3(qx, qy, qz);

    const r = p.distanceTo(q);

    expect(r).to.be.closeTo(ex, 0.00001);
  });
});
