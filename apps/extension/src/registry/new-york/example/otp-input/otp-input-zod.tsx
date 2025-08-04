"use client";

import { OtpStyledInput } from "@/registry/new-york/extension/otp-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const INPUT_NUM = 4;

const form = z.object({
  otp: z.string().min(INPUT_NUM, "Password confirmation is required"),
});

type Form = z.infer<typeof form>;

enum OtpInputType {
  password = "password",
  text = "text",
}

const OTPInputZod = () => {
  const [isPassword, setIsPassword] = useState<OtpInputType>(
    OtpInputType.password,
  );
  const multiForm = useForm<Form>({
    resolver: zodResolver(form),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: Form) => {
    toast.success("Form submitted : " + JSON.stringify(data, null, 2));
  };

  return (
    <Form {...multiForm}>
      <form
        className="grid gap-2 bg-background p-4 rounded-md shadow-md"
        onSubmit={multiForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={multiForm.control}
          name="otp"
          render={({ field }) => (
            <FormControl>
              <>
                <FormLabel htmlFor={field.name}>
                  Enter your confirmation password
                </FormLabel>
                <FormItem className="flex space-y-0 gap-x-2">
                  <OtpStyledInput
                    numInputs={INPUT_NUM}
                    inputType={isPassword}
                    {...field}
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
                          : OtpInputType.password,
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
                </FormItem>
                <FormMessage />
              </>
            </FormControl>
          )}
        />
        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default OTPInputZod;
