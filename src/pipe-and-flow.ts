import { pipe, flow } from "fp-ts/function";

const trim = (s: string) => s.trim();

const size = (s: string) => s.length;

const isAtLeast3 = (n: number) => n >= 3;
console.log(pipe("hello", trim, size, isAtLeast3));

const customPipe = <A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C =>
  g(f(a));

console.log(customPipe("hello", trim, size));

const isLogEnough = flow(size, isAtLeast3);

console.log(isLogEnough("hello"));

// flowを使うことで関数を合成することができる
// same as (s: string) => pipe(s, trim, size, isAtLeast3)
const isValid = flow(trim, size, isAtLeast3);
console.log(isValid("hi "));

// flowの最初の関数は引数を複数受け取ることができる
const concat = (s1: string, s2: string) => s1 + s2;
const isValid3 = flow(concat, trim, size, isAtLeast3);
console.log(isValid3("hi", "hello"));
