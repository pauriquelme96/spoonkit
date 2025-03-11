import { Type } from "@angular/core";
import { Class } from "./utility.types";

// DECORATORS
export const Domain = (): ((target: Type<any>) => void) => {
  return (target: Type<any>) => {
    Reflect.defineMetadata("instanceType", "Domain", target);
  };
};

export const Feature = (): ((target: Type<any>) => void) => {
  return (target: Type<any>) => {
    Reflect.defineMetadata("instanceType", "Domain", target);
  };
};

export const Service = (): ((target: Type<any>) => void) => {
  return (target: Type<any>) => {
    Reflect.defineMetadata("instanceType", "Service", target);
  };
};

@Service()
export class AppInjector extends Map {
  constructor() {
    super();
    this.set(AppInjector, this);
  }

  public resolve<T>(target: Class<T>, params: any = {}): T {
    const decorator = Reflect.getMetadata("instanceType", target);
    const tokens = Reflect.getMetadata("design:paramtypes", target) || []; // TODO: use Reflect.getMetadata('design:type', target) instead

    const injections = tokens.map(token => {
      if (token.name === "Object") return params;
      else return this.resolve<any>(token);
    });

    // TODO: When {target} comes from @Domain always create new instances
    if (decorator === "Service") {
      const classInstance = this.get(target);
      if (classInstance) {
        return classInstance as T;
      }
    }

    const newClassInstance = new (target as any)(...injections);
    this.set(target, newClassInstance);

    return newClassInstance as T;
  }

  public release(): void {
    for (const value of this.values()) {
      if (typeof value["release"] === "function") {
        value["release"]();
      }
    }

    this.clear();
  }
}
