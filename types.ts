
export type User = {
  id: string;
  username: string;
  password: string;
  collateral: {
    availabe: number;
    locked: number;
  };
  positions: UserPosition[];
  orders: UserOrder[];
}

export type UserPosition = {
  market: OrderbookKey;
  type: string;
  qty: number;
  margin: number;
  liquidationPrice: number;
  averagePrice: number;
  pnL: number
}

export type UserOrder = {
  id: string;
  market: OrderbookKey;
  type: OrderType;
  qty: number;
  margin: number;
  side: OrderSide;
  price: number;
  status: OrderStatus;
}

export type OrderInAsksAndBids = { 
  id: string, 
  userId: string, 
  qty: number, 
  filledQty: number, 
  createdAt: Date 
}

type Bid_Ask = {
  availableQty: number,
  orders: OrderInAsksAndBids[]
}

type Orderbook = {
  bids: Record<number, Bid_Ask>,
  asks: Record<number, Bid_Ask>,
  lastTradedPrice: number,
  indexPrice: number
}

export type OrderSide = "asks" | "bids"

export type OrderStatus = "OPEN" | "FILLED" | "CANCELLED" | "PARTIAL_FILLED"

export type OrderType = "LONG" | "SHORT"

export type OrderbookKey = "AXIS"

export type Orderbooks = Record<OrderbookKey, Orderbook>
