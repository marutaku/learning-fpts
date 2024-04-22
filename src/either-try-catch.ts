import * as E from "fp-ts/Either";

const jsonParse = (text: string): E.Either<Error, unknown> => {
  return E.tryCatch(() => JSON.parse(text), E.toError);
  // this is equivalent to the following:
  // try {
  //   const result = JSON.parse(text)
  //   return E.right(result)
  // } catch (e) {
  //   const error = e instanceof Error ? e : new Error(String(e))
  //   return E.left(error)
  // }
};

type JsonParseerrpr = Readonly<{
  type: "JsonParseError";
  error: Error;
}>;

// The arguments of returning tryCatchK is same as first argument function
const jsonParse2 = E.tryCatchK(JSON.parse, (e) => ({
  type: "JsonParseError",
  error: E.toError(e),
}));

console.log(jsonParse2('{"name": "John"}'))
console.log(jsonParse2('{invalid}'))