import { ButtonCtrl, ButtonProps } from './ButtonCtrl';

export class ButtonFactory {
  public static create(props: ButtonProps) {
    const button = new ButtonCtrl();
    button.init(props);
    return button;
  }
}
