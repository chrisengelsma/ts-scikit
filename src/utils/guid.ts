/**
 * A GUID.
 */
export class Guid {

  /// The value of this guid.
  private readonly _value: string;

  /**
   * Creates a new Guid.
   */
  static Create(): Guid {
    const value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return new Guid(value);
  }

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Gets the value of this guid.
   */
  get value(): string { return this._value; }

  /**
   * Determines is this guid equals a provided guid.
   * @param guid the guid.
   * @returns true, if this guid equals the other guid; false, otherwise.
   */
  equals(guid: Guid): boolean {
    return this._value === guid.value;
  }

}

