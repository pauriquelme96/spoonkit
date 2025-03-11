import { Field } from 'src/app/core/domain/field';
import { Computed } from 'src/app/core/signals/computed';

type FieldModel<T extends { [key: string]: Field<any> }> = {
  [K in keyof T]: T[K] extends Field<infer U> ? U : never;
};

type ErrorModel<T extends { [key: string]: Field<any> }> = {
  [K in keyof T]?: string[];
};

export class DataModel<T extends { [key: string]: Field<any> }> {
  public values = new Computed(() => {
    const values = {} as FieldModel<T>;
    for (const key in this.model) {
      values[key] = this.model[key].get();
    }
    return values;
  });

  public hasChanges = new Computed(() => {
    return Object.keys(this.activeChanges.get()).length > 0;
  });

  public isValid = new Computed(() => {
    return Object.keys(this.errors.get()).length === 0;
  });

  public errors = new Computed(() => {
    const errors: ErrorModel<T> = {};
    for (const key in this.model) {
      if (this.model[key].isValid.get()) continue;
      errors[key] = this.model[key].errors.get();
    }
    return errors;
  });

  public activeChanges = new Computed(() => {
    const values: Partial<FieldModel<T>> = {};
    for (const key in this.model) {
      if (!this.model[key].isDirty.get()) continue;
      values[key] = this.model[key].get();
    }
    return values;
  });

  constructor(public model: T) {}
}
