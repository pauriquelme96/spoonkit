import { Field } from 'src/app/core/domain/field';
import { watcher } from 'src/app/core/signals/computed';

type FieldModel = { [key: string]: Field<any> };

type ModelField<T extends FieldModel> = {
  [K in keyof T]: T[K] extends Field<infer U> ? U : never;
};

export function watchValues<T extends FieldModel>(model: T) {
  return watcher(() => {
    const values = {} as ModelField<T>;

    for (const key in model) {
      values[key] = model[key].get();
    }

    return values;
  });
}
