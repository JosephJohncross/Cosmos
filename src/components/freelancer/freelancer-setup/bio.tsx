import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "../../../hooks/hook-stepper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useEffect } from "react";

type BioDetailsProps = {
    handleBack: () => void,
    handleNext: () => void
}




const BioDetails = ({handleBack, handleNext}: BioDetailsProps) => {
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
                    <p className="font-circular font-bold text-[#7E8082]">3/5</p>

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Great! </span>Now, create a bio to showcase who you are</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">Enter your professional title in one sentence. Then, highlight your key strengths, what you excel at using clear paragraphs or bullet points. This helps clients quickly understand your expertise. You can always edit this later.</p>

                    <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 ">
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-[#545756] font-circular">Your Professional Title</FormLabel>

                                    <FormControl>
                                        <Input className="bg-white placeholder:font-circular w-3/4 border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="Branding & UIUX Design" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs font-circular font-normal"/>

                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-[#545756] font-circular">Your Bio</FormLabel>

                                    <FormControl>
                                        <Textarea className="bg-white resize-none placeholder:font-circular w-3/4 border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="Highlight your key skills, experiences, and passions. This section is one of the first impressions clients will have of your profile, so make it clear and impactful." {...field} />
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

export default BioDetails