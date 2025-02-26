"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loader from "@/components/loader";
import axios from "axios";

// Define the validation schema using Zod
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    otp: z
      .string()
      .min(4, "OTP must be 4 digits")
      .max(4, "OTP must be 4 digits"),
  })
  .refine((data) => {
    if (data.newPassword !== data.confirmPassword) {
      return {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      };
    }
  });

// Define the form values type
type resetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<resetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const router = useRouter();

  // Handle form submission
  const onSubmit = async (data: resetPasswordFormValues) => {
    try {
      await axios.post("/api/auth/reset-password", {
        password: data.newPassword,
        otp: data.otp,
      });
      router.push("/");
      toast("✅ Password reset successfully");
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast("❌ Password reset failed");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your password to reset your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">New Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confrim Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="otp">OTP</Label>
                  </div>
                  <Input id="otp" type="password" {...register("otp")} />
                  {errors.otp && (
                    <p className="text-red-500 text-sm">{errors.otp.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f77f1e] text-white hover:bg-[#f77f1e]/80 hover:text-white"
                >
                  {isSubmitting ? <Loader /> : "Reset Password"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="text-orange-500">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-orange-500">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
