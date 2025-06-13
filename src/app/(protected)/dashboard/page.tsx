import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  return (
    <div>
      <h1>Seja bem-vindo {session.user.name}</h1>
      <Image
        src={session?.user?.image as string}
        alt="User"
        className="rounded-full"
        width={50}
        height={50}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

export default DashboardPage;
