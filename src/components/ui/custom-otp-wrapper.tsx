import * as React from "react";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const CustomOTPInput = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ onChange, ...props }, ref) => {
  const handleChange = (newValue: string) => {
    // Allow only alphanumeric characters
    const alphanumericValue = newValue.replace(/[^a-zA-Z0-9]/g, "");
    if (onChange) {
      onChange(alphanumericValue);
    }
  };

  return (
    <OTPInput
      ref={ref}
      onChange={handleChange}
      {...props}
    />
  );
});

CustomOTPInput.displayName = "CustomOTPInput";

export { CustomOTPInput };