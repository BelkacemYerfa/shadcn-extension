"use client";

import { OtpStyledInput } from "@/registry/default/extension/otp-input";
import { Button } from "@/components/ui/button";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function PageExample() {
  return (
    <main className="pt-14 pb-4 max-w-xl mx-auto w-full space-y-8 ">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">Page Examples</h1>
        <p>Tree view examples </p>
      </div>
      <ExampleComp />
    </main>
  );
}

enum OtpInputType {
  password = "password",
  text = "text",
}

const ExampleComp = () => {
  const [isPassword, setIsPassword] = useState<OtpInputType>(
    OtpInputType.password
  );

  const [field, setField] = useState<string>("");

  const onChange = (otp: string) => {
    setField((prev) => prev + otp);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Form submitted : " + field);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Carousel</h2>
      <form className="grid gap-2" onSubmit={onSubmit}>
        <label>Enter your confirmation password</label>
        <div className="flex items-center gap-2 text-white">
          <OtpStyledInput
            onChange={onChange}
            numInputs={7}
            inputType={isPassword}
            value={field}
          />
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            type="button"
            onClick={() => {
              setIsPassword(
                isPassword === OtpInputType.password
                  ? OtpInputType.text
                  : OtpInputType.password
              );
            }}
          >
            {isPassword === OtpInputType.password ? (
              <EyeClosedIcon />
            ) : (
              <EyeOpenIcon />
            )}
            <span className="sr-only">{isPassword}</span>
          </Button>
        </div>
        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    </div>
  );
};
