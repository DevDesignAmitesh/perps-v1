import type { Orderbooks, OrderInAsksAndBids, OrderSide } from "./types";

class OrderbookManager {
  private static instance: OrderbookManager
  private orderBooks: Orderbooks

  constructor() {
    this.orderBooks = {
      AXIS: { bids: {}, asks: {
        900: {
          availableQty: 20,
          orders: []
        },
        800: {
          availableQty: 20,
          orders: []
        },
      }, lastTradedPrice: 90, indexPrice: 90.01 },
    }
  }
  
  static getInstance = (): OrderbookManager => {
    if (!OrderbookManager.instance) OrderbookManager.instance = new OrderbookManager()
    return OrderbookManager.instance;
  }

  getOrderBookWithStockAndSide = (stock: "AXIS") => {
    return this.orderBooks[stock]
  } 

  addingOrderInOrderBook = (side: OrderSide, price: number, order: OrderInAsksAndBids) => {
    const finalorder = this.orderBooks["AXIS"][side][price]?.orders ?? [];
    finalorder.push(order);
  }

  addBidsAndAsksInOrderbook(side: OrderSide, price: number, qty: number, order: OrderInAsksAndBids) {
    this.addingOrderInOrderBook(side, price, order)

    const finalQty = (this.orderBooks["AXIS"][side][price]?.availableQty ?? 0) + qty
    
    this.orderBooks["AXIS"][side][price] = {
      ...this.orderBooks["AXIS"][side][price],
      availableQty: finalQty,
      orders: this.orderBooks["AXIS"][side][price]!.orders,
    }
  }

  deletePriceFromOderbook(side: OrderSide, price: number,) {
    delete this.orderBooks["AXIS"][side][price]
  }
}

export const orderBookManager = OrderbookManager.getInstance();