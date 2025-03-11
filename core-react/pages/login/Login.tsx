import './Login.css';
import { LoginCtrl } from './LoginCtrl';
import { useCtrl } from '../../hooks/useCtrl';
import { Button } from '../../shared/CtrlComponents/Button/Button';
import { Input } from '../../shared/CtrlComponents/Input/Input';

export function Login() {
  const [ctrl, props] = useCtrl(LoginCtrl, { title: 'Blog' });

  return (
    <div className="lgn-main-layout">
      <img className="lgn-logo" src="img/c2c-logo.png" alt="C2C Logo" />

      <div className="lgn-form-wrapper">
        <div className="lgn-form">
          <h2 className="title c-secondary">{props.title}</h2>
          <Input from={ctrl.emailInput} />
          <Input from={ctrl.passwordInput} />
          <Button from={ctrl.loginButton} />
        </div>
      </div>
    </div>
  );
}
