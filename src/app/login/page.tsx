"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Divider } from "@/components/auth/Divider";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { status } = useSession();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [status, router, callbackUrl]);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue building your schedule."
      footer={
        <>
          New here?{" "}
          <Link
            href="/signup"
            className="font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
      <Divider />
      <GoogleButton label="Continue with Google" callbackUrl={callbackUrl} />
    </AuthLayout>
  );
}
