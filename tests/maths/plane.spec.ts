import { expect } from 'chai';
import 'mocha';
import { Plane, Point3, Vector3 } from '../../src/maths';

describe('Plane', () => {

  const EPS = 0.000001;

  it('should construct from planar coefficients', () => {
    const na = 0.2672612419;
    const nb = 0.5345224838;
    const nc = 0.8017837257;
    const nd = 1.0690449676;

    const plane: Plane = Plane.FromPlanarCoefficients(1, 2, 3, 4);

    expect(plane.a).to.be.closeTo(na, EPS);
    expect(plane.b).to.be.closeTo(nb, EPS);
    expect(plane.c).to.be.closeTo(nc, EPS);
    expect(plane.d).to.be.closeTo(nd, EPS);
  });

  it('should construct from a point and normal vector', () => {
    const px = 2.0, py = 5.0, pz = 10.0;
    const nx = 1.0, ny = -2.0, nz = 3.0;

    const p = new Point3(px, py, pz);
    const n = new Vector3(nx, ny, nz);

    const plane: Plane = Plane.FromPointAndNormal(p, n);

    const ea =  0.2672612419;
    const eb = -0.5345224838;
    const ec =  0.8017837257;
    const ed = -5.8797473221;

    expect(plane.a).to.be.closeTo(ea, EPS);
    expect(plane.b).to.be.closeTo(eb, EPS);
    expect(plane.c).to.be.closeTo(ec, EPS);
    expect(plane.d).to.be.closeTo(ed, EPS);
  });

});
