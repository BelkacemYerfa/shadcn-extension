import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import OtpInput, { OTPInputProps } from "react-otp-input";

type OtpOptions = Omit<OTPInputProps, "renderInput">;

type OtpStyledInputProps = {
  className?: string;
} & OtpOptions;

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
          className={cn("!w-12 !appearance-none", className)}
        />
      )}
      renderSeparator={<></>}
      containerStyle={
        "flex justify-center items-center gap-3 text-2xl font-bold "
      }
    />
  );
};
