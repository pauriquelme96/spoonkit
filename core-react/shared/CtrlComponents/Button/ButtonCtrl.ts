import { Subject } from 'rxjs';
import { Ctrl, CtrlReady } from '../../../core/Ctrl';

export interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export class ButtonCtrl extends Ctrl<ButtonProps> implements CtrlReady {
  public onClick = new Subject<void>();

  constructor(/* DEPENDENCIES */) {
    super();
  }

  ctrlReady() {
    this.onClick.subscribe(() => this.props.onClick?.());
  }
}
