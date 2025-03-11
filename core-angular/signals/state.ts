import { Subject } from 'rxjs';
import { Hypervisor } from './hypervisor';

export class State<T> {
  public onChange = new Subject<T>();

  constructor(private _value?: T, private debugTag?: string) {}

  public get() {
    Hypervisor.notify(this);
    return this._value;
  }

  public getUntrack() {
    return this._value;
  }

  public set(value: T) {
    this._value = value;
    this.onChange.next(value);
  }

  public update(updater: (value: T) => T) {
    this.set(updater(this._value));
  }
}

/*
import { Hypervisor } from './hypervisor';

export function $state<T>(initialValue?: T, debugTag?: string) {
  const state = new State<T>(initialValue, debugTag);

  return (newValue?: T) => {
    if (newValue !== undefined) {
      state.set(newValue);
    }
    return state.value;
  };
}

export class State<T> {
  private _value?: T;
  private subscribers: Array<() => void> = [];

  constructor(initialValue?: T, private debugTag?: string) {
    this._value = initialValue;
  }

  public get value() {
    Hypervisor.notify(this);
    return this._value;
  }

  public set(newValue: T) {
    this._value = newValue;
    this.notifySubscribers();
  }

  public subscribe(callback: () => void): void {
    this.subscribers.push(callback);
  }

  private notifySubscribers() {
    for (const callback of this.subscribers) {
      callback();
    }
  }
}


*/
