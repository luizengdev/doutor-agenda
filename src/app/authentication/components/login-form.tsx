"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("Email ou senha inválidos");
        },
      },
    );
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Faça login para acessar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Entrar"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGoogleLogin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-4 w-4"
                >
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.6 0 6.6 1.2 9.1 3.3l6.8-6.8C34.3 2.3 29.6 0 24 0 14.3 0 6.3 5.7 2.5 14l7.9 6.1C12.6 12.3 17.9 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.5 24c0-1.5-.1-2.9-.3-4.3H24v8.2h12.6c-1.1 2.9-3 5.3-5.5 7l7.9 6.1c4.6-4.3 7.5-10.7 7.5-17z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.4 28.1c-.6-1.5-1-3.1-1-4.8s.4-3.3 1-4.8l-7.9-6.1C.5 17.8 0 20.8 0 24s.5 6.2 1.5 8.8l7.9-6.1z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 48c5.6 0 10.3-1.8 13.7-4.8l-7.9-6.1c-2.2 1.5-5 2.4-7.9 2.4-6.1 0-11.3-4.1-13.2-9.7l-7.9 6.1C6.3 42.3 14.3 48 24 48z"
                  />
                </svg>
                Entrar com Google
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
