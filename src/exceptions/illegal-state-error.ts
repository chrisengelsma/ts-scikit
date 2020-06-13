export class IllegalStateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IllegalStateError';
  }
}
