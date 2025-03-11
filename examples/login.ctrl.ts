import { Feature } from 'src/app/core/app-injector';
import { Field } from 'src/app/core/domain/field';
import { Ctrl } from 'src/app/core/feature/ctrl';
import { PropModel } from 'src/app/core/feature/prop';
import { effect } from 'src/app/core/signals/effect';
import { bindField } from 'src/app/shared/actions/bind-field';
import { Button } from 'src/app/shared/ctrl-components/button/button.ctrl';
import { Input } from 'src/app/shared/ctrl-components/form-controls/input/input.ctrl';
import {
  isEmail,
  isRequired,
  isSecurePassword,
} from 'src/app/shared/validations/common-validations';
import { watchActiveChanges } from 'src/app/shared/watchers/active-changes.watcher';
import { watchIsValid } from 'src/app/shared/watchers/is-valid.watcher';
import { watchValues } from 'src/app/shared/watchers/values.watcher';

@Feature()
export class Login extends Ctrl {
  private data = {
    email: new Field<string>({
      value: null,
      validate: [isRequired(), isEmail()],
    }),
    password: new Field<string>({
      value: null,
      validate: [isRequired(), isSecurePassword()],
    }),
  };

  private values = watchValues(this.data);
  private isFormValid = watchIsValid(this.data);

  // ** WATCH (WATCHER)
  // LINK, BIND, TRACK
  // MONITOR, LISTEN, OBSERVE
  // DERIVED, EVALUATED

  //private isFormValid = linkIsValid(this.data);
  //private isFormValid = this.linkIsValid.from(this.data)
  //private isFormValid = this.watchIsValid.from(this.data)

  public emailInput = new Input<string>({
    label: 'Usuario',
    placeholder: '...',
    type: 'email',
    isValid: watchIsValid(this.data.email),
    onStart: (self) => {
      bindField(self, this.data.email);
    },
  });

  public passwordInput = new Input<string>({
    label: 'Contraseña',
    placeholder: '* * * * * *',
    type: 'password',
    isValid: watchIsValid(this.data.password),
    onStart: (self) => {
      bindField(self, this.data.password);
    },
  });

  private cleanForm() {
    this.data.email.set(null);
    this.data.password.set(null);
  }

  public loginButton = new Button({
    label: 'Login',
    onClick: () => {
      if (!this.isFormValid.get()) {
        console.log('INVALID');
        return;
      }

      // Do login logic here

      // Clean form after successful login
      this.cleanForm();
    },
  });

  constructor(props: PropModel<Login>) {
    super(props);

    const activeChanges = watchActiveChanges(this.data);

    effect(() => {
      console.log('active', activeChanges.get());
    });
  }
}
