import { z } from "zod";

export const login = z.strictObject({
  email: z.email(),
  password: z.string().min(8).max(16),
});

export const signup = login
  .safeExtend({
    userName: z.string(),
    phone: z.e164(),
    confirmPassword: z.string().min(8).max(16),
  })
  .superRefine((data, ctx) => {
    if (data.password != data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "password and confirmPassword must match.",
      });
    }

    if (!data.userName.includes(" ")) {
      ctx.addIssue({
        code: "custom",
        path: ["userName"],
        message: "userName must contain you first and last name",
      });
    }
  });
