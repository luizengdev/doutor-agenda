import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SignOutButton from "./components/sign-out-button";

const DashboardPage = async () => {
  // Verifica se o usuário está logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    // Se não estiver logado, redireciona para a pagina de autenticação
    redirect("/authentication");
  }

  // Busca as clnicas que o usurio esta relacionado
  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  });
  if (clinics.length === 0) {
    // Se o usurio nao tiver nenhuma clnica relacionada, redireciona para a pagina de criaçao de clinica
    redirect("/clinic-form");
  }

  return (
    <div>
      <h1>Seja bem-vindo {session.user.name}</h1>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
