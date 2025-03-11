import { equal } from 'src/app/shared/utils';
import { Computed } from '../signals/computed';
import { Effect } from '../signals/effect';
import { State } from '../signals/state';

export type FieldValidator = (field: Field<any>) => string | null;

interface FieldConf<T> {
  value?: T;
  map?: (value: T) => T;
  validate?: FieldValidator[] | (() => FieldValidator[]);
}

export class Field<T> {
  private initialized = new State<boolean>();
  private currentValue = new State<T>(null);
  private initialValue = new State<T>(null);

  private value = new Computed(() => {
    return this.initialized.get()
      ? this.currentValue.get()
      : this.initialValue.get();
  });

  public errors = new State<string[]>([]);
  public isValid = new Computed(() => this.errors.get().length === 0);
  public isDirty = new State(() => {
    return this.initialized.get()
      ? !equal(this.currentValue.get(), this.initialValue.get())
      : false;
  });

  constructor(private conf: FieldConf<T> = {}) {
    this.set(conf.value, { asInitValue: true });
    if (this.conf.validate) this.validate(this.conf.validate);
  }

  public validate(rules: (() => FieldValidator[]) | FieldValidator[]): void {
    const validationFn = Array.isArray(rules) ? () => rules : rules;

    new Effect(() => {
      if (!this.isDirty.get()) return;

      const errors = validationFn()
        .map((validation) => validation(this))
        .filter((error) => error !== null);

      this.errors.set(errors);
    });
  }

  public get() {
    return this.value.get();
  }

  public set(value: T, conf: { asInitValue?: boolean } = {}) {
    if (value === undefined) return;
    if (this.conf.map) value = this.conf.map(value);

    if (conf.asInitValue) {
      if (equal(this.initialValue.get(), value)) return;

      this.initialValue.set(value);
    } else {
      if (equal(this.currentValue.get(), value)) return;

      this.initialized.set(true);
      this.currentValue.set(value);
    }
  }

  public discard() {
    this.currentValue.set(null);
    this.initialized.set(false);
    this.errors.set([]);
  }
}
