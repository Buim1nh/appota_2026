import type { Metadata } from "next";
import { RegisterScreen } from "@/components/RegisterScreen";

export const metadata: Metadata = {
  title: "Tạo tài khoản",
  description: "Đăng ký tài khoản",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}
