import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export const validateAuthentication = async ({
  mustHavePlan = false,
  mustHaveClinic = false,
}: {
  mustHavePlan?: boolean;
  mustHaveClinic?: boolean;
} = {}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (mustHavePlan && !session.user.plan) {
    // redirect("/new-subscription");
  }
  if (mustHaveClinic && !session.user.clinic) {
    redirect("/clinic-form");
  }
  return session;
};

const WithAuthentication = async ({
  children,
  mustHavePlan = false,
  mustHaveClinic = false,
}: {
  children: React.ReactNode;
  mustHavePlan?: boolean;
  mustHaveClinic?: boolean;
}) => {
  await validateAuthentication({ mustHavePlan, mustHaveClinic });
  return children;
};

export default WithAuthentication;
