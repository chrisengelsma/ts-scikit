import { expect } from 'chai';
import 'mocha';
import {
  almostEqual,
  arrayDimensions,
  binarySearch,
  ccopy,
  copy,
  cosFromSin,
  isDecreasing,
  isIncreasing,
  isMonotonic,
  quickPartialSort,
  ramp,
  toDegrees,
  toRadians,
} from '../../src/utils';
import { czero, fill, zero } from '../../src/utils/array-math';

describe('Array Math', () => {

  const randomArray = (n: number): number[] => {
    // @ts-ignore
    return Array.from({ length: n }, () => randint(0, 40));
  };

  const randint = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * ( max - min )) + min;
  };

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

    let arr1: number[];
    let arr2: number[][];
    let arr3: number[][][];

    beforeEach(() => {
      const n = 4;
      arr1 = randomArray(n);
      arr2 = new Array<number[]>(n);
      arr3 = new Array<number[][]>(n);
      for (let i = 0; i < n; ++i) {
        arr2[i] = randomArray(n);
        arr3[i] = new Array<number[]>(n);
        for (let j = 0; j < n; ++j) {
          arr3[i][j] = randomArray(n);
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

  describe('#ccopy()', () => {

    let arr1: number[];
    let arr2: number[][];
    let arr3: number[][][];

    beforeEach(() => {
      const n = 4;
      arr1 = randomArray(n * 2);
      arr2 = new Array<number[]>(n);
      arr3 = new Array<number[][]>(n);
      for (let i = 0; i < n; ++i) {
        arr2[i] = randomArray(n * 2);
        arr3[i] = new Array<number[]>(n);
        for (let j = 0; j < n; ++j) {
          arr3[i][j] = randomArray(n * 2);
        }
      }
    });

    it('should copy complex 1D array', () => {
      const a = ccopy(arr1);
      expect(a).to.deep.equal(arr1);
      expect(a == arr1).to.be.false;
    });

    it('should copy complex 1D array subset', () => {
      const a = ccopy(arr1, 2);
      expect(a).to.deep.equal([ arr1[0], arr1[1], arr1[2], arr1[3] ]);
    });

    it('should copy complex 1D array subset with offset', () => {
      const a = ccopy(arr1, 2, 2);
      expect(a).to.deep.equal([
        arr1[4], arr1[5], arr1[6], arr1[7]
      ]);
    });

    it('should copy complex 1D array subset with offset and stride', () => {
      const a = ccopy(arr1, 2, 1, 2);
      expect(a).to.deep.equal([ arr1[2], arr1[3], arr1[6], arr1[7] ]);
    });

    it('should copy complex 2D array', () => {
      const a = ccopy(arr2);
      expect(a).to.deep.equal(arr2);
      expect(a == arr2).to.be.false;
    });

    it('should copy complex 2D array subset', () => {
      const a = ccopy(arr2, 2, 2);
      expect(a).to.deep.equal([
        [ arr2[0][0], arr2[0][1], arr2[0][2], arr2[0][3] ],
        [ arr2[1][0], arr2[1][1], arr2[1][2], arr2[1][3], ]
      ]);
    });

    it('should copy complex 2D array subset with offset', () => {
      const a = ccopy(arr2, 2, 2, 1, 1);
      expect(a).to.deep.equal([
        [ arr2[1][2], arr2[1][3], arr2[1][4], arr2[1][5] ],
        [ arr2[2][2], arr2[2][3], arr2[2][4], arr2[2][5] ]
      ]);
    });

    it('should copy complex 2D array subset with offset and stride', () => {
      const a = ccopy(arr2, 2, 2, 1, 1, 2, 2);
      expect(a).to.deep.equal([
        [ arr2[1][2], arr2[1][3], arr2[1][6], arr2[1][7] ],
        [ arr2[3][2], arr2[3][3], arr2[3][6], arr2[3][7] ]
      ]);
    });

    it('should copy complex 3D array', () => {
      const a = ccopy(arr3);
      expect(a).to.deep.equal(arr3);
      expect(a == arr3).to.be.false;
    });

    it('should copy complex 3D array subset', () => {
      const a = ccopy(arr3, 2, 2, 2);
      expect(a).to.deep.equal([
        [
          [ arr3[0][0][0], arr3[0][0][1], arr3[0][0][2], arr3[0][0][3] ],
          [ arr3[0][1][0], arr3[0][1][1], arr3[0][1][2], arr3[0][1][3] ]
        ],
        [
          [ arr3[1][0][0], arr3[1][0][1], arr3[1][0][2], arr3[1][0][3] ],
          [ arr3[1][1][0], arr3[1][1][1], arr3[1][1][2], arr3[1][1][3] ]
        ]
      ]);
    });

    it('should complex copy 3D array subset with offset', () => {
      const a = ccopy(arr3, 2, 2, 2, 1, 1, 1);
      expect(a).to.deep.equal([
        [
          [ arr3[1][1][2], arr3[1][1][3], arr3[1][1][4], arr3[1][1][5] ],
          [ arr3[1][2][2], arr3[1][2][3], arr3[1][2][4], arr3[1][2][5] ]
        ],
        [
          [ arr3[2][1][2], arr3[2][1][3], arr3[2][1][4], arr3[2][1][5] ],
          [ arr3[2][2][2], arr3[2][2][3], arr3[2][2][4], arr3[2][2][5] ]
        ]
      ]);
    });

    it('should copy 3D array subset with offset and stride', () => {
      const a = ccopy(arr3, 2, 2, 2, 1, 1, 1, 2, 2, 2);
      expect(a).to.deep.equal([
        [
          [ arr3[1][1][2], arr3[1][1][3], arr3[1][1][6], arr3[1][1][7] ],
          [ arr3[1][3][2], arr3[1][3][3], arr3[1][3][6], arr3[1][3][7] ]
        ],
        [
          [ arr3[3][1][2], arr3[3][1][3], arr3[3][1][6], arr3[3][1][7] ],
          [ arr3[3][3][2], arr3[3][3][3], arr3[3][3][6], arr3[3][3][7] ]
        ]
      ]);
    });
  });


  describe('#fill()', () => {

    it('should return new 1D array of all the same value', () => {
      const n1 = 10;
      const ra = 100;
      const rx: number[] = fill(ra, n1);

      for (let i1 = 0; i1 < n1; ++i1) {
        expect(rx[i1]).to.equal(ra);
      }
    });

    it('should return new 2D array of all the same value', () => {
      const n1 = 10;
      const n2 = 8;
      const ra = 100;
      const rx: number[][] = fill(ra, n1, n2);

      for (let i2 = 0; i2 < n2; ++i2) {
        for (let i1 = 0; i1 < n1; ++i1) {
          expect(rx[i2][i1]).to.equal(ra);
        }
      }
    });

    it('should return new 3D array of all the same value', () => {
      const n1 = 10;
      const n2 = 8;
      const n3 = 6;
      const ra = 100;

      const rx = fill(ra, n1, n2, n3);

      for (let i3 = 0; i3 < n3; ++i3) {
        for (let i2 = 0; i2 < n2; ++i2) {
          for (let i1 = 0; i1 < n1; ++i1) {
            expect(rx[i3][i2][i1]).to.equal(ra);
          }
        }
      }
    });

    it('should fill existing 1D array', () => {
      const n1 = 10;
      const rx: number[] = randomArray(n1);
      const ra = 100;

      fill(rx, ra);

      for (let i1 = 0; i1 < n1; ++i1) {
        expect(rx[i1]).to.equal(ra);
      }
    });


    it('should fill existing 2D array', () => {
      const n1 = 10;
      const n2 = 10;
      const ra = 100;

      const rx: number[][] = new Array<number[]>(n2);
      for (let i2 = 0; i2 < n2; ++i2) {
        rx[i2] = randomArray(n1);
      }

      fill(rx, ra);

      for (let i2 = 0; i2 < n2; ++i2) {
        for (let i1 = 0; i1 < n1; ++i1) {
          expect(rx[i2][i1]).to.equal(ra);
        }
      }
    });

    it('should fill existing 3D array', () => {
      const n1 = 10;
      const n2 = 10;
      const n3 = 10;
      const ra = 100;

      const rx: number[][][] = new Array<number[][]>(n3);
      for (let i3 = 0; i3 < n3; ++i3) {
        rx[i3] = new Array<number[]>(n2);
        for (let i2 = 0; i2 < n2; ++i2) {
          rx[i3][i2] = randomArray(n1);
        }
      }

      fill(rx, ra);

      for (let i3 = 0; i3 < n3; ++i3) {
        for (let i2 = 0; i2 < n2; ++i2) {
          for (let i1 = 0; i1 < n1; ++i1) {
            expect(rx[i3][i2][i1]).to.equal(ra);
          }
        }
      }
    });
  });

  describe('#zero()', () => {

    it('should return new 1D array of zeros', () => {
      const n1 = 10;
      const rx: number[] = zero(n1);
      for (let i1 = 0; i1 < n1; ++i1) {
        expect(rx[i1]).to.equal(0);
      }
    });

    it('should return new 2D array of zeros', () => {
      const n1 = 10;
      const n2 = 8;
      const rx: number[][] = zero(n1, n2);
      for (let i2 = 0; i2 < n2; ++i2) {
        for (let i1 = 0; i1 < n1; ++i1) {
          expect(rx[i2][i1]).to.equal(0);
        }
      }
    });

    it('should return new 3D array of zeros', () => {
      const n1 = 10;
      const n2 = 8;
      const n3 = 6;
      const rx: number[][][] = zero(n1, n2, n3);
      for (let i3 = 0; i3 < n3; ++i3) {
        for (let i2 = 0; i2 < n2; ++i2) {
          for (let i1 = 0; i1 < n1; ++i1) {
            expect(rx[i3][i2][i1]).to.equal(0);
          }
        }
      }
    });

    it('should zero existing 1D array', () => {
      const n1 = 10;

      const rx: number[] = randomArray(n1);

      zero(rx);

      for (let i1 = 0; i1 < n1; ++i1) {
        expect(rx[i1]).to.equal(0);
      }
    });


    it('should zero existing 2D array', () => {
      const n1 = 10;
      const n2 = 10;

      const rx: number[][] = new Array<number[]>(n2);
      for (let i2 = 0; i2 < n2; ++i2) {
        rx[i2] = randomArray(n1);
      }

      zero(rx);

      for (let i2 = 0; i2 < n2; ++i2) {
        for (let i1 = 0; i1 < n1; ++i1) {
          expect(rx[i2][i1]).to.equal(0);
        }
      }
    });

    it('should zero existing 3D array', () => {
      const n1 = 10;
      const n2 = 10;
      const n3 = 10;

      const rx: number[][][] = new Array<number[][]>(n3);
      for (let i3 = 0; i3 < n3; ++i3) {
        rx[i3] = new Array<number[]>(n2);
        for (let i2 = 0; i2 < n2; ++i2) {
          rx[i3][i2] = randomArray(n1);
        }
      }

      zero(rx);

      for (let i3 = 0; i3 < n3; ++i3) {
        for (let i2 = 0; i2 < n2; ++i2) {
          for (let i1 = 0; i1 < n1; ++i1) {
            expect(rx[i3][i2][i1]).to.equal(0);
          }
        }
      }
    });
  });


  describe('#czero()', () => {

    it('should return new complex 1D array of zeros', () => {
      const n1 = 10;
      const cx: number[] = czero(n1);
      for (let i1 = 0; i1 < n1; ++i1) {
        expect(cx[2 * i1]).to.equal(0);
        expect(cx[2 * i1 + 1]).to.equal(0);
      }
    });

    it('should return new complex 2D array of zeros', () => {
      const n1 = 10;
      const n2 = 8;
      const cx: number[][] = czero(n1, n2);
      for (let i2 = 0; i2 < n2; ++i2) {
        for (let i1 = 0; i1 < n1; ++i1) {
          expect(cx[i2][2 * i1]).to.equal(0);
          expect(cx[i2][2 * i1 + 1]).to.equal(0);
        }
      }
    });

    it('should return new complex 3D array of zeros', () => {
      const n1 = 10;
      const n2 = 8;
      const n3 = 6;
      const cx: number[][][] = czero(n1, n2, n3);
      for (let i3 = 0; i3 < n3; ++i3) {
        for (let i2 = 0; i2 < n2; ++i2) {
          for (let i1 = 0; i1 < n1; ++i1) {
            expect(cx[i3][i2][2 * i1]).to.equal(0);
            expect(cx[i3][i2][2 * i1 + 1]).to.equal(0);
          }
        }
      }
    });

    it('should zero existing complex 1D array', () => {
      const n1 = 10;
      const cx: number[] = randomArray(2 * n1);

      czero(cx);

      for (let i1 = 0; i1 < n1; ++i1) {
        expect(cx[2 * i1]).to.equal(0);
        expect(cx[2 * i1 + 1]).to.equal(0);
      }
    });


    it('should zero existing complex 2D array', () => {
      const n1 = 10;
      const n2 = 10;

      const cx: number[][] = new Array<number[]>(n2);
      for (let i2 = 0; i2 < n2; ++i2) {
        cx[i2] = randomArray(2 * n1);
      }

      czero(cx);

      for (let i2 = 0; i2 < n2; ++i2) {
        for (let i1 = 0; i1 < n1; ++i1) {
          expect(cx[i2][i1]).to.equal(0);
        }
      }
    });

    it('should zero existing complex 3D array', () => {
      const n1 = 10;
      const n2 = 10;
      const n3 = 10;

      const cx: number[][][] = new Array<number[][]>(n3);
      for (let i3 = 0; i3 < n3; ++i3) {
        cx[i3] = new Array<number[]>(n2);
        for (let i2 = 0; i2 < n2; ++i2) {
          cx[i3][i2] = randomArray(2 * n1);
        }
      }

      czero(cx);

      for (let i3 = 0; i3 < n3; ++i3) {
        for (let i2 = 0; i2 < n2; ++i2) {
          for (let i1 = 0; i1 < n1; ++i1) {
            expect(cx[i3][i2][2 * i1]).to.equal(0);
            expect(cx[i3][i2][2 * i1 + 1]).to.equal(0);
          }
        }
      }
    });
  });

  describe('#ramp()', () => {

    it('should ramp 1D array by reference', () => {
      const n1: number = 7;
      const d1: number = 1.0;
      const f1: number = 0.0;

      const x: number[] = zero(n1);

      ramp(x, f1, d1);

      for (let i1 = 0; i1 < n1; ++i1) {
        expect(x[i1]).to.equal(i1);
      }
    });

    it('should ramp 2D array by reference', () => {
      const n1: number = 7;
      const n2: number = 5;
      const d1: number = 1.0;
      const d2: number = 2.0;
      const f1: number = 0.0;

      const x: number[][] = zero(n1, n2);

      ramp(x, f1, d1, d2);

      for (let i2 = 0; i2 < n2; ++i2) {
        for (let i1 = 0; i1 < n1; ++i1) {
          expect(x[i2][i1]).to.equal(2 * i2 + i1);
        }
      }
    });


    it('should ramp 3D array by reference', () => {
      const n1: number = 7;
      const n2: number = 5;
      const n3: number = 3;
      const d1: number = 1.0;
      const d2: number = 2.0;
      const d3: number = 1.0;
      const f1: number = 0.0;

      const x: number[][][] = zero(n1, n2, n3);

      ramp(x, f1, d1, d2, d3);

      for (let i3 = 0; i3 < n3; ++i3) {
        for (let i2 = 0; i2 < n2; ++i2) {
          for (let i1 = 0; i1 < n1; ++i1) {
            expect(x[i3][i2][i1]).to.equal(i3 + 2 * i2 + i1);
          }
        }
      }
    });
  });

  it('should ramp new 1D array', () => {
    const n1: number = 7;

    const d1: number = 1.0;

    const f1: number = 0.0;

    const x = ramp(f1, d1, n1);

    for (let i1 = 0; i1 < n1; ++i1) {
      expect(x[i1]).to.equal(i1);
    }
  });

  it('should ramp new 2D array', () => {
    const n1: number = 7;
    const n2: number = 5;

    const d1: number = 1.0;
    const d2: number = 2.0;

    const f1: number = 0.0;

    const x = ramp(f1, d1, d2, n1, n2);

    for (let i2 = 0; i2 < n2; ++i2) {
      for (let i1 = 0; i1 < n1; ++i1) {
        expect(x[i2][i1]).to.equal(2 * i2 + i1);
      }
    }
  });


  it('should ramp new 3D array', () => {
    const n1: number = 7;
    const n2: number = 5;
    const n3: number = 3;

    const d1: number = 1.0;
    const d2: number = 2.0;
    const d3: number = 1.0;

    const f1: number = 0.0;

    const x = ramp(f1, d1, d2, d3, n1, n2, n3);

    for (let i3 = 0; i3 < n3; ++i3) {
      for (let i2 = 0; i2 < n2; ++i2) {
        for (let i1 = 0; i1 < n1; ++i1) {
          expect(x[i3][i2][i1]).to.equal(i3 + 2 * i2 + i1);
        }
      }
    }
  });
});

