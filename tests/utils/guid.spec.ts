import { expect } from 'chai';
import 'mocha';
import { Guid } from '../../src/utils';

describe('GUID', () => {
  it('should return guid value', () => {
    const guid = Guid.Create();
    expect(guid.value.length).to.equal(36);
  });

  it('should determine equality', () => {
    const guid1 = Guid.Create();
    const guid2 = Guid.Create();
    const guid3 = guid1;
    const guid4 = Object.assign({}, guid1);

    expect(guid1.equals(guid2)).to.be.false;
    expect(guid2.equals(guid3)).to.be.false;
    expect(guid1.equals(guid4)).to.be.false;
  });
});
