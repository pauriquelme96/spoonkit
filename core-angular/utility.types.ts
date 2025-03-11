export type Class<T> = Function & { prototype: T };
export type KeysOfType<T, E> = {
  [K in keyof T]: T[K] extends E ? K : never;
}[keyof T];
//export type InferModel<T> = T extends Entity<infer V> ? V : unknown;
