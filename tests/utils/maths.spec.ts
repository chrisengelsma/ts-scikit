import { expect } from 'chai';
import 'mocha';
import { MathsUtils } from '../../src/utils';

describe('Maths Utilities', () => {

  const EPS = 0.000001;

  describe('#cosFromSin()', () => {
    it('should compute cosine of an angle from its sine value', () => {
      const a = Math.PI / 2;
      const sa = Math.sin(a);
      const ca = Math.cos(a);

      expect(MathsUtils.CosFromSin(sa, a)).to.be.closeTo(ca, EPS);
    });
  });

  describe('#toRadians()', () => {
    it('should convert degrees to radians', () => {
      const degrees = [ 0, 45, 90, 180, 360 ];
      const radians = [ 0, Math.PI / 4.0, Math.PI / 2.0, Math.PI, 2 * Math.PI ];

      for (let i = 0; i < degrees.length; ++i) {
        expect(MathsUtils.ToRadians(degrees[i])).to.be.closeTo(radians[i], EPS);
      }
    });
  });

  describe('#toDegrees()', () => {
    it('should convert radians to degrees', () => {
      const degrees = [ 0, 45, 90, 180, 360 ];
      const radians = [ 0, Math.PI / 4.0, Math.PI / 2.0, Math.PI, 2 * Math.PI ];
      for (let i = 0; i < radians.length; ++i) {
        expect(MathsUtils.ToDegrees(radians[i])).to.be.closeTo(degrees[i], EPS);
      }
    });
  });


  describe('#isIncreasing()', () => {
    it('should determine if array values are increasing', () => {
      expect(MathsUtils.IsIncreasing([ 0, 1, 2, 3, 4 ])).to.be.true;
      expect(MathsUtils.IsIncreasing([ 0, 1, 2, 4, 3 ])).to.be.false;
      expect(MathsUtils.IsIncreasing([ 0, 1, 2, 3, 3 ])).to.be.true;
      expect(MathsUtils.IsIncreasing([ 0, 0, 0, 0, 0 ])).to.be.true;
      expect(MathsUtils.IsIncreasing([ 0, 0, 1, 2, 3 ])).to.be.true;
    });
  });

  describe('#isDecreasing()', () => {
    it('should determine if array values are decreasing', () => {
      expect(MathsUtils.IsDecreasing([ 4, 3, 2, 1, 0 ])).to.be.true;
      expect(MathsUtils.IsDecreasing([ 3, 4, 2, 1, 0 ])).to.be.false;
      expect(MathsUtils.IsDecreasing([ 3, 3, 2, 1, 0 ])).to.be.true;
      expect(MathsUtils.IsDecreasing([ 0, 0, 0, 0, 0 ])).to.be.true;
      expect(MathsUtils.IsDecreasing([ 4, 3, 2, 1, 1 ])).to.be.true;
    });
  });

  describe('#isMonotonic()', () => {
    it('should determine if array is monotonic', () => {
      expect(MathsUtils.IsMonotonic([ 0, 1, 2, 3, 4 ])).to.be.true;
      expect(MathsUtils.IsMonotonic([ 4, 3, 2, 1, 0 ])).to.be.true;
      expect(MathsUtils.IsMonotonic([ 0, 0, 0, 0, 0 ])).to.be.true;
      expect(MathsUtils.IsMonotonic([ 4, 3, 4, 3, 2 ])).to.be.false;
    });
  });

  describe('#almostEqual()', () => {
    it('should verify two values are almost equal', () => {
      expect(MathsUtils.AlmostEqual(1.0, 1.0001, 0.0001)).to.be.true;
      expect(MathsUtils.AlmostEqual(1.0, 1.0001, 0.00009)).to.be.false;
    });
  });

  describe('#copy()', () => {
    it('should copy entire array by value', () => {
      const arr1 = [ 0, 1, 2, 3, 4, 5 ];
      const arr1Ref = arr1;
      let arr2 = MathsUtils.Copy(arr1);

      expect(arr1).to.deep.equal(arr1Ref);
      expect(arr1).to.deep.equal(arr2);

      arr1[0] = 6; // Changing arr1 should affect arr1Ref but not arr2 (to prove copy by value).
      expect(arr1).to.deep.equal(arr1Ref);
      expect(arr1).to.not.deep.equal(arr2);
    });

    it('should copy array by value at starting index', () => {
      const arr1 = [ 0, 1, 2, 3, 4, 5 ];
      const arr2 = MathsUtils.Copy(arr1, 2);

      expect(arr2).to.deep.equal([ 2, 3, 4, 5 ]);
    });

    it('should copy array by value if starting index is outside range', () => {
      const arr1 = [ 0, 1, 2, 3, 4, 5 ];
      const arr2 = MathsUtils.Copy(arr1, -10);
      const arr3 = MathsUtils.Copy(arr1, 10);

      expect(arr2).to.deep.equal(arr1);
      expect(arr3).to.deep.equal([]);
    });
  });

  describe('#quickPartialSort()', () => {
    it('should sort an array of values', () => {
      const arr1 = [ 1, 5, 2, 7, 3, 4, 6, 9, 8 ];
      const arr2 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
      MathsUtils.QuickPartialSort(0, arr1);
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
      expect(MathsUtils.BinarySearch(inc, 10)).to.equal(5);
      expect(MathsUtils.BinarySearch(inc, 0)).to.equal(0);
      expect(MathsUtils.BinarySearch(inc, 20)).to.equal(10);

      expect(MathsUtils.BinarySearch(dec, 10)).to.equal(5);
      expect(MathsUtils.BinarySearch(dec, 0)).to.equal(10);
      expect(MathsUtils.BinarySearch(dec, 20)).to.equal(0);
    });

    it('should find missing value with default starting index', () => {
      expect(MathsUtils.BinarySearch(inc, 11)).to.equal(-7);
      expect(MathsUtils.BinarySearch(inc, 1)).to.equal(-2);
      expect(MathsUtils.BinarySearch(inc, 21)).to.equal(-12);

      expect(MathsUtils.BinarySearch(dec, 11)).to.equal(-6);
      expect(MathsUtils.BinarySearch(dec, 1)).to.equal(-11);
      expect(MathsUtils.BinarySearch(dec, 21)).to.equal(-1);
    });

    it ('should find existing value with custom starting index', () => {
      expect(MathsUtils.BinarySearch(inc, 10, 1)).to.equal(5);
      expect(MathsUtils.BinarySearch(dec, 10, 1)).to.equal(5);
    });

    it ('should find existing value with custom starting index', () => {
      expect(MathsUtils.BinarySearch(inc, 10, 1)).to.equal(5);
      expect(MathsUtils.BinarySearch(dec, 10, 5)).to.equal(5);
    });
  });
});

