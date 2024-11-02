'use client';

import AuthForm from "@/components/auth/auth";
import withPublicRoute from "@/components/auth/withPublicRoute";

function Signin() {
  return <AuthForm isSignUp={false} />;
}

export default withPublicRoute(Signin);