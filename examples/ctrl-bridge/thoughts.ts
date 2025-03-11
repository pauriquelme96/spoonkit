interface CtrlBind<T> {
  get?: Observable<T>;
  set?: (value: T) => void;
  init?: T;
}

export class CtrlProp<T> {
  private setter: (value: T) => void;

  public onChange = new Subject<T>();

  public get value(): T {
    return this._value;
  }

  constructor(private _value?: T) {}

  public set(value: T) {
    if (this._value === value) return;
    this._value = value;
    this.onChange.next(value);
    this.setter?.(value);
  }

  public bind(conf: CtrlBind<T>): Subscription {
    if (conf.init) this.set(conf.init);
    if (conf.set) this.setter = conf.set;
    if (conf.get)
      return conf.get.subscribe((value) => {
        if (value !== this._value) {
          this._value = value;
          this.onChange.next(value);
        }
      });
    return new Subscription();
  }
}

export class BaseCtrl {
  private subs: Subscription[] = [];

  public setProps(props: Partial<CtrlModel<this>>) {
    for (const key in props) {
      const prop = props[key] as any;
      const self = this as any;
      if (prop instanceof Observable) {
        // OBSERVABLE
        this.subs.push(prop.subscribe((value) => self[key].set(value)));
      } else if (typeof prop === 'function') {
        // FUNCTION
        self[key].onChange.subscribe((value) => prop(value));
      } else if (
        prop instanceof Object &&
        ('get' in prop || 'set' in prop || 'init' in prop)
      ) {
        // CTRL BIND
        self[key].bind(prop);
      } else {
        // RAW VALUE
        self[key].set(prop);
      }
    }

    return null;
  }
}

export class InputCtrl<T> extends BaseCtrl {
  value = new CtrlProp<T>();
  options = new CtrlProp<{ label: string; value: T }[]>();
  onOptionsChange = this.options.onChange;
  type = new CtrlProp<'text' | 'number' | 'password'>();
  placeholder = new CtrlProp<string>();
  disabled = new CtrlProp<boolean>();
  loading = new CtrlProp<boolean>();
}

// PENDING FILTER PROPS

type CtrlModel<T> = {
  [K in keyof T as T[K] extends CtrlProp<any>
    ? K
    : never]: T[K] extends CtrlProp<infer U>
    ?
        | U
        | Observable<U>
        | Promise<U>
        | ((self: T) => U | Promise<U> | Observable<U>)
        | CtrlBind<U>
    : never;
} & {
  [K in keyof T as T[K] extends CtrlProp<any>
    ? K extends string
      ? `on${Capitalize<K>}Change`
      : never
    : never]: T[K] extends CtrlProp<infer U>
    ? (payload: { value: U; self: T }) => void
    : never;
};

/*type GetCtrlModel<T> = {
  [K in keyof T]: T[K] extends CtrlProp<infer U> ? U : never;
};*/

class Dropdown {
  value;
  options;

  constructor(private initProps: any) {
    for (const key in initProps) {
      this[key] = initProps[key];
    }
  }
}

const country = new Dropdown({
  value: signal(null),
  options: signal(['Spain', 'Portugal', 'Argentina']),
});

computed(() => {
  const selectedCountry = country.value();
  city.value.set(null);

  if (!selectedCountry) return [];

  return [
    { name: 'Madrid', country: 'Spain' },
    { name: 'Lisboa', country: 'Portugal' },
    { name: 'Buenos Aires', country: 'Argentina' },
    { name: 'Barcelona', country: 'Spain' },
    { name: 'Valencia', country: 'Spain' },
    { name: 'Sevilla', country: 'Spain' },
  ].filter((city) => city.country === selectedCountry);
});

const city = new Dropdown({
  options(self) {
    const selectedCountry = country.value();

    return fetchOptions(() => Promise.resolve(city.options()));
  },
});

