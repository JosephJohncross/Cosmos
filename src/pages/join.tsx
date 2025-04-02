import { useEffect, useRef, useState } from "react"
import { Button } from "../components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../components/ui/dialog"
import LaptopIcon from "../components/icons/join/laptop"
import { useLocation } from "react-router-dom"
import { ApplicationRoutes } from "../routes/routes-constant"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import FreelancerIcon from "../components/icons/join/freelancer"
import { LucideCheckCircle, LucideCheckCircle2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Checkbox } from "../components/ui/checkbox"
import { useNavigate } from "react-router-dom"

const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().min(2, {
        message: "Email is required",
    }).email({message: "Please provide a valid a valid email"}),
    country:  z.string({
        required_error: "Please select a country"
    }),
    terms: z.boolean().default(false).optional(),
})

const JoinPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userType, setUserType] = useState<"freelancer" | "client">("freelancer")
    const navigate = useNavigate();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          country: "",
          terms: false
        },
    })

    const handleJoin = () => {
        userType == 'client' ? navigate(ApplicationRoutes.CLIENT_DASHBOARD) : navigate(ApplicationRoutes.FREELANCER_DASHBOARD)
        setIsOpen(false)
    }

    useEffect(() => {
        setIsOpen(true); // Open the dialog when the component mounts
    }, []);

    return (
        <>
            <main className=" mt-44">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <div className="hidden">Edit Profile</div>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-poppins font-semibold text-[20px] text-center">Join as a Client or Freelancer</DialogTitle>
                        </DialogHeader>

                        <div className="">
                            <RadioGroup defaultValue={userType} className="flex flex-col gap-y-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                        value="client" 
                                        id="client" 
                                        onClick={() => setUserType("client")}
                                        className="hidden" // Hide the default radio button
                                    />

                                    <Label
                                        htmlFor="client"
                                        className="border-gray-300 border cursor-pointer rounded-md w-full p-4 flex justify-between items-center"
                                    >
                                        <div className="flex space-x-3">
                                            <LaptopIcon className="w-9 h-9"/>
                                            <div className="">
                                            <p className="font-poppins font-semibold text-base text-[#545756]">I'm a Client</p>
                                            <p className="text-[14px] text-[#7E8082] font-normal font-circular">Hiring skill professionals</p>
                                            </div>
                                        </div>

                                        <div className={`h-4 w-4 rounded-full border-2 border-gray-300 flex items-center justify-center ${
                                            userType === "client" ? "border-primary" : ""
                                        }`}>
                                            {userType === "client" && (
                                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                                            )}
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                        value="freelancer" 
                                        id="freelancer" 
                                        onClick={() => setUserType("freelancer")}
                                        className="hidden" // Hide the default radio button
                                    />

                                    <Label
                                        htmlFor="freelancer"
                                        className="border-gray-300 border cursor-pointer rounded-md w-full p-4 flex justify-between items-center"
                                    >
                                        <div className="flex space-x-3">
                                            <FreelancerIcon className="w-9 h-9"/>
                                            <div className="">
                                            <p className="font-poppins font-semibold text-base text-[#545756]">I'm a Freelancer</p>
                                            <p className="text-[14px] text-[#7E8082] font-normal font-circular">Seeking job opportunities</p>
                                            </div>
                                        </div>
                                        <div className={`h-4 w-4 rounded-full border-2 border-gray-300 flex items-center justify-center ${
                                            userType === "freelancer" ? "border-primary" : ""
                                        }`}>
                                            {userType === "freelancer" && (
                                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                                            )}
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>

                            <div className="">
                                <Button onClick={()=> {handleJoin()}} className="bg-primary text-white w-full mt-6 py-6">Join as a {userType === "freelancer" ? "Freelancer" : "Client"}</Button>
                            </div>
                        </div>
                
                    </DialogContent>
                </Dialog>

                {/* <div className="content-container">
                    <div className="flex flex-col items-center">
                        <h1 className="font-poppins font-semibold text-[32px] text-black">Setup {userType === "freelancer" ? "Freelancer" : "Client"} account</h1>
                        <div className="w-full justify-center flex ">
                            <p className="text-[#626262] font-circular max-w-sm text-center mt-3">Complete your profile to attract more clients and showcase your skills!</p>
                        </div>

                        <div className="bg-[#DFFFED] rounded-full flex items-center space-x-4 border border-[#9BFFC5] mt-5 text-[#545756] py-3 px-6">
                            <p className="font-circular font-medium">Wallet Connected</p>
                            <LucideCheckCircle2 className="border-none" fill="#2ECC71" stroke="#FFF"/>
                        </div>
                    </div>

                    <div className="mt-10 mb-16">
                        <div className="max-w-xl rounded-xl bg-white mx-auto w-full p-10">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel className="text-[#545756] font-circular">Name</FormLabel>

                                            <FormControl>
                                                <Input className="bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="Mark John" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-circular font-normal"/>

                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel className="text-[#545756] font-circular">Email</FormLabel>

                                            <FormControl>
                                                <Input className="bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]" placeholder="example@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs font-circular font-normal"/>

                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel className="text-[#545756] font-circular">Country</FormLabel>
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

                                    <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-sm font-circular text-[#7E8082] pt-4 pb-7">
                                                        Yes, I agree to the Terms of Service, User Agreement, and Privacy Policy.
                                                    </FormLabel>
                                                </div>
                                                <FormMessage className="text-xs font-circular font-normal"/>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="px-4 py-4">
                                        <Button className="bg-primary w-full text-white">Join as a {userType === "freelancer" ? "Freelancer" : "Client"}</Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div> */}
            </main>
        </>
    )
}

export default JoinPage