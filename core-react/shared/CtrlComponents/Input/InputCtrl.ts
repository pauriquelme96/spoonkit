import { Subject } from 'rxjs';
import { Ctrl, CtrlReady } from '../../../core/Ctrl';

export interface InputProps<T> {
  type: string;
  value?: T;
  placeholder?: string;
  isValid?: boolean;
  label?: string;
  onChange?: (value: T) => void;
}

export class InputCtrl<T> extends Ctrl<InputProps<T>> implements CtrlReady {
  public onChange = new Subject<T>();

  constructor() {
    super();
  }

  ctrlReady() {
    this.onChange.subscribe((value) => this.props.onChange?.(value));
  }

  public setValue(value: T) {
    this.setProps({ value });
    this.onChange.next(value);
  }
}
