export class InstanceStore<T = any> {
  private store: { [_id: string | number]: T } = {};

  public resolve(_id: string | number, buildInstance: () => T): T {
    if (_id === null || _id === undefined) {
      const instance = buildInstance();
      // TODO-PAU: Review this
      return (this.store[Math.floor(Math.random() * 99999999)] = instance);
    }

    return this.store[_id] || (this.store[_id] = buildInstance());
  }

  public set(id: string | number, instance: T) {
    if (id === null || id === undefined) {
      return instance;
    }
    return (this.store[id] = instance);
  }

  public get(_id: string | number) {
    return this.store[_id];
  }

  public purge() {
    this.store = {};
  }
}
