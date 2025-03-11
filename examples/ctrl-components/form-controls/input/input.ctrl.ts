import { Prop, prop, PropModel } from 'src/app/core/feature/prop';
import { FormControl } from '../form-control.ctrl';

export class Input<T> extends FormControl<T> {
  @prop() type = new Prop('text');

  constructor(props: PropModel<Input<T>>) {
    super(props);
  }

  public override setValue(value: T) {
    if (value === '') value = null;
    if (this.type.get() === 'number') value = Number(value) as T;
    super.setValue(value);
  }
}
