import { Field } from 'src/app/core/domain/field';
import { watcher } from 'src/app/core/signals/computed';

type FieldModel = { [key: string]: Field<any> };

export function watchHasChanges(source: FieldModel) {
  return watcher(() => {
    for (const key in source) {
      if (source[key].isDirty.get()) return true;
    }

    return false;
  });
}
