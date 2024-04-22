import * as E from "fp-ts/Either";
import * as J from "fp-ts/Json";
import { pipe } from "fp-ts/lib/function";

type Response = Readonly<{
  body: string;
  contentLength: number;
}>;

type JsonStringifyError = Readonly<{
  type: "JsonStringifyError";
  error: Error;
}>;

const createResponse = (
  payload: unknown
): E.Either<JsonStringifyError, Response> =>
  pipe(
    payload,
    J.stringify,
    E.bimap(
      (e) => ({
        type: "JsonStringifyError",
        error: E.toError(e),
      }),
      (body) => ({
        body,
        contentLength: body.length,
      })
    )
    // the following is equivalent to the above
    // E.map((s) => ({ body: s, contentLength: s.length })),
    // E.mapLeft((e) => ({ type: "JsonStringifyError", error: E.toError(e) }))
  );

console.log(createResponse({ name: "John" }));
const circular: any = {};
circular.circular = circular;
console.log(createResponse(circular));
