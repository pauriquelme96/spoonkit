import { useState, useEffect } from 'react';
import { Ctrl } from '../core/Ctrl';
import { inject } from '../core/injector';

export type Class<T> = (new (...args: unknown[]) => T) & { prototype: T };

export function useCtrl<T extends Ctrl<T['props']>>(ctrlToken: Class<T> | T, initProps?: T['props']): [T, T['props']] {
  const [ctrl] = useState(() => (ctrlToken instanceof Ctrl ? ctrlToken : (inject(ctrlToken) as T)));
  const [props, setProps] = useState(ctrl.props);

  useEffect(() => {
    ctrl.onMount.next();
    ctrl.onPropsChange.subscribe((newState) => setProps({ ...props, ...newState }));
    return () => ctrl.onUnmount.next();
  }, []);

  return [ctrl, props];
}
