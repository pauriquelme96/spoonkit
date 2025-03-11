import { useCtrl } from '../../../hooks/useCtrl';
import { InputCtrl } from './InputCtrl';
import './Input.css';

export function Input({ from }: { from: InputCtrl<string | number> }) {
  const [ctrl, props] = useCtrl(from);

  return (
    <input
      className={(ctrl.props.isValid || 'invalid') + ' lgn-input'}
      value={props.value || ''}
      onChange={(e) => ctrl.setValue(e.target.value)}
      type={props.type}
      placeholder={props.placeholder}
    />
  );
}
