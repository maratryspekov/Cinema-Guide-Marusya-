import api from "./api";
import axios, { type AxiosError } from "axios";
import { z } from "zod";

// user's schema for validation
export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

// user's registration schema with password and confirmation validation
export const RegisterUserSchema = z
  .object({
    name: z.string().min(1),
    surname: z.string().min(1), // Добавить surname
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

type ApiErrorData = {
  message?: string;
  error?: string;
};

const isAxiosError = (error: unknown): error is AxiosError<ApiErrorData> =>
  axios.isAxiosError(error);

export async function fetchMe(): Promise<User> {
  try {
    const response = await api.get("/profile", { withCredentials: true });
    return UserSchema.parse(response.data);
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Unauthorized");
    }
    throw error;
  }
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<void> {
  try {
    await api.post("/auth/login", data, { withCredentials: true });
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  await api.get("/auth/logout", { withCredentials: true });
}

export async function registerUser(data: RegisterUser): Promise<void> {
  try {
    const { confirmPassword, ...registerData } = data;

    console.log("Registering user:", registerData);

    const formData = new URLSearchParams();
    formData.append("email", registerData.email);
    formData.append("password", registerData.password);
    formData.append("name", registerData.name);
    formData.append("surname", registerData.surname || ""); // undefined type check

    console.log("Form data:", Object.fromEntries(formData));

    const response = await api.post("/user", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("Registration successful:", response.data);

    // API returns { success: true } when successful (не result!)
    if (response.data?.success === true || response.data?.result === true) {
      return; // successful
    }

    // If status is 200/201 but no success/result: true, still consider it successful
    if (response.status === 200 || response.status === 201) {
      return;
    }

    throw new Error("Unexpected server response");
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      if (error.response?.status === 400 || error.response?.status === 409) {
        const message =
          error.response?.data?.error || "User with this email already exists";
        throw new Error(message);
      }
    }

    throw new Error("Registration error");
  }
}
