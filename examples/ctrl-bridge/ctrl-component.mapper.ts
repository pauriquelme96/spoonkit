import { Injectable } from '@angular/core';

import { Class } from 'src/app/core/utility.types';
import { Ctrl } from '../../core/feature/ctrl';
import { ButtonCtrlComponent } from '../ctrl-components/button/button.component';
import { Button } from '../ctrl-components/button/button.ctrl';
import { InputComponent } from '../ctrl-components/form-controls/input/input.component';
import { Input } from '../ctrl-components/form-controls/input/input.ctrl';

export interface iCtrlComponent<T extends Ctrl> {
  ctrl: T;
}

@Injectable({
  providedIn: 'root',
})
export class CtrlComponentMapper {
  private list: Map<Class<Ctrl>, Class<iCtrlComponent<any>>> = new Map()
    .set(Input, InputComponent)
    .set(Button, ButtonCtrlComponent);

  public resolve(ctrl: Ctrl): Class<iCtrlComponent<any>> {
    return this.list.get(ctrl.constructor);
  }
}
