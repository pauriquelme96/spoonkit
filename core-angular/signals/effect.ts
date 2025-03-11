import { debounceTime, merge } from 'rxjs';
import { Computed } from './computed';
import { Hypervisor } from './hypervisor';
import { State } from './state';

export const effect = (fn: () => void) => new Effect(fn);
export class Effect {
  constructor(private effectFn: () => void, private debugTag?: string) {
    this.runEffect();
  }

  private runEffect() {
    Hypervisor.startDependencyDetector();
    this.effectFn();
    const signals = Hypervisor.stopDependencyDetection();
    this.scheduleEffect(signals);
  }

  private scheduleEffect(states: (State<any> | Computed<any>)[]) {
    const sub = merge(...states.map((state) => state.onChange))
      .pipe(debounceTime(1))
      .subscribe(() => {
        sub.unsubscribe();
        this.runEffect();
      });
  }
}

/**

// Supongamos que Hypervisor, Computed y State están definidos en otros archivos
import { Hypervisor } from './hypervisor';
import { Computed } from './computed';
import { State } from './state';

export function $effect(effectFn: () => void, debugTag?: string) {
  return new Effect(effectFn, debugTag);
}

export class Effect {
  private subscriptions: Array<() => void> = [];
  private scheduled: boolean = false;

  constructor(private effectFn: () => void, private debugTag?: string) {
    this.runEffect();
  }

  private runEffect() {
    // Limpiar suscripciones anteriores
    this.unsubscribeAll();

    // Iniciar la detección de cambios
    Hypervisor.startChangeDetector();
    this.effectFn();
    const dependencies = Hypervisor.stopChangeDetector();

    // Suscribirse a los cambios en las dependencias
    for (const dep of dependencies) {
      dep.subscribe(() => this.scheduleEffect());
      this.subscriptions.push(() => dep.unsubscribe());
    }
  }

  private scheduleEffect() {
    if (!this.scheduled) {
      this.scheduled = true;
      // Utilizar setTimeout para agrupar cambios y evitar ejecuciones múltiples
      setTimeout(() => {
        this.scheduled = false;
        this.runEffect();
      }, 0);
    }
  }

  private unsubscribeAll() {
    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }
    this.subscriptions = [];
  }
}


*/
