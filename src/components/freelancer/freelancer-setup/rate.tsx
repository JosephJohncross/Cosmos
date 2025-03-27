import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "../../../hooks/hook-stepper"
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useEffect } from "react";


type RateDetailsProps = {
    handleBack: () => void,
    handleNext: () => void
}

const RateDetails = ({handleBack, handleNext}: RateDetailsProps) => {
    const {
        control,
        formState: { errors },
        register,
    } = useFormContext<StepperFormValues>();

     useEffect(() => {
        window.scrollTo(0,0)
    }, [])
    

    return (
        <>
            <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">
                    <p className="font-circular font-bold text-[#7E8082]">5/5</p>

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Now </span>set your hourly rate</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">Your hourly rate will be visible to clients on your profile and in search results once published. You can update it each time you submit a proposal to match the project's needs. </p>


                    <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 font-circular ">
                        <div className="flex justify-between border-b border-gray-200 pb-6">
                            <div className="flex flex-col">
                                <p className="text-[#18181B] text-lg font-medium">Hourly rate</p>
                                <p className="text-[#7E8082] mt-2">Total amount the client will see.</p>
                            </div>

                            <div className="flex flex-col gap-y-2 ">
                                <FormField
                                    control={control}
                                    name="rate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative ">
                                                    <p className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"><span className="text-base">ATOM </span>/hr</p>
                                                    <Input className="bg-white text-[#7E8082] pr-24 text-base border-gray-300 font-circular placeholder:text-[#BEBEBE] text-right" placeholder="0.0" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs font-circular font-normal"/>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex text-sm items-center justify-end space-x-2">
                                    <p className=" text-[#FB822F] mr-3">Service fee:</p>
                                    <p className="text-[#7E8082] font-medium">0.00</p>
                                    <p className="">ATOM /hr</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6">
                            <div className="flex flex-col">
                                <p className="text-[#18181B] text-lg font-medium">You'll receive</p>
                                <p className="text-[#7E8082] mt-2">The estimated amount after the platform fee is deducted.</p>
                            </div>

                            <div className="flex flex-col gap-y-2 ">
                                <FormField
                                    control={control}
                                    name="rate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative ">
                                                    <p className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"><span className="text-base">ATOM </span>/hr</p>
                                                    <Input disabled className="bg-white disabled:bg-gray-200 text-[#7E8082] pr-24 text-base border-gray-300 font-circular placeholder:text-[#BEBEBE] text-right" placeholder="0.0" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs font-circular font-normal"/>
                                        </FormItem>
                                    )}
                                />
                             
                            </div>
                        </div>

                        <div className="absolute flex items-center bottom-5 right-5 font-circular font-medium space-x-3">
                            <Button onClick={handleBack} className="flex hover:bg-white/80 items-center space-x-3 text-primary bg-transparent border border-primary">
                                <LucideChevronLeft/>
                                <p className="">Back</p>
                            </Button>

                            <Button onClick={handleNext} className="flex items-center space-x-3 bg-primary text-white">
                                <p className="">Next</p>
                                <LucideChevronRight/>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default RateDetails