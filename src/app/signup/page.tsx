"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Divider } from "@/components/auth/Divider";

export default function SignupPage() {
  const router = useRouter();
  const search = useSearchParams();
  const { status } = useSession();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [status, router, callbackUrl]);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="A few quick details and you're in."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
      <Divider />
      <GoogleButton label="Continue with Google" callbackUrl={callbackUrl} />
    </AuthLayout>
  );
}
