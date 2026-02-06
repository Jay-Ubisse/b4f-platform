// support/page.tsx
import { useTranslations } from "next-intl";

import { HelpCenterForm } from "@/components/forms/support";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Support = () => {
  const t = useTranslations("Dashboard.SupportPage");

  return (
    <div>
      <Breadcrumb className="hidden md:block absolute top-[22px] left-14">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("BreadCrumbTitile")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="px-4 sm:px-6 lg:px-0">
        <div className="max-w-6xl mx-auto mt-10">
          <HelpCenterForm />
        </div>
      </div>
    </div>
  );
};

export default Support;
