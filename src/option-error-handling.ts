import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

type Movie = Readonly<{
  title: string;
  releaseYear: number;
  ratingPosition: number;
  award?: string;
}>;

const movie1: Movie = {
  title: "The Kingdom of Monads",
  releaseYear: 2023,
  ratingPosition: 1,
  award: "Oscar",
};

const movie2: Movie = {
  title: "Natural Transformations",
  releaseYear: 2023,
  ratingPosition: 3,
};

const movie3: Movie = {
  title: "Fun with for loops",
  releaseYear: 2023,
  ratingPosition: 74,
};

const getMovieAwardHighlight = (movie: Movie): O.Option<string> =>
  pipe(
    movie.award,
    O.fromNullable,
    O.map((award) => `Awarded with: ${award}`)
  );

const getMovieTop10Highlight = (movie: Movie): O.Option<string> =>
  pipe(
    movie,
    O.fromPredicate(({ ratingPosition }) => ratingPosition <= 10),
    O.map(({ ratingPosition }) => `In TOP 10 ta position: ${ratingPosition}`)
  );

// O.alt execute the fallback function if the result form past function is None
// `alt` function should return the same type as the first function
// if you want to return a different type, you can use `altW` function
const getMovieHighlight = (movie: Movie): string =>
  pipe(
    movie,
    getMovieAwardHighlight,
    O.alt(() => getMovieTop10Highlight(movie)),
    O.getOrElse(() => `Released in ${movie.releaseYear}`)
  );

console.log(getMovieHighlight(movie1)); // Output: Awarded with: Oscar
console.log(getMovieHighlight(movie2)); // Output: In TOP 10 ta position: 3
console.log(getMovieHighlight(movie3)); // Output: Released in 2023
