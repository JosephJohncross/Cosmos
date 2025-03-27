import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "../../../hooks/hook-stepper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useEffect } from "react";
import { PostJobStepperFormValues } from "../../../hooks/post-job-stepper";

type TitleSectionProps = {
    handleBack: () => void,
    handleNext: () => void
}

const TitleSection = ({handleBack, handleNext} : TitleSectionProps) => {

    const {
        control,
        formState: { errors },
        register,
    } = useFormContext<PostJobStepperFormValues>();

    useEffect(() => {
        window.scrollTo(0,0)
    }, [])


    return(
        <>
            <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">
                    <p className="font-circular font-bold text-[#7E8082]">1/5</p>

                    <h1 className="font-poppins font-semibold text-[32px] mt-1">Begin with a compelling title</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">A strong title grabs attention and ensures your project post resonates with the right candidates. Since it’s the first thing they’ll notice, make it impactful!</p>

                    <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 ">
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-[#545756] font-circular">Project Title</FormLabel>

                                    <FormControl>
                                        <Input className="bg-white placeholder:font-circular w-3/4 border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="Write a title for your job" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs font-circular font-normal"/>

                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mt-10 font-circular">
                            <p className="text-[#545756] text-base">Example of titles</p>

                            <div className="flex flex-col space-y-1 mt-4">
                                <div className="flex items-center space-x-2">
                                    <span className="h-1 w-1 rounded-full block bg-[#7E8082]"></span>
                                    <p className="text-[#545756] text-base">Creative Graphic Designer Wanted for Ad Campaign Design</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="h-1 w-1 rounded-full block bg-[#7E8082]"></span>
                                    <p className="text-[#545756] text-base">Full-Stack Developer Wanted for E-Commerce Platform Development</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="h-1 w-1 rounded-full block bg-[#7E8082]"></span>
                                    <p className="text-[#545756] text-base">SEO Specialist Needed to Optimize Website and Boost Rankings</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="h-1 w-1 rounded-full block bg-[#7E8082]"></span>
                                    <p className="text-[#545756] text-base">Copywriter Needed for Email Marketing Campaigns</p>
                                </div>
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

export default TitleSection