declare const f: (x: number) => number;
declare const g: (x: number) => number;
declare type F<P, R> = (value: P) => R;
declare const compose: <P, R, O>(f1: F<R, O>, f2: F<P, R>) => (x: P) => O;
declare const h: (x: number) => number;
declare const m: (x: number) => number;
declare const pipe: <P, R>(x: P, f: F<P, R>) => R;
declare const result: number;
