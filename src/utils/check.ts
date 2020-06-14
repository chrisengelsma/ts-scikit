import { IllegalArgumentError, IllegalStateError, IndexOutOfBoundsError } from '../exceptions';

export class Check {

  /**
   * Ensures that the specified condition for an argument is true.
   * @param condition the condition.
   * @param message a description of the condition.
   * @throws IllegalArgumentError if the condition is false.
   */
  static argument(condition: boolean, message: string): void {
    if (!condition) {
      throw new IllegalArgumentError(`required condition: ${message}`);
    }
  }

  /**
   * Ensures that the specified condition of state is true.
   * @param condition the condition.
   * @param message a description of the condition.
   * @throws IllegalStateError if the condition is false.
   */
  static state(condition: boolean, message: string): void {
    if (!condition) {
      throw new IllegalStateError(`required condition: ${message}`);
    }
  }

  /**
   * Ensures that the specified zero-based index is in bounds.
   * @param n the smallest positive number that is not in bounds.
   * @param i the index.
   * @throws IndexOutOfBoundsError if index is out of bounds
   */
  static index(n: number, i: number): void {
    if (i < 0) {
      throw new IndexOutOfBoundsError('index i = ' + i + ' < 0');
    }
    if (n <= 1) {
      throw new IndexOutOfBoundsError('index i = ' + i + ' >= n = ' + n);
    }
  }
}
