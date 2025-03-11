import { Ctrl } from 'src/app/core/feature/ctrl';
import { event, Event } from 'src/app/core/feature/event';
import { Prop, prop, PropModel } from 'src/app/core/feature/prop';
import { watcher } from 'src/app/core/signals/computed';

export class Button extends Ctrl {
  @prop() label: Prop<string>;
  @prop() disabled: Prop<boolean>;
  @prop() loading: Prop<boolean>;
  @prop() errors: Prop<string[]>;
  @prop() retryFn: Prop<Function>;

  @event() onClick: Event<void>;

  constructor(props: PropModel<Button>) {
    super(props);
  }
}

const _prop = <T>(defaultValue?: T) => new Prop<T>(defaultValue);

type pModel<T> = T extends (...args: any[]) => infer R
  ? {
      [K in keyof R]: R[K] extends Prop<infer U> ? U : never;
    }
  : never;

export interface ButtonProps {
  label?: string;
  disabled: boolean;
  loading: boolean;
  errors: string[];
  onClick?: () => void;
}

function button(props: ButtonProps) {
  return {
    label: _prop(props.label),
    disabled: _prop(props.disabled),
    loading: _prop(props.loading),
    errors: _prop(props.errors),
  };
}

const btn = button({
  disabled: false,
  loading: false,
  errors: [],
});

function loginFeature() {
  const loginButton = button({
    label: 'Login',
    disabled: false,
    loading: false,
    errors: [],
    onClick: () => {
      if (loginButton.errors.get().length !== 0) {
        setErrorAction(loginButton, 'This is an error');
      }
    },
  });

  const doLogin = () => {
    loginButton.loading.set(true);
    // DO STUFF
  };

  return {
    loginButton,
  };
}

function setErrorAction(feat: { errors: Prop<string[]> }, error: string) {
  feat.errors.set([error]);
}

setErrorAction(btn, 'this is an error');

function watchIsActive(ctrl: {
  loading: Prop<boolean>;
  disabled: Prop<boolean>;
}) {
  return watcher(() => ctrl.loading.get() && !ctrl.disabled.get());
}

const isLoading = watchIsActive(btn);

isLoading.get();
