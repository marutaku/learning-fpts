import * as O from "fp-ts/Option";
import { chain } from "fp-ts/lib/EitherT";
import { flow, identity, pipe } from "fp-ts/lib/function";

const inverse = (x: number): O.Option<number> =>
  x === 0 ? O.none : O.some(1 / x);

inverse(0); // => none
inverse(2); // => some(0.5)

const getUIMessageWithInverse = (x: number): string =>
  pipe(
    x,
    inverse,
    O.match(
      () => `cannnot get the inverse of ${x}`,
      (ix) => `The inverse of ${x} is ${ix}`
    )
  );

console.log(getUIMessageWithInverse(0));
console.log(getUIMessageWithInverse(2));

const safeInverse = (x: number): number =>
  pipe(
    x,
    inverse,
    O.getOrElse(() => 0)
  );

console.log(safeInverse(0));
console.log(safeInverse(2));

// if we want to return other type if the value is none, use O.getOrElseW
// O.getOrElseW(() => "0")
// the "W" mean "widen" the return type
// most of Option relative functions have a "W" version(maybe)

const safeInverse2 = flow(
  inverse,
  O.getOrElseW(() => "invalid")
);

console.log(safeInverse2(0));
console.log(safeInverse2(2));

// if we want to convert option type from nullable value, use O.fromNullable
const value1: number | null = 1;
const value2: number | null = null;
console.log(O.fromNullable(value1));
console.log(O.fromNullable(value2));
