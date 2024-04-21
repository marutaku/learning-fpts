import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

const isEven = (a: number) => a % 2 === 0;

// fromPredicate indicate whether the value is satisfied some condition
const getEven = O.fromPredicate(isEven);

// in this example, 2 is even number, so it will return Some(2)
console.log(getEven(2)); // Some(2)

// in this example, 3 is not even number, so it will return None
console.log(getEven(3)); // none

type Discount = Readonly<{
  percentage: number;
  expired: boolean;
}>;

const isDiscountValid = (discount: Discount) => !discount.expired;

const getDiscountText = (discount: Discount): O.Option<string> =>
  pipe(
    discount,
    O.fromPredicate(isDiscountValid),
    O.map(({ percentage }) => `Discount ${percentage}%`)
  );

console.log(getDiscountText({ percentage: 10, expired: false })); // Some("Discount 10%")
console.log(getDiscountText({ percentage: 20, expired: true })); // None
