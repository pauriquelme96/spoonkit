import { Field } from 'src/app/core/domain/field';
import { effect } from 'src/app/core/signals/effect';
import { FormControl } from '../ctrl-components/form-controls/form-control.ctrl';

export function bindField(control: FormControl<any>, field: Field<any>) {
  //console.log('INIT');
  let skipControlUpdate: boolean;
  let skipFieldUpdate: boolean;

  // FIELD VALUE UPDATED
  effect(() => {
    const fieldValue = field.get();

    if (skipControlUpdate) {
      skipControlUpdate = false;
    } else {
      skipFieldUpdate = true;
      control.setValue(fieldValue);
    }
  });

  // CONTROL VALUE UPDATED
  effect(() => {
    const controlValue = control.value.get();

    if (skipFieldUpdate) {
      skipFieldUpdate = false;
    } else {
      skipControlUpdate = true;
      field.set(controlValue);
    }
  });
}
