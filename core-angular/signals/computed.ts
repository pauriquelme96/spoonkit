import { merge, Subject, Subscription } from 'rxjs';
import { Hypervisor } from './hypervisor';

export const watcher = <T>(fn: () => T) => new Computed<T>(fn);
export class Computed<T> {
  private _cachedValue: T;

  private _needsRecalculation = true;
  private sub: Subscription;
  public onChange = new Subject<T>();

  public get() {
    Hypervisor.notify(this);

    if (this._needsRecalculation) {
      this.startDetection();
    }

    return this._cachedValue;
  }

  constructor(private computeFn: () => T, private debugTag?: string) {}

  private startDetection() {
    this.sub?.unsubscribe();

    Hypervisor.startDependencyDetector();
    this._cachedValue = this.computeFn();
    const signals = Hypervisor.stopDependencyDetection();

    this.sub = merge(...signals.map((signal) => signal.onChange)).subscribe(
      () => {
        this._needsRecalculation = true;
        this.sub?.unsubscribe();
        this.onChange.next(this._cachedValue);
      }
    );

    this._needsRecalculation = false;
  }
}
