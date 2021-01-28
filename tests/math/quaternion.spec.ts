import { expect } from 'chai';
import 'mocha';
import { Matrix44, Quaternion, Vector3 } from '../../src/math';

describe('Quaternion', () => {

  const EPS = 0.00001;

  it('should construct from values', () => {
    const q = new Quaternion(1, 2, 3, 4);
    expect(q.x).to.equal(1);
    expect(q.y).to.equal(2);
    expect(q.z).to.equal(3);
    expect(q.w).to.equal(4);
  });

  it('should construct from rotation matrix', () => {
    let q: Quaternion;

    q = Quaternion.FromMatrix(
      new Matrix44(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      )
    );

    expect(q.x).to.equal(0);
    expect(q.y).to.equal(0);
    expect(q.z).to.equal(0);
    expect(q.w).to.equal(1);

    q = Quaternion.FromMatrix(
      new Matrix44(
        0.8518519, -0.5185185, 0.0740741, 0,
        0.5185185, 0.8148148, -0.2592593, 0,
        0.0740741, 0.2592593, 0.9629630, 0,
        0, 0, 0, 1
      )
    );

    expect(q.x).to.be.closeTo(0.1360828, EPS);
    expect(q.y).to.be.closeTo(0, EPS);
    expect(q.z).to.be.closeTo(0.2721655, EPS);
    expect(q.w).to.be.closeTo(0.9525793, EPS);
  });

  it('should construct from axis with angle magnitude', () => {
    const q = Quaternion.FromEulerAngles(1, 2, 3);

    expect(q.x).to.be.closeTo(0.7549338, EPS);
    expect(q.y).to.be.closeTo(-0.2061492, EPS);
    expect(q.z).to.be.closeTo(0.5015091, EPS);
    expect(q.w).to.be.closeTo(-0.3688714, EPS);
  });

  it('should equal same quaternion', () => {
    const t = new Quaternion(1, 2, 3, 4);
    const u = new Quaternion(1, 2, 3, 4);

    expect(t.equals(u)).to.be.true;
  });

  it('should clone', () => {
    const t = new Quaternion(1, 2, 3, 4);
    const u = t.clone();

    t.x = 5;
    t.y = 6;
    t.z = 7;
    t.w = 8;

    expect(u.x).to.equal(1);
    expect(u.y).to.equal(2);
    expect(u.z).to.equal(3);
    expect(u.w).to.equal(4);

    expect(t.x).to.equal(5);
    expect(t.y).to.equal(6);
    expect(t.z).to.equal(7);
    expect(t.w).to.equal(8);
  });

  it('should construct copy', () => {
    const t = new Quaternion(1, 2, 3, 4);
    const u = Quaternion.FromQuaternion(t);

    expect(u.x).to.equal(1);
    expect(u.y).to.equal(2);
    expect(u.z).to.equal(3);
    expect(u.w).to.equal(4);

    expect(t.x).to.equal(1);
    expect(t.y).to.equal(2);
    expect(t.z).to.equal(3);
    expect(u.w).to.equal(4);
  });

  it('should multiply with another quaternion', () => {
    const q = new Quaternion(0, 1, 0, 1);
    const r = new Quaternion(0.5, 0.5, 0.75, 1);
    const s: Quaternion = q.times(r) as Quaternion;

    expect(q.x).to.equal(0);
    expect(q.y).to.equal(1);
    expect(q.z).to.equal(0);
    expect(q.w).to.equal(1);

    expect(r.x).to.equal(0.5);
    expect(r.y).to.equal(0.5);
    expect(r.z).to.equal(0.75);
    expect(r.w).to.equal(1);

    expect(s.x).to.equal(1.25);
    expect(s.y).to.equal(1.5);
    expect(s.z).to.equal(0.25);
    expect(s.w).to.equal(0.5);

  });

  it('should rotate a vector', () => {
    const val = Math.sqrt(2.0) / 2.0;
    const q = new Quaternion(0, val, 0, val);
    const vec = new Vector3(1, 0, 0);

    const n = q.times(vec) as Vector3;

    expect(n.x).to.be.closeTo(0, 0.000001);
    expect(n.y).to.be.closeTo(0, 0.000001);
    expect(n.z).to.be.closeTo(-1, 0.000001);
  });

  it('should convert to a matrix', () => {
    const q: Quaternion = new Quaternion(0.5, 0.5, -0.5, -0.5);
    const m = q.toMatrix();

    expect(m.m[0]).to.equal(0.0);
    expect(m.m[1]).to.equal(0.0);
    expect(m.m[2]).to.equal(-1.0);
    expect(m.m[3]).to.equal(0.0);

    expect(m.m[4]).to.equal(1.0);
    expect(m.m[5]).to.equal(0.0);
    expect(m.m[6]).to.equal(0.0);
    expect(m.m[7]).to.equal(0.0);

    expect(m.m[8]).to.equal(0.0);
    expect(m.m[9]).to.equal(-1.0);
    expect(m.m[10]).to.equal(0.0);
    expect(m.m[11]).to.equal(0.0);

    expect(m.m[12]).to.equal(0.0);
    expect(m.m[13]).to.equal(0.0);
    expect(m.m[14]).to.equal(0.0);
    expect(m.m[15]).to.equal(0.0);
  });

  it('should convert to a rotation matrix', () => {
    const q: Quaternion = new Quaternion(0.5, 0.5, -0.5, -0.5);
    const m = q.toRotationMatrix();

    expect(m.m[0]).to.equal(0.0);
    expect(m.m[1]).to.equal(1.0);
    expect(m.m[2]).to.equal(0.0);
    expect(m.m[3]).to.equal(0.0);

    expect(m.m[4]).to.equal(0.0);
    expect(m.m[5]).to.equal(0.0);
    expect(m.m[6]).to.equal(-1.0);
    expect(m.m[7]).to.equal(0.0);

    expect(m.m[8]).to.equal(-1.0);
    expect(m.m[9]).to.equal(0.0);
    expect(m.m[10]).to.equal(0.0);
    expect(m.m[11]).to.equal(0.0);

    expect(m.m[12]).to.equal(0.0);
    expect(m.m[13]).to.equal(0.0);
    expect(m.m[14]).to.equal(0.0);
    expect(m.m[15]).to.equal(0.0);
  });

  it('should compute length', () => {
    const q: Quaternion = new Quaternion(5, 10, 4, 2);

    expect(q.lengthSquared).to.equal(145);
    expect(q.length).to.be.closeTo(12.0415945, 0.0000001);

  });

  it('should add quaternions', () => {
    const q1: Quaternion = new Quaternion(1, 2, 3, 4);
    const q2: Quaternion = new Quaternion(5, 6, 7, 8);

    let q3 = q1.plus(q2);

    expect(q1.x).to.equal(1);
    expect(q1.y).to.equal(2);
    expect(q1.z).to.equal(3);
    expect(q1.w).to.equal(4);

    expect(q2.x).to.equal(5);
    expect(q2.y).to.equal(6);
    expect(q2.z).to.equal(7);
    expect(q2.w).to.equal(8);

    expect(q3.x).to.equal(6);
    expect(q3.y).to.equal(8);
    expect(q3.z).to.equal(10);
    expect(q3.w).to.equal(12);

    q3 = q1.plusEquals(q2);

    expect(q1.x).to.equal(6);
    expect(q1.y).to.equal(8);
    expect(q1.z).to.equal(10);
    expect(q1.w).to.equal(12);

    expect(q2.x).to.equal(5);
    expect(q2.y).to.equal(6);
    expect(q2.z).to.equal(7);
    expect(q2.w).to.equal(8);

    expect(q3.x).to.equal(6);
    expect(q3.y).to.equal(8);
    expect(q3.z).to.equal(10);
    expect(q3.w).to.equal(12);
  });

  it('should subtract quaternions', () => {
    const q1: Quaternion = new Quaternion(5, 6, 7, 8);
    const q2: Quaternion = new Quaternion(1, 2, 3, 4);

    let q3 = q1.minus(q2);

    expect(q1.x).to.equal(5);
    expect(q1.y).to.equal(6);
    expect(q1.z).to.equal(7);
    expect(q1.w).to.equal(8);

    expect(q2.x).to.equal(1);
    expect(q2.y).to.equal(2);
    expect(q2.z).to.equal(3);
    expect(q2.w).to.equal(4);

    expect(q3.x).to.equal(4);
    expect(q3.y).to.equal(4);
    expect(q3.z).to.equal(4);
    expect(q3.w).to.equal(4);

    q3 = q1.minusEquals(q2);

    expect(q1.x).to.equal(4);
    expect(q1.y).to.equal(4);
    expect(q1.z).to.equal(4);
    expect(q1.w).to.equal(4);

    expect(q2.x).to.equal(1);
    expect(q2.y).to.equal(2);
    expect(q2.z).to.equal(3);
    expect(q2.w).to.equal(4);

    expect(q3.x).to.equal(4);
    expect(q3.y).to.equal(4);
    expect(q3.z).to.equal(4);
    expect(q3.w).to.equal(4);
  });

  it('should multiply by scalar value', () => {
    const q1: Quaternion = new Quaternion(1, 2, 3, 4);

    let q2: Quaternion = q1.times(5.0);

    expect(q1.x).to.equal(1);
    expect(q1.y).to.equal(2);
    expect(q1.z).to.equal(3);
    expect(q1.w).to.equal(4);

    expect(q2.x).to.equal(5);
    expect(q2.y).to.equal(10);
    expect(q2.z).to.equal(15);
    expect(q2.w).to.equal(20);
  });

  it('should normalize', () => {
    const q1: Quaternion = new Quaternion(1, 2, 3, 4);

    const q2 = q1.normalize();

    expect(q1.x).to.equal(1);
    expect(q1.y).to.equal(2);
    expect(q1.z).to.equal(3);
    expect(q1.w).to.equal(4);

    expect(q2.x).to.be.closeTo(0.1825742, 0.000001);
    expect(q2.y).to.be.closeTo(0.3651484, 0.000001);
    expect(q2.z).to.be.closeTo(0.5477226, 0.000001);
    expect(q2.w).to.be.closeTo(0.7302967, 0.000001);

    const q3 = q1.normalizeEquals();

    expect(q1.x).to.be.closeTo(0.1825742, 0.000001);
    expect(q1.y).to.be.closeTo(0.3651484, 0.000001);
    expect(q1.z).to.be.closeTo(0.5477226, 0.000001);
    expect(q1.w).to.be.closeTo(0.7302967, 0.000001);

    expect(q3.x).to.equal(q1.x);
    expect(q3.y).to.equal(q1.y);
    expect(q3.z).to.equal(q1.z);
    expect(q3.w).to.equal(q1.w);
  });

  it('should compute dot product', () => {
    const q1: Quaternion = new Quaternion(1, 2, 3, 4);
    const q2: Quaternion = new Quaternion(5, 6, 7, 8);

    expect(q1.dot(q2)).to.equal(70);
  });

  it('should convert to euler vector', () => {
    const q: Quaternion = new Quaternion(-0.365, -0.548, -0.730, -0.182);

    const xe = -1.3741243095144036;
    const ye = 0.8217990559893817;
    const ze = -2.9426992700524446;
    const eps = 0.000001;

    const v1 = q.toEuler('XYZ');
    const v2 = q.toEuler('YZX');
    const v3 = q.toEuler('ZYX');

    expect(v1.x).to.be.closeTo(xe, eps);
    expect(v1.y).to.be.closeTo(ye, eps);
    expect(v1.z).to.be.closeTo(ze, eps);

    expect(v2.x).to.be.closeTo(ye, eps);
    expect(v2.y).to.be.closeTo(ze, eps);
    expect(v2.z).to.be.closeTo(xe, eps);

    expect(v3.x).to.be.closeTo(ze, eps);
    expect(v3.y).to.be.closeTo(ye, eps);
    expect(v3.z).to.be.closeTo(xe, eps);
  });

  it('should compute spherical linear interpolation', () => {

  });
});
