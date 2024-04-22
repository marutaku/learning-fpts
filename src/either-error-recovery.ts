import * as E from "fp-ts/Either";
import { cons } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { flow, pipe } from "fp-ts/lib/function";

type Email = Readonly<{
  type: "Email";
  value: string;
}>;

type PhoneNumber = Readonly<{
  type: "PhoneNumber";
  value: string;
}>;

type MalformedEmail = Readonly<{
  type: "MalformedEmail";
  error: Error;
}>;

type NotAnEmail = Readonly<{
  type: "NotAnEmail";
  error: Error;
}>;

type NotAPhoneNumber = Readonly<{
  type: "NotAPhoneNumber";
  error: Error;
}>;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const validateEmail = flow(
  E.fromPredicate(
    (maybeEmail: string) => emailRegex.test(maybeEmail),
    (invalidEmail): MalformedEmail | NotAnEmail =>
      invalidEmail.includes("@")
        ? {
            type: "MalformedEmail",
            error: new Error("MalformedEmail"),
          }
        : {
            type: "NotAnEmail",
            error: new Error("NotAnEmail"),
          }
  ),
  E.map((email): Email => ({ type: "Email", value: email }))
);
const validatePhoneNumber = flow(
  E.fromPredicate(
    (maybePhoneNumber: string) => /^\d{10}$/.test(maybePhoneNumber),
    (): NotAPhoneNumber => ({
      type: "NotAPhoneNumber",
      error: new Error("NotAPhoneNumber"),
    })
  ),
  E.map(
    (phoneNumber): PhoneNumber => ({ type: "PhoneNumber", value: phoneNumber })
  )
);

const validateLoginName = (loginName: string) =>
  pipe(
    loginName,
    validateEmail,
    E.orElseW(
      (e): E.Either<NotAPhoneNumber | MalformedEmail, PhoneNumber> =>
        e.type === "NotAnEmail" ? validatePhoneNumber(loginName) : E.left(e)
    )
  );

console.log(validateLoginName("user@example.com"));
console.log(validateLoginName("1234567890"));
console.log(validateLoginName("foo@bar!"));
console.log(validateLoginName("1234567890a"));
