import { Ctrl } from 'src/app/core/feature/ctrl';
import { PropModel } from 'src/app/core/feature/prop';
import { Class } from 'src/app/core/utility.types';

export function BindCtrl(): any;
export function BindCtrl<T extends Ctrl>(
  ctrl: Class<T>,
  props: PropModel<T>
): any;
export function BindCtrl<T extends Ctrl>(
  ctrl?: Class<T>,
  props?: PropModel<T>
): any {
  let ctrlInstance: T;

  if (ctrl) {
    ctrlInstance = new (ctrl as any)(props);
  }

  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    const originalNgOnInit = constructor.prototype.ngOnInit;
    const originalNgOnDestroy = constructor.prototype.ngOnDestroy;

    if (ctrlInstance) constructor.prototype.ctrl = ctrlInstance;

    constructor.prototype.ngOnInit = function () {
      this.ctrl.onStart?.emit(this.ctrl);
      originalNgOnInit?.apply(this);
    };

    constructor.prototype.ngOnDestroy = function () {
      this.ctrl.onDestroy?.emit(this.ctrl);
      originalNgOnDestroy?.apply(this);
    };
  };
}
