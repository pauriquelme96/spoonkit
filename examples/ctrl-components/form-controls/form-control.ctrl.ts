import { Ctrl } from 'src/app/core/feature/ctrl';
import { Event, event } from 'src/app/core/feature/event';
import { Prop, prop } from 'src/app/core/feature/prop';
import { equal } from '../../utils';

export class FormControl<T> extends Ctrl {
  @prop() value: Prop<T>;
  @prop() label: Prop<string>;
  @prop() errors: Prop<string[]>;
  @prop() isValid: Prop<boolean>;
  @prop() loading: Prop<boolean>;
  @prop() placeholder: Prop<string>;

  @event() onChange: Event<T>;

  public setValue(value: T) {
    if (value === undefined) value = null;
    if (equal(this.value.getUntrack(), value)) return;

    this.value.set(value);
    this.onChange.emit(value);
  }
}
