import { expect } from 'chai';
import 'mocha';
import { Matrix44 } from '../../src/maths';

const randomArray = (): Array<number> => {
  // @ts-ignore
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 40));
};

const randomMatrix = (): Matrix44 => {
  let m = randomArray();
  return new Matrix44(
    m[0], m[1], m[2], m[3],
    m[4], m[5], m[6], m[7],
    m[8], m[9], m[10], m[11],
    m[12], m[13], m[14], m[15],
  );
};

describe('Matrix44', () => {

  it('should construct identity matrix44', () => {
    const A = Matrix44.AsIdentity();
    expect(A.m).to.deep.equal(
      Array<number>(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1)
    );
  });

  it('should construct from array', () => {
    const arr = randomArray();
    const A = Matrix44.FromArray(arr);
    expect(A.m).to.deep.equal(arr);
  });

  it('should construct from matrix44', () => {
    const A = randomMatrix();
    const B = Matrix44.FromMatrix44(A);

    expect(A.m).to.deep.equal(B.m);
  });

  it('should clone', () => {
    const A = randomMatrix();
    const B = A.clone();

    expect(A.m).to.deep.equal(B.m);

    A.set(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1);

    expect(A.m).not.to.deep.equal(B.m);
  });

  it('should return transposed matrix44', () => {
    const A = randomMatrix();
    const arr = A.m;
    const B = A.transpose();

    expect(A.m).to.equal(arr);

    expect(A.m[0]).to.equal(B.m[0]);
    expect(A.m[1]).to.equal(B.m[4]);
    expect(A.m[2]).to.equal(B.m[8]);
    expect(A.m[3]).to.equal(B.m[12]);

    expect(A.m[4]).to.equal(B.m[1]);
    expect(A.m[5]).to.equal(B.m[5]);
    expect(A.m[6]).to.equal(B.m[9]);
    expect(A.m[7]).to.equal(B.m[13]);

    expect(A.m[8]).to.equal(B.m[2]);
    expect(A.m[9]).to.equal(B.m[6]);
    expect(A.m[10]).to.equal(B.m[10]);
    expect(A.m[11]).to.equal(B.m[14]);

    expect(A.m[12]).to.equal(B.m[3]);
    expect(A.m[13]).to.equal(B.m[7]);
    expect(A.m[14]).to.equal(B.m[11]);
    expect(A.m[15]).to.equal(B.m[15]);

  });

  it('should transpose itself', () => {
    const A = randomMatrix();
    // @ts-ignore
    const arr = Object.assign({}, A.m);
    const B = A.transposeEquals();
    expect(A.m).to.equal(B.m);

    expect(A.m[0]).to.equal(arr[0]);
    expect(A.m[1]).to.equal(arr[4]);
    expect(A.m[2]).to.equal(arr[8]);
    expect(A.m[3]).to.equal(arr[12]);

    expect(A.m[4]).to.equal(arr[1]);
    expect(A.m[5]).to.equal(arr[5]);
    expect(A.m[6]).to.equal(arr[9]);
    expect(A.m[7]).to.equal(arr[13]);

    expect(A.m[8]).to.equal(arr[2]);
    expect(A.m[9]).to.equal(arr[6]);
    expect(A.m[10]).to.equal(arr[10]);
    expect(A.m[11]).to.equal(arr[14]);

    expect(A.m[12]).to.equal(arr[3]);
    expect(A.m[13]).to.equal(arr[7]);
    expect(A.m[14]).to.equal(arr[11]);
    expect(A.m[15]).to.equal(arr[15]);
  });

  it('should return inverse', () => {
    const A = new Matrix44(
      3.0, 0.0, 2.0, 1.0,
      2.0, 0.0, -2.0, 2.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 2.0
    );

    const Acopy = new Matrix44(
      3.0, 0.0, 2.0, 1.0,
      2.0, 0.0, -2.0, 2.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 2.0
    );

    const invA = new Matrix44(
      0.2, 0.2, 0.6, -0.6,
      -0.2, 0.3, 2.4, -1.4,
      0.2, -0.3, -0.4, 0.4,
      0.0, 0.0, -1.0, 1.0
    );

    const B = A.inverse();

    for (let i = 0; i < 16; i++) {
      expect(B.m[i]).to.be.closeTo(invA.m[i], 0.0001);
      expect(A.m[i]).to.be.closeTo(Acopy.m[i], 0.0001);
    }
  });

  it('should invert itself', () => {
    const A = new Matrix44(
      3.0, 0.0, 2.0, 1.0,
      2.0, 0.0, -2.0, 2.0,
      0.0, 1.0, 1.0, 1.0,
      0.0, 1.0, 1.0, 2.0
    );

    const invA = new Matrix44(
      0.2, 0.2, 0.6, -0.6,
      -0.2, 0.3, 2.4, -1.4,
      0.2, -0.3, -0.4, 0.4,
      0.0, 0.0, -1.0, 1.0
    );

    const B = A.inverseEquals();

    for (let i = 0; i < 16; i++) {
      expect(B.m[i]).to.be.closeTo(invA.m[i], 0.0001);
      expect(A.m[i]).to.be.closeTo(invA.m[i], 0.0001);
    }
  });

  it('should return matrix product', () => {
    const a00 = 1.0, a01 = 2.0, a02 = 3.0, a03 = 2.0;
    const a10 = 4.0, a11 = 2.0, a12 = 4.0, a13 = 4.0;
    const a20 = 2.0, a21 = 5.0, a22 = 3.0, a23 = 1.0;
    const a30 = -1.0, a31 = 2.0, a32 = -3.0, a33 = -1.0;

    const b00 = 2.0, b01 = 1.0, b02 = 3.0, b03 = -1.0;
    const b10 = 3.0, b11 = -3.0, b12 = -2.0, b13 = 2.0;
    const b20 = 3.0, b21 = -2.0, b22 = -4.0, b23 = -2.0;
    const b30 = -1.0, b31 = 2.0, b32 = -3.0, b33 = -1.0;

    const c00 = 15.0, c01 = -7.0, c02 = -19.0, c03 = -5.0;
    const c10 = 22.0, c11 = -2.0, c12 = -20.0, c13 = -12.0;
    const c20 = 27.0, c21 = -17.0, c22 = -19.0, c23 = 1.0;
    const c30 = -4.0, c31 = -3.0, c32 = 8.0, c33 = 12.0;

    const A = new Matrix44(
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33
    );

    const B = new Matrix44(
      b00, b01, b02, b03,
      b10, b11, b12, b13,
      b20, b21, b22, b23,
      b30, b31, b32, b33
    );

    const C = A.times(B) as Matrix44;

    expect(A.m[0]).to.equal(a00);
    expect(B.m[0]).to.equal(b00);
    expect(C.m[0]).to.equal(c00);
    expect(A.m[1]).to.equal(a10);
    expect(B.m[1]).to.equal(b10);
    expect(C.m[1]).to.equal(c10);
    expect(A.m[2]).to.equal(a20);
    expect(B.m[2]).to.equal(b20);
    expect(C.m[2]).to.equal(c20);
    expect(A.m[3]).to.equal(a30);
    expect(B.m[3]).to.equal(b30);
    expect(C.m[3]).to.equal(c30);

    expect(A.m[4]).to.equal(a01);
    expect(B.m[4]).to.equal(b01);
    expect(C.m[4]).to.equal(c01);
    expect(A.m[5]).to.equal(a11);
    expect(B.m[5]).to.equal(b11);
    expect(C.m[5]).to.equal(c11);
    expect(A.m[6]).to.equal(a21);
    expect(B.m[6]).to.equal(b21);
    expect(C.m[6]).to.equal(c21);
    expect(A.m[7]).to.equal(a31);
    expect(B.m[7]).to.equal(b31);
    expect(C.m[7]).to.equal(c31);

    expect(A.m[8]).to.equal(a02);
    expect(B.m[8]).to.equal(b02);
    expect(C.m[8]).to.equal(c02);
    expect(A.m[9]).to.equal(a12);
    expect(B.m[9]).to.equal(b12);
    expect(C.m[9]).to.equal(c12);
    expect(A.m[10]).to.equal(a22);
    expect(B.m[10]).to.equal(b22);
    expect(C.m[10]).to.equal(c22);
    expect(A.m[11]).to.equal(a32);
    expect(B.m[11]).to.equal(b32);
    expect(C.m[11]).to.equal(c32);

    expect(A.m[12]).to.equal(a03);
    expect(B.m[12]).to.equal(b03);
    expect(C.m[12]).to.equal(c03);
    expect(A.m[13]).to.equal(a13);
    expect(B.m[13]).to.equal(b13);
    expect(C.m[13]).to.equal(c13);
    expect(A.m[14]).to.equal(a23);
    expect(B.m[14]).to.equal(b23);
    expect(C.m[14]).to.equal(c23);
    expect(A.m[15]).to.equal(a33);
    expect(B.m[15]).to.equal(b33);
    expect(C.m[15]).to.equal(c33);
  });

  it('should apply product to itself', () => {
    const a00 = 1.0, a01 = 2.0, a02 = 3.0, a03 = 2.0;
    const a10 = 4.0, a11 = 2.0, a12 = 4.0, a13 = 4.0;
    const a20 = 2.0, a21 = 5.0, a22 = 3.0, a23 = 1.0;
    const a30 = -1.0, a31 = 2.0, a32 = -3.0, a33 = -1.0;

    const b00 = 2.0, b01 = 1.0, b02 = 3.0, b03 = -1.0;
    const b10 = 3.0, b11 = -3.0, b12 = -2.0, b13 = 2.0;
    const b20 = 3.0, b21 = -2.0, b22 = -4.0, b23 = -2.0;
    const b30 = -1.0, b31 = 2.0, b32 = -3.0, b33 = -1.0;

    const c00 = 15.0, c01 = -7.0, c02 = -19.0, c03 = -5.0;
    const c10 = 22.0, c11 = -2.0, c12 = -20.0, c13 = -12.0;
    const c20 = 27.0, c21 = -17.0, c22 = -19.0, c23 = 1.0;
    const c30 = -4.0, c31 = -3.0, c32 = 8.0, c33 = 12.0;

    const A = new Matrix44(
      a00, a01, a02, a03,
      a10, a11, a12, a13,
      a20, a21, a22, a23,
      a30, a31, a32, a33
    );

    const B = new Matrix44(
      b00, b01, b02, b03,
      b10, b11, b12, b13,
      b20, b21, b22, b23,
      b30, b31, b32, b33
    );

    const C = A.timesEquals(B);

    expect(A.m[0]).to.equal(c00);
    expect(B.m[0]).to.equal(b00);
    expect(C.m[0]).to.equal(c00);
    expect(A.m[1]).to.equal(c10);
    expect(B.m[1]).to.equal(b10);
    expect(C.m[1]).to.equal(c10);
    expect(A.m[2]).to.equal(c20);
    expect(B.m[2]).to.equal(b20);
    expect(C.m[2]).to.equal(c20);
    expect(A.m[3]).to.equal(c30);
    expect(B.m[3]).to.equal(b30);
    expect(C.m[3]).to.equal(c30);

    expect(A.m[4]).to.equal(c01);
    expect(B.m[4]).to.equal(b01);
    expect(C.m[4]).to.equal(c01);
    expect(A.m[5]).to.equal(c11);
    expect(B.m[5]).to.equal(b11);
    expect(C.m[5]).to.equal(c11);
    expect(A.m[6]).to.equal(c21);
    expect(B.m[6]).to.equal(b21);
    expect(C.m[6]).to.equal(c21);
    expect(A.m[7]).to.equal(c31);
    expect(B.m[7]).to.equal(b31);
    expect(C.m[7]).to.equal(c31);

    expect(A.m[8]).to.equal(c02);
    expect(B.m[8]).to.equal(b02);
    expect(C.m[8]).to.equal(c02);
    expect(A.m[9]).to.equal(c12);
    expect(B.m[9]).to.equal(b12);
    expect(C.m[9]).to.equal(c12);
    expect(A.m[10]).to.equal(c22);
    expect(B.m[10]).to.equal(b22);
    expect(C.m[10]).to.equal(c22);
    expect(A.m[11]).to.equal(c32);
    expect(B.m[11]).to.equal(b32);
    expect(C.m[11]).to.equal(c32);

    expect(A.m[12]).to.equal(c03);
    expect(B.m[12]).to.equal(b03);
    expect(C.m[12]).to.equal(c03);
    expect(A.m[13]).to.equal(c13);
    expect(B.m[13]).to.equal(b13);
    expect(C.m[13]).to.equal(c13);
    expect(A.m[14]).to.equal(c23);
    expect(B.m[14]).to.equal(b23);
    expect(C.m[14]).to.equal(c23);
    expect(A.m[15]).to.equal(c33);
    expect(B.m[15]).to.equal(b33);
    expect(C.m[15]).to.equal(c33);
  });


});
