import { Ctrl } from './ctrl';

export class Event<T> {
  private subs: Array<(value: T) => void> = [];

  constructor(callback?: (value: T) => void) {
    if (callback) this.subscribe(callback);
  }

  public emit(value: T) {
    for (const callback of this.subs) callback(value);
  }

  public subscribe(callback: (value: T) => void): () => void {
    if (!callback) return () => null;
    this.subs.push(callback);
    return () => this.subs.splice(this.subs.indexOf(callback), 1);
  }
}

export function event() {
  return function (target: Ctrl, propertyKey: string) {
    const privatePropertyKey = `__${propertyKey}`;

    Object.defineProperty(target, propertyKey, {
      get: function () {
        if (!(privatePropertyKey in this)) {
          this[privatePropertyKey] = new Event<any>(this['props'][propertyKey]);
        }

        return this[privatePropertyKey];
      },
      enumerable: true,
      configurable: true,
    });
  };
}
