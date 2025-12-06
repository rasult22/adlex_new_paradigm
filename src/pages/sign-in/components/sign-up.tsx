import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

export const SignupSimple = ({changeTab}: {changeTab: () => void}) => {
    const [password, setPassword] = useState("");
    return (
        <div className="mx-auto flex w-full flex-col gap-8 sm:max-w-90">
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(e.currentTarget));
                    console.log("Form data:", data);
                }}
                className="z-10 flex flex-col gap-6"
            >
                <div className="flex flex-col gap-5">
                    <Input isRequired hideRequiredIndicator label="Name" type="text" name="name" placeholder="Enter your name" size="md" />
                    <Input isRequired hideRequiredIndicator label="Email" type="email" name="email" placeholder="Enter your email" size="md" />
                    <Input
                        isRequired
                        hideRequiredIndicator
                        label="Password"
                        type="password"
                        name="password"
                        size="md"
                        placeholder="Create a password"
                        onChange={setPassword}
                        minLength={8}
                        pattern='.*[!@#$%^&*(),.?\":{}|<>].*'
                    />
                    <div className="flex flex-col gap-3">
                        <span className="flex gap-2">
                            <div
                                className={cx(
                                    "flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out",
                                    password.length >= 8 ? "bg-fg-success-primary" : "",
                                )}
                            >
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path
                                        d="M1.25 4L3.75 6.5L8.75 1.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm text-tertiary">Must be at least 8 characters</p>
                        </span>
                        <span className="flex gap-2">
                            <div
                                className={cx(
                                    "flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out",
                                    password.match(/[!@#$%^&*(),.?":{}|<>]/) ? "bg-fg-success-primary" : "",
                                )}
                            >
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path
                                        d="M1.25 4L3.75 6.5L8.75 1.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm text-tertiary">Must contain one special character</p>
                        </span>
                    </div>
                </div>

                <div className="z-10 flex flex-col gap-4">
                    <Button type="submit" size="lg">
                        Get started
                    </Button>
                </div>
            </Form>

            <div className="flex justify-center gap-1 text-center">
                <span className="text-sm text-tertiary">Already have an account?</span>
                <Button onClick={changeTab} href="#" color="link-color" size="md">
                    Log in
                </Button>
            </div>
        </div>
    );
};
