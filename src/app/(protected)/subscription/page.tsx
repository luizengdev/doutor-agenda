import { headers } from "next/headers";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { validateAuthentication } from "@/hocs/with-authentication";

import { SubscriptionPlan } from "./_components/subscription-plan";

const SubscriptionPage = async () => {
  const session = await validateAuthentication({ mustHaveClinic: true });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura.</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <SubscriptionPlan
          className="w-[350px]"
          active={session!.user.plan === "essential"}
          userEmail={session!.user.email}
        />
      </PageContent>
    </PageContainer>
  );
};

export default SubscriptionPage;
