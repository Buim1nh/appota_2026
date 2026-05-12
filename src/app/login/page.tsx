import type { Metadata } from "next";
import { LoginScreen } from "@/components/LoginScreen";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản",
};

export default function LoginPage() {
  return <LoginScreen />;
}
