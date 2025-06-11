"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// Função para criar uma clínica
export const createClinic = async (name: string) => {
  // Verifica se o usuário está logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se o usuário não estiver logado, lança um erro
  if (!session?.user) {
    throw new Error("Você precisa estar logado para criar uma clínica");
  }

  // Cria uma nova clínica no banco de dados
  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  // Associa o usuário logado à clínica recém-criada
  await db
    .insert(usersToClinicsTable)
    .values({ userId: session.user.id, clinicId: clinic.id });

  redirect("/dashboard");
};
