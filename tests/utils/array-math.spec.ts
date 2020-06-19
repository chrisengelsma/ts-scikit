import { expect } from 'chai';
import 'mocha';
import {
  almostEqual,
  arrayDimensions,
  binarySearch,
  copy,
  cosFromSin,
  isDecreasing,
  isIncreasing,
  isMonotonic,
  quickPartialSort,
  toDegrees,
  toRadians
} from '../../src/utils';

describe('Array Math', () => {

  const EPS = 0.000001;

  describe('#cosFromSin()', () => {
    it('should compute cosine of an angle from its sine value', () => {
      const a = Math.PI / 2;
      const sa = Math.sin(a);
      const ca = Math.cos(a);

      expect(cosFromSin(sa, a)).to.be.closeTo(ca, EPS);
    });
  });

  describe('#toRadians()', () => {
    it('should convert degrees to radians', () => {
      const degrees = [ 0, 45, 90, 180, 360 ];
      const radians = [ 0, Math.PI / 4.0, Math.PI / 2.0, Math.PI, 2 * Math.PI ];

      for (let i = 0; i < degrees.length; ++i) {
        expect(toRadians(degrees[i])).to.be.closeTo(radians[i], EPS);
      }
    });
  });

  describe('#toDegrees()', () => {
    it('should convert radians to degrees', () => {
      const degrees = [ 0, 45, 90, 180, 360 ];
      const radians = [ 0, Math.PI / 4.0, Math.PI / 2.0, Math.PI, 2 * Math.PI ];
      for (let i = 0; i < radians.length; ++i) {
        expect(toDegrees(radians[i])).to.be.closeTo(degrees[i], EPS);
      }
    });
  });


  describe('#isIncreasing()', () => {
    it('should determine if array values are increasing', () => {
      expect(isIncreasing([ 0, 1, 2, 3, 4 ])).to.be.true;
      expect(isIncreasing([ 0, 1, 2, 4, 3 ])).to.be.false;
      expect(isIncreasing([ 0, 1, 2, 3, 3 ])).to.be.true;
      expect(isIncreasing([ 0, 0, 0, 0, 0 ])).to.be.true;
      expect(isIncreasing([ 0, 0, 1, 2, 3 ])).to.be.true;
    });
  });

  describe('#isDecreasing()', () => {
    it('should determine if array values are decreasing', () => {
      expect(isDecreasing([ 4, 3, 2, 1, 0 ])).to.be.true;
      expect(isDecreasing([ 3, 4, 2, 1, 0 ])).to.be.false;
      expect(isDecreasing([ 3, 3, 2, 1, 0 ])).to.be.true;
      expect(isDecreasing([ 0, 0, 0, 0, 0 ])).to.be.true;
      expect(isDecreasing([ 4, 3, 2, 1, 1 ])).to.be.true;
    });
  });

  describe('#isMonotonic()', () => {
    it('should determine if array is monotonic', () => {
      expect(isMonotonic([ 0, 1, 2, 3, 4 ])).to.be.true;
      expect(isMonotonic([ 4, 3, 2, 1, 0 ])).to.be.true;
      expect(isMonotonic([ 0, 0, 0, 0, 0 ])).to.be.true;
      expect(isMonotonic([ 4, 3, 4, 3, 2 ])).to.be.false;
    });
  });

  describe('#almostEqual()', () => {
    it('should verify two values are almost equal', () => {
      expect(almostEqual(1.0, 1.0001, 0.0001)).to.be.true;
      expect(almostEqual(1.0, 1.0001, 0.00009)).to.be.false;
    });
  });

  describe('#quickPartialSort()', () => {
    it('should sort an array of values', () => {
      const arr1 = [ 1, 5, 2, 7, 3, 4, 6, 9, 8 ];
      const arr2 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
      quickPartialSort(0, arr1);
      expect(arr1).to.deep.equal(arr2);
    });
  });

  describe('#binarySearch()', () => {

    let inc: number[];
    let dec: number[];

    beforeEach(() => {
      inc = [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ];
      dec = Object.assign([], inc).reverse();
    });

    it('should find existing value with default starting index', () => {
      expect(binarySearch(inc, 10)).to.equal(5);
      expect(binarySearch(inc, 0)).to.equal(0);
      expect(binarySearch(inc, 20)).to.equal(10);

      expect(binarySearch(dec, 10)).to.equal(5);
      expect(binarySearch(dec, 0)).to.equal(10);
      expect(binarySearch(dec, 20)).to.equal(0);
    });

    it('should find missing value with default starting index', () => {
      expect(binarySearch(inc, 11)).to.equal(-7);
      expect(binarySearch(inc, 1)).to.equal(-2);
      expect(binarySearch(inc, 21)).to.equal(-12);

      expect(binarySearch(dec, 11)).to.equal(-6);
      expect(binarySearch(dec, 1)).to.equal(-11);
      expect(binarySearch(dec, 21)).to.equal(-1);
    });

    it('should find existing value with custom starting index', () => {
      expect(binarySearch(inc, 10, 1)).to.equal(5);
      expect(binarySearch(dec, 10, 1)).to.equal(5);
    });

    it('should find existing value with custom starting index', () => {
      expect(binarySearch(inc, 10, 1)).to.equal(5);
      expect(binarySearch(dec, 10, 5)).to.equal(5);
    });
  });

  describe('#arrayDimensions()', () => {
    it('should get dimensions of array', () => {
      const a0 = 0;
      const a1 = [ 0, 0 ];
      const a2 = [ [ 0, 0 ], [ 0, 0 ] ];
      const a3 = [ [ [ 0, 0 ], [ 0, 0 ] ], [ [ 0, 0 ], [ 0, 0 ] ], [ [ 0, 0 ], [ 0, 0 ] ] ];

      expect(arrayDimensions(a0)).to.equal(0);
      expect(arrayDimensions(a1)).to.equal(1);
      expect(arrayDimensions(a2)).to.equal(2);
      expect(arrayDimensions(a3)).to.equal(3);
    });
  });

  describe('#copy()', () => {

    const randomArray = (): number[] => {
      // @ts-ignore
      return Array.from({ length: 4 }, () => Math.floor(Math.random() * 40));
    };

    let arr1: number[];
    let arr2: number[][];
    let arr3: number[][][];

    beforeEach(() => {
      arr1 = randomArray();
      arr2 = new Array<number[]>(4);
      arr3 = new Array<number[][]>(4);
      for (let i = 0; i < 4; ++i) {
        arr2[i] = randomArray();
        arr3[i] = new Array<number[]>(4);
        for (let j = 0; j < 4; ++j) {
          arr3[i][j] = randomArray();
        }
      }
    });

    it('should copy 1D array', () => {
      const a = copy(arr1);
      expect(a).to.deep.equal(arr1);
      expect(a == arr1).to.be.false;
    });

    it('should copy 1D array subset', () => {
      const a = copy(arr1, 2);
      expect(a).to.deep.equal([ arr1[0], arr1[1] ]);
    });

    it('should copy 1D array subset with offset', () => {
      const a = copy(arr1, 2, 2);
      expect(a).to.deep.equal([ arr1[2], arr1[3] ]);
    });

    it('should copy 1D array subset with offset and stride', () => {
      const a = copy(arr1, 2, 1, 2);
      expect(a).to.deep.equal([ arr1[1], arr1[3] ]);
    });

    it('should copy 2D array', () => {
      const a = copy(arr2);
      expect(a).to.deep.equal(arr2);
      expect(a == arr2).to.be.false;
    });

    it('should copy 2D array subset', () => {
      const a = copy(arr2, 2, 2);
      expect(a).to.deep.equal([
        [ arr2[0][0], arr2[0][1] ],
        [ arr2[1][0], arr2[1][1] ]
      ]);
    });

    it('should copy 2D array subset with offset', () => {
      const a = copy(arr2, 2, 2, 1, 1);
      expect(a).to.deep.equal([
        [ arr2[1][1], arr2[1][2] ],
        [ arr2[2][1], arr2[2][2] ]
      ]);
    });

    it('should copy 2D array subset with offset and stride', () => {
      const a = copy(arr2, 2, 2, 1, 1, 2, 2);
      expect(a).to.deep.equal([
        [ arr2[1][1], arr2[1][3] ],
        [ arr2[3][1], arr2[3][3] ]
      ]);
    });

    it('should copy 3D array', () => {
      const a = copy(arr3);
      expect(a).to.deep.equal(arr3);
      expect(a == arr3).to.be.false;
    });

    it('should copy 3D array subset', () => {
      const a = copy(arr3, 2, 2, 2);
      console.log(a);
      expect(a).to.deep.equal([
        [
          [ arr3[0][0][0], arr3[0][0][1] ],
          [ arr3[0][1][0], arr3[0][1][1] ]
        ],
        [
          [ arr3[1][0][0], arr3[1][0][1] ],
          [ arr3[1][1][0], arr3[1][1][1] ]
        ]
      ]);
    });

    it('should copy 3D array subset with offset', () => {
      const a = copy(arr3, 2, 2, 2, 1, 1, 1);
      console.log(a);
      expect(a).to.deep.equal([
        [
          [ arr3[1][1][1], arr3[1][1][2] ],
          [ arr3[1][2][1], arr3[1][2][2] ]
        ],
        [
          [ arr3[2][1][1], arr3[2][1][2] ],
          [ arr3[2][2][1], arr3[2][2][2] ]
        ]
      ]);
    });

    it('should copy 3D array subset with offset and stride', () => {
      const a = copy(arr3, 2, 2, 2, 1, 1, 1, 2, 2, 2);
      console.log(a);
      expect(a).to.deep.equal([
        [
          [ arr3[1][1][1], arr3[1][1][3] ],
          [ arr3[1][3][1], arr3[1][3][3] ]
        ],
        [
          [ arr3[3][1][1], arr3[3][1][3] ],
          [ arr3[3][3][1], arr3[3][3][3] ]
        ]
      ]);
    });
  });
});

