import {
  Input as AngularInput,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { BindCtrl } from 'src/app/shared/ctrl-bridge/bind-ctrl.decorator';
import { Input } from './input.ctrl';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
@BindCtrl()
export class InputComponent {
  @AngularInput() ctrl: Input<any>;

  public props: any = {};

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    /*$effect(() => {
      for (const key in this.ctrl) {
        if (this.ctrl[key][PropSymbol]) {
          this.ctrl[key]();
        }
      }

      this.changeDetector.detectChanges();
      console.log('DETECTOR');
    });*/
  }
}
