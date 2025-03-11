import { Field } from 'src/app/core/domain/field';
import { Computed, watcher } from 'src/app/core/signals/computed';

type FieldModel = { [key: string]: Field<any> };

export function watchIsValid(source: FieldModel | Field<any>) {
  // IS FIELD
  if (source instanceof Field) {
    return watcher(() => source.errors.get().length === 0);
  }

  const validityModel: Computed<boolean>[] = [];
  for (const key in source) {
    validityModel.push(watchIsValid(source[key]));
  }

  // IS MODEL
  return watcher(() => {
    for (const isValid of validityModel) {
      if (!isValid.get()) return false;
    }

    return true;
  });
}
