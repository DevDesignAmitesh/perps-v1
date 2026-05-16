import z, { type ZodError } from "zod";

export const createOrderSchema = z.object({
  side: z.enum(["LONG", "SHORT"]),
  type: z.enum(["LIMIT", "MARKET"]),
  symbol: z.string(),
  price: z.number().optional(),
  qty: z.number().optional(),
  userId: z.string(),
});

export type CreateOrderProps = z.infer<typeof createOrderSchema>

export const zodErrorMessage = ({ error }: { error: ZodError }) => {
  return error.issues.map((er) => `${er.path.join(".")}: ${er.message}`)
}