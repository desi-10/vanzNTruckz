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
import Loader from "./loader";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Define the form values type
type LoginFormValues = z.infer<typeof loginSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await axios.post("/api/auth/forgot-password", {
        email: data.email,
      });
      router.push("/reset-password");
      toast("✅ Password reset link sent to your email");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(`❌ ${error.response?.data.error}`);
        return;
      }
      console.error("An unexpected error occurred:", error);
      toast("❌ Something went wrong, please try again later");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f77f1e] text-white hover:bg-[#f77f1e]/80 hover:text-white"
                >
                  {isSubmitting ? <Loader /> : "Send Email"}
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
