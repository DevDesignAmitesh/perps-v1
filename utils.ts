import { orderBookManager } from "./orderBookManager";
import type { OrderType, User } from "./types";
import { userManager } from "./userManager";
import type { CreateOrderProps } from "./validation";

const LIQUIDATION_PERCENTAGE = 0.1; // 10%

export function orderRequestHandler(userInput: CreateOrderProps) {
  const { side, symbol, type, userId, price, qty } = userInput;

  if (type === "LIMIT") {
    if (price === undefined || qty === undefined) {
      return {
        ok: false,
        error: "price and quantity should be defined"
      }
    }

    // run the loop on the asks and bids according to the (side)
    const orderBook = orderBookManager.getOrderBookWithStockAndSide("AXIS")
    if (!orderBook) return {
      ok: false,
      error: "order book of AXIS stock not found"
    }
    
    const usersPriceIncludingLeverage = calculateFinalPriceWithLeverage(userId, price, qty);
    if (!usersPriceIncludingLeverage) return {
      ok: false,
      error: "unable to calculate the leverage of the user"
    }
    
    const { leverage, lockedPrice, priceAskedByUser, userActualBalance } = usersPriceIncludingLeverage;
    
    // lock the user's the balance
    userManager.lockUsersBalance(userId, lockedPrice);

    let particularSideData = [];

    if (side === "LONG") {
      particularSideData = Object.entries(orderBook["asks"])
    } else {
      particularSideData = Object.entries(orderBook["bids"])
        .sort((a, b) => Number(b) - Number(a) ? 1 : -1);
    }
    
    const margin = priceAskedByUser / leverage;
    
    for (let i = 0; i < particularSideData.length; i++) {
      const elm = particularSideData[i];
      if (!elm) continue;
      
      const keyPrice = Number(elm[0]);
      const keyValue = elm[1];

      if (side === "LONG") {
        if (keyPrice <= price) {
          // creating a filled order for the user
          userManager.addOrder(userId, {
            id: crypto.randomUUID(),
            margin,
            market: "AXIS",
            price,
            qty,
            side: "bids",
            status: "FILLED",
            type: "SHORT",
          })

          const averagePrice = userManager.calculateAveragePrice(userId, (type as OrderType));
          if (!averagePrice) return;

          const liquidationPrice = averagePrice * LIQUIDATION_PERCENTAGE;
          
          // creating a position thing for BOTH of the user
          userManager.addingPosition(userId, {
            averagePrice,
            liquidationPrice,
            margin,
            market: "AXIS",
            pnL: averagePrice,
            qty,
            type
          })

          // creating the order in the order book
          orderBookManager.addingOrderInOrderBook("asks", keyPrice, {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            filledQty: qty,
            qty,
            userId,
          })

          // deleting that price order from the order book
          orderBookManager.deletePriceFromOderbook("asks", keyPrice)
        } else {
          // add in the orderBook
          orderBookManager.addBidsAndAsksInOrderbook("asks", price, qty, {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            filledQty: 0,
            qty,
            userId
          })

          // add to the user order also
          userManager.addOrder(userId, {
            id: crypto.randomUUID(),
            margin,
            market: "AXIS",
            price,
            qty,
            side: "asks",
            status: "OPEN",
            type: "LONG"
          })
      
          return // to the user
        }
      } else if (side === "SHORT") {
        if (keyPrice >= price) {
          
        } else {
          // add in the orderBook
          orderBookManager.addBidsAndAsksInOrderbook("bids", price, qty, {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            filledQty: 0,
            qty,
            userId,
          });

          // add to the user order also
          userManager.addOrder(userId, {
            id: crypto.randomUUID(),
            margin,
            market: "AXIS",
            price,
            qty,
            side: "bids",
            status: "OPEN",
            type: "SHORT",
          })

          return // to the user
        }
      }
      
    }

    
    // find the other user with the qty thing in the order book (according to the side)
    // if the other user not found
    // adding this user to the orderBook
    // create an open order in the db

    // but if the user found
  }
}

export function calculateFinalPriceWithLeverage(userId: string, price: number, qty: number) {
  const user = userManager.findUserById(userId)
  if (!user) return;

  // 1 = 1x || 2 = 2x and so on
  let leverage = 0;
  let lockedPrice = 0;
  
  const priceAskedByUser = price * qty;
  
  const userActualBalance = user.collateral.availabe - user.collateral.locked; 

  if (userActualBalance >= priceAskedByUser) {
    lockedPrice = priceAskedByUser;
    leverage = 1
  } else {
    lockedPrice = userActualBalance
    leverage =  priceAskedByUser / userActualBalance;
  }

  return { leverage, priceAskedByUser, userActualBalance, lockedPrice }
}

