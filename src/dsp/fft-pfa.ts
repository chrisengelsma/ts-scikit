import { Check, binarySearch } from '../utils';

/**
 * A prime-factor (PFA) complex-to-complex FFT.
 * <p>
 * The FFT length nfft must be composed of mutually prime factors from the
 * set { 2, 3, 4, 5, 7, 8, 9, 11, 13, 16 }. This restriction implies n
 * cannot exceed 720720 = 5 * 7 * 9 * 11 * 13 * 16.
 * <p>
 * References:
 * <ul><li>
 *   Temperton, C., 1985, Implementation of a self-sorting in-place prime
 *   factor fft algorithm:  Journal of Computational Physics, v. 58,
 *   p. 283-299.
 * </li><li>
 *   Temperton, C., 1988, A new set of minimum-add rotated rotated dft
 *   modules: Journal of Computational Physics, v. 75, p. 190-198.
 * </li></ul>
 */
export class FftPfa {

  // Constants used in this implementation of the prime-factor FFT.
  private static readonly _P120 = 0.120536680;
  private static readonly _P142 = 0.142314838;
  private static readonly _P173 = 0.173648178;
  private static readonly _P222 = 0.222520934;
  private static readonly _P239 = 0.239315664;
  private static readonly _P281 = 0.281732557;
  private static readonly _P342 = 0.342020143;
  private static readonly _P354 = 0.354604887;
  private static readonly _P382 = 0.382683432;
  private static readonly _P415 = 0.415415013;
  private static readonly _P433 = 0.433883739;
  private static readonly _P464 = 0.464723172;
  private static readonly _P540 = 0.540640817;
  private static readonly _P559 = 0.559016994;
  private static readonly _P568 = 0.568064747;
  private static readonly _P587 = 0.587785252;
  private static readonly _P623 = 0.623489802;
  private static readonly _P642 = 0.642787610;
  private static readonly _P654 = 0.654860734;
  private static readonly _P663 = 0.663122658;
  private static readonly _P707 = 0.707106781;
  private static readonly _P748 = 0.748510748;
  private static readonly _P755 = 0.755749574;
  private static readonly _P766 = 0.766044443;
  private static readonly _P781 = 0.781831482;
  private static readonly _P822 = 0.822983866;
  private static readonly _P841 = 0.841253533;
  private static readonly _P866 = 0.866025404;
  private static readonly _P885 = 0.885456026;
  private static readonly _P900 = 0.900968868;
  private static readonly _P909 = 0.909631995;
  private static readonly _P923 = 0.923879533;
  private static readonly _P935 = 0.935016243;
  private static readonly _P939 = 0.939692621;
  private static readonly _P951 = 0.951056516;
  private static readonly _P959 = 0.959492974;
  private static readonly _P970 = 0.970941817;
  private static readonly _P974 = 0.974927912;
  private static readonly _P984 = 0.984807753;
  private static readonly _P989 = 0.989821442;
  private static readonly _P992 = 0.992708874;
  private static readonly _PONE = 1.000000000;

  // Factors supported in this implementation of the prime-factor FFT.
  // Methods in this class require that these factors be in descending order.
  private static readonly _NFAC = 10;
  private static readonly _kfac: number[] = [ 16, 13, 11, 9, 8, 7, 5, 4, 3, 2 ];

