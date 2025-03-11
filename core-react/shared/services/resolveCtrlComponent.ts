import { Ctrl } from '../../core/Ctrl';
import { Button } from '../CtrlComponents/Button/Button';
import { ButtonCtrl } from '../CtrlComponents/Button/ButtonCtrl';

const list = new Map()
  // MAP CTRL -> COMPONENT
  .set(ButtonCtrl, Button);

export function resolveCtrlComponent(ctrl: Ctrl<unknown>) {
  return list.get(ctrl.constructor);
}
