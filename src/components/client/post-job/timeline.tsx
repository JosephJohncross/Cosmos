import { useFormContext } from "react-hook-form";
import { PostJobStepperFormValues } from "../../../hooks/post-job-stepper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { LucideCalendarSearch, LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { cn } from "../../../lib/utils";
import { format } from "date-fns";

type TimelineSectionProps = {
    handleBack: () => void,
    handleNext: () => void
}

const TimelineSection = ({handleBack, handleNext}: TimelineSectionProps) => {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())

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
                    <p className="font-circular font-bold text-[#7E8082]">5/5</p>

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Looking great, </span>  set project timeframe</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">Your project timeline will be visible to freelancers on the project page and in search results once published. You can update it as needed to ensure it matches the project's scope and deadlines.</p>


                    <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 font-circular ">
                        <div className="flex justify-between border-b border-gray-200 pb-6">
                            <div className="flex flex-col">
                                <p className="text-[#18181B] text-lg font-medium">Timeframe</p>
                                <p className="text-[#7E8082] mt-2">A specific period during which the project is expected to be completed.</p>
                            </div>

                            <div className="flex flex-col gap-y-2 ">
                            <FormField
                                        control={control}
                                        name="timeframe"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild className="w-full bg-transparent hover:bg-white hover:text-[#7E8082] min-w-44 focus:bg-white">
                                                        <FormControl className="border border-gray-300 w-full dark:border-[#1D2739]">
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full py-4 pl-3 text-left font-normal font-circular",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")  
                                                                ) : (
                                                                    <span className="font-circular text-base text-[#BEBEBE]">Select timeframe</span>
                                                                )}
                                                                <LucideCalendarSearch className="ml-auto h-4 w-4 text-[#7E8082] opacity-50" />

                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            captionLayout="dropdown-buttons"
                                                            selected={date}
                                                            onSelect={(e: Date | undefined)=> {                                                                    
                                                                field.onChange(e)
                                                                setDate(e)
                                                                // setOpen(false) 
                                                            }}
                                                            fromYear={1920}
                                                            toYear={2030}
                                                            classNames={{
                                                                dropdown_year: 'focus:bg-white hover:bg-white active:bg-white',
                                                                caption_dropdowns: 'flex space-x-2 focus:bgwhi',
                                                            }}
                                                            disabled={(date) => 
                                                                date < new Date()
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>

                                                <FormMessage className="font-normal text-xs dark:text-red-500"/>
                                            </FormItem>
                                        )}
                                    />
                            </div>
                        </div>

                        <div className="flex justify-between pt-6">
                            <div className="flex flex-col">
                                <p className="text-[#18181B] text-lg font-medium">Duration</p>
                                <p className="text-[#7E8082] mt-2">The total length of time the project will take to complete.</p>
                            </div>

                            <div className="flex flex-col gap-y-2 ">
                                <FormField
                                    control={control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-transparent min-w-44 placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]">
                                                    <SelectValue className="placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="14 days" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent className="bg-white text-[#545756]">
                                                <SelectItem value="fluent">30days</SelectItem>
                                                <SelectItem value="proficient">2 months</SelectItem>
                                            </SelectContent>
                                        </Select>
                                
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

export default TimelineSection