  // FFT lengths supported in this implementation of the prime-factor FFT.
  // These lengths are the products of mutually prime factors chosen from
  // the set above. For example, note that 17 and 32 are not in this table;
  // 17 is not in the set above, and 32 = 2 * 16 is not valid, because the
  // factors 2 and 16 share the prime factor 2.
  private static readonly _NTABLE = 240;
  private static readonly _ntable: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 22, 24, 26, 28, 30, 33,
    35, 36, 39, 40, 42, 44, 45, 48, 52, 55, 56, 60, 63, 65, 66, 70,
    72, 77, 78, 80, 84, 88, 90, 91, 99,
    104, 105, 110, 112, 117, 120, 126, 130, 132, 140, 143, 144, 154,
    156, 165, 168, 176, 180, 182, 195, 198, 208, 210, 220, 231, 234,
    240, 252, 260, 264, 273, 280, 286, 308, 312, 315, 330, 336, 360,
    364, 385, 390, 396, 420, 429, 440, 455, 462, 468, 495, 504, 520,
    528, 546, 560, 572, 585, 616, 624, 630, 660, 693, 715, 720, 728,
    770, 780, 792, 819, 840, 858, 880, 910, 924, 936, 990,
    1001, 1008, 1040, 1092, 1144, 1155, 1170, 1232, 1260, 1287, 1320,
    1365, 1386, 1430, 1456, 1540, 1560, 1584, 1638, 1680, 1716, 1820,
    1848, 1872, 1980, 2002, 2145, 2184, 2288, 2310, 2340, 2520, 2574,
    2640, 2730, 2772, 2860, 3003, 3080, 3120, 3276, 3432, 3465, 3640,
    3696, 3960, 4004, 4095, 4290, 4368, 4620, 4680, 5005, 5040, 5148,
    5460, 5544, 5720, 6006, 6160, 6435, 6552, 6864, 6930, 7280, 7920,
    8008, 8190, 8580, 9009, 9240, 9360,
    10010, 10296, 10920, 11088, 11440, 12012, 12870, 13104, 13860,
    15015, 16016, 16380, 17160, 18018, 18480, 20020, 20592, 21840,
    24024, 25740, 27720, 30030, 32760, 34320, 36036, 40040, 45045,
    48048, 51480, 55440, 60060, 65520, 72072, 80080, 90090,
    102960, 120120, 144144, 180180, 240240, 360360, 720720
  ];

  // FFT costs, one for each FFT length above. These are times, in seconds,
  // for a forward and inverse FFT and scaling (by 1.0/nfft), as measured
  // by Dave Hale, 03/25/2005, on a Pentium M 2.1 GHz processor, using a
  // Java Hotspot Server VM (build 1.5.0_01-b08, mixed mode).
  private static readonly _ctable: number[] = [
    0.00000154844595, 0.00000160858985, 0.00000173777398, 0.00000178300246,
    0.00000186692603, 0.00000202796424, 0.00000205593203, 0.00000203027471,
    0.00000213199871, 0.00000223464061, 0.00000245504197, 0.00000224507775,
    0.00000277484785, 0.00000271335681, 0.00000260084271, 0.00000266712117,
    0.00000277849063, 0.00000284002694, 0.00000317837121, 0.00000373373597,
    0.00000315791133, 0.00000424124687, 0.00000358681599, 0.00000374904075,
    0.00000474708669, 0.00000438838644, 0.00000401250829, 0.00000562735292,
    0.00000434116390, 0.00000517084182, 0.00000552020262, 0.00000498530294,
    0.00000520248930, 0.00000681986102, 0.00000710553295, 0.00000593798174,
    0.00000587481339, 0.00000701743322, 0.00000861901953, 0.00000832813604,
    0.00000791730898, 0.00000688403680, 0.00001002803645, 0.00001026784570,
    0.00000819893573, 0.00000828260941, 0.00001014724144, 0.00000934954606,
    0.00001232645727, 0.00001214189591, 0.00001269497208, 0.00001102202755,
    0.00001388176589, 0.00001172641106, 0.00001503375461, 0.00001113972204,
    0.00001364655225, 0.00001703912278, 0.00001477596306, 0.00001424973677,
    0.00002127456187, 0.00001398938399, 0.00002008644290, 0.00001869909587,
    0.00001986433148, 0.00001651781665, 0.00002092824006, 0.00001702478496,
    0.00002499906394, 0.00002500343282, 0.00002465807389, 0.00002632305568,
    0.00002308853872, 0.00002566435179, 0.00002996843066, 0.00003179869821,
    0.00002372351388, 0.00002578195392, 0.00003236648622, 0.00003062192175,
    0.00003688562326, 0.00002903319322, 0.00004464405117, 0.00003835181037,
    0.00003890755813, 0.00003489790229, 0.00004193095941, 0.00003661590772,
    0.00003585050946, 0.00004948000296, 0.00005194636790, 0.00005316664012,
    0.00004831628715, 0.00004470982143, 0.00006711791710, 0.00005416880764,
    0.00006503589644, 0.00006376341005, 0.00006060697752, 0.00006481361636,
    0.00005494746660, 0.00006842950360, 0.00006725764749, 0.00007955041900,
    0.00006517351390, 0.00008783546746, 0.00008145918907, 0.00008208007212,
    0.00008453260181, 0.00007714824943, 0.00008332986646, 0.00009686623465,
    0.00011742291007, 0.00008016979016, 0.00010372863801, 0.00011169975463,
    0.00010527145635, 0.00010259693695, 0.00012171112596, 0.00009645574497,
    0.00014179527113, 0.00011871442125, 0.00014121545403, 0.00012558781115,
    0.00012962723272, 0.00014012872534, 0.00017282139776, 0.00012333743842,
    0.00015017243965, 0.00015933147632, 0.00018467637839, 0.00016783978549,
    0.00017760241178, 0.00018111945022, 0.00015790303508, 0.00021759913091,
    0.00017785473273, 0.00021290391156, 0.00021022786937, 0.00025198138131,
    0.00022553766468, 0.00022349921892, 0.00022576645627, 0.00022422478451,
    0.00026572035023, 0.00021417878529, 0.00028409252164, 0.00028290960452,
    0.00026774495388, 0.00028504340401, 0.00028006152125, 0.00037010347376,
    0.00037949981053, 0.00033613022319, 0.00040431974162, 0.00036459661264,
    0.00035351217790, 0.00033107438017, 0.00046689976690, 0.00039452432539,
    0.00045647219690, 0.00042150673401, 0.00050466112371, 0.00055797101449,
    0.00047941598851, 0.00049189587426, 0.00052933403805, 0.00060568491080,
    0.00056200897868, 0.00060222489477, 0.00058842538190, 0.00060084033613,
    0.00074850523169, 0.00070305370305, 0.00081422764228, 0.00073423753666,
    0.00073504587156, 0.00075785092698, 0.00098138167565, 0.00073504587156,
    0.00093946503989, 0.00091880733945, 0.00090674513354, 0.00105810882198,
    0.00120590006020, 0.00104322916667, 0.00124255583127, 0.00113291855204,
    0.00130338541667, 0.00122432762836, 0.00130234070221, 0.00133444370420,
    0.00158214849921, 0.00153958493467, 0.00166694421316, 0.00183424908425,
    0.00157344854674, 0.00164180327869, 0.00210620399579, 0.00198316831683,
    0.00195414634146, 0.00197145669291, 0.00228132118451, 0.00241495778046,
    0.00264248021108, 0.00243970767357, 0.00246068796069, 0.00314937106918,
    0.00341226575809, 0.00304407294833, 0.00342979452055, 0.00391780821918,
    0.00339491525424, 0.00423467230444, 0.00427991452991, 0.00422573839662,
    0.00513589743590, 0.00532712765957, 0.00522976501305, 0.00671812080537,
    0.00644051446945, 0.00747388059701, 0.00785490196078, 0.00890222222222,
    0.01032474226804, 0.01088586956522, 0.01131638418079, 0.01125280898876,
    0.01371232876712, 0.01390972222222, 0.01663636363636, 0.01917142857143,
    0.02201098901099, 0.02425301204819, 0.02849295774648, 0.03531578947368,
    0.04575000000000, 0.06190909090909, 0.10542105263158, 0.24033333333333,
  ];

  /**
   * Determines whether the specified FFT length is valid.
   * @param nfft the FFT length.
   * @returns true, if FFT length is value; false, otherwise.
   */
  static IsValidNFFT(nfft: number): boolean {
    return binarySearch(this._ntable, nfft) >= 0;
  }

  /**
   * Returns an FFT length optimized for memory.
   * <p>
   * The FFT length will be the smallest valid length that is not less than
   * the specified length n.
   * @param n the lower bound on FFT length.
   * @returns the FFT length.
   */
  static SmallNFFT(n: number): number {
    Check.argument(n <= 720720, 'n does not exceed 720720');
    let i = binarySearch(this._ntable, n);
    if (i < 0) { i = -( i + 1 ); }
    return this._ntable[i];
  }

  /**
   * Returns an FFT length optimized for speed.
   * <p>
   * The FFT length will be the fastest valid length that is not less than
   * the specified length n.
   * @param n the lower bound on FFT length.
   * @returns the FFT length.
   */
  static FastNFFT(n: number): number {
    Check.argument(n <= 720720, 'n does not exceed 720720');
    let ifast = binarySearch(this._ntable, n);
    if (ifast < 0) { ifast = -( ifast + 1 );}

    let nfast = this._ntable[ifast];
    const nstop = 2 * nfast;
    let cfast = this._ctable[ifast];
    for (let i = ifast + 1; i < this._NTABLE && this._ntable[i] < nstop; i++) {
      if (this._ctable[i] < cfast) {
        cfast = this._ctable[i];
        nfast = this._ntable[i];
      }
    }
    return nfast;
  }

  /**
   * Prime-factor complex-to-complex FFT for 1D arrays.
   * @param sign the sign of the exponent in the Fourier transform.
   * @param nfft the FFT length.
   * @param z array[2*nfft] of nfft packed complex numbers.
   */
  static Transform(sign: number, nfft: number, z: number[]): void {
    // What is left of n after dividing by factors.
    let nleft = nfft;

    // Loop over all possible factors, from largest to smallest.
    for (let jfac = 0; jfac < this._NFAC; jfac++) {

      // Skip the current factor if not a mutually prime factor of n.
      const ifac = Math.floor(this._kfac[jfac]);
      const ndiv = Math.floor(nleft / ifac);
      if (ndiv * ifac !== nleft) { continue; }

      // What is left of n (nleft), and n divided by the current factor (m).
      nleft = ndiv;
      const m = Math.floor(nfft / ifac);

      // Rotation factor mu and stride mm.
      let mu = 0;
      let mm = 0;
      for (let kfac = 1; kfac <= ifac && mm % ifac !== 1; ++kfac) {
        mu = kfac;
        mm = kfac * m;
      }

      if (sign < 0) { mu = ifac - mu; }

      // Array stride, bound, and indices.
      const jinc = 2 * mm;
      const jmax = 2 * nfft;
      const j0 = 0;
      const j1 = j0 + jinc;

      // Factor 2.
      if (ifac === 2) {
        this._pfa2(z, m, j0, j1);
        continue;
      }
      const j2 = ( j1 + jinc ) % jmax;

      // Factor 3.
      if (ifac === 3) {
        this._pfa3(z, mu, m, j0, j1, j2);
        continue;
      }
      const j3 = ( j2 + jinc ) % jmax;

      // Factor 4.
      if (ifac === 4) {
        this._pfa4(z, mu, m, j0, j1, j2, j3);
        continue;
      }
      const j4 = ( j3 + jinc ) % jmax;

      // Factor 5.
      if (ifac === 5) {
        this._pfa5(z, mu, m, j0, j1, j2, j3, j4);
        continue;
      }
      const j5 = ( j4 + jinc ) % jmax;
      const j6 = ( j5 + jinc ) % jmax;

      // Factor 7.
      if (ifac === 7) {
        this._pfa7(z, mu, m, j0, j1, j2, j3, j4, j5, j6);
        continue;
      }
      const j7 = ( j6 + jinc ) % jmax;

      // Factor 8.
      if (ifac === 8) {
        this._pfa8(z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7);
        continue;
      }
      const j8 = ( j7 + jinc ) % jmax;

      // Factor 9.
      if (ifac === 9) {
        this._pfa9(z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8);
        continue;
      }
      const j9 = ( j8 + jinc ) % jmax;
      const j10 = ( j9 + jinc ) % jmax;

      // Factor 11.
      if (ifac === 11) {
        this._pfa11(z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10);
        continue;
      }
      const j11 = ( j10 + jinc ) % jmax;
      const j12 = ( j11 + jinc ) % jmax;

      // Factor 13.
      if (ifac === 13) {
        this._pfa13(z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, j11, j12);
        continue;
      }
      const j13 = ( j12 + jinc ) % jmax;
      const j14 = ( j13 + jinc ) % jmax;
      const j15 = ( j14 + jinc ) % jmax;

      // Factor 16.
      if (ifac === 16) {
        this._pfa16(z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, j11, j12, j13, j14, j15);
      }
    }
  }

  /**
   * Prime-factor complex-to-complex multiple FFT.
   * <p>
   * Performs multiple transforms across the 2nd (slowest) dimension of a 2-D
   * array. In this version, z[0:nfft-1][0,2,4,...] contains the real parts,
   * and z[0:nfft-1][1,3,5,...] contains the imaginary parts.
   * @param sign the sign of the exponent in the Fourier transform.
   * @param n1 the number of transforms (fast dimension).
   * @param nfft the FFT length (slow dimension).
   * @param z array[nfft][2*n1] of n1*nfft packed complex numbers
   */
  static Transform2a(sign: number, n1: number, nfft: number, z: number[][]): void {

    // What is left of n after dividing by factors.
    let nleft = nfft;

    // Loop over all possible factors, from largest to smallest.
    for (let jfac = 0; jfac < this._NFAC; ++jfac) {

      // Skip the current factor, if not a mutually prime factor of n
      const ifac = this._kfac[jfac];
      const ndiv = nleft / ifac;
      if (ndiv * ifac !== nleft)
        continue;

      // What is left of n (nleft), and n divided by the current factor (m).
      nleft = ndiv;
      const m = nfft / ifac;

      // Rotation factor mu and stride mm.
      let mu = 0;
      let mm = 0;
      for (let kfac = 1; kfac <= ifac && mm % ifac !== 1; ++kfac) {
        mu = kfac;
        mm = kfac * m;
      }
      if (sign < 0)
        mu = ifac - mu;

      // Array stride, bound, and indices.
      const jinc = mm;
      const jmax = nfft;
      const j0 = 0;
      const j1 = j0 + jinc;

      // Factor 2.
      if (ifac === 2) {
        this._pfa2a(n1, z, m, j0, j1);
        continue;
      }
      const j2 = ( j1 + jinc ) % jmax;

      // Factor 3.
      if (ifac === 3) {
        this._pfa3a(n1, z, mu, m, j0, j1, j2);
        continue;
      }
      const j3 = ( j2 + jinc ) % jmax;

      // Factor 4.
      if (ifac === 4) {
        this._pfa4a(n1, z, mu, m, j0, j1, j2, j3);
        continue;
      }
      const j4 = ( j3 + jinc ) % jmax;

      // Factor 5.
      if (ifac === 5) {
        this._pfa5a(n1, z, mu, m, j0, j1, j2, j3, j4);
        continue;
      }
      const j5 = ( j4 + jinc ) % jmax;
      const j6 = ( j5 + jinc ) % jmax;

      // Factor 7.
      if (ifac === 7) {
        this._pfa7a(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6);
        continue;
      }
      const j7 = ( j6 + jinc ) % jmax;

      // Factor 8.
      if (ifac === 8) {
        this._pfa8a(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7);
        continue;
      }
      const j8 = ( j7 + jinc ) % jmax;

      // Factor 9.
      if (ifac === 9) {
        this._pfa9a(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8);
        continue;
      }
      const j9 = ( j8 + jinc ) % jmax;
      const j10 = ( j9 + jinc ) % jmax;

      // Factor 11.
      if (ifac === 11) {
        this._pfa11a(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10);
        continue;
      }
      const j11 = ( j10 + jinc ) % jmax;
      const j12 = ( j11 + jinc ) % jmax;

      // Factor 13.
      if (ifac === 13) {
        this._pfa13a(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, j11, j12);
        continue;
      }
      const j13 = ( j12 + jinc ) % jmax;
      const j14 = ( j13 + jinc ) % jmax;
      const j15 = ( j14 + jinc ) % jmax;

      // Factor 16.
      if (ifac === 16) {
        this._pfa16a(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, j11, j12, j13, j14, j15);
      }
    }
  }

  /**
   * Prime-factor complex-to-complex multiple FFT.
   * <p>
   * Performs multiple transforms across the 2nd (slowest) dimension of a 2-D
   * array. In this version, z[0,2,4,...][0:n1-1] contains the real parts,
   * and z[1,3,5,...][0:n1-1] contains the imaginary parts.
   * @param sign the sign of the exponent in the Fourier transform.
   * @param n1 the number of transforms (fast dimension).
   * @param nfft the FFT length (slow dimension).
   * @param z array[nfft*2[n1] of nfft*n1 complex numbers.
   */
  static Transform2b(sign: number, n1: number, nfft: number, z: number[][]): void {
    // What is left of n after dividing by factors.
    let nleft = nfft;

    // Loop over all possible factors, from largest to smallest.
    for (let jfac = 0; jfac < this._NFAC; ++jfac) {

      // Skip the current factor, if not a mutually prime factor of n
      const ifac = this._kfac[jfac];
      const ndiv = nleft / ifac;
      if (ndiv * ifac !== nleft)
        continue;

      // What is left of n (nleft), and n divided by the current factor (m).
      nleft = ndiv;
      const m = nfft / ifac;

      // Rotation factor mu and stride mm.
      let mu = 0;
      let mm = 0;
      for (let kfac = 1; kfac <= ifac && mm % ifac !== 1; ++kfac) {
        mu = kfac;
        mm = kfac * m;
      }
      if (sign < 0)
        mu = ifac - mu;

      // Array stride, bound, and indices.
      const jinc = 2 * mm;
      const jmax = 2 * nfft;
      const j0 = 0;
      const j1 = j0 + jinc;

      // Factor 2.
      if (ifac === 2) {
        this._pfa2b(n1, z, m, j0, j1);
        continue;
      }
      const j2 = ( j1 + jinc ) % jmax;

      // Factor 3.
      if (ifac === 3) {
        this._pfa3b(n1, z, mu, m, j0, j1, j2);
        continue;
      }
      const j3 = ( j2 + jinc ) % jmax;

      // Factor 4.
      if (ifac === 4) {
        this._pfa4b(n1, z, mu, m, j0, j1, j2, j3);
        continue;
      }
      const j4 = ( j3 + jinc ) % jmax;

      // Factor 5.
      if (ifac === 5) {
        this._pfa5b(n1, z, mu, m, j0, j1, j2, j3, j4);
        continue;
      }
      const j5 = ( j4 + jinc ) % jmax;
      const j6 = ( j5 + jinc ) % jmax;

      // Factor 7.
      if (ifac === 7) {
        this._pfa7b(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6);
        continue;
      }
      const j7 = ( j6 + jinc ) % jmax;

      // Factor 8.
      if (ifac === 8) {
        this._pfa8b(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7);
        continue;
      }
      const j8 = ( j7 + jinc ) % jmax;

      // Factor 9.
      if (ifac === 9) {
        this._pfa9b(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8);
        continue;
      }
      const j9 = ( j8 + jinc ) % jmax;
      const j10 = ( j9 + jinc ) % jmax;

      // Factor 11.
      if (ifac === 11) {
        this._pfa11b(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10);
        continue;
      }
      const j11 = ( j10 + jinc ) % jmax;
      const j12 = ( j11 + jinc ) % jmax;

      // Factor 13.
      if (ifac === 13) {
        this._pfa13b(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, j11, j12);
        continue;
      }
      const j13 = ( j12 + jinc ) % jmax;
      const j14 = ( j13 + jinc ) % jmax;
      const j15 = ( j14 + jinc ) % jmax;

      // Factor 16.
      if (ifac === 16) {
        this._pfa16b(n1, z, mu, m, j0, j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, j11, j12, j13, j14, j15);
      }
    }
  }

  private static _pfa2(z: number[], m: number, j0: number, j1: number): void {
    for (let i = 0; i < m; i++) {
      const t1r = z[j0    ] - z[j1    ];
      const t1i = z[j0 + 1] - z[j1 + 1];

      z[j0    ] = z[j0    ] + z[j1    ];
      z[j0 + 1] = z[j0 + 1] + z[j1 + 1];
      z[j1    ] = t1r;
      z[j1 + 1] = t1i;

      const jt = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa3(z: number[], mu: number, m: number,
                       j0: number, j1: number, j2: number): void {
    let c1: number;
    if (mu === 1) { c1 = this._P866; } else { c1 = -this._P866; }
    for (let i = 0; i < m; i++) {
      const t1r = z[j1] + z[j2];
      const t1i = z[j1 + 1] + z[j2 + 1];
      const y1r = z[j0] - 0.5 * t1r;
      const y1i = z[j0 + 1] - 0.5 * t1i;
      const y2r = c1 * ( z[j1] - z[j2] );
      const y2i = c1 * ( z[j1 + 1] - z[j2 + 1] );

      z[j0] = z[j0] + t1r;
      z[j0 + 1] = z[j0 + 1] + t1i;
      z[j1] = y1r - y2i;
      z[j1 + 1] = y1i + y2r;
      z[j2] = y1r + y2i;
      z[j2 + 1] = y1i - y2r;

      const jt = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa4(z: number[], mu: number, m: number,
                       j0: number, j1: number, j2: number, j3: number): void {
    let c1: number;
    if (mu === 1) { c1 = this._PONE; } else { c1 = -this._PONE; }
    for (let i = 0; i < m; i++) {
      const t1r = z[j0] + z[j2];
      const t1i = z[j0 + 1] + z[j2 + 1];
      const t2r = z[j1] + z[j3];
      const t2i = z[j1 + 1] + z[j3 + 1];
      const y1r = z[j0] - z[j2];
      const y1i = z[j0 + 1] - z[j2 + 1];
      const y3r = c1 * ( z[j1] - z[j3] );
      const y3i = c1 * ( z[j1 + 1] - z[j3 + 1] );

      z[j0] = t1r + t2r;
      z[j0 + 1] = t1i + t2i;
      z[j1] = y1r - y3i;
      z[j1 + 1] = y1i + y3r;
      z[j2] = t1r - t2r;
      z[j2 + 1] = t1i - t2i;
      z[j3] = y1r + y3i;
      z[j3 + 1] = y1i - y3r;

      const jt = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa5(z: number[], mu: number, m: number,
                       j0: number, j1: number, j2: number, j3: number,
                       j4: number): void {
    let c1, c2, c3;
    if (mu === 1) {
      c1 = this._P559;
      c2 = this._P951;
      c3 = this._P587;
    } else if (mu === 2) {
      c1 = -this._P559;
      c2 = this._P587;
      c3 = -this._P951;
    } else if (mu === 3) {
      c1 = -this._P559;
      c2 = -this._P587;
      c3 = this._P951;
    } else {
      c1 = this._P559;
      c2 = -this._P951;
      c3 = -this._P587;
    }
    for (let i = 0; i < m; i++) {
      const t1r = z[j1] + z[j4];
      const t1i = z[j1 + 1] + z[j4 + 1];
      const t2r = z[j2] + z[j3];
      const t2i = z[j2 + 1] + z[j3 + 1];
      const t3r = z[j1] - z[j4];
      const t3i = z[j1 + 1] - z[j4 + 1];
      const t4r = z[j2] - z[j3];
      const t4i = z[j2 + 1] - z[j3 + 1];
      const t5r = t1r + t2r;
      const t5i = t1i + t2i;
      const t6r = c1 * ( t1r - t2r );
      const t6i = c1 * ( t1i - t2i );
      const t7r = z[j0] - 0.25 * t5r;
      const t7i = z[j0 + 1] - 0.25 * t5i;
      const y1r = t7r + t6r;
      const y1i = t7i + t6i;
      const y2r = t7r - t6r;
      const y2i = t7i - t6i;
      const y3r = c3 * t3r - c2 * t4r;
      const y3i = c3 * t3i - c2 * t4i;
      const y4r = c2 * t3r + c3 * t4r;
      const y4i = c2 * t3i + c3 * t4i;

      z[j0    ] = z[j0    ] + t5r;
      z[j0 + 1] = z[j0 + 1] + t5i;
      z[j1    ] = y1r - y4i;
      z[j1 + 1] = y1i + y4r;
      z[j2    ] = y2r - y3i;
      z[j2 + 1] = y2i + y3r;
      z[j3    ] = y2r + y3i;
      z[j3 + 1] = y2i - y3r;
      z[j4    ] = y1r + y4i;
      z[j4 + 1] = y1i - y4r;

      const jt = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa7(z: number[], mu: number, m: number,
                       j0: number, j1: number, j2: number, j3: number,
                       j4: number, j5: number, j6: number): void {
    let c1, c2, c3, c4, c5, c6;
    if (mu === 1) {
      c1 = this._P623;
      c2 = -this._P222;
      c3 = -this._P900;
      c4 = this._P781;
      c5 = this._P974;
      c6 = this._P433;
    } else if (mu === 2) {
      c1 = -this._P222;
      c2 = -this._P900;
      c3 = this._P623;
      c4 = this._P974;
      c5 = -this._P433;
      c6 = -this._P781;
    } else if (mu === 3) {
      c1 = -this._P900;
      c2 = this._P623;
      c3 = -this._P222;
      c4 = this._P433;
      c5 = -this._P781;
      c6 = this._P974;
    } else if (mu === 4) {
      c1 = -this._P900;
      c2 = this._P623;
      c3 = -this._P222;
      c4 = -this._P433;
      c5 = this._P781;
      c6 = -this._P974;
    } else if (mu === 5) {
      c1 = -this._P222;
      c2 = -this._P900;
      c3 = this._P623;
      c4 = -this._P974;
      c5 = this._P433;
      c6 = this._P781;
    } else {
      c1 = this._P623;
      c2 = -this._P222;
      c3 = -this._P900;
      c4 = -this._P781;
      c5 = -this._P974;
      c6 = -this._P433;
    }
    for (let i = 0; i < m; i++) {
      const t1r = z[j1] + z[j6];
      const t1i = z[j1 + 1] + z[j6 + 1];
      const t2r = z[j2] + z[j5];
      const t2i = z[j2 + 1] + z[j5 + 1];
      const t3r = z[j3] + z[j4];
      const t3i = z[j3 + 1] + z[j4 + 1];
      const t4r = z[j1] - z[j6];
      const t4i = z[j1 + 1] - z[j6 + 1];
      const t5r = z[j2] - z[j5];
      const t5i = z[j2 + 1] - z[j5 + 1];
      const t6r = z[j3] - z[j4];
      const t6i = z[j3 + 1] - z[j4 + 1];
      const t7r = z[j0] - 0.5 * t3r;
      const t7i = z[j0 + 1] - 0.5 * t3i;
      const t8r = t1r - t3r;
      const t8i = t1i - t3i;
      const t9r = t2r - t3r;
      const t9i = t2i - t3i;
      const y1r = t7r + c1 * t8r + c2 * t9r;
      const y1i = t7i + c1 * t8i + c2 * t9i;
      const y2r = t7r + c2 * t8r + c3 * t9r;
      const y2i = t7i + c2 * t8i + c3 * t9i;
      const y3r = t7r + c3 * t8r + c1 * t9r;
      const y3i = t7i + c3 * t8i + c1 * t9i;
      const y4r = c6 * t4r - c4 * t5r + c5 * t6r;
      const y4i = c6 * t4i - c4 * t5i + c5 * t6i;
      const y5r = c5 * t4r - c6 * t5r - c4 * t6r;
      const y5i = c5 * t4i - c6 * t5i - c4 * t6i;
      const y6r = c4 * t4r + c5 * t5r + c6 * t6r;
      const y6i = c4 * t4i + c5 * t5i + c6 * t6i;

      z[j0] = z[j0] + t1r + t2r + t3r;
      z[j0 + 1] = z[j0 + 1] + t1i + t2i + t3i;
      z[j1] = y1r - y6i;
      z[j1 + 1] = y1i + y6r;
      z[j2] = y2r - y5i;
      z[j2 + 1] = y2i + y5r;
      z[j3] = y3r - y4i;
      z[j3 + 1] = y3i + y4r;
      z[j4] = y3r + y4i;
      z[j4 + 1] = y3i - y4r;
      z[j5] = y2r + y5i;
      z[j5 + 1] = y2i - y5r;
      z[j6] = y1r + y6i;
      z[j6 + 1] = y1i - y6r;

      const jt = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa8(z: number[], mu: number, m: number,
                       j0: number, j1: number, j2: number, j3: number,
                       j4: number, j5: number, j6: number, j7: number): void {
    let c1, c2, c3;
    if (mu === 1) {
      c1 = this._PONE;
      c2 = this._P707;
    } else if (mu === 3) {
      c1 = -this._PONE;
      c2 = -this._P707;
    } else if (mu === 5) {
      c1 = this._PONE;
      c2 = -this._P707;
    } else {
      c1 = -this._PONE;
      c2 = this._P707;
    }
    c3 = c1 * c2;
    for (let i = 0; i < m; i++) {
      const t1r = z[j0] + z[j4];
      const t1i = z[j0 + 1] + z[j4 + 1];
      const t2r = z[j0] - z[j4];
      const t2i = z[j0 + 1] - z[j4 + 1];
      const t3r = z[j1] + z[j5];
      const t3i = z[j1 + 1] + z[j5 + 1];
      const t4r = z[j1] - z[j5];
      const t4i = z[j1 + 1] - z[j5 + 1];
      const t5r = z[j2] + z[j6];
      const t5i = z[j2 + 1] + z[j6 + 1];
      const t6r = c1 * ( z[j2] - z[j6] );
      const t6i = c1 * ( z[j2 + 1] - z[j6 + 1] );
      const t7r = z[j3] + z[j7];
      const t7i = z[j3 + 1] + z[j7 + 1];
      const t8r = z[j3] - z[j7];
      const t8i = z[j3 + 1] - z[j7 + 1];
      const t9r = t1r + t5r;
      const t9i = t1i + t5i;
      const t10r = t3r + t7r;
      const t10i = t3i + t7i;
      const t11r = c2 * ( t4r - t8r );
      const t11i = c2 * ( t4i - t8i );
      const t12r = c3 * ( t4r + t8r );
      const t12i = c3 * ( t4i + t8i );
      const y1r = t2r + t11r;
      const y1i = t2i + t11i;
      const y2r = t1r - t5r;
      const y2i = t1i - t5i;
      const y3r = t2r - t11r;
      const y3i = t2i - t11i;
      const y5r = t12r - t6r;
      const y5i = t12i - t6i;
      const y6r = c1 * ( t3r - t7r );
      const y6i = c1 * ( t3i - t7i );
      const y7r = t12r + t6r;
      const y7i = t12i + t6i;

      z[j0] = t9r + t10r;
      z[j0 + 1] = t9i + t10i;
      z[j1] = y1r - y7i;
      z[j1 + 1] = y1i + y7r;
      z[j2] = y2r - y6i;
      z[j2 + 1] = y2i + y6r;
      z[j3] = y3r - y5i;
      z[j3 + 1] = y3i + y5r;
      z[j4] = t9r - t10r;
      z[j4 + 1] = t9i - t10i;
      z[j5] = y3r + y5i;
      z[j5 + 1] = y3i - y5r;
      z[j6] = y2r + y6i;
      z[j6 + 1] = y2i - y6r;
      z[j7] = y1r + y7i;
      z[j7 + 1] = y1i - y7r;

      const jt = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa9(z: number[], mu: number, m: number,
                       j0: number, j1: number, j2: number, j3: number,
                       j4: number, j5: number, j6: number, j7: number,
                       j8: number): void {
    let c1, c2, c3, c4, c5, c6, c7, c8, c9;
    if (mu === 1) {
      c1 = this._P866;
      c2 = this._P766;
      c3 = this._P642;
      c4 = this._P173;
      c5 = this._P984;
    } else if (mu === 2) {
      c1 = -this._P866;
      c2 = this._P173;
      c3 = this._P984;
      c4 = -this._P939;
      c5 = this._P342;
    } else if (mu === 4) {
      c1 = this._P866;
      c2 = -this._P939;
      c3 = this._P342;
      c4 = this._P766;
      c5 = -this._P642;
    } else if (mu === 5) {
      c1 = -this._P866;
      c2 = -this._P939;
      c3 = -this._P342;
      c4 = this._P766;
      c5 = this._P642;
    } else if (mu === 7) {
      c1 = this._P866;
      c2 = this._P173;
      c3 = -this._P984;
      c4 = -this._P939;
      c5 = -this._P342;
    } else {
      c1 = -this._P866;
      c2 = this._P766;
      c3 = -this._P642;
      c4 = this._P173;
      c5 = -this._P984;
    }
    c6 = c1 * c2;
    c7 = c1 * c3;
    c8 = c1 * c4;
    c9 = c1 * c5;
    for (let i = 0; i < m; i++) {
      const t1r = z[j3] + z[j6];
      const t1i = z[j3 + 1] + z[j6 + 1];
      const t2r = z[j0] - 0.5 * t1r;
      const t2i = z[j0 + 1] - 0.5 * t1i;
      const t3r = c1 * ( z[j3] - z[j6] );
      const t3i = c1 * ( z[j3 + 1] - z[j6 + 1] );
      const t4r = z[j0] + t1r;
      const t4i = z[j0 + 1] + t1i;
      const t5r = z[j4] + z[j7];
      const t5i = z[j4 + 1] + z[j7 + 1];
      const t6r = z[j1] - 0.5 * t5r;
      const t6i = z[j1 + 1] - 0.5 * t5i;
      const t7r = z[j4] - z[j7];
      const t7i = z[j4 + 1] - z[j7 + 1];
      const t8r = z[j1] + t5r;
      const t8i = z[j1 + 1] + t5i;
      const t9r = z[j2] + z[j5];
      const t9i = z[j2 + 1] + z[j5 + 1];
      const t10r = z[j8] - 0.5 * t9r;
      const t10i = z[j8 + 1] - 0.5 * t9i;
      const t11r = z[j2] - z[j5];
      const t11i = z[j2 + 1] - z[j5 + 1];
      const t12r = z[j8] + t9r;
      const t12i = z[j8 + 1] + t9i;
      const t13r = t8r + t12r;
      const t13i = t8i + t12i;
      const t14r = t6r + t10r;
      const t14i = t6i + t10i;
      const t15r = t6r - t10r;
      const t15i = t6i - t10i;
      const t16r = t7r + t11r;
      const t16i = t7i + t11i;
      const t17r = t7r - t11r;
      const t17i = t7i - t11i;
      const t18r = c2 * t14r - c7 * t17r;
      const t18i = c2 * t14i - c7 * t17i;
      const t19r = c4 * t14r + c9 * t17r;
      const t19i = c4 * t14i + c9 * t17i;
      const t20r = c3 * t15r + c6 * t16r;
      const t20i = c3 * t15i + c6 * t16i;
      const t21r = c5 * t15r - c8 * t16r;
      const t21i = c5 * t15i - c8 * t16i;
      const t22r = t18r + t19r;
      const t22i = t18i + t19i;
      const t23r = t20r - t21r;
      const t23i = t20i - t21i;
      const y1r = t2r + t18r;
      const y1i = t2i + t18i;
      const y2r = t2r + t19r;
      const y2i = t2i + t19i;
      const y3r = t4r - 0.5 * t13r;
      const y3i = t4i - 0.5 * t13i;
      const y4r = t2r - t22r;
      const y4i = t2i - t22i;
      const y5r = t3r - t23r;
      const y5i = t3i - t23i;
      const y6r = c1 * ( t8r - t12r );
      const y6i = c1 * ( t8i - t12i );
      const y7r = t21r - t3r;
      const y7i = t21i - t3i;
      const y8r = t3r + t20r;
      const y8i = t3i + t20i;

      z[j0] = t4r + t13r;
      z[j0 + 1] = t4i + t13i;
      z[j1] = y1r - y8i;
      z[j1 + 1] = y1i + y8r;
      z[j2] = y2r - y7i;
      z[j2 + 1] = y2i + y7r;
      z[j3] = y3r - y6i;
      z[j3 + 1] = y3i + y6r;
      z[j4] = y4r - y5i;
      z[j4 + 1] = y4i + y5r;
      z[j5] = y4r + y5i;
      z[j5 + 1] = y4i - y5r;
      z[j6] = y3r + y6i;
      z[j6 + 1] = y3i - y6r;
      z[j7] = y2r + y7i;
      z[j7 + 1] = y2i - y7r;
      z[j8] = y1r + y8i;
      z[j8 + 1] = y1i - y8r;

      const jt = j8 + 2;
      j8 = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa11(z: number[], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number,
                        j4: number, j5: number, j6: number, j7: number,
                        j8: number, j9: number, j10: number): void {
    let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10;
    if (mu === 1) {
      c1 = this._P841;
      c2 = this._P415;
      c3 = -this._P142;
      c4 = -this._P654;
      c5 = -this._P959;
      c6 = this._P540;
      c7 = this._P909;
      c8 = this._P989;
      c9 = this._P755;
      c10 = this._P281;
    } else if (mu === 2) {
      c1 = this._P415;
      c2 = -this._P654;
      c3 = -this._P959;
      c4 = -this._P142;
      c5 = this._P841;
      c6 = this._P909;
      c7 = this._P755;
      c8 = -this._P281;
      c9 = -this._P989;
      c10 = -this._P540;
    } else if (mu === 3) {
      c1 = -this._P142;
      c2 = -this._P959;
      c3 = this._P415;
      c4 = this._P841;
      c5 = -this._P654;
      c6 = this._P989;
      c7 = -this._P281;
      c8 = -this._P909;
      c9 = this._P540;
      c10 = this._P755;
    } else if (mu === 4) {
      c1 =  -this._P654;
      c2 =  -this._P142;
      c3 =   this._P841;
      c4 =  -this._P959;
      c5 =   this._P415;
      c6 =   this._P755;
      c7 =  -this._P989;
      c8 =   this._P540;
      c9 =   this._P281;
      c10 = -this._P909;
    } else if (mu === 5) {
      c1 =  -this._P959;
      c2 =   this._P841;
      c3 =  -this._P654;
      c4 =   this._P415;
      c5 =  -this._P142;
      c6 =   this._P281;
      c7 =  -this._P540;
      c8 =   this._P755;
      c9 =  -this._P909;
      c10 =  this._P989;
    } else if (mu === 6) {
      c1 = -this._P959;
      c2 = this._P841;
      c3 = -this._P654;
      c4 = this._P415;
      c5 = -this._P142;
      c6 = -this._P281;
      c7 = this._P540;
      c8 = -this._P755;
      c9 = this._P909;
      c10 = -this._P989;
    } else if (mu === 7) {
      c1 = -this._P654;
      c2 = -this._P142;
      c3 = this._P841;
      c4 = -this._P959;
      c5 = this._P415;
      c6 = -this._P755;
      c7 = this._P989;
      c8 = -this._P540;
      c9 = -this._P281;
      c10 = this._P909;
    } else if (mu === 8) {
      c1 = -this._P142;
      c2 = -this._P959;
      c3 = this._P415;
      c4 = this._P841;
      c5 = -this._P654;
      c6 = -this._P989;
      c7 = this._P281;
      c8 = this._P909;
      c9 = -this._P540;
      c10 = -this._P755;
    } else if (mu === 9) {
      c1 = this._P415;
      c2 = -this._P654;
      c3 = -this._P959;
      c4 = -this._P142;
      c5 = this._P841;
      c6 = -this._P909;
      c7 = -this._P755;
      c8 = this._P281;
      c9 = this._P989;
      c10 = this._P540;
    } else {
      c1 = this._P841;
      c2 = this._P415;
      c3 = -this._P142;
      c4 = -this._P654;
      c5 = -this._P959;
      c6 = -this._P540;
      c7 = -this._P909;
      c8 = -this._P989;
      c9 = -this._P755;
      c10 = -this._P281;
    }
    for (let i = 0; i < m; i++) {
      const t1r = z[j1] + z[j10];
      const t1i = z[j1 + 1] + z[j10 + 1];
      const t2r = z[j2] + z[j9];
      const t2i = z[j2 + 1] + z[j9 + 1];
      const t3r = z[j3] + z[j8];
      const t3i = z[j3 + 1] + z[j8 + 1];
      const t4r = z[j4] + z[j7];
      const t4i = z[j4 + 1] + z[j7 + 1];
      const t5r = z[j5] + z[j6];
      const t5i = z[j5 + 1] + z[j6 + 1];
      const t6r = z[j1] - z[j10];
      const t6i = z[j1 + 1] - z[j10 + 1];
      const t7r = z[j2] - z[j9];
      const t7i = z[j2 + 1] - z[j9 + 1];
      const t8r = z[j3] - z[j8];
      const t8i = z[j3 + 1] - z[j8 + 1];
      const t9r = z[j4] - z[j7];
      const t9i = z[j4 + 1] - z[j7 + 1];
      const t10r = z[j5] - z[j6];
      const t10i = z[j5 + 1] - z[j6 + 1];
      const t11r = z[j0] - 0.5 * t5r;
      const t11i = z[j0 + 1] - 0.5 * t5i;
      const t12r = t1r - t5r;
      const t12i = t1i - t5i;
      const t13r = t2r - t5r;
      const t13i = t2i - t5i;
      const t14r = t3r - t5r;
      const t14i = t3i - t5i;
      const t15r = t4r - t5r;
      const t15i = t4i - t5i;
      const y1r = t11r + c1 * t12r + c2 * t13r + c3 * t14r + c4 * t15r;
      const y1i = t11i + c1 * t12i + c2 * t13i + c3 * t14i + c4 * t15i;
      const y2r = t11r + c2 * t12r + c4 * t13r + c5 * t14r + c3 * t15r;
      const y2i = t11i + c2 * t12i + c4 * t13i + c5 * t14i + c3 * t15i;
      const y3r = t11r + c3 * t12r + c5 * t13r + c2 * t14r + c1 * t15r;
      const y3i = t11i + c3 * t12i + c5 * t13i + c2 * t14i + c1 * t15i;
      const y4r = t11r + c4 * t12r + c3 * t13r + c1 * t14r + c5 * t15r;
      const y4i = t11i + c4 * t12i + c3 * t13i + c1 * t14i + c5 * t15i;
      const y5r = t11r + c5 * t12r + c1 * t13r + c4 * t14r + c2 * t15r;
      const y5i = t11i + c5 * t12i + c1 * t13i + c4 * t14i + c2 * t15i;
      const y6r = c10 * t6r - c6 * t7r + c9 * t8r - c7 * t9r + c8 * t10r;
      const y6i = c10 * t6i - c6 * t7i + c9 * t8i - c7 * t9i + c8 * t10i;
      const y7r = c9 * t6r - c8 * t7r + c6 * t8r + c10 * t9r - c7 * t10r;
      const y7i = c9 * t6i - c8 * t7i + c6 * t8i + c10 * t9i - c7 * t10i;
      const y8r = c8 * t6r - c10 * t7r - c7 * t8r + c6 * t9r + c9 * t10r;
      const y8i = c8 * t6i - c10 * t7i - c7 * t8i + c6 * t9i + c9 * t10i;
      const y9r = c7 * t6r + c9 * t7r - c10 * t8r - c8 * t9r - c6 * t10r;
      const y9i = c7 * t6i + c9 * t7i - c10 * t8i - c8 * t9i - c6 * t10i;
      const y10r = c6 * t6r + c7 * t7r + c8 * t8r + c9 * t9r + c10 * t10r;
      const y10i = c6 * t6i + c7 * t7i + c8 * t8i + c9 * t9i + c10 * t10i;

      z[j0] = z[j0] + t1r + t2r + t3r + t4r + t5r;
      z[j0 + 1] = z[j0 + 1] + t1i + t2i + t3i + t4i + t5i;
      z[j1] = y1r - y10i;
      z[j1 + 1] = y1i + y10r;
      z[j2] = y2r - y9i;
      z[j2 + 1] = y2i + y9r;
      z[j3] = y3r - y8i;
      z[j3 + 1] = y3i + y8r;
      z[j4] = y4r - y7i;
      z[j4 + 1] = y4i + y7r;
      z[j5] = y5r - y6i;
      z[j5 + 1] = y5i + y6r;
      z[j6] = y5r + y6i;
      z[j6 + 1] = y5i - y6r;
      z[j7] = y4r + y7i;
      z[j7 + 1] = y4i - y7r;
      z[j8] = y3r + y8i;
      z[j8 + 1] = y3i - y8r;
      z[j9] = y2r + y9i;
      z[j9 + 1] = y2i - y9r;
      z[j10] = y1r + y10i;
      z[j10 + 1] = y1i - y10r;

      const jt = j10 + 2;
      j10 = j9 + 2;
      j9 = j8 + 2;
      j8 = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa13(z: number[], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number,
                        j4: number, j5: number, j6: number, j7: number,
                        j8: number, j9: number, j10: number, j11: number,
                        j12: number): void {
    let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12;
    if (mu === 1) {
      c1 = this._P885;
      c2 = this._P568;
      c3 = this._P120;
      c4 = -this._P354;
      c5 = -this._P748;
      c6 = -this._P970;
      c7 = this._P464;
      c8 = this._P822;
      c9 = this._P992;
      c10 = this._P935;
      c11 = this._P663;
      c12 = this._P239;
    } else if (mu === 2) {
      c1 = this._P568;
      c2 = -this._P354;
      c3 = -this._P970;
      c4 = -this._P748;
      c5 = this._P120;
      c6 = this._P885;
      c7 = this._P822;
      c8 = this._P935;
      c9 = this._P239;
      c10 = -this._P663;
      c11 = -this._P992;
      c12 = -this._P464;
    } else if (mu === 3) {
      c1 = this._P120;
      c2 = -this._P970;
      c3 = -this._P354;
      c4 = this._P885;
      c5 = this._P568;
      c6 = -this._P748;
      c7 = this._P992;
      c8 = this._P239;
      c9 = -this._P935;
      c10 = -this._P464;
      c11 = this._P822;
      c12 = this._P663;
    } else if (mu === 4) {
      c1 = -this._P354;
      c2 = -this._P748;
      c3 = this._P885;
      c4 = this._P120;
      c5 = -this._P970;
      c6 = this._P568;
      c7 = this._P935;
      c8 = -this._P663;
      c9 = -this._P464;
      c10 = this._P992;
      c11 = -this._P239;
      c12 = -this._P822;
    } else if (mu === 5) {
      c1 = -this._P748;
      c2 = this._P120;
      c3 = this._P568;
      c4 = -this._P970;
      c5 = this._P885;
      c6 = -this._P354;
      c7 = this._P663;
      c8 = -this._P992;
      c9 = this._P822;
      c10 = -this._P239;
      c11 = -this._P464;
      c12 = this._P935;
    } else if (mu === 6) {
      c1 = -this._P970;
      c2 = this._P885;
      c3 = -this._P748;
      c4 = this._P568;
      c5 = -this._P354;
      c6 = this._P120;
      c7 = this._P239;
      c8 = -this._P464;
      c9 = this._P663;
      c10 = -this._P822;
      c11 = this._P935;
      c12 = -this._P992;
    } else if (mu === 7) {
      c1 = -this._P970;
      c2 = this._P885;
      c3 = -this._P748;
      c4 = this._P568;
      c5 = -this._P354;
      c6 = this._P120;
      c7 = -this._P239;
      c8 = this._P464;
      c9 = -this._P663;
      c10 = this._P822;
      c11 = -this._P935;
      c12 = this._P992;
    } else if (mu === 8) {
      c1 = -this._P748;
      c2 = this._P120;
      c3 = this._P568;
      c4 = -this._P970;
      c5 = this._P885;
      c6 = -this._P354;
      c7 = -this._P663;
      c8 = this._P992;
      c9 = -this._P822;
      c10 = this._P239;
      c11 = this._P464;
      c12 = -this._P935;
    } else if (mu === 9) {
      c1 = -this._P354;
      c2 = -this._P748;
      c3 = this._P885;
      c4 = this._P120;
      c5 = -this._P970;
      c6 = this._P568;
      c7 = -this._P935;
      c8 = this._P663;
      c9 = this._P464;
      c10 = -this._P992;
      c11 = this._P239;
      c12 = this._P822;
    } else if (mu === 10) {
      c1 = this._P120;
      c2 = -this._P970;
      c3 = -this._P354;
      c4 = this._P885;
      c5 = this._P568;
      c6 = -this._P748;
      c7 = -this._P992;
      c8 = -this._P239;
      c9 = this._P935;
      c10 = this._P464;
      c11 = -this._P822;
      c12 = -this._P663;
    } else if (mu === 11) {
      c1 = this._P568;
      c2 = -this._P354;
      c3 = -this._P970;
      c4 = -this._P748;
      c5 = this._P120;
      c6 = this._P885;
      c7 = -this._P822;
      c8 = -this._P935;
      c9 = -this._P239;
      c10 = this._P663;
      c11 = this._P992;
      c12 = this._P464;
    } else {
      c1 = this._P885;
      c2 = this._P568;
      c3 = this._P120;
      c4 = -this._P354;
      c5 = -this._P748;
      c6 = -this._P970;
      c7 = -this._P464;
      c8 = -this._P822;
      c9 = -this._P992;
      c10 = -this._P935;
      c11 = -this._P663;
      c12 = -this._P239;
    }
    for (let i = 0; i < m; i++) {
      const t1r = z[j1] + z[j12];
      const t1i = z[j1 + 1] + z[j12 + 1];
      const t2r = z[j2] + z[j11];
      const t2i = z[j2 + 1] + z[j11 + 1];
      const t3r = z[j3] + z[j10];
      const t3i = z[j3 + 1] + z[j10 + 1];
      const t4r = z[j4] + z[j9];
      const t4i = z[j4 + 1] + z[j9 + 1];
      const t5r = z[j5] + z[j8];
      const t5i = z[j5 + 1] + z[j8 + 1];
      const t6r = z[j6] + z[j7];
      const t6i = z[j6 + 1] + z[j7 + 1];
      const t7r = z[j1] - z[j12];
      const t7i = z[j1 + 1] - z[j12 + 1];
      const t8r = z[j2] - z[j11];
      const t8i = z[j2 + 1] - z[j11 + 1];
      const t9r = z[j3] - z[j10];
      const t9i = z[j3 + 1] - z[j10 + 1];
      const t10r = z[j4] - z[j9];
      const t10i = z[j4 + 1] - z[j9 + 1];
      const t11r = z[j5] - z[j8];
      const t11i = z[j5 + 1] - z[j8 + 1];
      const t12r = z[j6] - z[j7];
      const t12i = z[j6 + 1] - z[j7 + 1];
      const t13r = z[j0] - 0.5 * t6r;
      const t13i = z[j0 + 1] - 0.5 * t6i;
      const t14r = t1r - t6r;
      const t14i = t1i - t6i;
      const t15r = t2r - t6r;
      const t15i = t2i - t6i;
      const t16r = t3r - t6r;
      const t16i = t3i - t6i;
      const t17r = t4r - t6r;
      const t17i = t4i - t6i;
      const t18r = t5r - t6r;
      const t18i = t5i - t6i;
      const y1r = t13r + c1 * t14r + c2 * t15r + c3 * t16r + c4 * t17r + c5 * t18r;
      const y1i = t13i + c1 * t14i + c2 * t15i + c3 * t16i + c4 * t17i + c5 * t18i;
      const y2r = t13r + c2 * t14r + c4 * t15r + c6 * t16r + c5 * t17r + c3 * t18r;
      const y2i = t13i + c2 * t14i + c4 * t15i + c6 * t16i + c5 * t17i + c3 * t18i;
      const y3r = t13r + c3 * t14r + c6 * t15r + c4 * t16r + c1 * t17r + c2 * t18r;
      const y3i = t13i + c3 * t14i + c6 * t15i + c4 * t16i + c1 * t17i + c2 * t18i;
      const y4r = t13r + c4 * t14r + c5 * t15r + c1 * t16r + c3 * t17r + c6 * t18r;
      const y4i = t13i + c4 * t14i + c5 * t15i + c1 * t16i + c3 * t17i + c6 * t18i;
      const y5r = t13r + c5 * t14r + c3 * t15r + c2 * t16r + c6 * t17r + c1 * t18r;
      const y5i = t13i + c5 * t14i + c3 * t15i + c2 * t16i + c6 * t17i + c1 * t18i;
      const y6r = t13r + c6 * t14r + c1 * t15r + c5 * t16r + c2 * t17r + c4 * t18r;
      const y6i = t13i + c6 * t14i + c1 * t15i + c5 * t16i + c2 * t17i + c4 * t18i;
      const y7r = c12 * t7r - c7 * t8r + c11 * t9r - c8 * t10r + c10 * t11r - c9 * t12r;
      const y7i = c12 * t7i - c7 * t8i + c11 * t9i - c8 * t10i + c10 * t11i - c9 * t12i;
      const y8r = c11 * t7r - c9 * t8r + c8 * t9r - c12 * t10r - c7 * t11r + c10 * t12r;
      const y8i = c11 * t7i - c9 * t8i + c8 * t9i - c12 * t10i - c7 * t11i + c10 * t12i;
      const y9r = c10 * t7r - c11 * t8r - c7 * t9r + c9 * t10r - c12 * t11r - c8 * t12r;
      const y9i = c10 * t7i - c11 * t8i - c7 * t9i + c9 * t10i - c12 * t11i - c8 * t12i;
      const y10r = c9 * t7r + c12 * t8r - c10 * t9r - c7 * t10r + c8 * t11r + c11 * t12r;
      const y10i = c9 * t7i + c12 * t8i - c10 * t9i - c7 * t10i + c8 * t11i + c11 * t12i;
      const y11r = c8 * t7r + c10 * t8r + c12 * t9r - c11 * t10r - c9 * t11r - c7 * t12r;
      const y11i = c8 * t7i + c10 * t8i + c12 * t9i - c11 * t10i - c9 * t11i - c7 * t12i;
      const y12r = c7 * t7r + c8 * t8r + c9 * t9r + c10 * t10r + c11 * t11r + c12 * t12r;
      const y12i = c7 * t7i + c8 * t8i + c9 * t9i + c10 * t10i + c11 * t11i + c12 * t12i;

      z[j0] = z[j0] + t1r + t2r + t3r + t4r + t5r + t6r;
      z[j0 + 1] = z[j0 + 1] + t1i + t2i + t3i + t4i + t5i + t6i;
      z[j1] = y1r - y12i;
      z[j1 + 1] = y1i + y12r;
      z[j2] = y2r - y11i;
      z[j2 + 1] = y2i + y11r;
      z[j3] = y3r - y10i;
      z[j3 + 1] = y3i + y10r;
      z[j4] = y4r - y9i;
      z[j4 + 1] = y4i + y9r;
      z[j5] = y5r - y8i;
      z[j5 + 1] = y5i + y8r;
      z[j6] = y6r - y7i;
      z[j6 + 1] = y6i + y7r;
      z[j7] = y6r + y7i;
      z[j7 + 1] = y6i - y7r;
      z[j8] = y5r + y8i;
      z[j8 + 1] = y5i - y8r;
      z[j9] = y4r + y9i;
      z[j9 + 1] = y4i - y9r;
      z[j10] = y3r + y10i;
      z[j10 + 1] = y3i - y10r;
      z[j11] = y2r + y11i;
      z[j11 + 1] = y2i - y11r;
      z[j12] = y1r + y12i;
      z[j12 + 1] = y1i - y12r;

      const jt = j12 + 2;
      j12 = j11 + 2;
      j11 = j10 + 2;
      j10 = j9 + 2;
      j9 = j8 + 2;
      j8 = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa16(z: number[], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number,
                        j4: number, j5: number, j6: number, j7: number,
                        j8: number, j9: number, j10: number, j11: number,
                        j12: number, j13: number, j14: number, j15: number): void {
    let c1, c2, c3, c4, c5, c6, c7;
    if (mu === 1) {
      c1 = this._PONE;
      c2 = this._P923;
      c3 = this._P382;
      c4 = this._P707;
    } else if (mu === 3) {
      c1 = -this._PONE;
      c2 = this._P382;
      c3 = this._P923;
      c4 = -this._P707;
    } else if (mu === 5) {
      c1 = this._PONE;
      c2 = -this._P382;
      c3 = this._P923;
      c4 = -this._P707;
    } else if (mu === 7) {
      c1 = -this._PONE;
      c2 = -this._P923;
      c3 = this._P382;
      c4 = this._P707;
    } else if (mu === 9) {
      c1 = this._PONE;
      c2 = -this._P923;
      c3 = -this._P382;
      c4 = this._P707;
    } else if (mu === 11) {
      c1 = -this._PONE;
      c2 = -this._P382;
      c3 = -this._P923;
      c4 = -this._P707;
    } else if (mu === 13) {
      c1 = this._PONE;
      c2 = this._P382;
      c3 = -this._P923;
      c4 = -this._P707;
    } else {
      c1 = -this._PONE;
      c2 = this._P923;
      c3 = -this._P382;
      c4 = this._P707;
    }
    c5 = c1 * c4;
    c6 = c1 * c3;
    c7 = c1 * c2;
    for (let i = 0; i < m; i++) {
      const t1r = z[j0] + z[j8];
      const t1i = z[j0 + 1] + z[j8 + 1];
      const t2r = z[j4] + z[j12];
      const t2i = z[j4 + 1] + z[j12 + 1];
      const t3r = z[j0] - z[j8];
      const t3i = z[j0 + 1] - z[j8 + 1];
      const t4r = c1 * ( z[j4] - z[j12] );
      const t4i = c1 * ( z[j4 + 1] - z[j12 + 1] );
      const t5r = t1r + t2r;
      const t5i = t1i + t2i;
      const t6r = t1r - t2r;
      const t6i = t1i - t2i;
      const t7r = z[j1] + z[j9];
      const t7i = z[j1 + 1] + z[j9 + 1];
      const t8r = z[j5] + z[j13];
      const t8i = z[j5 + 1] + z[j13 + 1];
      const t9r = z[j1] - z[j9];
      const t9i = z[j1 + 1] - z[j9 + 1];
      const t10r = z[j5] - z[j13];
      const t10i = z[j5 + 1] - z[j13 + 1];
      const t11r = t7r + t8r;
      const t11i = t7i + t8i;
      const t12r = t7r - t8r;
      const t12i = t7i - t8i;
      const t13r = z[j2] + z[j10];
      const t13i = z[j2 + 1] + z[j10 + 1];
      const t14r = z[j6] + z[j14];
      const t14i = z[j6 + 1] + z[j14 + 1];
      const t15r = z[j2] - z[j10];
      const t15i = z[j2 + 1] - z[j10 + 1];
      const t16r = z[j6] - z[j14];
      const t16i = z[j6 + 1] - z[j14 + 1];
      const t17r = t13r + t14r;
      const t17i = t13i + t14i;
      const t18r = c4 * ( t15r - t16r );
      const t18i = c4 * ( t15i - t16i );
      const t19r = c5 * ( t15r + t16r );
      const t19i = c5 * ( t15i + t16i );
      const t20r = c1 * ( t13r - t14r );
      const t20i = c1 * ( t13i - t14i );
      const t21r = z[j3] + z[j11];
      const t21i = z[j3 + 1] + z[j11 + 1];
      const t22r = z[j7] + z[j15];
      const t22i = z[j7 + 1] + z[j15 + 1];
      const t23r = z[j3] - z[j11];
      const t23i = z[j3 + 1] - z[j11 + 1];
      const t24r = z[j7] - z[j15];
      const t24i = z[j7 + 1] - z[j15 + 1];
      const t25r = t21r + t22r;
      const t25i = t21i + t22i;
      const t26r = t21r - t22r;
      const t26i = t21i - t22i;
      const t27r = t9r + t24r;
      const t27i = t9i + t24i;
      const t28r = t10r + t23r;
      const t28i = t10i + t23i;
      const t29r = t9r - t24r;
      const t29i = t9i - t24i;
      const t30r = t10r - t23r;
      const t30i = t10i - t23i;
      const t31r = t5r + t17r;
      const t31i = t5i + t17i;
      const t32r = t11r + t25r;
      const t32i = t11i + t25i;
      const t33r = t3r + t18r;
      const t33i = t3i + t18i;
      const t34r = c2 * t29r - c6 * t30r;
      const t34i = c2 * t29i - c6 * t30i;
      const t35r = t3r - t18r;
      const t35i = t3i - t18i;
      const t36r = c7 * t27r - c3 * t28r;
      const t36i = c7 * t27i - c3 * t28i;
      const t37r = t4r + t19r;
      const t37i = t4i + t19i;
      const t38r = c3 * t27r + c7 * t28r;
      const t38i = c3 * t27i + c7 * t28i;
      const t39r = t4r - t19r;
      const t39i = t4i - t19i;
      const t40r = c6 * t29r + c2 * t30r;
      const t40i = c6 * t29i + c2 * t30i;
      const t41r = c4 * ( t12r - t26r );
      const t41i = c4 * ( t12i - t26i );
      const t42r = c5 * ( t12r + t26r );
      const t42i = c5 * ( t12i + t26i );
      const y1r = t33r + t34r;
      const y1i = t33i + t34i;
      const y2r = t6r + t41r;
      const y2i = t6i + t41i;
      const y3r = t35r + t40r;
      const y3i = t35i + t40i;
      const y4r = t5r - t17r;
      const y4i = t5i - t17i;
      const y5r = t35r - t40r;
      const y5i = t35i - t40i;
      const y6r = t6r - t41r;
      const y6i = t6i - t41i;
      const y7r = t33r - t34r;
      const y7i = t33i - t34i;
      const y9r = t38r - t37r;
      const y9i = t38i - t37i;
      const y10r = t42r - t20r;
      const y10i = t42i - t20i;
      const y11r = t36r + t39r;
      const y11i = t36i + t39i;
      const y12r = c1 * ( t11r - t25r );
      const y12i = c1 * ( t11i - t25i );
      const y13r = t36r - t39r;
      const y13i = t36i - t39i;
      const y14r = t42r + t20r;
      const y14i = t42i + t20i;
      const y15r = t38r + t37r;
      const y15i = t38i + t37i;

      z[j0] = t31r + t32r;
      z[j0 + 1] = t31i + t32i;
      z[j1] = y1r - y15i;
      z[j1 + 1] = y1i + y15r;
      z[j2] = y2r - y14i;
      z[j2 + 1] = y2i + y14r;
      z[j3] = y3r - y13i;
      z[j3 + 1] = y3i + y13r;
      z[j4] = y4r - y12i;
      z[j4 + 1] = y4i + y12r;
      z[j5] = y5r - y11i;
      z[j5 + 1] = y5i + y11r;
      z[j6] = y6r - y10i;
      z[j6 + 1] = y6i + y10r;
      z[j7] = y7r - y9i;
      z[j7 + 1] = y7i + y9r;
      z[j8] = t31r - t32r;
      z[j8 + 1] = t31i - t32i;
      z[j9] = y7r + y9i;
      z[j9 + 1] = y7i - y9r;
      z[j10] = y6r + y10i;
      z[j10 + 1] = y6i - y10r;
      z[j11] = y5r + y11i;
      z[j11 + 1] = y5i - y11r;
      z[j12] = y4r + y12i;
      z[j12 + 1] = y4i - y12r;
      z[j13] = y3r + y13i;
      z[j13 + 1] = y3i - y13r;
      z[j14] = y2r + y14i;
      z[j14 + 1] = y2i - y14r;
      z[j15] = y1r + y15i;
      z[j15 + 1] = y1i - y15r;

      const jt = j15 + 2;
      j15 = j14 + 2;
      j14 = j13 + 2;
      j13 = j12 + 2;
      j12 = j11 + 2;
      j11 = j10 + 2;
      j10 = j9 + 2;
      j9 = j8 + 2;
      j8 = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa2a(n1: number, z: number[][], m: number, j0: number, j1: number) {
    const m1 = 2 * n1;
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj0[i1] - zj1[i1];
        const t1i = zj0[i1 + 1] - zj1[i1 + 1];
        zj0[i1] = zj0[i1] + zj1[i1];
        zj0[i1 + 1] = zj0[i1 + 1] + zj1[i1 + 1];
        zj1[i1] = t1r;
        zj1[i1 + 1] = t1i;
      }
      const jt = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa3a(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number) {
    const m1 = 2 * n1;
    let c1;
    if (mu === 1) {
      c1 = this._P866;
    } else {
      c1 = -this._P866;
    }
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj1[i1] + zj2[i1];
        const t1i = zj1[i1 + 1] + zj2[i1 + 1];
        const y1r = zj0[i1] - 0.5 * t1r;
        const y1i = zj0[i1 + 1] - 0.5 * t1i;
        const y2r = c1 * ( zj1[i1] - zj2[i1] );
        const y2i = c1 * ( zj1[i1 + 1] - zj2[i1 + 1] );
        zj0[i1] = zj0[i1] + t1r;
        zj0[i1 + 1] = zj0[i1 + 1] + t1i;
        zj1[i1] = y1r - y2i;
        zj1[i1 + 1] = y1i + y2r;
        zj2[i1] = y1r + y2i;
        zj2[i1 + 1] = y1i - y2r;
      }
      const jt = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa4a(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number) {
    const m1 = 2 * n1;
    let c1;
    if (mu === 1) {
      c1 = this._PONE;
    } else {
      c1 = -this._PONE;
    }
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      const zj3: number[] = z[j3];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj0[i1] + zj2[i1];
        const t1i = zj0[i1 + 1] + zj2[i1 + 1];
        const t2r = zj1[i1] + zj3[i1];
        const t2i = zj1[i1 + 1] + zj3[i1 + 1];
        const y1r = zj0[i1] - zj2[i1];
        const y1i = zj0[i1 + 1] - zj2[i1 + 1];
        const y3r = c1 * ( zj1[i1] - zj3[i1] );
        const y3i = c1 * ( zj1[i1 + 1] - zj3[i1 + 1] );
        zj0[i1] = t1r + t2r;
        zj0[i1 + 1] = t1i + t2i;
        zj1[i1] = y1r - y3i;
        zj1[i1 + 1] = y1i + y3r;
        zj2[i1] = t1r - t2r;
        zj2[i1 + 1] = t1i - t2i;
        zj3[i1] = y1r + y3i;
        zj3[i1 + 1] = y1i - y3r;
      }
      const jt = j3 + 1;
      j3 = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa5a(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number, j4: number) {
    const m1 = 2 * n1;
    let c1, c2, c3;
    if (mu === 1) {
      c1 = this._P559;
      c2 = this._P951;
      c3 = this._P587;
    } else if (mu === 2) {
      c1 = -this._P559;
      c2 = this._P587;
      c3 = -this._P951;
    } else if (mu === 3) {
      c1 = -this._P559;
      c2 = -this._P587;
      c3 = this._P951;
    } else {
      c1 = this._P559;
      c2 = -this._P951;
      c3 = -this._P587;
    }
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      const zj3: number[] = z[j3];
      const zj4: number[] = z[j4];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj1[i1] + zj4[i1];
        const t1i = zj1[i1 + 1] + zj4[i1 + 1];
        const t2r = zj2[i1] + zj3[i1];
        const t2i = zj2[i1 + 1] + zj3[i1 + 1];
        const t3r = zj1[i1] - zj4[i1];
        const t3i = zj1[i1 + 1] - zj4[i1 + 1];
        const t4r = zj2[i1] - zj3[i1];
        const t4i = zj2[i1 + 1] - zj3[i1 + 1];
        const t5r = t1r + t2r;
        const t5i = t1i + t2i;
        const t6r = c1 * ( t1r - t2r );
        const t6i = c1 * ( t1i - t2i );
        const t7r = zj0[i1] - 0.25 * t5r;
        const t7i = zj0[i1 + 1] - 0.25 * t5i;
        const y1r = t7r + t6r;
        const y1i = t7i + t6i;
        const y2r = t7r - t6r;
        const y2i = t7i - t6i;
        const y3r = c3 * t3r - c2 * t4r;
        const y3i = c3 * t3i - c2 * t4i;
        const y4r = c2 * t3r + c3 * t4r;
        const y4i = c2 * t3i + c3 * t4i;
        zj0[i1] = zj0[i1] + t5r;
        zj0[i1 + 1] = zj0[i1 + 1] + t5i;
        zj1[i1] = y1r - y4i;
        zj1[i1 + 1] = y1i + y4r;
        zj2[i1] = y2r - y3i;
        zj2[i1 + 1] = y2i + y3r;
        zj3[i1] = y2r + y3i;
        zj3[i1 + 1] = y2i - y3r;
        zj4[i1] = y1r + y4i;
        zj4[i1 + 1] = y1i - y4r;
      }
      const jt = j4 + 1;
      j4 = j3 + 1;
      j3 = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa7a(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number) {
    const m1 = 2 * n1;
    let c1, c2, c3, c4, c5, c6;
    if (mu === 1) {
      c1 = this._P623;
      c2 = -this._P222;
      c3 = -this._P900;
      c4 = this._P781;
      c5 = this._P974;
      c6 = this._P433;
    } else if (mu === 2) {
      c1 = -this._P222;
      c2 = -this._P900;
      c3 = this._P623;
      c4 = this._P974;
      c5 = -this._P433;
      c6 = -this._P781;
    } else if (mu === 3) {
      c1 = -this._P900;
      c2 = this._P623;
      c3 = -this._P222;
      c4 = this._P433;
      c5 = -this._P781;
      c6 = this._P974;
    } else if (mu === 4) {
      c1 = -this._P900;
      c2 = this._P623;
      c3 = -this._P222;
      c4 = -this._P433;
      c5 = this._P781;
      c6 = -this._P974;
    } else if (mu === 5) {
      c1 = -this._P222;
      c2 = -this._P900;
      c3 = this._P623;
      c4 = -this._P974;
      c5 = this._P433;
      c6 = this._P781;
    } else {
      c1 = this._P623;
      c2 = -this._P222;
      c3 = -this._P900;
      c4 = -this._P781;
      c5 = -this._P974;
      c6 = -this._P433;
    }
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      const zj3: number[] = z[j3];
      const zj4: number[] = z[j4];
      const zj5: number[] = z[j5];
      const zj6: number[] = z[j6];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj1[i1] + zj6[i1];
        const t1i = zj1[i1 + 1] + zj6[i1 + 1];
        const t2r = zj2[i1] + zj5[i1];
        const t2i = zj2[i1 + 1] + zj5[i1 + 1];
        const t3r = zj3[i1] + zj4[i1];
        const t3i = zj3[i1 + 1] + zj4[i1 + 1];
        const t4r = zj1[i1] - zj6[i1];
        const t4i = zj1[i1 + 1] - zj6[i1 + 1];
        const t5r = zj2[i1] - zj5[i1];
        const t5i = zj2[i1 + 1] - zj5[i1 + 1];
        const t6r = zj3[i1] - zj4[i1];
        const t6i = zj3[i1 + 1] - zj4[i1 + 1];
        const t7r = zj0[i1] - 0.5 * t3r;
        const t7i = zj0[i1 + 1] - 0.5 * t3i;
        const t8r = t1r - t3r;
        const t8i = t1i - t3i;
        const t9r = t2r - t3r;
        const t9i = t2i - t3i;
        const y1r = t7r + c1 * t8r + c2 * t9r;
        const y1i = t7i + c1 * t8i + c2 * t9i;
        const y2r = t7r + c2 * t8r + c3 * t9r;
        const y2i = t7i + c2 * t8i + c3 * t9i;
        const y3r = t7r + c3 * t8r + c1 * t9r;
        const y3i = t7i + c3 * t8i + c1 * t9i;
        const y4r = c6 * t4r - c4 * t5r + c5 * t6r;
        const y4i = c6 * t4i - c4 * t5i + c5 * t6i;
        const y5r = c5 * t4r - c6 * t5r - c4 * t6r;
        const y5i = c5 * t4i - c6 * t5i - c4 * t6i;
        const y6r = c4 * t4r + c5 * t5r + c6 * t6r;
        const y6i = c4 * t4i + c5 * t5i + c6 * t6i;
        zj0[i1] = zj0[i1] + t1r + t2r + t3r;
        zj0[i1 + 1] = zj0[i1 + 1] + t1i + t2i + t3i;
        zj1[i1] = y1r - y6i;
        zj1[i1 + 1] = y1i + y6r;
        zj2[i1] = y2r - y5i;
        zj2[i1 + 1] = y2i + y5r;
        zj3[i1] = y3r - y4i;
        zj3[i1 + 1] = y3i + y4r;
        zj4[i1] = y3r + y4i;
        zj4[i1 + 1] = y3i - y4r;
        zj5[i1] = y2r + y5i;
        zj5[i1 + 1] = y2i - y5r;
        zj6[i1] = y1r + y6i;
        zj6[i1 + 1] = y1i - y6r;
      }
      const jt = j6 + 1;
      j6 = j5 + 1;
      j5 = j4 + 1;
      j4 = j3 + 1;
      j3 = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa8a(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number, j7: number) {
    const m1 = 2 * n1;
    let c1, c2, c3;
    if (mu === 1) {
      c1 = this._PONE;
      c2 = this._P707;
    } else if (mu === 3) {
      c1 = -this._PONE;
      c2 = -this._P707;
    } else if (mu === 5) {
      c1 = this._PONE;
      c2 = -this._P707;
    } else {
      c1 = -this._PONE;
      c2 = this._P707;
    }
    c3 = c1 * c2;
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      const zj3: number[] = z[j3];
      const zj4: number[] = z[j4];
      const zj5: number[] = z[j5];
      const zj6: number[] = z[j6];
      const zj7: number[] = z[j7];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj0[i1] + zj4[i1];
        const t1i = zj0[i1 + 1] + zj4[i1 + 1];
        const t2r = zj0[i1] - zj4[i1];
        const t2i = zj0[i1 + 1] - zj4[i1 + 1];
        const t3r = zj1[i1] + zj5[i1];
        const t3i = zj1[i1 + 1] + zj5[i1 + 1];
        const t4r = zj1[i1] - zj5[i1];
        const t4i = zj1[i1 + 1] - zj5[i1 + 1];
        const t5r = zj2[i1] + zj6[i1];
        const t5i = zj2[i1 + 1] + zj6[i1 + 1];
        const t6r = c1 * ( zj2[i1] - zj6[i1] );
        const t6i = c1 * ( zj2[i1 + 1] - zj6[i1 + 1] );
        const t7r = zj3[i1] + zj7[i1];
        const t7i = zj3[i1 + 1] + zj7[i1 + 1];
        const t8r = zj3[i1] - zj7[i1];
        const t8i = zj3[i1 + 1] - zj7[i1 + 1];
        const t9r = t1r + t5r;
        const t9i = t1i + t5i;
        const t10r = t3r + t7r;
        const t10i = t3i + t7i;
        const t11r = c2 * ( t4r - t8r );
        const t11i = c2 * ( t4i - t8i );
        const t12r = c3 * ( t4r + t8r );
        const t12i = c3 * ( t4i + t8i );
        const y1r = t2r + t11r;
        const y1i = t2i + t11i;
        const y2r = t1r - t5r;
        const y2i = t1i - t5i;
        const y3r = t2r - t11r;
        const y3i = t2i - t11i;
        const y5r = t12r - t6r;
        const y5i = t12i - t6i;
        const y6r = c1 * ( t3r - t7r );
        const y6i = c1 * ( t3i - t7i );
        const y7r = t12r + t6r;
        const y7i = t12i + t6i;
        zj0[i1] = t9r + t10r;
        zj0[i1 + 1] = t9i + t10i;
        zj1[i1] = y1r - y7i;
        zj1[i1 + 1] = y1i + y7r;
        zj2[i1] = y2r - y6i;
        zj2[i1 + 1] = y2i + y6r;
        zj3[i1] = y3r - y5i;
        zj3[i1 + 1] = y3i + y5r;
        zj4[i1] = t9r - t10r;
        zj4[i1 + 1] = t9i - t10i;
        zj5[i1] = y3r + y5i;
        zj5[i1 + 1] = y3i - y5r;
        zj6[i1] = y2r + y6i;
        zj6[i1 + 1] = y2i - y6r;
        zj7[i1] = y1r + y7i;
        zj7[i1 + 1] = y1i - y7r;
      }
      const jt = j7 + 1;
      j7 = j6 + 1;
      j6 = j5 + 1;
      j5 = j4 + 1;
      j4 = j3 + 1;
      j3 = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa9a(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number, j7: number, j8: number) {
    const m1 = 2 * n1;
    let c1, c2, c3, c4, c5, c6, c7, c8, c9;
    if (mu === 1) {
      c1 = this._P866;
      c2 = this._P766;
      c3 = this._P642;
      c4 = this._P173;
      c5 = this._P984;
    } else if (mu === 2) {
      c1 = -this._P866;
      c2 = this._P173;
      c3 = this._P984;
      c4 = -this._P939;
      c5 = this._P342;
    } else if (mu === 4) {
      c1 = this._P866;
      c2 = -this._P939;
      c3 = this._P342;
      c4 = this._P766;
      c5 = -this._P642;
    } else if (mu === 5) {
      c1 = -this._P866;
      c2 = -this._P939;
      c3 = -this._P342;
      c4 = this._P766;
      c5 = this._P642;
    } else if (mu === 7) {
      c1 = this._P866;
      c2 = this._P173;
      c3 = -this._P984;
      c4 = -this._P939;
      c5 = -this._P342;
    } else {
      c1 = -this._P866;
      c2 = this._P766;
      c3 = -this._P642;
      c4 = this._P173;
      c5 = -this._P984;
    }
    c6 = c1 * c2;
    c7 = c1 * c3;
    c8 = c1 * c4;
    c9 = c1 * c5;
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      const zj3: number[] = z[j3];
      const zj4: number[] = z[j4];
      const zj5: number[] = z[j5];
      const zj6: number[] = z[j6];
      const zj7: number[] = z[j7];
      const zj8: number[] = z[j8];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj3[i1] + zj6[i1];
        const t1i = zj3[i1 + 1] + zj6[i1 + 1];
        const t2r = zj0[i1] - 0.5 * t1r;
        const t2i = zj0[i1 + 1] - 0.5 * t1i;
        const t3r = c1 * ( zj3[i1] - zj6[i1] );
        const t3i = c1 * ( zj3[i1 + 1] - zj6[i1 + 1] );
        const t4r = zj0[i1] + t1r;
        const t4i = zj0[i1 + 1] + t1i;
        const t5r = zj4[i1] + zj7[i1];
        const t5i = zj4[i1 + 1] + zj7[i1 + 1];
        const t6r = zj1[i1] - 0.5 * t5r;
        const t6i = zj1[i1 + 1] - 0.5 * t5i;
        const t7r = zj4[i1] - zj7[i1];
        const t7i = zj4[i1 + 1] - zj7[i1 + 1];
        const t8r = zj1[i1] + t5r;
        const t8i = zj1[i1 + 1] + t5i;
        const t9r = zj2[i1] + zj5[i1];
        const t9i = zj2[i1 + 1] + zj5[i1 + 1];
        const t10r = zj8[i1] - 0.5 * t9r;
        const t10i = zj8[i1 + 1] - 0.5 * t9i;
        const t11r = zj2[i1] - zj5[i1];
        const t11i = zj2[i1 + 1] - zj5[i1 + 1];
        const t12r = zj8[i1] + t9r;
        const t12i = zj8[i1 + 1] + t9i;
        const t13r = t8r + t12r;
        const t13i = t8i + t12i;
        const t14r = t6r + t10r;
        const t14i = t6i + t10i;
        const t15r = t6r - t10r;
        const t15i = t6i - t10i;
        const t16r = t7r + t11r;
        const t16i = t7i + t11i;
        const t17r = t7r - t11r;
        const t17i = t7i - t11i;
        const t18r = c2 * t14r - c7 * t17r;
        const t18i = c2 * t14i - c7 * t17i;
        const t19r = c4 * t14r + c9 * t17r;
        const t19i = c4 * t14i + c9 * t17i;
        const t20r = c3 * t15r + c6 * t16r;
        const t20i = c3 * t15i + c6 * t16i;
        const t21r = c5 * t15r - c8 * t16r;
        const t21i = c5 * t15i - c8 * t16i;
        const t22r = t18r + t19r;
        const t22i = t18i + t19i;
        const t23r = t20r - t21r;
        const t23i = t20i - t21i;
        const y1r = t2r + t18r;
        const y1i = t2i + t18i;
        const y2r = t2r + t19r;
        const y2i = t2i + t19i;
        const y3r = t4r - 0.5 * t13r;
        const y3i = t4i - 0.5 * t13i;
        const y4r = t2r - t22r;
        const y4i = t2i - t22i;
        const y5r = t3r - t23r;
        const y5i = t3i - t23i;
        const y6r = c1 * ( t8r - t12r );
        const y6i = c1 * ( t8i - t12i );
        const y7r = t21r - t3r;
        const y7i = t21i - t3i;
        const y8r = t3r + t20r;
        const y8i = t3i + t20i;
        zj0[i1] = t4r + t13r;
        zj0[i1 + 1] = t4i + t13i;
        zj1[i1] = y1r - y8i;
        zj1[i1 + 1] = y1i + y8r;
        zj2[i1] = y2r - y7i;
        zj2[i1 + 1] = y2i + y7r;
        zj3[i1] = y3r - y6i;
        zj3[i1 + 1] = y3i + y6r;
        zj4[i1] = y4r - y5i;
        zj4[i1 + 1] = y4i + y5r;
        zj5[i1] = y4r + y5i;
        zj5[i1 + 1] = y4i - y5r;
        zj6[i1] = y3r + y6i;
        zj6[i1 + 1] = y3i - y6r;
        zj7[i1] = y2r + y7i;
        zj7[i1 + 1] = y2i - y7r;
        zj8[i1] = y1r + y8i;
        zj8[i1 + 1] = y1i - y8r;
      }
      const jt = j8 + 1;
      j8 = j7 + 1;
      j7 = j6 + 1;
      j6 = j5 + 1;
      j5 = j4 + 1;
      j4 = j3 + 1;
      j3 = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa11a(n1: number, z: number[][], mu: number, m: number,
                         j0: number, j1: number, j2: number, j3: number, j4: number, j5: number,
                         j6: number, j7: number, j8: number, j9: number, j10: number) {
    const m1 = 2 * n1;
    let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10;
    if (mu === 1) {
      c1 = this._P841;
      c2 = this._P415;
      c3 = -this._P142;
      c4 = -this._P654;
      c5 = -this._P959;
      c6 = this._P540;
      c7 = this._P909;
      c8 = this._P989;
      c9 = this._P755;
      c10 = this._P281;
    } else if (mu === 2) {
      c1 = this._P415;
      c2 = -this._P654;
      c3 = -this._P959;
      c4 = -this._P142;
      c5 = this._P841;
      c6 = this._P909;
      c7 = this._P755;
      c8 = -this._P281;
      c9 = -this._P989;
      c10 = -this._P540;
    } else if (mu === 3) {
      c1 = -this._P142;
      c2 = -this._P959;
      c3 = this._P415;
      c4 = this._P841;
      c5 = -this._P654;
      c6 = this._P989;
      c7 = -this._P281;
      c8 = -this._P909;
      c9 = this._P540;
      c10 = this._P755;
    } else if (mu === 4) {
      c1 = -this._P654;
      c2 = -this._P142;
      c3 = this._P841;
      c4 = -this._P959;
      c5 = this._P415;
      c6 = this._P755;
      c7 = -this._P989;
      c8 = this._P540;
      c9 = this._P281;
      c10 = -this._P909;
    } else if (mu === 5) {
      c1 = -this._P959;
      c2 = this._P841;
      c3 = -this._P654;
      c4 = this._P415;
      c5 = -this._P142;
      c6 = this._P281;
      c7 = -this._P540;
      c8 = this._P755;
      c9 = -this._P909;
      c10 = this._P989;
    } else if (mu === 6) {
      c1 = -this._P959;
      c2 = this._P841;
      c3 = -this._P654;
      c4 = this._P415;
      c5 = -this._P142;
      c6 = -this._P281;
      c7 = this._P540;
      c8 = -this._P755;
      c9 = this._P909;
      c10 = -this._P989;
    } else if (mu === 7) {
      c1 = -this._P654;
      c2 = -this._P142;
      c3 = this._P841;
      c4 = -this._P959;
      c5 = this._P415;
      c6 = -this._P755;
      c7 = this._P989;
      c8 = -this._P540;
      c9 = -this._P281;
      c10 = this._P909;
    } else if (mu === 8) {
      c1 = -this._P142;
      c2 = -this._P959;
      c3 = this._P415;
      c4 = this._P841;
      c5 = -this._P654;
      c6 = -this._P989;
      c7 = this._P281;
      c8 = this._P909;
      c9 = -this._P540;
      c10 = -this._P755;
    } else if (mu === 9) {
      c1 = this._P415;
      c2 = -this._P654;
      c3 = -this._P959;
      c4 = -this._P142;
      c5 = this._P841;
      c6 = -this._P909;
      c7 = -this._P755;
      c8 = this._P281;
      c9 = this._P989;
      c10 = this._P540;
    } else {
      c1 = this._P841;
      c2 = this._P415;
      c3 = -this._P142;
      c4 = -this._P654;
      c5 = -this._P959;
      c6 = -this._P540;
      c7 = -this._P909;
      c8 = -this._P989;
      c9 = -this._P755;
      c10 = -this._P281;
    }
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      const zj3: number[] = z[j3];
      const zj4: number[] = z[j4];
      const zj5: number[] = z[j5];
      const zj6: number[] = z[j6];
      const zj7: number[] = z[j7];
      const zj8: number[] = z[j8];
      const zj9: number[] = z[j9];
      const zj10: number[] = z[j10];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj1[i1] + zj10[i1];
        const t1i = zj1[i1 + 1] + zj10[i1 + 1];
        const t2r = zj2[i1] + zj9[i1];
        const t2i = zj2[i1 + 1] + zj9[i1 + 1];
        const t3r = zj3[i1] + zj8[i1];
        const t3i = zj3[i1 + 1] + zj8[i1 + 1];
        const t4r = zj4[i1] + zj7[i1];
        const t4i = zj4[i1 + 1] + zj7[i1 + 1];
        const t5r = zj5[i1] + zj6[i1];
        const t5i = zj5[i1 + 1] + zj6[i1 + 1];
        const t6r = zj1[i1] - zj10[i1];
        const t6i = zj1[i1 + 1] - zj10[i1 + 1];
        const t7r = zj2[i1] - zj9[i1];
        const t7i = zj2[i1 + 1] - zj9[i1 + 1];
        const t8r = zj3[i1] - zj8[i1];
        const t8i = zj3[i1 + 1] - zj8[i1 + 1];
        const t9r = zj4[i1] - zj7[i1];
        const t9i = zj4[i1 + 1] - zj7[i1 + 1];
        const t10r = zj5[i1] - zj6[i1];
        const t10i = zj5[i1 + 1] - zj6[i1 + 1];
        const t11r = zj0[i1] - 0.5 * t5r;
        const t11i = zj0[i1 + 1] - 0.5 * t5i;
        const t12r = t1r - t5r;
        const t12i = t1i - t5i;
        const t13r = t2r - t5r;
        const t13i = t2i - t5i;
        const t14r = t3r - t5r;
        const t14i = t3i - t5i;
        const t15r = t4r - t5r;
        const t15i = t4i - t5i;
        const y1r = t11r + c1 * t12r + c2 * t13r + c3 * t14r + c4 * t15r;
        const y1i = t11i + c1 * t12i + c2 * t13i + c3 * t14i + c4 * t15i;
        const y2r = t11r + c2 * t12r + c4 * t13r + c5 * t14r + c3 * t15r;
        const y2i = t11i + c2 * t12i + c4 * t13i + c5 * t14i + c3 * t15i;
        const y3r = t11r + c3 * t12r + c5 * t13r + c2 * t14r + c1 * t15r;
        const y3i = t11i + c3 * t12i + c5 * t13i + c2 * t14i + c1 * t15i;
        const y4r = t11r + c4 * t12r + c3 * t13r + c1 * t14r + c5 * t15r;
        const y4i = t11i + c4 * t12i + c3 * t13i + c1 * t14i + c5 * t15i;
        const y5r = t11r + c5 * t12r + c1 * t13r + c4 * t14r + c2 * t15r;
        const y5i = t11i + c5 * t12i + c1 * t13i + c4 * t14i + c2 * t15i;
        const y6r = c10 * t6r - c6 * t7r + c9 * t8r - c7 * t9r + c8 * t10r;
        const y6i = c10 * t6i - c6 * t7i + c9 * t8i - c7 * t9i + c8 * t10i;
        const y7r = c9 * t6r - c8 * t7r + c6 * t8r + c10 * t9r - c7 * t10r;
        const y7i = c9 * t6i - c8 * t7i + c6 * t8i + c10 * t9i - c7 * t10i;
        const y8r = c8 * t6r - c10 * t7r - c7 * t8r + c6 * t9r + c9 * t10r;
        const y8i = c8 * t6i - c10 * t7i - c7 * t8i + c6 * t9i + c9 * t10i;
        const y9r = c7 * t6r + c9 * t7r - c10 * t8r - c8 * t9r - c6 * t10r;
        const y9i = c7 * t6i + c9 * t7i - c10 * t8i - c8 * t9i - c6 * t10i;
        const y10r = c6 * t6r + c7 * t7r + c8 * t8r + c9 * t9r + c10 * t10r;
        const y10i = c6 * t6i + c7 * t7i + c8 * t8i + c9 * t9i + c10 * t10i;
        zj0[i1] = zj0[i1] + t1r + t2r + t3r + t4r + t5r;
        zj0[i1 + 1] = zj0[i1 + 1] + t1i + t2i + t3i + t4i + t5i;
        zj1[i1] = y1r - y10i;
        zj1[i1 + 1] = y1i + y10r;
        zj2[i1] = y2r - y9i;
        zj2[i1 + 1] = y2i + y9r;
        zj3[i1] = y3r - y8i;
        zj3[i1 + 1] = y3i + y8r;
        zj4[i1] = y4r - y7i;
        zj4[i1 + 1] = y4i + y7r;
        zj5[i1] = y5r - y6i;
        zj5[i1 + 1] = y5i + y6r;
        zj6[i1] = y5r + y6i;
        zj6[i1 + 1] = y5i - y6r;
        zj7[i1] = y4r + y7i;
        zj7[i1 + 1] = y4i - y7r;
        zj8[i1] = y3r + y8i;
        zj8[i1 + 1] = y3i - y8r;
        zj9[i1] = y2r + y9i;
        zj9[i1 + 1] = y2i - y9r;
        zj10[i1] = y1r + y10i;
        zj10[i1 + 1] = y1i - y10r;
      }
      const jt = j10 + 1;
      j10 = j9 + 1;
      j9 = j8 + 1;
      j8 = j7 + 1;
      j7 = j6 + 1;
      j6 = j5 + 1;
      j5 = j4 + 1;
      j4 = j3 + 1;
      j3 = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa13a(n1: number, z: number[][], mu: number, m: number,
                         j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number,
                         j7: number, j8: number, j9: number, j10: number, j11: number, j12: number) {
    const m1 = 2 * n1;
    let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12;
    if (mu === 1) {
      c1 = this._P885;
      c2 = this._P568;
      c3 = this._P120;
      c4 = -this._P354;
      c5 = -this._P748;
      c6 = -this._P970;
      c7 = this._P464;
      c8 = this._P822;
      c9 = this._P992;
      c10 = this._P935;
      c11 = this._P663;
      c12 = this._P239;
    } else if (mu === 2) {
      c1 = this._P568;
      c2 = -this._P354;
      c3 = -this._P970;
      c4 = -this._P748;
      c5 = this._P120;
      c6 = this._P885;
      c7 = this._P822;
      c8 = this._P935;
      c9 = this._P239;
      c10 = -this._P663;
      c11 = -this._P992;
      c12 = -this._P464;
    } else if (mu === 3) {
      c1 = this._P120;
      c2 = -this._P970;
      c3 = -this._P354;
      c4 = this._P885;
      c5 = this._P568;
      c6 = -this._P748;
      c7 = this._P992;
      c8 = this._P239;
      c9 = -this._P935;
      c10 = -this._P464;
      c11 = this._P822;
      c12 = this._P663;
    } else if (mu === 4) {
      c1 = -this._P354;
      c2 = -this._P748;
      c3 = this._P885;
      c4 = this._P120;
      c5 = -this._P970;
      c6 = this._P568;
      c7 = this._P935;
      c8 = -this._P663;
      c9 = -this._P464;
      c10 = this._P992;
      c11 = -this._P239;
      c12 = -this._P822;
    } else if (mu === 5) {
      c1 = -this._P748;
      c2 = this._P120;
      c3 = this._P568;
      c4 = -this._P970;
      c5 = this._P885;
      c6 = -this._P354;
      c7 = this._P663;
      c8 = -this._P992;
      c9 = this._P822;
      c10 = -this._P239;
      c11 = -this._P464;
      c12 = this._P935;
    } else if (mu === 6) {
      c1 = -this._P970;
      c2 = this._P885;
      c3 = -this._P748;
      c4 = this._P568;
      c5 = -this._P354;
      c6 = this._P120;
      c7 = this._P239;
      c8 = -this._P464;
      c9 = this._P663;
      c10 = -this._P822;
      c11 = this._P935;
      c12 = -this._P992;
    } else if (mu === 7) {
      c1 = -this._P970;
      c2 = this._P885;
      c3 = -this._P748;
      c4 = this._P568;
      c5 = -this._P354;
      c6 = this._P120;
      c7 = -this._P239;
      c8 = this._P464;
      c9 = -this._P663;
      c10 = this._P822;
      c11 = -this._P935;
      c12 = this._P992;
    } else if (mu === 8) {
      c1 = -this._P748;
      c2 = this._P120;
      c3 = this._P568;
      c4 = -this._P970;
      c5 = this._P885;
      c6 = -this._P354;
      c7 = -this._P663;
      c8 = this._P992;
      c9 = -this._P822;
      c10 = this._P239;
      c11 = this._P464;
      c12 = -this._P935;
    } else if (mu === 9) {
      c1 = -this._P354;
      c2 = -this._P748;
      c3 = this._P885;
      c4 = this._P120;
      c5 = -this._P970;
      c6 = this._P568;
      c7 = -this._P935;
      c8 = this._P663;
      c9 = this._P464;
      c10 = -this._P992;
      c11 = this._P239;
      c12 = this._P822;
    } else if (mu === 10) {
      c1 = this._P120;
      c2 = -this._P970;
      c3 = -this._P354;
      c4 = this._P885;
      c5 = this._P568;
      c6 = -this._P748;
      c7 = -this._P992;
      c8 = -this._P239;
      c9 = this._P935;
      c10 = this._P464;
      c11 = -this._P822;
      c12 = -this._P663;
    } else if (mu === 11) {
      c1 = this._P568;
      c2 = -this._P354;
      c3 = -this._P970;
      c4 = -this._P748;
      c5 = this._P120;
      c6 = this._P885;
      c7 = -this._P822;
      c8 = -this._P935;
      c9 = -this._P239;
      c10 = this._P663;
      c11 = this._P992;
      c12 = this._P464;
    } else {
      c1 = this._P885;
      c2 = this._P568;
      c3 = this._P120;
      c4 = -this._P354;
      c5 = -this._P748;
      c6 = -this._P970;
      c7 = -this._P464;
      c8 = -this._P822;
      c9 = -this._P992;
      c10 = -this._P935;
      c11 = -this._P663;
      c12 = -this._P239;
    }
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      const zj3: number[] = z[j3];
      const zj4: number[] = z[j4];
      const zj5: number[] = z[j5];
      const zj6: number[] = z[j6];
      const zj7: number[] = z[j7];
      const zj8: number[] = z[j8];
      const zj9: number[] = z[j9];
      const zj10: number[] = z[j10];
      const zj11: number[] = z[j11];
      const zj12: number[] = z[j12];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj1[i1] + zj12[i1];
        const t1i = zj1[i1 + 1] + zj12[i1 + 1];
        const t2r = zj2[i1] + zj11[i1];
        const t2i = zj2[i1 + 1] + zj11[i1 + 1];
        const t3r = zj3[i1] + zj10[i1];
        const t3i = zj3[i1 + 1] + zj10[i1 + 1];
        const t4r = zj4[i1] + zj9[i1];
        const t4i = zj4[i1 + 1] + zj9[i1 + 1];
        const t5r = zj5[i1] + zj8[i1];
        const t5i = zj5[i1 + 1] + zj8[i1 + 1];
        const t6r = zj6[i1] + zj7[i1];
        const t6i = zj6[i1 + 1] + zj7[i1 + 1];
        const t7r = zj1[i1] - zj12[i1];
        const t7i = zj1[i1 + 1] - zj12[i1 + 1];
        const t8r = zj2[i1] - zj11[i1];
        const t8i = zj2[i1 + 1] - zj11[i1 + 1];
        const t9r = zj3[i1] - zj10[i1];
        const t9i = zj3[i1 + 1] - zj10[i1 + 1];
        const t10r = zj4[i1] - zj9[i1];
        const t10i = zj4[i1 + 1] - zj9[i1 + 1];
        const t11r = zj5[i1] - zj8[i1];
        const t11i = zj5[i1 + 1] - zj8[i1 + 1];
        const t12r = zj6[i1] - zj7[i1];
        const t12i = zj6[i1 + 1] - zj7[i1 + 1];
        const t13r = zj0[i1] - 0.5 * t6r;
        const t13i = zj0[i1 + 1] - 0.5 * t6i;
        const t14r = t1r - t6r;
        const t14i = t1i - t6i;
        const t15r = t2r - t6r;
        const t15i = t2i - t6i;
        const t16r = t3r - t6r;
        const t16i = t3i - t6i;
        const t17r = t4r - t6r;
        const t17i = t4i - t6i;
        const t18r = t5r - t6r;
        const t18i = t5i - t6i;
        const y1r = t13r + c1 * t14r + c2 * t15r + c3 * t16r + c4 * t17r + c5 * t18r;
        const y1i = t13i + c1 * t14i + c2 * t15i + c3 * t16i + c4 * t17i + c5 * t18i;
        const y2r = t13r + c2 * t14r + c4 * t15r + c6 * t16r + c5 * t17r + c3 * t18r;
        const y2i = t13i + c2 * t14i + c4 * t15i + c6 * t16i + c5 * t17i + c3 * t18i;
        const y3r = t13r + c3 * t14r + c6 * t15r + c4 * t16r + c1 * t17r + c2 * t18r;
        const y3i = t13i + c3 * t14i + c6 * t15i + c4 * t16i + c1 * t17i + c2 * t18i;
        const y4r = t13r + c4 * t14r + c5 * t15r + c1 * t16r + c3 * t17r + c6 * t18r;
        const y4i = t13i + c4 * t14i + c5 * t15i + c1 * t16i + c3 * t17i + c6 * t18i;
        const y5r = t13r + c5 * t14r + c3 * t15r + c2 * t16r + c6 * t17r + c1 * t18r;
        const y5i = t13i + c5 * t14i + c3 * t15i + c2 * t16i + c6 * t17i + c1 * t18i;
        const y6r = t13r + c6 * t14r + c1 * t15r + c5 * t16r + c2 * t17r + c4 * t18r;
        const y6i = t13i + c6 * t14i + c1 * t15i + c5 * t16i + c2 * t17i + c4 * t18i;
        const y7r = c12 * t7r - c7 * t8r + c11 * t9r - c8 * t10r + c10 * t11r - c9 * t12r;
        const y7i = c12 * t7i - c7 * t8i + c11 * t9i - c8 * t10i + c10 * t11i - c9 * t12i;
        const y8r = c11 * t7r - c9 * t8r + c8 * t9r - c12 * t10r - c7 * t11r + c10 * t12r;
        const y8i = c11 * t7i - c9 * t8i + c8 * t9i - c12 * t10i - c7 * t11i + c10 * t12i;
        const y9r = c10 * t7r - c11 * t8r - c7 * t9r + c9 * t10r - c12 * t11r - c8 * t12r;
        const y9i = c10 * t7i - c11 * t8i - c7 * t9i + c9 * t10i - c12 * t11i - c8 * t12i;
        const y10r = c9 * t7r + c12 * t8r - c10 * t9r - c7 * t10r + c8 * t11r + c11 * t12r;
        const y10i = c9 * t7i + c12 * t8i - c10 * t9i - c7 * t10i + c8 * t11i + c11 * t12i;
        const y11r = c8 * t7r + c10 * t8r + c12 * t9r - c11 * t10r - c9 * t11r - c7 * t12r;
        const y11i = c8 * t7i + c10 * t8i + c12 * t9i - c11 * t10i - c9 * t11i - c7 * t12i;
        const y12r = c7 * t7r + c8 * t8r + c9 * t9r + c10 * t10r + c11 * t11r + c12 * t12r;
        const y12i = c7 * t7i + c8 * t8i + c9 * t9i + c10 * t10i + c11 * t11i + c12 * t12i;
        zj0[i1] = zj0[i1] + t1r + t2r + t3r + t4r + t5r + t6r;
        zj0[i1 + 1] = zj0[i1 + 1] + t1i + t2i + t3i + t4i + t5i + t6i;
        zj1[i1] = y1r - y12i;
        zj1[i1 + 1] = y1i + y12r;
        zj2[i1] = y2r - y11i;
        zj2[i1 + 1] = y2i + y11r;
        zj3[i1] = y3r - y10i;
        zj3[i1 + 1] = y3i + y10r;
        zj4[i1] = y4r - y9i;
        zj4[i1 + 1] = y4i + y9r;
        zj5[i1] = y5r - y8i;
        zj5[i1 + 1] = y5i + y8r;
        zj6[i1] = y6r - y7i;
        zj6[i1 + 1] = y6i + y7r;
        zj7[i1] = y6r + y7i;
        zj7[i1 + 1] = y6i - y7r;
        zj8[i1] = y5r + y8i;
        zj8[i1 + 1] = y5i - y8r;
        zj9[i1] = y4r + y9i;
        zj9[i1 + 1] = y4i - y9r;
        zj10[i1] = y3r + y10i;
        zj10[i1 + 1] = y3i - y10r;
        zj11[i1] = y2r + y11i;
        zj11[i1 + 1] = y2i - y11r;
        zj12[i1] = y1r + y12i;
        zj12[i1 + 1] = y1i - y12r;
      }
      const jt = j12 + 1;
      j12 = j11 + 1;
      j11 = j10 + 1;
      j10 = j9 + 1;
      j9 = j8 + 1;
      j8 = j7 + 1;
      j7 = j6 + 1;
      j6 = j5 + 1;
      j5 = j4 + 1;
      j4 = j3 + 1;
      j3 = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa16a(n1: number, z: number[][], mu: number, m: number,
                         j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number, j7: number, j8: number,
                         j9: number, j10: number, j11: number, j12: number, j13: number, j14: number, j15: number) {
    const m1 = 2 * n1;
    let c1, c2, c3, c4, c5, c6, c7;
    if (mu === 1) {
      c1 = this._PONE;
      c2 = this._P923;
      c3 = this._P382;
      c4 = this._P707;
    } else if (mu === 3) {
      c1 = -this._PONE;
      c2 = this._P382;
      c3 = this._P923;
      c4 = -this._P707;
    } else if (mu === 5) {
      c1 = this._PONE;
      c2 = -this._P382;
      c3 = this._P923;
      c4 = -this._P707;
    } else if (mu === 7) {
      c1 = -this._PONE;
      c2 = -this._P923;
      c3 = this._P382;
      c4 = this._P707;
    } else if (mu === 9) {
      c1 = this._PONE;
      c2 = -this._P923;
      c3 = -this._P382;
      c4 = this._P707;
    } else if (mu === 11) {
      c1 = -this._PONE;
      c2 = -this._P382;
      c3 = -this._P923;
      c4 = -this._P707;
    } else if (mu === 13) {
      c1 = this._PONE;
      c2 = this._P382;
      c3 = -this._P923;
      c4 = -this._P707;
    } else {
      c1 = -this._PONE;
      c2 = this._P923;
      c3 = -this._P382;
      c4 = this._P707;
    }
    c5 = c1 * c4;
    c6 = c1 * c3;
    c7 = c1 * c2;
    for (let i = 0; i < m; i++) {
      const zj0: number[] = z[j0];
      const zj1: number[] = z[j1];
      const zj2: number[] = z[j2];
      const zj3: number[] = z[j3];
      const zj4: number[] = z[j4];
      const zj5: number[] = z[j5];
      const zj6: number[] = z[j6];
      const zj7: number[] = z[j7];
      const zj8: number[] = z[j8];
      const zj9: number[] = z[j9];
      const zj10: number[] = z[j10];
      const zj11: number[] = z[j11];
      const zj12: number[] = z[j12];
      const zj13: number[] = z[j13];
      const zj14: number[] = z[j14];
      const zj15: number[] = z[j15];
      for (let i1 = 0; i1 < m1; i1 += 2) {
        const t1r = zj0[i1] + zj8[i1];
        const t1i = zj0[i1 + 1] + zj8[i1 + 1];
        const t2r = zj4[i1] + zj12[i1];
        const t2i = zj4[i1 + 1] + zj12[i1 + 1];
        const t3r = zj0[i1] - zj8[i1];
        const t3i = zj0[i1 + 1] - zj8[i1 + 1];
        const t4r = c1 * ( zj4[i1] - zj12[i1] );
        const t4i = c1 * ( zj4[i1 + 1] - zj12[i1 + 1] );
        const t5r = t1r + t2r;
        const t5i = t1i + t2i;
        const t6r = t1r - t2r;
        const t6i = t1i - t2i;
        const t7r = zj1[i1] + zj9[i1];
        const t7i = zj1[i1 + 1] + zj9[i1 + 1];
        const t8r = zj5[i1] + zj13[i1];
        const t8i = zj5[i1 + 1] + zj13[i1 + 1];
        const t9r = zj1[i1] - zj9[i1];
        const t9i = zj1[i1 + 1] - zj9[i1 + 1];
        const t10r = zj5[i1] - zj13[i1];
        const t10i = zj5[i1 + 1] - zj13[i1 + 1];
        const t11r = t7r + t8r;
        const t11i = t7i + t8i;
        const t12r = t7r - t8r;
        const t12i = t7i - t8i;
        const t13r = zj2[i1] + zj10[i1];
        const t13i = zj2[i1 + 1] + zj10[i1 + 1];
        const t14r = zj6[i1] + zj14[i1];
        const t14i = zj6[i1 + 1] + zj14[i1 + 1];
        const t15r = zj2[i1] - zj10[i1];
        const t15i = zj2[i1 + 1] - zj10[i1 + 1];
        const t16r = zj6[i1] - zj14[i1];
        const t16i = zj6[i1 + 1] - zj14[i1 + 1];
        const t17r = t13r + t14r;
        const t17i = t13i + t14i;
        const t18r = c4 * ( t15r - t16r );
        const t18i = c4 * ( t15i - t16i );
        const t19r = c5 * ( t15r + t16r );
        const t19i = c5 * ( t15i + t16i );
        const t20r = c1 * ( t13r - t14r );
        const t20i = c1 * ( t13i - t14i );
        const t21r = zj3[i1] + zj11[i1];
        const t21i = zj3[i1 + 1] + zj11[i1 + 1];
        const t22r = zj7[i1] + zj15[i1];
        const t22i = zj7[i1 + 1] + zj15[i1 + 1];
        const t23r = zj3[i1] - zj11[i1];
        const t23i = zj3[i1 + 1] - zj11[i1 + 1];
        const t24r = zj7[i1] - zj15[i1];
        const t24i = zj7[i1 + 1] - zj15[i1 + 1];
        const t25r = t21r + t22r;
        const t25i = t21i + t22i;
        const t26r = t21r - t22r;
        const t26i = t21i - t22i;
        const t27r = t9r + t24r;
        const t27i = t9i + t24i;
        const t28r = t10r + t23r;
        const t28i = t10i + t23i;
        const t29r = t9r - t24r;
        const t29i = t9i - t24i;
        const t30r = t10r - t23r;
        const t30i = t10i - t23i;
        const t31r = t5r + t17r;
        const t31i = t5i + t17i;
        const t32r = t11r + t25r;
        const t32i = t11i + t25i;
        const t33r = t3r + t18r;
        const t33i = t3i + t18i;
        const t34r = c2 * t29r - c6 * t30r;
        const t34i = c2 * t29i - c6 * t30i;
        const t35r = t3r - t18r;
        const t35i = t3i - t18i;
        const t36r = c7 * t27r - c3 * t28r;
        const t36i = c7 * t27i - c3 * t28i;
        const t37r = t4r + t19r;
        const t37i = t4i + t19i;
        const t38r = c3 * t27r + c7 * t28r;
        const t38i = c3 * t27i + c7 * t28i;
        const t39r = t4r - t19r;
        const t39i = t4i - t19i;
        const t40r = c6 * t29r + c2 * t30r;
        const t40i = c6 * t29i + c2 * t30i;
        const t41r = c4 * ( t12r - t26r );
        const t41i = c4 * ( t12i - t26i );
        const t42r = c5 * ( t12r + t26r );
        const t42i = c5 * ( t12i + t26i );
        const y1r = t33r + t34r;
        const y1i = t33i + t34i;
        const y2r = t6r + t41r;
        const y2i = t6i + t41i;
        const y3r = t35r + t40r;
        const y3i = t35i + t40i;
        const y4r = t5r - t17r;
        const y4i = t5i - t17i;
        const y5r = t35r - t40r;
        const y5i = t35i - t40i;
        const y6r = t6r - t41r;
        const y6i = t6i - t41i;
        const y7r = t33r - t34r;
        const y7i = t33i - t34i;
        const y9r = t38r - t37r;
        const y9i = t38i - t37i;
        const y10r = t42r - t20r;
        const y10i = t42i - t20i;
        const y11r = t36r + t39r;
        const y11i = t36i + t39i;
        const y12r = c1 * ( t11r - t25r );
        const y12i = c1 * ( t11i - t25i );
        const y13r = t36r - t39r;
        const y13i = t36i - t39i;
        const y14r = t42r + t20r;
        const y14i = t42i + t20i;
        const y15r = t38r + t37r;
        const y15i = t38i + t37i;
        zj0[i1] = t31r + t32r;
        zj0[i1 + 1] = t31i + t32i;
        zj1[i1] = y1r - y15i;
        zj1[i1 + 1] = y1i + y15r;
        zj2[i1] = y2r - y14i;
        zj2[i1 + 1] = y2i + y14r;
        zj3[i1] = y3r - y13i;
        zj3[i1 + 1] = y3i + y13r;
        zj4[i1] = y4r - y12i;
        zj4[i1 + 1] = y4i + y12r;
        zj5[i1] = y5r - y11i;
        zj5[i1 + 1] = y5i + y11r;
        zj6[i1] = y6r - y10i;
        zj6[i1 + 1] = y6i + y10r;
        zj7[i1] = y7r - y9i;
        zj7[i1 + 1] = y7i + y9r;
        zj8[i1] = t31r - t32r;
        zj8[i1 + 1] = t31i - t32i;
        zj9[i1] = y7r + y9i;
        zj9[i1 + 1] = y7i - y9r;
        zj10[i1] = y6r + y10i;
        zj10[i1 + 1] = y6i - y10r;
        zj11[i1] = y5r + y11i;
        zj11[i1 + 1] = y5i - y11r;
        zj12[i1] = y4r + y12i;
        zj12[i1 + 1] = y4i - y12r;
        zj13[i1] = y3r + y13i;
        zj13[i1 + 1] = y3i - y13r;
        zj14[i1] = y2r + y14i;
        zj14[i1 + 1] = y2i - y14r;
        zj15[i1] = y1r + y15i;
        zj15[i1 + 1] = y1i - y15r;
      }
      const jt = j15 + 1;
      j15 = j14 + 1;
      j14 = j13 + 1;
      j13 = j12 + 1;
      j12 = j11 + 1;
      j11 = j10 + 1;
      j10 = j9 + 1;
      j9 = j8 + 1;
      j8 = j7 + 1;
      j7 = j6 + 1;
      j6 = j5 + 1;
      j5 = j4 + 1;
      j4 = j3 + 1;
      j3 = j2 + 1;
      j2 = j1 + 1;
      j1 = j0 + 1;
      j0 = jt;
    }
  }

  private static _pfa2b(n1: number, z: number[][], m: number, j0: number, j1: number) {
    for (let i = 0; i < m; i++) {
      const zj0r: number[] = z[j0];
      const zj0i: number[] = z[j0 + 1];
      const zj1r: number[] = z[j1];
      const zj1i: number[] = z[j1 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj0r[i1] - zj1r[i1];
        const t1i = zj0i[i1] - zj1i[i1];
        zj0r[i1] = zj0r[i1] + zj1r[i1];
        zj0i[i1] = zj0i[i1] + zj1i[i1];
        zj1r[i1] = t1r;
        zj1i[i1] = t1i;
      }
      const jt = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa3b(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number) {
    let c1;
    if (mu === 1) {
      c1 = this._P866;
    } else {
      c1 = -this._P866;
    }
    for (let i = 0; i < m; i++) {
      const zj0r = z[j0];
      const zj0i = z[j0 + 1];
      const zj1r = z[j1];
      const zj1i = z[j1 + 1];
      const zj2r = z[j2];
      const zj2i = z[j2 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj1r[i1] + zj2r[i1];
        const t1i = zj1i[i1] + zj2i[i1];
        const y1r = zj0r[i1] - 0.5 * t1r;
        const y1i = zj0i[i1] - 0.5 * t1i;
        const y2r = c1 * ( zj1r[i1] - zj2r[i1] );
        const y2i = c1 * ( zj1i[i1] - zj2i[i1] );
        zj0r[i1] = zj0r[i1] + t1r;
        zj0i[i1] = zj0i[i1] + t1i;
        zj1r[i1] = y1r - y2i;
        zj1i[i1] = y1i + y2r;
        zj2r[i1] = y1r + y2i;
        zj2i[i1] = y1i - y2r;
      }
      const jt = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa4b(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number) {
    let c1;
    if (mu === 1) {
      c1 = this._PONE;
    } else {
      c1 = -this._PONE;
    }
    for (let i = 0; i < m; i++) {
      const zj0r = z[j0];
      const zj0i = z[j0 + 1];
      const zj1r = z[j1];
      const zj1i = z[j1 + 1];
      const zj2r = z[j2];
      const zj2i = z[j2 + 1];
      const zj3r = z[j3];
      const zj3i = z[j3 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj0r[i1] + zj2r[i1];
        const t1i = zj0i[i1] + zj2i[i1];
        const t2r = zj1r[i1] + zj3r[i1];
        const t2i = zj1i[i1] + zj3i[i1];
        const y1r = zj0r[i1] - zj2r[i1];
        const y1i = zj0i[i1] - zj2i[i1];
        const y3r = c1 * ( zj1r[i1] - zj3r[i1] );
        const y3i = c1 * ( zj1i[i1] - zj3i[i1] );
        zj0r[i1] = t1r + t2r;
        zj0i[i1] = t1i + t2i;
        zj1r[i1] = y1r - y3i;
        zj1i[i1] = y1i + y3r;
        zj2r[i1] = t1r - t2r;
        zj2i[i1] = t1i - t2i;
        zj3r[i1] = y1r + y3i;
        zj3i[i1] = y1i - y3r;
      }
      const jt = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa5b(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number, j4: number) {
    let c1, c2, c3;
    if (mu === 1) {
      c1 = this._P559;
      c2 = this._P951;
      c3 = this._P587;
    } else if (mu === 2) {
      c1 = -this._P559;
      c2 = this._P587;
      c3 = -this._P951;
    } else if (mu === 3) {
      c1 = -this._P559;
      c2 = -this._P587;
      c3 = this._P951;
    } else {
      c1 = this._P559;
      c2 = -this._P951;
      c3 = -this._P587;
    }
    for (let i = 0; i < m; i++) {
      const zj0r = z[j0];
      const zj0i = z[j0 + 1];
      const zj1r = z[j1];
      const zj1i = z[j1 + 1];
      const zj2r = z[j2];
      const zj2i = z[j2 + 1];
      const zj3r = z[j3];
      const zj3i = z[j3 + 1];
      const zj4r = z[j4];
      const zj4i = z[j4 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj1r[i1] + zj4r[i1];
        const t1i = zj1i[i1] + zj4i[i1];
        const t2r = zj2r[i1] + zj3r[i1];
        const t2i = zj2i[i1] + zj3i[i1];
        const t3r = zj1r[i1] - zj4r[i1];
        const t3i = zj1i[i1] - zj4i[i1];
        const t4r = zj2r[i1] - zj3r[i1];
        const t4i = zj2i[i1] - zj3i[i1];
        const t5r = t1r + t2r;
        const t5i = t1i + t2i;
        const t6r = c1 * ( t1r - t2r );
        const t6i = c1 * ( t1i - t2i );
        const t7r = zj0r[i1] - 0.25 * t5r;
        const t7i = zj0i[i1] - 0.25 * t5i;
        const y1r = t7r + t6r;
        const y1i = t7i + t6i;
        const y2r = t7r - t6r;
        const y2i = t7i - t6i;
        const y3r = c3 * t3r - c2 * t4r;
        const y3i = c3 * t3i - c2 * t4i;
        const y4r = c2 * t3r + c3 * t4r;
        const y4i = c2 * t3i + c3 * t4i;
        zj0r[i1] = zj0r[i1] + t5r;
        zj0i[i1] = zj0i[i1] + t5i;
        zj1r[i1] = y1r - y4i;
        zj1i[i1] = y1i + y4r;
        zj2r[i1] = y2r - y3i;
        zj2i[i1] = y2i + y3r;
        zj3r[i1] = y2r + y3i;
        zj3i[i1] = y2i - y3r;
        zj4r[i1] = y1r + y4i;
        zj4i[i1] = y1i - y4r;
      }
      const jt = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa7b(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number) {
    let c1, c2, c3, c4, c5, c6;
    if (mu === 1) {
      c1 = this._P623;
      c2 = -this._P222;
      c3 = -this._P900;
      c4 = this._P781;
      c5 = this._P974;
      c6 = this._P433;
    } else if (mu === 2) {
      c1 = -this._P222;
      c2 = -this._P900;
      c3 = this._P623;
      c4 = this._P974;
      c5 = -this._P433;
      c6 = -this._P781;
    } else if (mu === 3) {
      c1 = -this._P900;
      c2 = this._P623;
      c3 = -this._P222;
      c4 = this._P433;
      c5 = -this._P781;
      c6 = this._P974;
    } else if (mu === 4) {
      c1 = -this._P900;
      c2 = this._P623;
      c3 = -this._P222;
      c4 = -this._P433;
      c5 = this._P781;
      c6 = -this._P974;
    } else if (mu === 5) {
      c1 = -this._P222;
      c2 = -this._P900;
      c3 = this._P623;
      c4 = -this._P974;
      c5 = this._P433;
      c6 = this._P781;
    } else {
      c1 = this._P623;
      c2 = -this._P222;
      c3 = -this._P900;
      c4 = -this._P781;
      c5 = -this._P974;
      c6 = -this._P433;
    }
    for (let i = 0; i < m; i++) {
      const zj0r = z[j0];
      const zj0i = z[j0 + 1];
      const zj1r = z[j1];
      const zj1i = z[j1 + 1];
      const zj2r = z[j2];
      const zj2i = z[j2 + 1];
      const zj3r = z[j3];
      const zj3i = z[j3 + 1];
      const zj4r = z[j4];
      const zj4i = z[j4 + 1];
      const zj5r = z[j5];
      const zj5i = z[j5 + 1];
      const zj6r = z[j6];
      const zj6i = z[j6 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj1r[i1] + zj6r[i1];
        const t1i = zj1i[i1] + zj6i[i1];
        const t2r = zj2r[i1] + zj5r[i1];
        const t2i = zj2i[i1] + zj5i[i1];
        const t3r = zj3r[i1] + zj4r[i1];
        const t3i = zj3i[i1] + zj4i[i1];
        const t4r = zj1r[i1] - zj6r[i1];
        const t4i = zj1i[i1] - zj6i[i1];
        const t5r = zj2r[i1] - zj5r[i1];
        const t5i = zj2i[i1] - zj5i[i1];
        const t6r = zj3r[i1] - zj4r[i1];
        const t6i = zj3i[i1] - zj4i[i1];
        const t7r = zj0r[i1] - 0.5 * t3r;
        const t7i = zj0i[i1] - 0.5 * t3i;
        const t8r = t1r - t3r;
        const t8i = t1i - t3i;
        const t9r = t2r - t3r;
        const t9i = t2i - t3i;
        const y1r = t7r + c1 * t8r + c2 * t9r;
        const y1i = t7i + c1 * t8i + c2 * t9i;
        const y2r = t7r + c2 * t8r + c3 * t9r;
        const y2i = t7i + c2 * t8i + c3 * t9i;
        const y3r = t7r + c3 * t8r + c1 * t9r;
        const y3i = t7i + c3 * t8i + c1 * t9i;
        const y4r = c6 * t4r - c4 * t5r + c5 * t6r;
        const y4i = c6 * t4i - c4 * t5i + c5 * t6i;
        const y5r = c5 * t4r - c6 * t5r - c4 * t6r;
        const y5i = c5 * t4i - c6 * t5i - c4 * t6i;
        const y6r = c4 * t4r + c5 * t5r + c6 * t6r;
        const y6i = c4 * t4i + c5 * t5i + c6 * t6i;
        zj0r[i1] = zj0r[i1] + t1r + t2r + t3r;
        zj0i[i1] = zj0i[i1] + t1i + t2i + t3i;
        zj1r[i1] = y1r - y6i;
        zj1i[i1] = y1i + y6r;
        zj2r[i1] = y2r - y5i;
        zj2i[i1] = y2i + y5r;
        zj3r[i1] = y3r - y4i;
        zj3i[i1] = y3i + y4r;
        zj4r[i1] = y3r + y4i;
        zj4i[i1] = y3i - y4r;
        zj5r[i1] = y2r + y5i;
        zj5i[i1] = y2i - y5r;
        zj6r[i1] = y1r + y6i;
        zj6i[i1] = y1i - y6r;
      }
      const jt = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa8b(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number, j7: number) {
    let c1, c2, c3;
    if (mu === 1) {
      c1 = this._PONE;
      c2 = this._P707;
    } else if (mu === 3) {
      c1 = -this._PONE;
      c2 = -this._P707;
    } else if (mu === 5) {
      c1 = this._PONE;
      c2 = -this._P707;
    } else {
      c1 = -this._PONE;
      c2 = this._P707;
    }
    c3 = c1 * c2;
    for (let i = 0; i < m; i++) {
      const zj0r = z[j0];
      const zj0i = z[j0 + 1];
      const zj1r = z[j1];
      const zj1i = z[j1 + 1];
      const zj2r = z[j2];
      const zj2i = z[j2 + 1];
      const zj3r = z[j3];
      const zj3i = z[j3 + 1];
      const zj4r = z[j4];
      const zj4i = z[j4 + 1];
      const zj5r = z[j5];
      const zj5i = z[j5 + 1];
      const zj6r = z[j6];
      const zj6i = z[j6 + 1];
      const zj7r = z[j7];
      const zj7i = z[j7 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj0r[i1] + zj4r[i1];
        const t1i = zj0i[i1] + zj4i[i1];
        const t2r = zj0r[i1] - zj4r[i1];
        const t2i = zj0i[i1] - zj4i[i1];
        const t3r = zj1r[i1] + zj5r[i1];
        const t3i = zj1i[i1] + zj5i[i1];
        const t4r = zj1r[i1] - zj5r[i1];
        const t4i = zj1i[i1] - zj5i[i1];
        const t5r = zj2r[i1] + zj6r[i1];
        const t5i = zj2i[i1] + zj6i[i1];
        const t6r = c1 * ( zj2r[i1] - zj6r[i1] );
        const t6i = c1 * ( zj2i[i1] - zj6i[i1] );
        const t7r = zj3r[i1] + zj7r[i1];
        const t7i = zj3i[i1] + zj7i[i1];
        const t8r = zj3r[i1] - zj7r[i1];
        const t8i = zj3i[i1] - zj7i[i1];
        const t9r = t1r + t5r;
        const t9i = t1i + t5i;
        const t10r = t3r + t7r;
        const t10i = t3i + t7i;
        const t11r = c2 * ( t4r - t8r );
        const t11i = c2 * ( t4i - t8i );
        const t12r = c3 * ( t4r + t8r );
        const t12i = c3 * ( t4i + t8i );
        const y1r = t2r + t11r;
        const y1i = t2i + t11i;
        const y2r = t1r - t5r;
        const y2i = t1i - t5i;
        const y3r = t2r - t11r;
        const y3i = t2i - t11i;
        const y5r = t12r - t6r;
        const y5i = t12i - t6i;
        const y6r = c1 * ( t3r - t7r );
        const y6i = c1 * ( t3i - t7i );
        const y7r = t12r + t6r;
        const y7i = t12i + t6i;
        zj0r[i1] = t9r + t10r;
        zj0i[i1] = t9i + t10i;
        zj1r[i1] = y1r - y7i;
        zj1i[i1] = y1i + y7r;
        zj2r[i1] = y2r - y6i;
        zj2i[i1] = y2i + y6r;
        zj3r[i1] = y3r - y5i;
        zj3i[i1] = y3i + y5r;
        zj4r[i1] = t9r - t10r;
        zj4i[i1] = t9i - t10i;
        zj5r[i1] = y3r + y5i;
        zj5i[i1] = y3i - y5r;
        zj6r[i1] = y2r + y6i;
        zj6i[i1] = y2i - y6r;
        zj7r[i1] = y1r + y7i;
        zj7i[i1] = y1i - y7r;
      }
      const jt = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa9b(n1: number, z: number[][], mu: number, m: number,
                        j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number, j7: number, j8: number) {
    let c1, c2, c3, c4, c5, c6, c7, c8, c9;
    if (mu === 1) {
      c1 = this._P866;
      c2 = this._P766;
      c3 = this._P642;
      c4 = this._P173;
      c5 = this._P984;
    } else if (mu === 2) {
      c1 = -this._P866;
      c2 = this._P173;
      c3 = this._P984;
      c4 = -this._P939;
      c5 = this._P342;
    } else if (mu === 4) {
      c1 = this._P866;
      c2 = -this._P939;
      c3 = this._P342;
      c4 = this._P766;
      c5 = -this._P642;
    } else if (mu === 5) {
      c1 = -this._P866;
      c2 = -this._P939;
      c3 = -this._P342;
      c4 = this._P766;
      c5 = this._P642;
    } else if (mu === 7) {
      c1 = this._P866;
      c2 = this._P173;
      c3 = -this._P984;
      c4 = -this._P939;
      c5 = -this._P342;
    } else {
      c1 = -this._P866;
      c2 = this._P766;
      c3 = -this._P642;
      c4 = this._P173;
      c5 = -this._P984;
    }
    c6 = c1 * c2;
    c7 = c1 * c3;
    c8 = c1 * c4;
    c9 = c1 * c5;
    for (let i = 0; i < m; i++) {
      const zj0r = z[j0];
      const zj0i = z[j0 + 1];
      const zj1r = z[j1];
      const zj1i = z[j1 + 1];
      const zj2r = z[j2];
      const zj2i = z[j2 + 1];
      const zj3r = z[j3];
      const zj3i = z[j3 + 1];
      const zj4r = z[j4];
      const zj4i = z[j4 + 1];
      const zj5r = z[j5];
      const zj5i = z[j5 + 1];
      const zj6r = z[j6];
      const zj6i = z[j6 + 1];
      const zj7r = z[j7];
      const zj7i = z[j7 + 1];
      const zj8r = z[j8];
      const zj8i = z[j8 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj3r[i1] + zj6r[i1];
        const t1i = zj3i[i1] + zj6i[i1];
        const t2r = zj0r[i1] - 0.5 * t1r;
        const t2i = zj0i[i1] - 0.5 * t1i;
        const t3r = c1 * ( zj3r[i1] - zj6r[i1] );
        const t3i = c1 * ( zj3i[i1] - zj6i[i1] );
        const t4r = zj0r[i1] + t1r;
        const t4i = zj0i[i1] + t1i;
        const t5r = zj4r[i1] + zj7r[i1];
        const t5i = zj4i[i1] + zj7i[i1];
        const t6r = zj1r[i1] - 0.5 * t5r;
        const t6i = zj1i[i1] - 0.5 * t5i;
        const t7r = zj4r[i1] - zj7r[i1];
        const t7i = zj4i[i1] - zj7i[i1];
        const t8r = zj1r[i1] + t5r;
        const t8i = zj1i[i1] + t5i;
        const t9r = zj2r[i1] + zj5r[i1];
        const t9i = zj2i[i1] + zj5i[i1];
        const t10r = zj8r[i1] - 0.5 * t9r;
        const t10i = zj8i[i1] - 0.5 * t9i;
        const t11r = zj2r[i1] - zj5r[i1];
        const t11i = zj2i[i1] - zj5i[i1];
        const t12r = zj8r[i1] + t9r;
        const t12i = zj8i[i1] + t9i;
        const t13r = t8r + t12r;
        const t13i = t8i + t12i;
        const t14r = t6r + t10r;
        const t14i = t6i + t10i;
        const t15r = t6r - t10r;
        const t15i = t6i - t10i;
        const t16r = t7r + t11r;
        const t16i = t7i + t11i;
        const t17r = t7r - t11r;
        const t17i = t7i - t11i;
        const t18r = c2 * t14r - c7 * t17r;
        const t18i = c2 * t14i - c7 * t17i;
        const t19r = c4 * t14r + c9 * t17r;
        const t19i = c4 * t14i + c9 * t17i;
        const t20r = c3 * t15r + c6 * t16r;
        const t20i = c3 * t15i + c6 * t16i;
        const t21r = c5 * t15r - c8 * t16r;
        const t21i = c5 * t15i - c8 * t16i;
        const t22r = t18r + t19r;
        const t22i = t18i + t19i;
        const t23r = t20r - t21r;
        const t23i = t20i - t21i;
        const y1r = t2r + t18r;
        const y1i = t2i + t18i;
        const y2r = t2r + t19r;
        const y2i = t2i + t19i;
        const y3r = t4r - 0.5 * t13r;
        const y3i = t4i - 0.5 * t13i;
        const y4r = t2r - t22r;
        const y4i = t2i - t22i;
        const y5r = t3r - t23r;
        const y5i = t3i - t23i;
        const y6r = c1 * ( t8r - t12r );
        const y6i = c1 * ( t8i - t12i );
        const y7r = t21r - t3r;
        const y7i = t21i - t3i;
        const y8r = t3r + t20r;
        const y8i = t3i + t20i;
        zj0r[i1] = t4r + t13r;
        zj0i[i1] = t4i + t13i;
        zj1r[i1] = y1r - y8i;
        zj1i[i1] = y1i + y8r;
        zj2r[i1] = y2r - y7i;
        zj2i[i1] = y2i + y7r;
        zj3r[i1] = y3r - y6i;
        zj3i[i1] = y3i + y6r;
        zj4r[i1] = y4r - y5i;
        zj4i[i1] = y4i + y5r;
        zj5r[i1] = y4r + y5i;
        zj5i[i1] = y4i - y5r;
        zj6r[i1] = y3r + y6i;
        zj6i[i1] = y3i - y6r;
        zj7r[i1] = y2r + y7i;
        zj7i[i1] = y2i - y7r;
        zj8r[i1] = y1r + y8i;
        zj8i[i1] = y1i - y8r;
      }
      const jt = j8 + 2;
      j8 = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa11b(n1: number, z: number[][], mu: number, m: number,
                         j0: number, j1: number, j2: number, j3: number, j4: number, j5: number,
                         j6: number, j7: number, j8: number, j9: number, j10: number) {
    let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10;
    if (mu === 1) {
      c1 = this._P841;
      c2 = this._P415;
      c3 = -this._P142;
      c4 = -this._P654;
      c5 = -this._P959;
      c6 = this._P540;
      c7 = this._P909;
      c8 = this._P989;
      c9 = this._P755;
      c10 = this._P281;
    } else if (mu === 2) {
      c1 = this._P415;
      c2 = -this._P654;
      c3 = -this._P959;
      c4 = -this._P142;
      c5 = this._P841;
      c6 = this._P909;
      c7 = this._P755;
      c8 = -this._P281;
      c9 = -this._P989;
      c10 = -this._P540;
    } else if (mu === 3) {
      c1 = -this._P142;
      c2 = -this._P959;
      c3 = this._P415;
      c4 = this._P841;
      c5 = -this._P654;
      c6 = this._P989;
      c7 = -this._P281;
      c8 = -this._P909;
      c9 = this._P540;
      c10 = this._P755;
    } else if (mu === 4) {
      c1 = -this._P654;
      c2 = -this._P142;
      c3 = this._P841;
      c4 = -this._P959;
      c5 = this._P415;
      c6 = this._P755;
      c7 = -this._P989;
      c8 = this._P540;
      c9 = this._P281;
      c10 = -this._P909;
    } else if (mu === 5) {
      c1 = -this._P959;
      c2 = this._P841;
      c3 = -this._P654;
      c4 = this._P415;
      c5 = -this._P142;
      c6 = this._P281;
      c7 = -this._P540;
      c8 = this._P755;
      c9 = -this._P909;
      c10 = this._P989;
    } else if (mu === 6) {
      c1 = -this._P959;
      c2 = this._P841;
      c3 = -this._P654;
      c4 = this._P415;
      c5 = -this._P142;
      c6 = -this._P281;
      c7 = this._P540;
      c8 = -this._P755;
      c9 = this._P909;
      c10 = -this._P989;
    } else if (mu === 7) {
      c1 = -this._P654;
      c2 = -this._P142;
      c3 = this._P841;
      c4 = -this._P959;
      c5 = this._P415;
      c6 = -this._P755;
      c7 = this._P989;
      c8 = -this._P540;
      c9 = -this._P281;
      c10 = this._P909;
    } else if (mu === 8) {
      c1 = -this._P142;
      c2 = -this._P959;
      c3 = this._P415;
      c4 = this._P841;
      c5 = -this._P654;
      c6 = -this._P989;
      c7 = this._P281;
      c8 = this._P909;
      c9 = -this._P540;
      c10 = -this._P755;
    } else if (mu === 9) {
      c1 = this._P415;
      c2 = -this._P654;
      c3 = -this._P959;
      c4 = -this._P142;
      c5 = this._P841;
      c6 = -this._P909;
      c7 = -this._P755;
      c8 = this._P281;
      c9 = this._P989;
      c10 = this._P540;
    } else {
      c1 = this._P841;
      c2 = this._P415;
      c3 = -this._P142;
      c4 = -this._P654;
      c5 = -this._P959;
      c6 = -this._P540;
      c7 = -this._P909;
      c8 = -this._P989;
      c9 = -this._P755;
      c10 = -this._P281;
    }
    for (let i = 0; i < m; i++) {
      const zj0r = z[j0];
      const zj0i = z[j0 + 1];
      const zj1r = z[j1];
      const zj1i = z[j1 + 1];
      const zj2r = z[j2];
      const zj2i = z[j2 + 1];
      const zj3r = z[j3];
      const zj3i = z[j3 + 1];
      const zj4r = z[j4];
      const zj4i = z[j4 + 1];
      const zj5r = z[j5];
      const zj5i = z[j5 + 1];
      const zj6r = z[j6];
      const zj6i = z[j6 + 1];
      const zj7r = z[j7];
      const zj7i = z[j7 + 1];
      const zj8r = z[j8];
      const zj8i = z[j8 + 1];
      const zj9r = z[j9];
      const zj9i = z[j9 + 1];
      const zj10r = z[j10];
      const zj10i = z[j10 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj1r[i1] + zj10r[i1];
        const t1i = zj1i[i1] + zj10i[i1];
        const t2r = zj2r[i1] + zj9r[i1];
        const t2i = zj2i[i1] + zj9i[i1];
        const t3r = zj3r[i1] + zj8r[i1];
        const t3i = zj3i[i1] + zj8i[i1];
        const t4r = zj4r[i1] + zj7r[i1];
        const t4i = zj4i[i1] + zj7i[i1];
        const t5r = zj5r[i1] + zj6r[i1];
        const t5i = zj5i[i1] + zj6i[i1];
        const t6r = zj1r[i1] - zj10r[i1];
        const t6i = zj1i[i1] - zj10i[i1];
        const t7r = zj2r[i1] - zj9r[i1];
        const t7i = zj2i[i1] - zj9i[i1];
        const t8r = zj3r[i1] - zj8r[i1];
        const t8i = zj3i[i1] - zj8i[i1];
        const t9r = zj4r[i1] - zj7r[i1];
        const t9i = zj4i[i1] - zj7i[i1];
        const t10r = zj5r[i1] - zj6r[i1];
        const t10i = zj5i[i1] - zj6i[i1];
        const t11r = zj0r[i1] - 0.5 * t5r;
        const t11i = zj0i[i1] - 0.5 * t5i;
        const t12r = t1r - t5r;
        const t12i = t1i - t5i;
        const t13r = t2r - t5r;
        const t13i = t2i - t5i;
        const t14r = t3r - t5r;
        const t14i = t3i - t5i;
        const t15r = t4r - t5r;
        const t15i = t4i - t5i;
        const y1r = t11r + c1 * t12r + c2 * t13r + c3 * t14r + c4 * t15r;
        const y1i = t11i + c1 * t12i + c2 * t13i + c3 * t14i + c4 * t15i;
        const y2r = t11r + c2 * t12r + c4 * t13r + c5 * t14r + c3 * t15r;
        const y2i = t11i + c2 * t12i + c4 * t13i + c5 * t14i + c3 * t15i;
        const y3r = t11r + c3 * t12r + c5 * t13r + c2 * t14r + c1 * t15r;
        const y3i = t11i + c3 * t12i + c5 * t13i + c2 * t14i + c1 * t15i;
        const y4r = t11r + c4 * t12r + c3 * t13r + c1 * t14r + c5 * t15r;
        const y4i = t11i + c4 * t12i + c3 * t13i + c1 * t14i + c5 * t15i;
        const y5r = t11r + c5 * t12r + c1 * t13r + c4 * t14r + c2 * t15r;
        const y5i = t11i + c5 * t12i + c1 * t13i + c4 * t14i + c2 * t15i;
        const y6r = c10 * t6r - c6 * t7r + c9 * t8r - c7 * t9r + c8 * t10r;
        const y6i = c10 * t6i - c6 * t7i + c9 * t8i - c7 * t9i + c8 * t10i;
        const y7r = c9 * t6r - c8 * t7r + c6 * t8r + c10 * t9r - c7 * t10r;
        const y7i = c9 * t6i - c8 * t7i + c6 * t8i + c10 * t9i - c7 * t10i;
        const y8r = c8 * t6r - c10 * t7r - c7 * t8r + c6 * t9r + c9 * t10r;
        const y8i = c8 * t6i - c10 * t7i - c7 * t8i + c6 * t9i + c9 * t10i;
        const y9r = c7 * t6r + c9 * t7r - c10 * t8r - c8 * t9r - c6 * t10r;
        const y9i = c7 * t6i + c9 * t7i - c10 * t8i - c8 * t9i - c6 * t10i;
        const y10r = c6 * t6r + c7 * t7r + c8 * t8r + c9 * t9r + c10 * t10r;
        const y10i = c6 * t6i + c7 * t7i + c8 * t8i + c9 * t9i + c10 * t10i;
        zj0r[i1] = zj0r[i1] + t1r + t2r + t3r + t4r + t5r;
        zj0i[i1] = zj0i[i1] + t1i + t2i + t3i + t4i + t5i;
        zj1r[i1] = y1r - y10i;
        zj1i[i1] = y1i + y10r;
        zj2r[i1] = y2r - y9i;
        zj2i[i1] = y2i + y9r;
        zj3r[i1] = y3r - y8i;
        zj3i[i1] = y3i + y8r;
        zj4r[i1] = y4r - y7i;
        zj4i[i1] = y4i + y7r;
        zj5r[i1] = y5r - y6i;
        zj5i[i1] = y5i + y6r;
        zj6r[i1] = y5r + y6i;
        zj6i[i1] = y5i - y6r;
        zj7r[i1] = y4r + y7i;
        zj7i[i1] = y4i - y7r;
        zj8r[i1] = y3r + y8i;
        zj8i[i1] = y3i - y8r;
        zj9r[i1] = y2r + y9i;
        zj9i[i1] = y2i - y9r;
        zj10r[i1] = y1r + y10i;
        zj10i[i1] = y1i - y10r;
      }
      const jt = j10 + 2;
      j10 = j9 + 2;
      j9 = j8 + 2;
      j8 = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa13b(n1: number, z: number[][], mu: number, m: number,
                         j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number,
                         j7: number, j8: number, j9: number, j10: number, j11: number, j12: number) {
    let c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12;
    if (mu === 1) {
      c1 = this._P885;
      c2 = this._P568;
      c3 = this._P120;
      c4 = -this._P354;
      c5 = -this._P748;
      c6 = -this._P970;
      c7 = this._P464;
      c8 = this._P822;
      c9 = this._P992;
      c10 = this._P935;
      c11 = this._P663;
      c12 = this._P239;
    } else if (mu === 2) {
      c1 = this._P568;
      c2 = -this._P354;
      c3 = -this._P970;
      c4 = -this._P748;
      c5 = this._P120;
      c6 = this._P885;
      c7 = this._P822;
      c8 = this._P935;
      c9 = this._P239;
      c10 = -this._P663;
      c11 = -this._P992;
      c12 = -this._P464;
    } else if (mu === 3) {
      c1 = this._P120;
      c2 = -this._P970;
      c3 = -this._P354;
      c4 = this._P885;
      c5 = this._P568;
      c6 = -this._P748;
      c7 = this._P992;
      c8 = this._P239;
      c9 = -this._P935;
      c10 = -this._P464;
      c11 = this._P822;
      c12 = this._P663;
    } else if (mu === 4) {
      c1 = -this._P354;
      c2 = -this._P748;
      c3 = this._P885;
      c4 = this._P120;
      c5 = -this._P970;
      c6 = this._P568;
      c7 = this._P935;
      c8 = -this._P663;
      c9 = -this._P464;
      c10 = this._P992;
      c11 = -this._P239;
      c12 = -this._P822;
    } else if (mu === 5) {
      c1 = -this._P748;
      c2 = this._P120;
      c3 = this._P568;
      c4 = -this._P970;
      c5 = this._P885;
      c6 = -this._P354;
      c7 = this._P663;
      c8 = -this._P992;
      c9 = this._P822;
      c10 = -this._P239;
      c11 = -this._P464;
      c12 = this._P935;
    } else if (mu === 6) {
      c1 = -this._P970;
      c2 = this._P885;
      c3 = -this._P748;
      c4 = this._P568;
      c5 = -this._P354;
      c6 = this._P120;
      c7 = this._P239;
      c8 = -this._P464;
      c9 = this._P663;
      c10 = -this._P822;
      c11 = this._P935;
      c12 = -this._P992;
    } else if (mu === 7) {
      c1 = -this._P970;
      c2 = this._P885;
      c3 = -this._P748;
      c4 = this._P568;
      c5 = -this._P354;
      c6 = this._P120;
      c7 = -this._P239;
      c8 = this._P464;
      c9 = -this._P663;
      c10 = this._P822;
      c11 = -this._P935;
      c12 = this._P992;
    } else if (mu === 8) {
      c1 = -this._P748;
      c2 = this._P120;
      c3 = this._P568;
      c4 = -this._P970;
      c5 = this._P885;
      c6 = -this._P354;
      c7 = -this._P663;
      c8 = this._P992;
      c9 = -this._P822;
      c10 = this._P239;
      c11 = this._P464;
      c12 = -this._P935;
    } else if (mu === 9) {
      c1 = -this._P354;
      c2 = -this._P748;
      c3 = this._P885;
      c4 = this._P120;
      c5 = -this._P970;
      c6 = this._P568;
      c7 = -this._P935;
      c8 = this._P663;
      c9 = this._P464;
      c10 = -this._P992;
      c11 = this._P239;
      c12 = this._P822;
    } else if (mu === 10) {
      c1 = this._P120;
      c2 = -this._P970;
      c3 = -this._P354;
      c4 = this._P885;
      c5 = this._P568;
      c6 = -this._P748;
      c7 = -this._P992;
      c8 = -this._P239;
      c9 = this._P935;
      c10 = this._P464;
      c11 = -this._P822;
      c12 = -this._P663;
    } else if (mu === 11) {
      c1 = this._P568;
      c2 = -this._P354;
      c3 = -this._P970;
      c4 = -this._P748;
      c5 = this._P120;
      c6 = this._P885;
      c7 = -this._P822;
      c8 = -this._P935;
      c9 = -this._P239;
      c10 = this._P663;
      c11 = this._P992;
      c12 = this._P464;
    } else {
      c1 = this._P885;
      c2 = this._P568;
      c3 = this._P120;
      c4 = -this._P354;
      c5 = -this._P748;
      c6 = -this._P970;
      c7 = -this._P464;
      c8 = -this._P822;
      c9 = -this._P992;
      c10 = -this._P935;
      c11 = -this._P663;
      c12 = -this._P239;
    }
    for (let i = 0; i < m; i++) {
      const zj0r = z[j0];
      const zj0i = z[j0 + 1];
      const zj1r = z[j1];
      const zj1i = z[j1 + 1];
      const zj2r = z[j2];
      const zj2i = z[j2 + 1];
      const zj3r = z[j3];
      const zj3i = z[j3 + 1];
      const zj4r = z[j4];
      const zj4i = z[j4 + 1];
      const zj5r = z[j5];
      const zj5i = z[j5 + 1];
      const zj6r = z[j6];
      const zj6i = z[j6 + 1];
      const zj7r = z[j7];
      const zj7i = z[j7 + 1];
      const zj8r = z[j8];
      const zj8i = z[j8 + 1];
      const zj9r = z[j9];
      const zj9i = z[j9 + 1];
      const zj10r = z[j10];
      const zj10i = z[j10 + 1];
      const zj11r = z[j11];
      const zj11i = z[j11 + 1];
      const zj12r = z[j12];
      const zj12i = z[j12 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj1r[i1] + zj12r[i1];
        const t1i = zj1i[i1] + zj12i[i1];
        const t2r = zj2r[i1] + zj11r[i1];
        const t2i = zj2i[i1] + zj11i[i1];
        const t3r = zj3r[i1] + zj10r[i1];
        const t3i = zj3i[i1] + zj10i[i1];
        const t4r = zj4r[i1] + zj9r[i1];
        const t4i = zj4i[i1] + zj9i[i1];
        const t5r = zj5r[i1] + zj8r[i1];
        const t5i = zj5i[i1] + zj8i[i1];
        const t6r = zj6r[i1] + zj7r[i1];
        const t6i = zj6i[i1] + zj7i[i1];
        const t7r = zj1r[i1] - zj12r[i1];
        const t7i = zj1i[i1] - zj12i[i1];
        const t8r = zj2r[i1] - zj11r[i1];
        const t8i = zj2i[i1] - zj11i[i1];
        const t9r = zj3r[i1] - zj10r[i1];
        const t9i = zj3i[i1] - zj10i[i1];
        const t10r = zj4r[i1] - zj9r[i1];
        const t10i = zj4i[i1] - zj9i[i1];
        const t11r = zj5r[i1] - zj8r[i1];
        const t11i = zj5i[i1] - zj8i[i1];
        const t12r = zj6r[i1] - zj7r[i1];
        const t12i = zj6i[i1] - zj7i[i1];
        const t13r = zj0r[i1] - 0.5 * t6r;
        const t13i = zj0i[i1] - 0.5 * t6i;
        const t14r = t1r - t6r;
        const t14i = t1i - t6i;
        const t15r = t2r - t6r;
        const t15i = t2i - t6i;
        const t16r = t3r - t6r;
        const t16i = t3i - t6i;
        const t17r = t4r - t6r;
        const t17i = t4i - t6i;
        const t18r = t5r - t6r;
        const t18i = t5i - t6i;
        const y1r = t13r + c1 * t14r + c2 * t15r + c3 * t16r + c4 * t17r + c5 * t18r;
        const y1i = t13i + c1 * t14i + c2 * t15i + c3 * t16i + c4 * t17i + c5 * t18i;
        const y2r = t13r + c2 * t14r + c4 * t15r + c6 * t16r + c5 * t17r + c3 * t18r;
        const y2i = t13i + c2 * t14i + c4 * t15i + c6 * t16i + c5 * t17i + c3 * t18i;
        const y3r = t13r + c3 * t14r + c6 * t15r + c4 * t16r + c1 * t17r + c2 * t18r;
        const y3i = t13i + c3 * t14i + c6 * t15i + c4 * t16i + c1 * t17i + c2 * t18i;
        const y4r = t13r + c4 * t14r + c5 * t15r + c1 * t16r + c3 * t17r + c6 * t18r;
        const y4i = t13i + c4 * t14i + c5 * t15i + c1 * t16i + c3 * t17i + c6 * t18i;
        const y5r = t13r + c5 * t14r + c3 * t15r + c2 * t16r + c6 * t17r + c1 * t18r;
        const y5i = t13i + c5 * t14i + c3 * t15i + c2 * t16i + c6 * t17i + c1 * t18i;
        const y6r = t13r + c6 * t14r + c1 * t15r + c5 * t16r + c2 * t17r + c4 * t18r;
        const y6i = t13i + c6 * t14i + c1 * t15i + c5 * t16i + c2 * t17i + c4 * t18i;
        const y7r = c12 * t7r - c7 * t8r + c11 * t9r - c8 * t10r + c10 * t11r - c9 * t12r;
        const y7i = c12 * t7i - c7 * t8i + c11 * t9i - c8 * t10i + c10 * t11i - c9 * t12i;
        const y8r = c11 * t7r - c9 * t8r + c8 * t9r - c12 * t10r - c7 * t11r + c10 * t12r;
        const y8i = c11 * t7i - c9 * t8i + c8 * t9i - c12 * t10i - c7 * t11i + c10 * t12i;
        const y9r = c10 * t7r - c11 * t8r - c7 * t9r + c9 * t10r - c12 * t11r - c8 * t12r;
        const y9i = c10 * t7i - c11 * t8i - c7 * t9i + c9 * t10i - c12 * t11i - c8 * t12i;
        const y10r = c9 * t7r + c12 * t8r - c10 * t9r - c7 * t10r + c8 * t11r + c11 * t12r;
        const y10i = c9 * t7i + c12 * t8i - c10 * t9i - c7 * t10i + c8 * t11i + c11 * t12i;
        const y11r = c8 * t7r + c10 * t8r + c12 * t9r - c11 * t10r - c9 * t11r - c7 * t12r;
        const y11i = c8 * t7i + c10 * t8i + c12 * t9i - c11 * t10i - c9 * t11i - c7 * t12i;
        const y12r = c7 * t7r + c8 * t8r + c9 * t9r + c10 * t10r + c11 * t11r + c12 * t12r;
        const y12i = c7 * t7i + c8 * t8i + c9 * t9i + c10 * t10i + c11 * t11i + c12 * t12i;
        zj0r[i1] = zj0r[i1] + t1r + t2r + t3r + t4r + t5r + t6r;
        zj0i[i1] = zj0i[i1] + t1i + t2i + t3i + t4i + t5i + t6i;
        zj1r[i1] = y1r - y12i;
        zj1i[i1] = y1i + y12r;
        zj2r[i1] = y2r - y11i;
        zj2i[i1] = y2i + y11r;
        zj3r[i1] = y3r - y10i;
        zj3i[i1] = y3i + y10r;
        zj4r[i1] = y4r - y9i;
        zj4i[i1] = y4i + y9r;
        zj5r[i1] = y5r - y8i;
        zj5i[i1] = y5i + y8r;
        zj6r[i1] = y6r - y7i;
        zj6i[i1] = y6i + y7r;
        zj7r[i1] = y6r + y7i;
        zj7i[i1] = y6i - y7r;
        zj8r[i1] = y5r + y8i;
        zj8i[i1] = y5i - y8r;
        zj9r[i1] = y4r + y9i;
        zj9i[i1] = y4i - y9r;
        zj10r[i1] = y3r + y10i;
        zj10i[i1] = y3i - y10r;
        zj11r[i1] = y2r + y11i;
        zj11i[i1] = y2i - y11r;
        zj12r[i1] = y1r + y12i;
        zj12i[i1] = y1i - y12r;
      }
      const jt = j12 + 2;
      j12 = j11 + 2;
      j11 = j10 + 2;
      j10 = j9 + 2;
      j9 = j8 + 2;
      j8 = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }

  private static _pfa16b(n1: number, z: number[][], mu: number, m: number,
                         j0: number, j1: number, j2: number, j3: number, j4: number, j5: number, j6: number, j7: number, j8: number,
                         j9: number, j10: number, j11: number, j12: number, j13: number, j14: number, j15: number) {
    let c1, c2, c3, c4, c5, c6, c7;
    if (mu === 1) {
      c1 = this._PONE;
      c2 = this._P923;
      c3 = this._P382;
      c4 = this._P707;
    } else if (mu === 3) {
      c1 = -this._PONE;
      c2 = this._P382;
      c3 = this._P923;
      c4 = -this._P707;
    } else if (mu === 5) {
      c1 = this._PONE;
      c2 = -this._P382;
      c3 = this._P923;
      c4 = -this._P707;
    } else if (mu === 7) {
      c1 = -this._PONE;
      c2 = -this._P923;
      c3 = this._P382;
      c4 = this._P707;
    } else if (mu === 9) {
      c1 = this._PONE;
      c2 = -this._P923;
      c3 = -this._P382;
      c4 = this._P707;
    } else if (mu === 11) {
      c1 = -this._PONE;
      c2 = -this._P382;
      c3 = -this._P923;
      c4 = -this._P707;
    } else if (mu === 13) {
      c1 = this._PONE;
      c2 = this._P382;
      c3 = -this._P923;
      c4 = -this._P707;
    } else {
      c1 = -this._PONE;
      c2 = this._P923;
      c3 = -this._P382;
      c4 = this._P707;
    }
    c5 = c1 * c4;
    c6 = c1 * c3;
    c7 = c1 * c2;
    for (let i = 0; i < m; i++) {
      const zj0r: number[] = z[j0];
      const zj0i: number[] = z[j0 + 1];
      const zj1r: number[] = z[j1];
      const zj1i: number[] = z[j1 + 1];
      const zj2r: number[] = z[j2];
      const zj2i: number[] = z[j2 + 1];
      const zj3r: number[] = z[j3];
      const zj3i: number[] = z[j3 + 1];
      const zj4r: number[] = z[j4];
      const zj4i: number[] = z[j4 + 1];
      const zj5r: number[] = z[j5];
      const zj5i: number[] = z[j5 + 1];
      const zj6r: number[] = z[j6];
      const zj6i: number[] = z[j6 + 1];
      const zj7r: number[] = z[j7];
      const zj7i: number[] = z[j7 + 1];
      const zj8r: number[] = z[j8];
      const zj8i: number[] = z[j8 + 1];
      const zj9r: number[] = z[j9];
      const zj9i: number[] = z[j9 + 1];
      const zj10r: number[] = z[j10];
      const zj10i: number[] = z[j10 + 1];
      const zj11r: number[] = z[j11];
      const zj11i: number[] = z[j11 + 1];
      const zj12r: number[] = z[j12];
      const zj12i: number[] = z[j12 + 1];
      const zj13r: number[] = z[j13];
      const zj13i: number[] = z[j13 + 1];
      const zj14r: number[] = z[j14];
      const zj14i: number[] = z[j14 + 1];
      const zj15r: number[] = z[j15];
      const zj15i: number[] = z[j15 + 1];
      for (let i1 = 0; i1 < n1; i1++) {
        const t1r = zj0r[i1] + zj8r[i1];
        const t1i = zj0i[i1] + zj8i[i1];
        const t2r = zj4r[i1] + zj12r[i1];
        const t2i = zj4i[i1] + zj12i[i1];
        const t3r = zj0r[i1] - zj8r[i1];
        const t3i = zj0i[i1] - zj8i[i1];
        const t4r = c1 * ( zj4r[i1] - zj12r[i1] );
        const t4i = c1 * ( zj4i[i1] - zj12i[i1] );
        const t5r = t1r + t2r;
        const t5i = t1i + t2i;
        const t6r = t1r - t2r;
        const t6i = t1i - t2i;
        const t7r = zj1r[i1] + zj9r[i1];
        const t7i = zj1i[i1] + zj9i[i1];
        const t8r = zj5r[i1] + zj13r[i1];
        const t8i = zj5i[i1] + zj13i[i1];
        const t9r = zj1r[i1] - zj9r[i1];
        const t9i = zj1i[i1] - zj9i[i1];
        const t10r = zj5r[i1] - zj13r[i1];
        const t10i = zj5i[i1] - zj13i[i1];
        const t11r = t7r + t8r;
        const t11i = t7i + t8i;
        const t12r = t7r - t8r;
        const t12i = t7i - t8i;
        const t13r = zj2r[i1] + zj10r[i1];
        const t13i = zj2i[i1] + zj10i[i1];
        const t14r = zj6r[i1] + zj14r[i1];
        const t14i = zj6i[i1] + zj14i[i1];
        const t15r = zj2r[i1] - zj10r[i1];
        const t15i = zj2i[i1] - zj10i[i1];
        const t16r = zj6r[i1] - zj14r[i1];
        const t16i = zj6i[i1] - zj14i[i1];
        const t17r = t13r + t14r;
        const t17i = t13i + t14i;
        const t18r = c4 * ( t15r - t16r );
        const t18i = c4 * ( t15i - t16i );
        const t19r = c5 * ( t15r + t16r );
        const t19i = c5 * ( t15i + t16i );
        const t20r = c1 * ( t13r - t14r );
        const t20i = c1 * ( t13i - t14i );
        const t21r = zj3r[i1] + zj11r[i1];
        const t21i = zj3i[i1] + zj11i[i1];
        const t22r = zj7r[i1] + zj15r[i1];
        const t22i = zj7i[i1] + zj15i[i1];
        const t23r = zj3r[i1] - zj11r[i1];
        const t23i = zj3i[i1] - zj11i[i1];
        const t24r = zj7r[i1] - zj15r[i1];
        const t24i = zj7i[i1] - zj15i[i1];
        const t25r = t21r + t22r;
        const t25i = t21i + t22i;
        const t26r = t21r - t22r;
        const t26i = t21i - t22i;
        const t27r = t9r + t24r;
        const t27i = t9i + t24i;
        const t28r = t10r + t23r;
        const t28i = t10i + t23i;
        const t29r = t9r - t24r;
        const t29i = t9i - t24i;
        const t30r = t10r - t23r;
        const t30i = t10i - t23i;
        const t31r = t5r + t17r;
        const t31i = t5i + t17i;
        const t32r = t11r + t25r;
        const t32i = t11i + t25i;
        const t33r = t3r + t18r;
        const t33i = t3i + t18i;
        const t34r = c2 * t29r - c6 * t30r;
        const t34i = c2 * t29i - c6 * t30i;
        const t35r = t3r - t18r;
        const t35i = t3i - t18i;
        const t36r = c7 * t27r - c3 * t28r;
        const t36i = c7 * t27i - c3 * t28i;
        const t37r = t4r + t19r;
        const t37i = t4i + t19i;
        const t38r = c3 * t27r + c7 * t28r;
        const t38i = c3 * t27i + c7 * t28i;
        const t39r = t4r - t19r;
        const t39i = t4i - t19i;
        const t40r = c6 * t29r + c2 * t30r;
        const t40i = c6 * t29i + c2 * t30i;
        const t41r = c4 * ( t12r - t26r );
        const t41i = c4 * ( t12i - t26i );
        const t42r = c5 * ( t12r + t26r );
        const t42i = c5 * ( t12i + t26i );
        const y1r = t33r + t34r;
        const y1i = t33i + t34i;
        const y2r = t6r + t41r;
        const y2i = t6i + t41i;
        const y3r = t35r + t40r;
        const y3i = t35i + t40i;
        const y4r = t5r - t17r;
        const y4i = t5i - t17i;
        const y5r = t35r - t40r;
        const y5i = t35i - t40i;
        const y6r = t6r - t41r;
        const y6i = t6i - t41i;
        const y7r = t33r - t34r;
        const y7i = t33i - t34i;
        const y9r = t38r - t37r;
        const y9i = t38i - t37i;
        const y10r = t42r - t20r;
        const y10i = t42i - t20i;
        const y11r = t36r + t39r;
        const y11i = t36i + t39i;
        const y12r = c1 * ( t11r - t25r );
        const y12i = c1 * ( t11i - t25i );
        const y13r = t36r - t39r;
        const y13i = t36i - t39i;
        const y14r = t42r + t20r;
        const y14i = t42i + t20i;
        const y15r = t38r + t37r;
        const y15i = t38i + t37i;
        zj0r[i1] = t31r + t32r;
        zj0i[i1] = t31i + t32i;
        zj1r[i1] = y1r - y15i;
        zj1i[i1] = y1i + y15r;
        zj2r[i1] = y2r - y14i;
        zj2i[i1] = y2i + y14r;
        zj3r[i1] = y3r - y13i;
        zj3i[i1] = y3i + y13r;
        zj4r[i1] = y4r - y12i;
        zj4i[i1] = y4i + y12r;
        zj5r[i1] = y5r - y11i;
        zj5i[i1] = y5i + y11r;
        zj6r[i1] = y6r - y10i;
        zj6i[i1] = y6i + y10r;
        zj7r[i1] = y7r - y9i;
        zj7i[i1] = y7i + y9r;
        zj8r[i1] = t31r - t32r;
        zj8i[i1] = t31i - t32i;
        zj9r[i1] = y7r + y9i;
        zj9i[i1] = y7i - y9r;
        zj10r[i1] = y6r + y10i;
        zj10i[i1] = y6i - y10r;
        zj11r[i1] = y5r + y11i;
        zj11i[i1] = y5i - y11r;
        zj12r[i1] = y4r + y12i;
        zj12i[i1] = y4i - y12r;
        zj13r[i1] = y3r + y13i;
        zj13i[i1] = y3i - y13r;
        zj14r[i1] = y2r + y14i;
        zj14i[i1] = y2i - y14r;
        zj15r[i1] = y1r + y15i;
        zj15i[i1] = y1i - y15r;
      }
      const jt = j15 + 2;
      j15 = j14 + 2;
      j14 = j13 + 2;
      j13 = j12 + 2;
      j12 = j11 + 2;
      j11 = j10 + 2;
      j10 = j9 + 2;
      j9 = j8 + 2;
      j8 = j7 + 2;
      j7 = j6 + 2;
      j6 = j5 + 2;
      j5 = j4 + 2;
      j4 = j3 + 2;
      j3 = j2 + 2;
      j2 = j1 + 2;
      j1 = j0 + 2;
      j0 = jt;
    }
  }
}
