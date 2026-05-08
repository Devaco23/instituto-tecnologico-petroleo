import type { ReactNode } from "react";
import DashboardLayout from "../../../components/DashboardLayout";

type EstudianteLayoutProps = {
  children: ReactNode;
};

export default function EstudianteLayout({ children }: EstudianteLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
