"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { useAuth } from "@/hooks/use-auth";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      router.push("/dashboard");
    }
    return result;
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <AuthForm mode="sign-in" onSubmit={handleSignIn} />
    </div>
  );
}
