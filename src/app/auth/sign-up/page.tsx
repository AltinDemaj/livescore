"use client";

import { AuthForm } from "@/components/auth-form";
import { useAuth } from "@/hooks/use-auth";

export default function SignUpPage() {
  const { signUp } = useAuth();

  const handleSignUp = async (email: string, password: string) => {
    return await signUp(email, password);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <AuthForm mode="sign-up" onSubmit={handleSignUp} />
    </div>
  );
}
