import { Component, Input } from '@angular/core';
import { BindCtrl } from '../../ctrl-bridge/bind-ctrl.decorator';
import { Button } from './button.ctrl';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
@BindCtrl()
export class ButtonCtrlComponent {
  @Input() ctrl: Button;
}
