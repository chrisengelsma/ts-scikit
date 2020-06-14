import { expect } from 'chai';
import 'mocha';
import { Check } from '../../src/utils';

describe('Check', () => {
  it('should not throw if argument check passes', () => {
    const condition: boolean = 2 + 2 === 4;
    const msg: string = 'peekaboo';
    expect(() => { Check.argument(condition, msg); }).to.not.throw(`required condition: ${ msg }`);
  });

  it('should throw if argument check fails', () => {
    const condition: boolean = 2 + 2 === 5;
    const msg: string = 'peekaboo';
    expect(() => { Check.argument(condition, msg); }).to.throw(`required condition: ${ msg }`);
  });

  it('should not throw if state check passes', () => {
    const condition: boolean = 2 + 2 === 4;
    const msg: string = 'peekaboo';
    expect(() => { Check.state(condition, msg); }).to.not.throw(`required condition: ${ msg }`);
  });

  it('should throw if state check fails', () => {
    const condition: boolean = 2 + 2 === 5;
    const msg: string = 'peekaboo';
    expect(() => { Check.state(condition, msg); }).to.throw(`required condition: ${ msg }`);
  });


  it('should not throw if argument index check passes', () => {
    const n: number = 5;
    for (let i = 0; i < n; ++i) {
      expect(() => { Check.index(n, i); }).to.not.throw(`index i = ${i} < 0'`);
      expect(() => { Check.index(n, i); }).to.not.throw(`index i = ${i} >= n = ${n}`);
    }
  });

  it('should throw if index check fails', () => {
    const n: number = 5;
    for (let i = 0; i < n; ++i) {
      expect(() => { Check.index(n, i - n); }).to.throw(`index i = ${ i - n } < 0`);
    }
  });
});
