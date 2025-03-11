import { AppInjector } from './app-injector';

export const injector = new AppInjector();

export function useProviders(...targets: any[]) {
  return targets.map((target) => ({
    provide: target,
    useFactory: () => injector.resolve(target),
  }));
}
