import * as E from "fp-ts/Either";
import base64 from "base-64";
import { pipe } from "fp-ts/lib/function";

type User = Readonly<{
  id: number;
  username: string;
}>;

type Base64DecodeError = Readonly<{
  type: "Base64DecodeError";
  error: Error;
}>;

const base64Decode = E.tryCatchK(
  base64.decode,
  (e): Base64DecodeError => ({
    type: "Base64DecodeError",
    error: E.toError(e),
  })
);
type JsonParseError = Readonly<{
  type: "JsonParseError";
  error: Error;
}>;

type InvalidUserObject = Readonly<{
  type: "InvalidUserObject";
  error: Error;
}>;

const jsonParse = E.tryCatchK(
  JSON.parse,
  (e): JsonParseError => ({
    type: "JsonParseError",
    error: E.toError(e),
  })
);

const encodeUser = (user: User): string => base64.encode(JSON.stringify(user));
const decodeUser = (encodedUser: string) =>
  pipe(
    encodedUser,
    base64Decode,
    E.flatMap(jsonParse),
    E.flatMap(decodeUserObjectFromUnknown)
  );

declare const decodeUserObjectFromUnknown: (
  u: unknown
) => E.Either<InvalidUserObject, User>;
