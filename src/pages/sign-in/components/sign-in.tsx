import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";

export const LoginSimple = ({changeTab}: {changeTab: () => void}) => {
    return (
            <div className="relative z-10 mx-auto flex w-full flex-col gap-8 sm:max-w-90">
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        console.log("Form data:", data);
                    }}
                    className="z-10 flex flex-col gap-6"
                >
                    <div className="flex flex-col gap-5">
                        <Input isRequired hideRequiredIndicator label="Email" type="email" name="email" placeholder="Enter your email" size="md" />
                        <Input isRequired hideRequiredIndicator label="Password" type="password" name="password" size="md" placeholder="••••••••" />
                    </div>

                    <div className="flex items-center">
                        <Checkbox label="Remember for 30 days" name="remember" />

                        <Button color="link-color" size="md" href="#" className="ml-auto">
                            Forgot password
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button type="submit" size="lg">
                            Sign in
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
