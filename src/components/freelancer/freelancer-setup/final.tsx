import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "../../../hooks/hook-stepper"

type FinalDetailsProps = {
    handleBack: () => void,
    handleNext: () => void
}

const FinalDetails = ({handleBack, handleNext}: FinalDetailsProps) => {
    const {
        control,
        formState: { errors },
        register,
    } = useFormContext<StepperFormValues>();

    return (
        <>
              <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Finalize </span> Your Profile and Publish</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">A professional photo builds client trust, and for secure, hassle-free payments, we require your personal information to handle transactions.</p>
                
                    <div className="bg-white relative rounded-xl p-10 mt-9 ">
                        <div className="w-3/4 border border-black">
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default FinalDetails