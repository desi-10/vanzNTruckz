import { ModeToggle } from "@/components/mode-toggle";
import { ResetPasswordForm } from "@/components/reset-password";
import Image from "next/image";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-muted p-6 md:p-10">
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-md">
          <Image
            src="/app_logo_round.png"
            alt="Logo"
            width={1000}
            height={1000}
            className="w-full h-full"
          />
        </div>
        <p className="text-center text-sm font-bold">VanzNTruckz</p>
      </div>
      <div className="absolute bottom-10 right-10">
        <ModeToggle />
      </div>
      <ResetPasswordForm />
    </div>
  );
}
