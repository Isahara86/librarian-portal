type Falsy = false | 0 | '' | null | undefined;

interface Array<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter<S extends T>(predicate: BooleanConstructor, thisArg?: any): Exclude<S, Falsy>[];
}
