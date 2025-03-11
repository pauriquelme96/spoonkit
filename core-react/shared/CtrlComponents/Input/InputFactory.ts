import { InputCtrl, InputProps } from './InputCtrl';

export class InputFactory {
  public static create<T>(props: InputProps<T>) {
    const input = new InputCtrl<T>();
    input.init(props);
    return input;
  }
}
