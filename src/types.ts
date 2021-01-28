export type ExtrapolationType =
  | 'ZeroValue'  // Extrapolate with zero values.
  | 'ZeroSlope'; // Extrapolate values at the ends with zero slope.

export type EulerAngleOrderType =
  | 'XYZ'
  | 'ZYX'
  | 'YZX'
