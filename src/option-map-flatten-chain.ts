import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

const head = <A>(as: ReadonlyArray<A>): O.Option<A> =>
  as.length === 0 ? O.none : O.some(as[0]);

const toUpperCase = (s: string): string => s.toUpperCase();
const addPrefix = (s: string): string => `Best - ${s}`;

const getBestMovie = (titles: ReadonlyArray<string>): O.Option<string> =>
  pipe(titles, head, O.map(toUpperCase), O.map(addPrefix));

console.log(getBestMovie(["movie1", "movie2"]));

const inverse = (x: number): O.Option<number> =>
  x === 0 ? O.none : O.some(1 / x);

const inverseHead = (ns: ReadonlyArray<number>) =>
  pipe(
    ns,
    head,
    // .chain is same as .flatMap or .map + .flatten
    O.chain(inverse)
  );

console.log(inverseHead([2, 0]));
