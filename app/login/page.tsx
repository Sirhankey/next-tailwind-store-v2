import Image from "next/image";
import LoginForm from "../lib/domain/ui/login-form";



export default function LoginPage() {
  return (
    <main className="flex flex-col items-center md:flex-row md:h-screen" style={{ background: 'linear-gradient(to right, #06b0cc, #05cbe1)' }}>
      <div className="flex items-center justify-center w-1/2 md:w-1/2">
        <Image src="/demo/images/logo/logo.png" alt="Login Image" width={800} height={600} />
      </div>

      <div className="relative mx-auto my-auto flex w-1/2 max-w-[400px] flex-col space-y-2.5 p-4">
        <LoginForm />
      </div>
    </main>
  );
}
