import { expect } from 'chai';
import 'mocha';
import { Matrix44, Point3, Segment, Vector3 } from '../../src/maths';

describe('Segment', () => {

  it('should construct from two endpoints', () => {
    const p: Point3 = new Point3(1, 2, 3);
    const q: Point3 = new Point3(4, 6, 8);

    const s: Segment = new Segment(p, q);

    expect(s.a.equals(p)).to.be.true;
    expect(s.b.equals(q)).to.be.true;
    expect(s.d.equals(new Vector3(3, 4, 5))).to.be.true;
  });

  it('should construct from another segment', () => {
    const p: Point3 = new Point3(1, 2, 3);
    const q: Point3 = new Point3(4, 6, 8);

    const s: Segment = new Segment(p, q);
    const t: Segment = Segment.FromSegment(s);

    expect(t.a.equals(s.a)).to.be.true;
    expect(t.b.equals(s.b)).to.be.true;
    expect(t.d.equals(s.d)).to.be.true;
  });

  it('should compute length', () => {
    const p: Point3 = new Point3(1, 2, 3);
    const q: Point3 = new Point3(4, 6, 8);

    const s: Segment = new Segment(p, q);

    expect(s.length).to.be.closeTo(7.071067, 0.0001);
  });

  it('should clone', () => {
    const p: Point3 = new Point3(1, 2, 3);
    const q: Point3 = new Point3(4, 6, 8);

    const s: Segment = new Segment(p, q);
    const t: Segment = s.clone();

    expect(s.a.equals(t.a)).to.be.true;
    expect(s.b.equals(t.b)).to.be.true;
    expect(s.d.equals(t.d)).to.be.true;

    expect(s === t).to.not.be.true;
  });

  it('should compute intersection with triangle', () => {
    const s0: Point3 = new Point3(-1, -1, -1);
    const s1: Point3 = new Point3(2, 1, 2);

    const s: Segment = new Segment(s0, s1);

    const intersection: Point3 = s.intersectWithTriangle(
      -2, 2, -2,
      1, 1, -4,
      2, 0, 3);

    expect(intersection.x).to.be.closeTo(1.202532, 0.00001);
    expect(intersection.y).to.be.closeTo(0.468354, 0.00001);
    expect(intersection.z).to.be.closeTo(1.202532, 0.00001);
  });

  it('should return null intersection of non-intersecting triangle', () => {
    const s0: Point3 = new Point3(-1, -1, -1);
    const s1: Point3 = new Point3(2, 1, 2);

    const s: Segment = new Segment(s0, s1);

    const intersection: Point3 = s.intersectWithTriangle(
      -2, 2, -2,
      1, 1, 4,
      2, 0, 3);

    expect(intersection).to.be.null;
  });

  it('should transform with matrix', () => {
    const s0: Point3 = new Point3(-1, -1, -1);
    const s1: Point3 = new Point3(2, 1, 2);
    const m: Matrix44 = new Matrix44(
      -2, 2, 3, 0,
      -1, 1, 3, 0,
      2, 0, -1, 0,
      0, 0, 0, 1
      );

    const s: Segment = new Segment(s0, s1);
    s.transform(m);

    expect(s.a.x).to.equal(-3);
    expect(s.a.y).to.equal(-3);
    expect(s.a.z).to.equal(-1);

    expect(s.b.x).to.equal(4);
    expect(s.b.y).to.equal(5);
    expect(s.b.z).to.equal(2);

    expect(s.d.x).to.equal(7);
    expect(s.d.y).to.equal(8);
    expect(s.d.z).to.equal(3);
  });
});
