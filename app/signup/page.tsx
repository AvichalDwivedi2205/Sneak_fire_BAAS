'use client';

import AuthForm from "@/components/auth/auth";
import withPublicRoute from "@/components/auth/withPublicRoute";

function Signup() {
  return <AuthForm isSignUp={true} />;
}

export default withPublicRoute(Signup);