function ctrlPipe<T>(fn: (self: T) => any, ...effects: any[]) {
  console.log('CtrlPipe', fn, effects);
  return (self: T) => {
    return fn(self);
  };
}

function fetchOptions(promise: () => Promise<IdNameModel[]>) {
  return ctrlPipe(async (self: InputCtrl<string>) => {
    self.setProps({ loading: true });
    let options: IdNameModel[] = [];

    try {
      options = await promise();
    } catch (err) {
      self.setProps({
        disabled: true,
        //touched: true,
        //errors: ['Error cargando opciones'],
      });
    }

    self.setProps({ loading: false });
    return options.map((item) => ({ label: item.name, value: item.id }));
  });
}

country.value.set('Spain');

console.log(country.value);
console.log(city.options());

country.value.set('Portugal');

//console.log(city.options());

/*const input = new InputCtrl<string>();
    const fetchOptions =
      (promise: () => Promise<IdNameModel[]>) => cbind(async (self: InputCtrl<string>) => {
        self.setProps({ loading: true });
        let options: IdNameModel[] = [];

        try {
          options = await promise();
        } catch (err) {
          self.setProps({
            disabled: true,
            //touched: true,
            //errors: ['Error cargando opciones'],
          });
        }

        self.setProps({ loading: false });
        return options.map((item) => ({ label: item.name, value: item.id }));
    });

    input.setProps({
      async onValueChange({ value, self }) {
        self.setProps({ disabled: true, loading: true });
        try {
          await Promise.resolve(value);
        } catch (err) {
          alert('Error guardando');
        }
        self.setProps({ disabled: false, loading: false });
      },
      options: fetchOptions(() => this.masterDataApi.getVmGalleries()),
    });*/

let cbind: any;
let x: any;

const ctrl: any = {
  value: cbind((self, vnetId) => {
    x.activity.setValues({ vnet: vnetId });
    return vnetId;
  }, x.activity.fieldChanges$('vnet')),
  disabled: cbind(() => {
    return !x.activity.hasChanges;
  }, x.activity.onChange),
  _disabled: x.activity.hasChanges$,
  options: cbind((_, vnetId) => {
    ctrl.value.set(null);
    if (!vnetId) return [];

    return _fetchOptions(() => Promise.resolve([]));
  }, x.vnetResource.value),
};

console.log(ctrl);

function _fetchOptions(promise: () => Promise<any>) {
  return cbind(async (self: InputCtrl<string>) => {
    self.setProps({ loading: true });
    let options: any[] = [];

    try {
      options = await promise();
    } catch (err) {
      self.setProps({
        disabled: true,
        //touched: true,
        //errors: ['Error cargando opciones'],
      });
    }

    self.setProps({ loading: false });
    return options.map((item) => ({ label: item.name, value: item.id }));
  });
}

type CtrlModel<T> = {
  [K in keyof T as T[K] extends CtrlProp<any>
    ? K
    : never]: T[K] extends CtrlProp<infer U>
    ? U | Observable<U> | Promise<U>
    : never;
} & {
  [K in keyof T as T[K] extends CtrlProp<any>
    ? K extends string
      ? `on${Capitalize<K>}Change`
      : never
    : never]: T[K] extends CtrlProp<infer U>
    ? (payload: { value: U; self: T }) => void
    : never;
} & {
  [K in keyof T as T[K] extends CtrlProp<any>
    ? K extends string
      ? `$${K}`
      : never
    : never]: T[K] extends CtrlProp<infer U>
    ?
        | ((self: T) => U | Promise<U>)
        | [(self: T) => U | Promise<U>, ...(Observable<any> | CtrlProp<any>)[]]
    : never;
};

export class CtrlProp<T> {
  public onChange = new Subject<T>();

  constructor(private _value?: T) {}

  public get(): T {
    return this._value;
  }

  public set(value: T) {
    if (this._value === value) return;
    this._value = value;
    this.onChange.next(value);
  }
}

export class CtrlBind {
  constructor() {}
}

