import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import LoginForm from "./components/login-form";
import SignUpForm from "./components/sign-up-form";

export default function AuthenticationPage() {
  return (
    <div
      className={cn(
        "bg-background flex h-screen w-screen items-center justify-center",
      )}
    >
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">
            Bem-vindo(a) ao Doutor Agenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="bg-acent grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
