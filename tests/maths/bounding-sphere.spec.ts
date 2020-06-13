import { expect } from 'chai';
import 'mocha';
import { BoundingBox, BoundingSphere, Point3 } from '../../src/maths';

describe('BoundingSphere', () => {

  let bs: BoundingSphere;

  beforeEach(() => {
    bs = new BoundingSphere(1, 2, 3, 4);
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

  it('should expand radius by another bounding sphere', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    bs.expandRadiusBy(new BoundingSphere(1, 0, 0, 5));
    expect(bs.radius).to.equal(6);
    bs.expandRadiusBy(new BoundingSphere(0, 1, 0, 3));
    expect(bs.radius).to.equal(6);
  });

  it('should expand radius by a bounding box', () => {
    const bs: BoundingSphere = new BoundingSphere(0, 0, 0, 5);
    bs.expandRadiusByBoundingBox(new BoundingBox(-5, 6, -1, 2, -8, 10));
    expect(bs.radius).to.be.closeTo(11.8321595, 0.000001);
  });
});