export class BaseCtrl {
  private subs: Subscription[] = [];

  public initProps(props: Partial<CtrlModel<this>>) {
    for (const key in props) {
      const prop = props[key] as any;
      const self = this as any;
      if (prop instanceof Observable) {
        // OBSERVABLE
        this.subs.push(prop.subscribe((value) => self[key].set(value)));
      } else if (typeof prop === 'function') {
        // FUNCTION
        self[key].onChange.subscribe((value) => prop(value));
      } else if (
        prop instanceof Object &&
        ('get' in prop || 'set' in prop || 'init' in prop)
      ) {
        // CTRL BIND
        self[key].bind(prop);
      } else {
        // RAW VALUE
        self[key].set(prop);
      }
    }

    return null;
  }
}

class Select extends BaseCtrl {
  public loading = new CtrlProp<boolean>();
  public error = new CtrlProp<string>();
  public value = new CtrlProp<string>();
  public options = new CtrlProp<{ label: string; value: string }[]>();
}

async function fetchOptions(self: Select, from: Promise<IdNameModel[]>) {
  let options: { label: string; value: string }[] = [];

  try {
    self.loading.set(true);
    const data = await from;
    options = data.map((option) => ({ label: option.name, value: option.id }));
  } catch (err) {
    console.error(err);
    self.error.set('Error cargando opciones');
  }

  self.loading.set(false);
  return options;
}

const country = new Select();
const city = new Select();

country.initProps({
  $options: (self) => fetchOptions(self, getCountries()),
  /*$options: async (self) => {
    let options: { label: string; value: string }[] = [];

    try {
      self.loading.set(true);
      const countries = await getCountries();
      options = countries.map((option) => ({ label: option.name, value: option.id }));
    } catch (err) {
      console.error(err);
      self.error.set('Error cargando opciones');
    }

    self.loading.set(false);

    return options;
  },*/
});

const select = new Select({
  $options(self) {
    return onChange(country.value$, (countryId) => {
      city.value.set(null);
      if (!countryId) return [];

      return fetchOptions(self, getCities(countryId));
    });
  },
});

fetchOptions((countryId) => getCities(countryId), {
  de: country.value,
});

const activityChange = new Subject<string>();

city.initProps({
  value: activityChange,
  onValueChange: ({ value }) => {
    activityChange.next(value);
  },
  $options: [
    (self) => {
      const countryId = country.value.get();
      if (!countryId) {
        self.value.set(null);
        return [];
      }

      return fetchOptions(self, getCities(countryId));
    },
    country.value,
  ],
});

const ctrl: any = {
  $value(self) {
    let skip: boolean;
    self.value.onChange.subscribe((value) => {
      skip = true;
      activityChange.next(value);
    });

    return activityChange.pipe(
      // SKIP SAME VALUE
      filter(() => (skip ? (skip = false) : true))
    );
  },
  $options(self) {
    return country.value.onChange.pipe(
      map((countryId) => {
        if (!countryId) {
          self.value.set(null);
          return [];
        }

        return fetchOptions(self, getCities(countryId));
      })
    );
  },
};

console.log(ctrl);

const getCountries = (): Promise<IdNameModel[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Mexico' },
        { id: '2', name: 'Canada' },
      ]);
    }, 1000);
  });

const getCities = (
  countryId: string
): Promise<(IdNameModel & { countryId: string })[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        [
          { id: '1', countryId: '1', name: 'Mexico City' },
          { id: '2', countryId: '1', name: 'Guadalajara' },
          { id: '3', countryId: '2', name: 'Toronto' },
          { id: '4', countryId: '2', name: 'Montreal' },
        ].filter((c) => c.countryId === countryId)
      );
    }, 1000);
  });

// TWO WAY BINDING
const name = new Subject<string>();
const input = new Subject<string>();

let skip: boolean;
input.subscribe((value) => {
  if (skip) skip = false;
  else name.next(value);
});

name.pipe(tap(() => (skip = true)));
