import { Ctrl, CtrlReady } from '../../core/Ctrl';
import { ButtonFactory } from '../../shared/CtrlComponents/Button/ButtonFactory';
import { InputFactory } from '../../shared/CtrlComponents/Input/InputFactory';

export interface LoginProps {
  title: string;
}

export class LoginCtrl extends Ctrl<LoginProps> implements CtrlReady {
  public props: LoginProps = {
    title: 'Blog',
  };

  public emailInput = InputFactory.create<string>({
    type: 'email',
    placeholder: 'Email',
    label: 'Email',
  });

  public passwordInput = InputFactory.create<string>({
    type: 'password',
    placeholder: 'Password',
    label: 'Password',
  });

  public loginButton = ButtonFactory.create({
    label: 'Entrar',
    onClick: () => {
      this.setProps({ title: 'Blog+' });
    },
  });

  ctrlReady() {
    this.emailInput.onChange.subscribe((value) => {
      console.log('email', value);
    });
  }
}
