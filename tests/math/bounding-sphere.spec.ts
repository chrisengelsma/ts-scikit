import { expect } from 'chai';
import 'mocha';
import { BoundingBox, BoundingSphere, Point3 } from '../../src/math';

describe('BoundingSphere', () => {

  let bs: BoundingSphere;

  beforeEach(() => {
    bs = new BoundingSphere(1, 2, 3, 4);
  });

  it('should construct empty bounding sphere', () => {
    const bs = BoundingSphere.AsEmpty();
    expect(bs.center.x).to.equal(0);
    expect(bs.center.y).to.equal(0);
    expect(bs.center.z).to.equal(0);
    expect(bs.radius).to.equal(-1);
  });

  it('should construct infinite bounding sphere', () => {
    const bs = BoundingSphere.AsInfinite();
    expect(bs.center.x).to.equal(0);
    expect(bs.center.y).to.equal(0);
    expect(bs.center.z).to.equal(0);
    expect(bs.radius).to.equal(Number.POSITIVE_INFINITY);
  });

  it('should construct using default constructor', () => {
    const bs = new BoundingSphere(-1, 5, 10, 2);
    expect(bs.center.x).to.equal(-1);
    expect(bs.center.y).to.equal(5);
    expect(bs.center.z).to.equal(10);
    expect(bs.radius).to.equal(2);
  });

  it('should construct from parameters', () => {
    const bs = BoundingSphere.FromParameters(new Point3(1, 2, 3), 5);
    expect(bs.center.x).to.equal(1);
    expect(bs.center.y).to.equal(2);
    expect(bs.center.z).to.equal(3);
    expect(bs.radius).to.equal(5);
  });

  it('should construct from bounding box', () => {
    const bbox = new BoundingBox(-10, 10, -2, 2, -5, 5);
    const bs = BoundingSphere.FromBoundingBox(bbox);
    expect(bs.center.x).to.equal(0);
    expect(bs.center.y).to.equal(0);
    expect(bs.center.z).to.equal(0);
    expect(bs.radius).to.be.closeTo(11.3578167, 0.000001);
  });

  it('should expand radius by a bounding sphere', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    bs.expandRadiusBy(new BoundingSphere(1, 0, 0, 5));
    expect(bs.radius).to.equal(6);
    bs.expandRadiusBy(new BoundingSphere(0, 1, 0, 3));
    expect(bs.radius).to.equal(6);
  });

  it('should expand radius by a bounding box', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    bs.expandRadiusBy(new BoundingBox(-5, 6, -1, 2, -8, 10));
    expect(bs.radius).to.be.closeTo(11.8321595, 0.000001);
  });

  it('should expand by a bounding box', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bb: BoundingBox = new BoundingBox(-4, 2, -10, 20, -10, 10);
    bs.expandBy(bb);
    expect(bs.center.x).to.equal(-1);
    expect(bs.center.y).to.equal(5);
    expect(bs.center.z).to.equal(0);
    expect(bs.radius).to.be.closeTo(18.27566688, 0.0000001);
  });

  it('should expand by a bounding sphere', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bs2: BoundingSphere = new BoundingSphere(2, 3, 5, 10);
    bs.expandBy(bs2);
    expect(bs.center.x).to.be.closeTo(1.81110711, 0.0000001);
    expect(bs.center.y).to.be.closeTo(2.71666065, 0.0000001);
    expect(bs.center.z).to.be.closeTo(4.52776776, 0.0000001);
    expect(bs.radius).to.be.closeTo(16.1644140, 0.0000001);

    const bs3: BoundingSphere = BoundingSphere.AsEmpty();
    bs3.expandBy(bs2);
    expect(bs3.center.x).to.equal(bs2.center.x);
    expect(bs3.center.y).to.equal(bs2.center.y);
    expect(bs3.center.z).to.equal(bs2.center.z);
    expect(bs3.radius).to.equal(bs2.radius);
  });

  it('should expand by an infinite bounding sphere', () => {
    const bs1: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bs2: BoundingSphere = BoundingSphere.AsInfinite();
    bs1.expandBy(bs2);
    expect(bs1.isInfinite).to.be.true;
  });

  it('should not expand by an empty bounding sphere', () => {
    const bs1: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bs2: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bs3: BoundingSphere = BoundingSphere.AsEmpty();
    bs1.expandBy(bs3);
    expect(bs1.center.x).to.equal(bs2.center.x);
    expect(bs1.center.y).to.equal(bs2.center.y);
    expect(bs1.center.z).to.equal(bs2.center.z);
    expect(bs1.radius).to.equal(bs2.radius);
  });

  it('should not expand by an empty bounding box', () => {
    const bs1: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bs2: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bb: BoundingBox = BoundingBox.AsEmpty();
    bs1.expandBy(bb);
    expect(bs1.center.x).to.equal(bs2.center.x);
    expect(bs1.center.y).to.equal(bs2.center.y);
    expect(bs1.center.z).to.equal(bs2.center.z);
    expect(bs1.radius).to.equal(bs2.radius);
  });

  it('should expand by an infinite bounding box', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bb: BoundingBox = BoundingBox.AsInfinite();
    bs.expandBy(bb);
    expect(bs.isInfinite).to.be.true;
  });

  it('should expand by a point', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const point: Point3 = new Point3(2, 1, 10);

    bs.expandBy(point);
    expect(bs.center.x).to.be.closeTo(0.51204996, 0.0000001);
    expect(bs.center.y).to.be.closeTo(0.25602498, 0.0000001);
    expect(bs.center.z).to.be.closeTo(2.56024981, 0.0000001);
    expect(bs.radius).to.be.closeTo(7.62347538, 0.0000001);

  });

  it('should expand by a list of points', () => {
    const bs1: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    const bs2: BoundingSphere = new BoundingSphere(0, 0, 0, 5);

    bs1.expandBy([ 0, 0, 10, 10, 0, 0, 0, 10, 0 ]);
    bs2.expandBy([
      new Point3(0, 0, 10),
      new Point3(10, 0, 0),
      new Point3(0, 10, 0)
    ]);

    expect(bs1.center.x).to.be.closeTo(1.26847645, 0.0000001);
    expect(bs1.center.y).to.be.closeTo(0.68642823, 0.0000001);
    expect(bs1.center.z).to.be.closeTo(2.01127382, 0.0000001);
    expect(bs1.radius).to.be.closeTo(9.6123292, 0.0000001);

    expect(bs2.center.x).to.be.closeTo(1.26847645, 0.0000001);
    expect(bs2.center.y).to.be.closeTo(0.68642823, 0.0000001);
    expect(bs2.center.z).to.be.closeTo(2.01127382, 0.0000001);
    expect(bs2.radius).to.be.closeTo(9.6123292, 0.0000001);

  });

  it('should expand empty bounding sphere by a point', () => {
    const bs: BoundingSphere = BoundingSphere.AsEmpty();
    const point: Point3 = new Point3(2, 1, 10);
    bs.expandBy(point);
    expect(bs.center.x).to.equal(point.x);
    expect(bs.center.y).to.equal(point.y);
    expect(bs.center.z).to.equal(point.z);
    expect(bs.radius).to.equal(0);
  });

  it('should reject expanding radius with array not divisible by three', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    expect(() => {bs.expandBy([ 1, 2 ]);}).to.throw();
  });

  it('should determine if contains a point', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 10);

    expect(bs.contains(new Point3(0, 0, 0))).to.be.true;
    expect(bs.contains(new Point3(0, 0, 10))).to.be.true;
    expect(bs.contains(new Point3(10, 0, 0))).to.be.true;
    expect(bs.contains(new Point3(0, 10, 0))).to.be.true;
    expect(bs.contains(new Point3(10, 10, 10))).to.be.false;

    expect(bs.contains([ 0, 0, 0 ])).to.be.true;
    expect(bs.contains([ 0, 0, 10 ])).to.be.true;
    expect(bs.contains([ 10, 0, 0 ])).to.be.true;
    expect(bs.contains([ 0, 10, 0 ])).to.be.true;
    expect(bs.contains([ 10, 10, 10 ])).to.be.false;

    expect(() => bs.contains([ 0, 2 ])).to.throw();
  });

});

