import { event, Event } from './event';

export class Ctrl {
  @event() onStart: Event<this>;
  @event() onDestroy: Event<void>;

  constructor(private props: unknown = {}) {
    this.onStart.subscribe(() => {
      this['ctrlStart']?.();
    });
  }
}

export interface CtrlOnStart {
  ctrlStart(): void;
}

export interface CtrlOnDestroy {
  ctrlDestroy(): void;
}
