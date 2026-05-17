import { orderBookManager } from "./orderBookManager";

const orderBook = orderBookManager.getOrderBookWithStockAndSide("AXIS")

const particularSideData = Object.entries(orderBook!["asks"])
  // for chote se bada its by default
  // for bade se chota
  .sort((a, b) => Number(b) - Number(a) ? 1 : -1);

try {
  for (let i = 0; i < particularSideData.length; i++) {
    const elm = particularSideData[i]
  
    if (!elm) continue; 
    
    const price = Number(elm[0]);
    const value = elm[1];  
    
    console.log("price ", price)
    console.log("value ", value)
  }
} catch (e) {
  console.log("error in the matchig engined ", e)
}