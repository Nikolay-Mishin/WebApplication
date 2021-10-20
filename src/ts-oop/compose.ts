const f = (x: number): number => x + 1;
const g = (x: number): number => x * 2;

// Опрередим тип для функции, принимающей параметр типа P и возвращающая результат типа R
type F<P, R> = (value: P) => R;

const compose = <P, R, O>(f1: F<R, O>, f2: F<P, R>) => (x: P): O => f1(f2(x));

// Мы можем применить эту функцию создания новой функции:
const h = compose(g, f);

h(10); // Возвращает 22

// Теперь представьте, что в языке есть оператор (.) для записи compose:
//const h = g.f;
// Поскольку этот оператор определён на множестве функций и он правоассоциативен, допустимо использовать несколько функций:
//const m = h.g.f;
// Это эквивалентно следующему коду:
//const m = h.(g.f);

// Или следующему, если переписать с использованием функции compose:
export const m = compose(h, compose(g, f));

const pipe = <P, R>(x: P, f: F<P, R>): R => f(x);

pipe(10, f); // Возвращает 11

// Теперь представьте, что в языке есть оператор (|>) для записи pipe:
//const result = 10 |> f;
// Поскольку этот оператор левоассоциативен, допустимо использовать его с несколькими значениями:
//const result = 10 |> f |> g;
// Это эквивалентно следующему коду:
//const result = (10 |> f) |> g;

// Или следующему, если переписать с использованием функции pipe:
export const result = pipe(pipe(10, f), g); // Возвращает 22
