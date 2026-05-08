import type { ReactNode } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

type ProfesorLayoutProps = {
  children: ReactNode;
};

export default function ProfesorLayout({ children }: ProfesorLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
