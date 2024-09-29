import Image from "next/image";
import AuthForm from "@/components/auth/auth";

export default function Home() {
  return (
  <div>
    <AuthForm isSignUp={true}/>
  </div>
  );
}
