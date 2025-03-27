import { useFormContext } from "react-hook-form";
import { PostJobStepperFormValues } from "../../../hooks/post-job-stepper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useEffect } from "react";

type DescriptionSectionProps = {
    handleBack: () => void,
    handleNext: () => void
}

const DescriptionSection = ({handleBack, handleNext}: DescriptionSectionProps) => {
    const {
        control,
        formState: { errors },
        register,
        setValue,
        getValues
    } = useFormContext<PostJobStepperFormValues>();

     useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    return(
        <>
               <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">
                    <p className="font-circular font-bold text-[#7E8082]">3/5</p>

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Great! </span>Now, provide a detailed project description</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">Provide a clear and detailed description of your project, including goals, tasks and required skills. This helps freelancers understand your needs and apply confidently.</p>

                    <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 ">
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-[#545756] font-circular">Project Description</FormLabel>

                                    <FormControl>
                                        <Textarea className="bg-white h-32 resize-none placeholder:font-circular w-3/4 border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="Example: We are seeking new freelancers for a UI/UX project focused on a sports niche website. The project involves designing four pages, including a homepage, with a minimalistic design approach. Candidates should be able to deliver rapid work while maintaining high-quality standards. If you are passionate about user experience and can create visually appealing interfaces, we want to hear from you!" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs font-circular font-normal"/>

                                    </FormItem>
                                )}
                            />
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

export default DescriptionSection