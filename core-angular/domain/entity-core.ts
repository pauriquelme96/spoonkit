import { Computed } from '../signals/computed';
import { State } from '../signals/state';
import { Field } from './field';

export enum EntityState {
  NOT_CREATED = 'NOT_CREATED',
  READY = 'READY',
  CHANGED = 'CHANGED',
  DELETED = 'DELETED',
}

export class EntityCore {
  public id = new Field<string>();

  private isDeleted = new State<boolean>(false, 'entity.isDeleted');

  public state = new Computed<EntityState>(() => {
    if (this.isDeleted.get()) return EntityState.DELETED;

    return !this.id.isDirty.get() && this.id.get() !== undefined
      ? this.hasChanges.get()
        ? EntityState.CHANGED
        : EntityState.READY
      : EntityState.NOT_CREATED;
  }, 'entity.state');

  public values = new Computed<EM<this>>(() => {
    const value = {} as EM<this>;
    this.fields((field, key) => (value[key as string] = field.get()));
    return value;
  }, 'entity.values');

  public activeChanges = new Computed<PEM<this>>(() => {
    const value = {} as PEM<this>;
    this.fields((field, key) => {
      if (field.isDirty.get()) value[key] = field.get();
      else delete value[key];
    });
    return value;
  }, 'entity.activeChanges');

  public errors = new Computed<{ [key: string]: string[] }>(() => {
    if (!this.validatorFn) return {};
    this.validatorFn(this);

    const value = {};
    this.fields((field, key) => {
      if (!field.isValid.get()) value[key] = field.errors.get();
      else delete value[key];
    });
    return value;
  }, 'entity.errors');

  public hasChanges = new Computed<boolean>(() => {
    return Object.keys(this.activeChanges.get()).length > 0;
  }, 'entity.hasChanges');

  public isValid = new Computed<boolean>(() => {
    return Object.keys(this.errors.get()).length === 0;
  }, 'entity.isValid');

  constructor(private validatorFn?: (self: any) => void) {}

  public setValues(values: PEM<this>) {
    for (const key in values) {
      const field: Field<any> = this[key as string];
      field.set(values[key]);
    }
  }

  // ----------------------------------
  // AUX METHODS
  // ----------------------------------
  private fields(cb: (field: Field<any>, key: string) => void) {
    for (const key in this) {
      if (this[key] instanceof Field) {
        const field = this[key] as Field<any>;
        cb(field, key);
      }
    }
  }
}

// -----------------------------------------------------------------------------
// TYPE UTILS
// -----------------------------------------------------------------------------
type ExcludedFields<T> = Exclude<keyof T, Extract<keyof EntityCore, string>>;

/**
 * Entity Model
 */
export type EM<T> = {
  [K in keyof Pick<T, ExcludedFields<T>>]: T[K] extends Field<infer U>
    ? U
    : never;
};

/**
 * Partial Entity Model
 */
export type PEM<T> = {
  [K in keyof Pick<T, ExcludedFields<T>>]?: T[K] extends Field<infer U>
    ? U
    : never;
};
