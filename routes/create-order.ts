import { type Response, type Request } from "express";
import { createOrderSchema, zodErrorMessage } from "../validation";
import orderRequestHandler from "../utils";

export default function createOrder(req: Request, res: Response) {
  const { data, success, error } = createOrderSchema.safeParse({
    ...req.body,
    userId: req.userId
  });

  if (!success) {
    console.log("zod error ", zodErrorMessage({ error }));
    res.status(411).json({ message: "invalid inputs" })
    return;
  }

  const res = orderRequestHandler(data);
}
