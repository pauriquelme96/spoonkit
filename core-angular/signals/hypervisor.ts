import { Computed } from './computed';
import { State } from './state';

export class Hypervisor {
  private static detectionStack: (State<any> | Computed<any>)[][] = [];

  static notify(signal: State<any> | Computed<any>) {
    if (this.detectionStack.length > 0) {
      const currentDetections =
        this.detectionStack[this.detectionStack.length - 1];

      if (!currentDetections.includes(signal)) {
        currentDetections.push(signal);
      }
    }
  }

  static startDependencyDetector() {
    this.detectionStack.push([]);
  }

  static stopDependencyDetection(): (State<any> | Computed<any>)[] {
    return this.detectionStack.pop() || [];
  }
}
