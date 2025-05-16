import { z } from 'zod';

// define  a schema
const userSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
  email: z.string().email()
});

// define the type of user objects ( some valid, some invalid )
type User = z.infer<typeof userSchema>;

const users: unknown[] = [
  { name: 'Alamin', age: 31, email: 'hello@alamin.com' },
  { name: 'Alamin', age: -31, email: 'hello@alamin.com' },
  { name: 'Alamin', age: 31, email: '@alamin.com' },
  { name: 36, age: 31, email: '@alamin.com' },
];

users.forEach((data, index) => {
  const result = userSchema.safeParse(data);
  if (result.success) {
    const user: User = result.data
    console.log("Succeeded!")
  } else {
    console.error('Validation Failed', result.error.format());
  }
});
