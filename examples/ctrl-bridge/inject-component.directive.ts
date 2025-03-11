import { Directive, Input, ViewContainerRef } from '@angular/core';
import { Ctrl } from '../../core/feature/ctrl';
import { CtrlComponentMapper } from './ctrl-component.mapper';

@Directive({
  selector: '[fromCtrl]',
})
export class InjectComponentDirective {
  @Input('fromCtrl') ctrl: Ctrl;

  constructor(
    private container: ViewContainerRef,
    private ctrlComponentMapper: CtrlComponentMapper
  ) {}

  ngOnInit() {
    this.container.clear();
    if (!this.ctrl) throw new Error('ctrl is required');

    const component = this.ctrlComponentMapper.resolve(this.ctrl);
    if (!component) throw new Error('component not found for ctrl');

    const componentRef: any = this.container.createComponent(component as any);
    componentRef.instance.ctrl = this.ctrl;

    this.ctrl.onStart.emit(this.ctrl);
  }

  ngOnDestroy() {
    this.ctrl.onDestroy.emit();
  }
}
