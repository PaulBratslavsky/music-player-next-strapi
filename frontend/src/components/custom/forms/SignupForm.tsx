"use client";

import { useFormState } from "react-dom";
import { registerUserAction } from "@/data/actions/auth-actions";

import Link from "next/link";

const INITIAL_STATE = {
  zodErrors: null,
  strapiErrors: null,
  data: null,
  message: null,
};

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ZodErrors } from "@/components/custom/ZodErrors";
import { StrapiErrors } from "@/components/custom/StrapiErrors";
import { SubmitButton } from "@/components/custom/SubmitButton";

export function SignupForm() {
  const [formState, formAction] = useFormState(
    registerUserAction,
    INITIAL_STATE
  );

  return (
    <form action={formAction}>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" type="text" />
            <ZodErrors error={formState.zodErrors?.username} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="m@example.com"
              type="email"
            />
            <ZodErrors error={formState.zodErrors?.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" />
            <ZodErrors error={formState.zodErrors?.password} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <SubmitButton
            className="w-full"
            text="Sign Up"
            loadingText="Loading"
          />
          <StrapiErrors error={formState.strapiErrors} />
        </CardFooter>
        <div className="mb-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="login">
            Log In
          </Link>
        </div>
      </Card>
    </form>
  );
}
