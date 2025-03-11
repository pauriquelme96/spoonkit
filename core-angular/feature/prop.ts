import { Computed } from '../signals/computed';
import { effect } from '../signals/effect';
import { State } from '../signals/state';
import { Ctrl } from './ctrl';
import { Event } from './event';

export class Prop<T> extends State<T> {}
export class RequiredProp<T> extends Prop<T> {
  private isRequired = true;
}

export function prop() {
  return function (target: Ctrl, propertyKey: string) {
    const privatePropertyKey = `__${propertyKey}`;
    let defaultValue = false;

    Object.defineProperty(target, propertyKey, {
      get: function () {
        if (!(privatePropertyKey in this)) {
          if (this['props'][propertyKey] instanceof Computed) {
            this[privatePropertyKey] = new Prop<any>(
              this['props'][propertyKey].get()
            );
            effect(() =>
              this[privatePropertyKey].set(this['props'][propertyKey].get())
            );
          } else {
            this[privatePropertyKey] = new Prop<any>(
              this['props'][propertyKey]
            );
          }
        }

        if (defaultValue && this['props'][propertyKey] !== undefined) {
          this[privatePropertyKey].set(this['props'][propertyKey]);
          defaultValue = false;
        }

        return this[privatePropertyKey];
      },
      set: function (value: Prop<any>) {
        if (!(privatePropertyKey in this)) {
          this[privatePropertyKey] = value;
          defaultValue = true;
        } else {
          throw new Error("Can't override a property");
        }
      },
      enumerable: true,
      configurable: true,
    });
  };
}

// -----------------------------------------------------------------------------
// TYPE UTILS
// -----------------------------------------------------------------------------

export type ExtractPropType<P> = P extends Prop<infer T> ? T : never;
export type ExtractRequiredPropType<P> = P extends RequiredProp<infer T>
  ? T
  : never;
export type ExtractEmitterType<P> = P extends Event<infer T> ? T : never;

export type PropModel<T> = {
  // Emisores opcionales (Emitter)
  [K in keyof T as T[K] extends Event<any> ? K : never]?: (
    value: ExtractEmitterType<T[K]>
  ) => void;
} & {
  // Propiedades obligatorias (RequiredProp)
  [K in keyof T as T[K] extends RequiredProp<any> ? K : never]-?:
    | ExtractRequiredPropType<T[K]>
    | Computed<ExtractRequiredPropType<T[K]>>;
} & {
  // Propiedades opcionales (Prop) que NO son RequiredProp
  [K in keyof T as T[K] extends Prop<any> ? K : never]?:
    | ExtractPropType<T[K]>
    | Computed<ExtractPropType<T[K]>>;
};
