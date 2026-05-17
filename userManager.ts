import type { OrderType, User, UserOrder, UserPosition } from "./types";

class UserManager {
  private users: User[] = [];
  private static instance: UserManager

  static getInstance = (): UserManager => {
    if (!UserManager.instance) UserManager.instance = new UserManager();

    return UserManager.instance;
  }
  
  findUserById = (userId: string) => {
    return this.users.find((usr) => usr.id === userId);
  }
  
  addUser = (user: User) => { 
    this.users.push(user); 
  }

  removeUserAndUpdateUsers = (userId: string) => {
    this.users = this.users.filter((usr) => usr.id !== userId);
  }

  lockUsersBalance = (userId: string, lockedPrice: number) => {
    const user = this.users.find((usr) => usr.id === userId);
    if (!user) return;

    const updatedUser: User = {
      ...user,
      collateral: {
        ...user.collateral,
        locked: user.collateral.locked + lockedPrice
      }
    }

    this.removeUserAndUpdateUsers(user.id);  
    this.addUser(updatedUser);
  }

  addOrder = (userId: string, order: UserOrder) => {
    const user = this.findUserById(userId);
    if (!user) return;
    
    user.orders.push(order)
  }

  
  addingPosition = (userId: string, position: UserPosition) => {
    const user = this.findUserById(userId);
    if (!user) return;

    user.positions.push(position)
  }

  calculateAveragePrice = (userId: string, side: OrderType) => {
    const user = this.findUserById(userId);
    if (!user) return

    let totalPrice = 0;
    let totalQty = 0;

    for (let i = 0; i < user.orders.length; i++) {
      const order = user.orders[i];
      if (!order) continue;
      if (order.type !== side) continue;

      totalPrice += order.price * order.qty;
      totalQty += order.qty;
    }

    return totalPrice / totalQty
  }
}

export const userManager = UserManager.getInstance();