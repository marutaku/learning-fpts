import * as E from "fp-ts/Either";
import { makeMatch } from "ts-adt/MakeADT";
import { pipe } from "fp-ts/lib/function";

type Account = Readonly<{
  balance: number;
  frozen: boolean;
}>;

type Cart = Readonly<{
  items: Item[];
  total: number;
}>;

type Item = Readonly<{
  id: string;
  price: number;
}>;

type AccountFrozen = Readonly<{
  type: "AccountFrozen";
  message: string;
}>;

type NotEnoughBalance = Readonly<{
  type: "NotEnoughBalance";
  message: string;
}>;

const pay =
  (amount: number) =>
  (account: Account): E.Either<AccountFrozen | NotEnoughBalance, Account> =>
    account.frozen
      ? E.left({
          type: "AccountFrozen",
          message: "Cannot pay with a frozen account",
        })
      : account.balance < amount
        ? E.left({
            type: "NotEnoughBalance",
            message: `Cannot pay ${amount} with a balance of ${account.balance}`,
          })
        : E.right({
            ...account,
            balance: account.balance - amount,
          });

const matchError = makeMatch("type");

const checkout = (cart: Cart) => (account: Account) =>
  pipe(
    account,
    pay(cart.total),
    E.match(
      matchError({
        AccountFrozen: (error) => "Account frozen",
        NotEnoughBalance: (error) => "Not enough balance",
      }),
      (account) => "Payment successful"
    )
  );

const account1: Account = {
  balance: 70,
  frozen: false,
};
const account2: Account = {
  balance: 30,
  frozen: false,
};
const account3: Account = {
  balance: 100,
  frozen: true,
};

console.log(checkout({ items: [], total: 50 })(account1)); // Output: { balance: 20, frozen: false }
console.log(checkout({ items: [], total: 50 })(account2)); // Output: { type: 'NotEnoughBalance', message: 'Cannot pay 50 with a balance of 30' }
console.log(checkout({ items: [], total: 50 })(account3)); // Output: { type: 'AccountFrozen', message: 'Cannot pay with a frozen account' }
