"use client";

import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CoursesTable } from "@/components/tables/courses";

export default function CoursesPage() {
  const t = useTranslations("Dashboard.CoursesPage");

  return (
    <div className="relative p-4 md:p-10">
      <Breadcrumb className="hidden md:block absolute top-[22px] left-14">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("BreadCrumbTitle")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CoursesTable />
    </div>
  );
}
