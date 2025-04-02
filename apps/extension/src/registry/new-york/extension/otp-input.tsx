import React from "react";
import { Input } from "@/registry/new-york/ui/input";
import { cn } from "@/lib/utils";
import OtpInput, { OTPInputProps } from "react-otp-input";

type OtpOptions = Omit<OTPInputProps, "renderInput">;

type OtpStyledInputProps = {
  className?: string;
} & OtpOptions;

/**
 * Otp input Docs: {@link: https://shadcn-extension.vercel.app/docs/otp-input}
 */

export const OtpStyledInput = ({
  className,
  ...props
}: OtpStyledInputProps) => {
  return (
    <OtpInput
      {...props}
      renderInput={(inputProps) => (
        <Input
          {...inputProps}
          className={cn("selection:bg-none !w-9", className)}
        />
      )}
      containerStyle={`flex justify-center items-center flex-wrap ${
        props.renderSeparator ? "gap-1" : "gap-x-3 gap-y-2"
      }`}
    />
  );
};
