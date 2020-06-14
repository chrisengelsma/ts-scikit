import { expect } from 'chai';
import 'mocha';
import { Point3, Point4, Vector3 } from '../../src/maths';

describe('Point4', () => {

  it('should construct from a 3D point', () => {
    const p = new Point3(0, 1, 2);
    const q = Point4.FromPoint3(p);

    expect(q.x).to.equal(0);
    expect(q.y).to.equal(1);
    expect(q.z).to.equal(2);
    expect(q.w).to.equal(1);
  });

  it('should construct values', () => {
    const t = new Point4(1, 2, 3, 4);
    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
    expect(t.z).to.equal(3);
    expect(t.w).to.equal(4);
  });

  it('should subtract vector', () => {
    const p = new Point4(1.0, 2.0, 3.0, 2.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const q = p.minus(v);

    expect(q.x).to.equal(-3.0);
    expect(q.y).to.equal(-3.0);
    expect(q.z).to.equal(-3.0);
    expect(q.w).to.equal(2.0);
  });

  it('should add vector', () => {
    const p = new Point4(1.0, 2.0, 3.0, 2.0);
    const v = new Vector3(4.0, 5.0, 6.0);

    const q = p.plus(v);

    expect(q.x).to.equal(5.0);
    expect(q.y).to.equal(7.0);
    expect(q.z).to.equal(9.0);
    expect(q.w).to.equal(2.0);
  });

  it('should add a vector to itself', () => {
    const p = new Point4(0, 1, 2, 3);
    p.plusEquals(new Vector3(1, 2, 3));

    expect(p.x).to.equal(1);
    expect(p.y).to.equal(3);
    expect(p.z).to.equal(5);
    expect(p.w).to.equal(3);
  });

  it('should subtract a vector from itself', () => {
    const p = new Point4(0, 1, 2, 3);
    p.minusEquals(new Vector3(1, 2, 3));

    expect(p.x).to.equal(-1);
    expect(p.y).to.equal(-1);
    expect(p.z).to.equal(-1);
    expect(p.w).to.equal(3);
  });

  it('should compute affine', () => {
    const px = 1.0, py = 2.0, pz = 3.0, pw = 2.0;
    const qx = 3.0, qy = 5.0, qz = 10.0, qw = 3.0;
    const a = 0.25;
    const ex = 1.5, ey = 2.75, ez = 4.75, ew = 2.25;

    const p = new Point4(px, py, pz, pw);
    const q = new Point4(qx, qy, qz, qw);

    const r = p.affine(a, q);

    expect(r.x).to.equal(ex);
    expect(r.y).to.equal(ey);
    expect(r.z).to.equal(ez);
    expect(r.w).to.equal(ew);

  });

  it('should compute homogenized point', () => {
    const p = new Point4(2.0, 4.0, 10.0, 2.0);

    const q = p.homogenize();

    expect(q.x).to.equal(1.0);
    expect(p.x).to.equal(2.0);
    expect(q.y).to.equal(2.0);
    expect(p.y).to.equal(4.0);
    expect(q.z).to.equal(5.0);
    expect(p.z).to.equal(10.0);
    expect(q.w).to.equal(1.0);
    expect(p.w).to.equal(2.0);
  });

  it('should homogenize', () => {
    const p = new Point4(2.0, 4.0, 10.0, 2.0);

    const q = p.homogenizeEquals();

    expect(q.x).to.equal(1.0);
    expect(p.x).to.equal(1.0);
    expect(q.y).to.equal(2.0);
    expect(p.y).to.equal(2.0);
    expect(q.z).to.equal(5.0);
    expect(p.z).to.equal(5.0);
    expect(q.w).to.equal(1.0);
    expect(p.w).to.equal(1.0);
  });
});
