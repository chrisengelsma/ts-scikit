import { expect } from 'chai';
import 'mocha';
import { BoundingBox, Point3 } from '../../src/maths';

describe('BoundingBox', () => {

  let bbox: BoundingBox;

  beforeEach(() =>{
    bbox = new BoundingBox(-1, 1, -2, 2, -3, 3);
  });

  it('should construct', () => {
    const bb = new BoundingBox(-1, 1, -2, 2, 0, 5);

    expect(bb.xmin).to.equal(-1);
    expect(bb.xmax).to.equal(1);
    expect(bb.ymin).to.equal(-2);
    expect(bb.ymax).to.equal(2);
    expect(bb.zmin).to.equal(0);
    expect(bb.zmax).to.equal(5);

    expect(bb.isEmpty).to.be.false;
    expect(bb.isInfinite).to.be.false;
  });

  it('should throw error if constructed with xmax < xmin', () => {
    expect(() => new BoundingBox(1, 0, 0, 1, 0, 1)).to.throw('xmin <= xmax');
  });

  it('should throw error if constructed with ymax < ymin', () => {
    expect(() => new BoundingBox(0, 1, 1, 0, 0, 1)).to.throw('ymin <= ymax');
  });

  it('should throw error if constructed with zmax < zmin', () => {
    expect(() => new BoundingBox(0, 1, 0, 1, 1, 0)).to.throw('zmin <= zmax');
  });

  it('should construct an empty box', () => {
    const bb: BoundingBox = BoundingBox.AsEmpty();
    expect(bb.isEmpty).to.be.true;
  });

  it('should construct from an array of points', () => {
    const bb = BoundingBox.FromPoints([
      new Point3(0, 0, 0),
      new Point3(-1, -2, 10),
      new Point3(2, 0, -10),
      new Point3(20, 20, -50),
    ]);

    expect(bb.xmin).to.equal(-1);
    expect(bb.xmax).to.equal(20);
    expect(bb.ymin).to.equal(-2);
    expect(bb.ymax).to.equal(20);
    expect(bb.zmin).to.equal(-50);
    expect(bb.zmax).to.equal(10);
  });

  it('should construct box from two corner points', () => {
    const px = -1.0, py = 2.0, pz = 7.0;
    const qx = 3.0, qy = -5.0, qz = 0.0;
    const p = new Point3(px, py, pz);
    const q = new Point3(qx, qy, qz);

    const bb: BoundingBox = BoundingBox.FromCorners(p, q);

    expect(bb.xmin).to.equal(px);
    expect(bb.ymin).to.equal(qy);
    expect(bb.zmin).to.equal(qz);

    expect(bb.xmax).to.equal(qx);
    expect(bb.ymax).to.equal(py);
    expect(bb.zmax).to.equal(pz);
  });

  it('should return minimum point', () => {
    expect(bbox.min.x).to.equal(-1);
    expect(bbox.min.y).to.equal(-2);
    expect(bbox.min.z).to.equal(-3);
  });

  it('should return maximum point', () => {
    expect(bbox.max.x).to.equal(1);
    expect(bbox.max.y).to.equal(2);
    expect(bbox.max.z).to.equal(3);
  });

  it('should expand using a single point', () => {
    bbox.expandBy(new Point3(10, 10, 10));

    expect(bbox.min.x).to.equal(-1);
    expect(bbox.min.y).to.equal(-2);
    expect(bbox.min.z).to.equal(-3);

    expect(bbox.max.x).to.equal(10);
    expect(bbox.max.y).to.equal(10);
    expect(bbox.max.z).to.equal(10);

  });

  it('should expand using a list of points', () => {
    const points: Point3[] = [
      new Point3(-10, 0, 20),
      new Point3(20, -10, 0),
      new Point3(0, 20, -10)
    ];

    bbox.expandBy(points);

    expect(bbox.min.x).to.equal(-10);
    expect(bbox.min.y).to.equal(-10);
    expect(bbox.min.z).to.equal(-10);

    expect(bbox.max.x).to.equal(20);
    expect(bbox.max.y).to.equal(20);
    expect(bbox.max.z).to.equal(20);
  });

  it('should expand using a bounding box', () => {
    const bb = new BoundingBox(-10, 10, -20, 0, 0, 30);

    bbox.expandBy(bb);

    expect(bbox.min.x).to.equal(-10);
    expect(bbox.min.y).to.equal(-20);
    expect(bbox.min.z).to.equal(-3);

    expect(bbox.max.x).to.equal(10);
    expect(bbox.max.y).to.equal(2);
    expect(bbox.max.z).to.equal(30);
  });

  it('should expand using an array of numbers', () => {
    const points: number[] = [-10, 0, 20, 20, -10, 0, 0, 20, -10];

    bbox.expandBy(points);

    expect(bbox.min.x).to.equal(-10);
    expect(bbox.min.y).to.equal(-10);
    expect(bbox.min.z).to.equal(-10);

    expect(bbox.max.x).to.equal(20);
    expect(bbox.max.y).to.equal(20);
    expect(bbox.max.z).to.equal(20);

  });

  it('should throw error if expandBy number array not divisible by 3', () => {
    expect(() => bbox.expandBy([-10])).to.throw('number array length divisible by 3');
    expect(() => bbox.expandBy([-10, 0])).to.throw('number array length divisible by 3');
    expect(() => bbox.expandBy([-10, 0, 20, 1])).to.throw('number array length divisible by 3');
  });

  it('should set to empty', () => {
    bbox.setEmpty();
    expect(bbox.isEmpty).to.be.true;
  });

  it('should set to infinite', () => {
    bbox.setInfinite();
    expect(bbox.isInfinite).to.be.true;
  });

});
