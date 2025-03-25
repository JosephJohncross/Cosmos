import { Dispatch, SetStateAction } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "../../components/ui/input-otp"
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

type TwoFAOtpIInputComponentProps = {
    setValue:  Dispatch<SetStateAction<string>>,
    value: string,
    optionalParamterToSet?: Dispatch<SetStateAction<any>>,
    optionalParamter?: any    
}

const TwoFAOtpIInputComponent = ({setValue, value, optionalParamter, optionalParamterToSet}: TwoFAOtpIInputComponentProps) => {

    return (
        <div className="space-y-2 w-full flex justify-center">
            <InputOTP
                maxLength={5}
                value={value}
                onChange={(value) => {
                    setValue(value)
                    optionalParamterToSet(false)
                }}
                className=""
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            >
                <InputOTPGroup className="flex">
                    <InputOTPSlot index={0} className="h-20 w-16 text-[28px] leading-[33.89px] tracking-[0.1px]"/>
                    <InputOTPSlot index={1} className="h-20 w-16 text-[28px] leading-[33.89px] tracking-[0.1px]"/>
                    <InputOTPSlot index={2} className="h-20 w-16 text-[28px] leading-[33.89px] tracking-[0.1px]"/>
                    <InputOTPSlot index={3} className="h-20 w-16 text-[28px] leading-[33.89px] tracking-[0.1px]"/>
                    <InputOTPSlot index={4} className="h-20 w-16 text-[28px] leading-[33.89px] tracking-[0.1px]"/>
                </InputOTPGroup>
            </InputOTP>
        </div>
    )
}

export default TwoFAOtpIInputComponent