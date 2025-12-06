import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { loginUser } from "@/queries/auth";
import { useAuthStore } from "@/stores/auth";

export const LoginSimple = ({ changeTab }: { changeTab: () => void }) => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await loginUser({ email, password });
      setAuth(response.user, response.tokens);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 mx-auto flex w-full flex-col gap-8 sm:max-w-90">
      <Form onSubmit={handleSubmit} className="z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <Input
            isRequired
            hideRequiredIndicator
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            size="md"
          />
          <Input
            isRequired
            hideRequiredIndicator
            label="Password"
            type="password"
            name="password"
            size="md"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-error-secondary p-3 text-sm text-error-primary">
            {error}
          </div>
        )}

        <div className="flex items-center">
          <Checkbox label="Remember for 30 days" name="remember" />

          <Button color="link-color" size="md" href="#" className="ml-auto">
            Forgot password
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" size="lg" isDisabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </Form>

      <div className="z-10 flex justify-center gap-1 text-center">
        <span className="text-sm text-tertiary">Don't have an account?</span>
        <Button onClick={changeTab} color="link-color" size="md" href="#">
          Sign up
        </Button>
      </div>
    </div>
  );
};
