export class IndexOutOfBoundsError extends RangeError {
  constructor(message) {
    super(message);
    this.name = 'IndexOutOfBoundsError';
  }
}
