import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "../../../hooks/hook-stepper"
import { useCallback, useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { LucideCalendarSearch, LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { cn } from "../../../lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { PhoneInput, getPhoneData } from "../phone-input";

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

    const [previewImageUrl, setPreviewImageUrl] = useState("/images/freelancer/file.svg")
    const [imageFile, setImageFile] = useState<File>(null)
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(new Date())

    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setImageFile(file)

        if (file) {
            const fileReader = new FileReader()


            fileReader.onload = () => {
                console.log("Hello")
                setPreviewImageUrl(fileReader.result as string)
            }
            fileReader.readAsDataURL(file)
        } 
    }

    const renderImage =  useCallback(() => {
        return (
            <>
           
                { previewImageUrl !== null &&
                    <img
                        src={previewImageUrl}
                        alt="profile image"
                        className="w-32 h-full"
                    />
                }
            </>
        )
    }, [previewImageUrl])

    return (
        <>
              <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Finalize </span> Your Profile and Publish</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">A professional photo builds client trust, and for secure, hassle-free payments, we require your personal information to handle transactions.</p>
                
                    <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 ">
                        <div className="w-3/4">
                            <div className="flex flex-col border border-[#E4E4E7] w-max p-4 items-center bg-[#FBFBFB] border-dashed rounded-md">
                                <div className="">
                                    <Input onChange={(e) => {handleFileChange(e)}} id="bulk-upload" type="file" className="peer hidden"/>
                                    <Label htmlFor="bulk-upload" className="text-[#60BB22] underline underline-offset-2 cursor-pointer">
                                        <div className="">
                                            {renderImage()}
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex flex-col items-center mt-3">
                                    <span className="font-circular text-base text-[#3D3D3D]"><span className="text-primary underline underline-offset-1">Upload</span> your image</span>

                                    <p className="text-[#BEBEBE] text-sm font-circular mt-1">{"250x250 Min size / 5 MB Max"}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-x-5">
                                <div className="w-1/2">
                                    <FormField
                                        control={control}
                                        name="date_of_birth"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-[#545756] text-sm font-normal font-circular mb-1">Date of Birth*</FormLabel>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                    <PopoverTrigger asChild className="w-full bg-transparent hover:bg-white hover:text-[#7E8082] focus:bg-white">
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
                                                                    <span className="font-circular text-base text-[#BEBEBE]">YY-MM-DD</span>
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
                                                                date > new Date()
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
                                
                                <div className="w-1/2">
                                    <FormField
                                        control={control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel className="text-[#545756] font-normal font-circular text-sm">Country*</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-transparent placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]">
                                                        <SelectValue className="placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="Select a country" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent className="bg-white">
                                                    <SelectItem value="nigeria">Nigeria</SelectItem>
                                                    <SelectItem value="france">France</SelectItem>
                                                    <SelectItem value="canada">Canada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                    
                                            <FormMessage className="text-xs font-circular font-normal"/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="mt-5">
                                <FormField
                                    control={control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel className="text-[#545756] text-sm font-normal font-circular">Street address*</FormLabel>

                                        <FormControl>
                                            <Input className="bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE] py-2" placeholder="Enter  street number and address " {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs font-circular font-normal"/>

                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="mt-5 flex items-center gap-x-5">
                                <div className="w-1/2">
                                    <FormField
                                        control={control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel className="text-[#545756] text-sm font-normal font-circular">State/Province*</FormLabel>

                                            <FormControl>
                                                <Input className="bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE] py-2" placeholder="Enter  state/province" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-circular font-normal"/>

                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-1/2">
                                    <FormField
                                        control={control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel className="text-[#545756] text-sm font-normal font-circular">City*</FormLabel>

                                            <FormControl>
                                                <Input className="bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE] py-2" placeholder="Enter  city" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-circular font-normal"/>

                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-5 flex items-center gap-x-5">
                                <div className="w-1/2">
                                    <FormField
                                        control={control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#545756] text-sm font-normal font-circular">Phone Number*</FormLabel>
                                                <FormControl>
                                                    <PhoneInput {...field} />
                                                </FormControl>
                                                {/* <FormDescription>
                                                    Enter a valid phone number with country
                                                </FormDescription> */}
                                                <FormMessage className="text-xs font-circular font-normal"/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-1/2">
                                    <FormField
                                        control={control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel className="text-[#545756] text-sm font-normal font-circular">ZIP/Postal code*</FormLabel>

                                            <FormControl>
                                                <Input className="bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE] py-2" placeholder="Enter  zip/postal code" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-circular font-normal"/>

                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="absolute flex items-center bottom-7 right-7 font-circular font-medium space-x-3">
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

export default FinalDetails