import './Button.css';
import { ButtonCtrl } from './ButtonCtrl';
import { useCtrl } from '../../../hooks/useCtrl';

export function Button({ from }: { from: ButtonCtrl }) {
  const [ctrl, props] = useCtrl(from);

  return (
    <button onClick={() => ctrl.onClick.next()} disabled={props.disabled} className="btn btn-sm btn-accent">
      {props.label}
    </button>
  );
}
