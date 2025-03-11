import { Directive, Input, ViewContainerRef } from '@angular/core';
import { Prop } from 'src/app/core/feature/prop';

@Directive({
  selector: '[feature]',
})
export class FeatureDirective {
  @Input('feature') feature: { [key: string]: Prop<any> };

  constructor(private viewContainerRef: ViewContainerRef) {
    const instance = this.viewContainerRef['_lContainer'][0][8];

    if (instance) {
      // component
    } else if (this.viewContainerRef.element.nativeElement) {
      const element = this.viewContainerRef.element.nativeElement;
      debugger;
      element.setAttribute('value', '12314123');

      const observer = new MutationObserver((mutations) => {
        console.log('MUTATION');
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            console.log({
              type: mutation.type,
              target: mutation.target,
              attributeName: mutation.attributeName,
              oldValue: mutation.oldValue,
            });
            //console.log(mutation.target.getAttribute('value'));
          }
        });
      });

      observer.observe(element, {
        attributes: true,
      });
      // element
    }
  }
}
