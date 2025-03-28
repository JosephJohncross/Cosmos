import { StepperFormValues } from "../../../hooks/hook-stepper"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "../../../components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form"
import { useFormContext } from "react-hook-form";
import { LucideChevronLeft, LucideChevronRight, LucidePlus } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect } from "react";

type LanguageDetailsProps = {
    handleBack: () => void,
    handleNext: () => void
}

const LanguageDetails = ({handleBack, handleNext}: LanguageDetailsProps) => {
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
                    <p className="font-circular font-bold text-[#7E8082]">4/5</p>

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Looking good! </span> Now, tell us which languages you speak.</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">Clients on Work often look for multilingual talent. English is a must, do you know any others?</p>
                
                    <div className="bg-white relative rounded-xl p-10 mt-9 ">
                        <div className="w-3/4 flex justify-between items-baseline">
                            <div className="flex font-circular flex-col gap-y-3">
                                <p className=" text-base text-[#545756]">Your Bio</p>

                                <p className="mt-3 text-[#7E8082]">English (included on all profiles)</p>
                            </div>

                            <div className="">
                                <FormField
                                    control={control}
                                    name="englishFluency"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel className="text-[#545756] text-base font-normal font-circular">Fluency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-transparent min-w-44 placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]">
                                                    <SelectValue className="placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="My level" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent className="bg-white text-[#545756]">
                                                <SelectItem value="fluent">Fluent</SelectItem>
                                                <SelectItem value="proficient">Proficient</SelectItem>
                                            </SelectContent>
                                        </Select>
                                
                                        <FormMessage className="text-xs font-circular font-normal"/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>

                        <div className="flex items-center justify-between mt-20">
                            <div className="flex text-[#2ECC71] space-x-2 px-6 py-2 items-center border border-green-500 rounded-md bg-transparent hover:bg-white/80">
                                <LucidePlus size={20} className=""/>
                                <p className="font-circular text-base">Add language</p>
                            </div>

                            <div className=" flex items-center font-circular font-medium space-x-3">
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
                </div>
            </main>
        </>
    )
}

export default LanguageDetails