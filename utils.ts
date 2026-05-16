import type { CreateOrderProps } from "./validation";

export default function orderRequestHandler(userInput: CreateOrderProps) {
  const { side, symbol, type, userId, price, qty } = userInput;

  // BEFORE ORDER

  if (type === "LIMIT") {
    if (price === undefined || qty === undefined) {
      return {
        ok: false,
        error: "price and quantity should be defined"
      }
    }
  } else if (type === "MARKET") {
    if (price === undefined && qty === undefined) {
      return {
        ok: false,
        error: "atleast price or quantity should be defined"
      }
    }
  }
  
  // calculate total amount
  // confirm user have balance
  // calculate leverage
  // check of availabe price 
    // if not and type == "MARKET"
      // create a entry of cancelled order
      // cancel the order
    // if not and type === "LIMIT"
      // add the trade in the orderBook
      // create a entry of open order
    // if yes and type === "MARKET"
      // check if the quantity is high than user
}