import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  // The four fields carry no persistent helper text (mockup v9), so these
  // messages are the only place a rule is ever stated. Each one has to name the
  // problem and show a correct example.
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email must include an @, e.g. yichun.chen@example.com"),
  phone: z
    .string()
    .regex(/^09\d{8}$/, "Enter a 10-digit mobile number, e.g. 0912345678"),
  company: z.string().max(100).optional(),
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
