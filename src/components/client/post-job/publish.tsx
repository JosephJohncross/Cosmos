import PencilEdit from "../../icons/freelance/pencil-edit";
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "../../../components/ui/dialog"
import { useNavigate } from "react-router-dom";
import UploadSuccess from "../../icons/freelance/upload-success";
import { ApplicationRoutes } from "../../../routes/routes-constant";
import { useRef } from "react";
import WalletSign from "../../icons/client/wallet-verify";
import ApplySuceess from "../../icons/freelance/apply-success";
import { DialogClose } from "@radix-ui/react-dialog";
import { useAuth } from "../../../context/auth-context";

type PublishSectionProps = {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}

const PublishSection = ({setActiveStep} : PublishSectionProps) => {
    const navigate = useNavigate()
    const {setHasJob} = useAuth()
    const successModal = useRef<HTMLDivElement>(null)
    const walletSignModal = useRef<HTMLDivElement>(null)
    const walletSignModalClose = useRef<HTMLDivElement>(null)

    const handleSuccess = () => {
        setHasJob(true)
        walletSignModalClose.current.click()
        successModal.current.click()

        const timeout2 = setTimeout(() => {
            navigate(ApplicationRoutes.CLIENT_DASHBOARD)
        }, 3000)
    }
    
    return(
        <>
            <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Finalize </span>  Your Project and Publish</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">Make any final edits, then submit your project. You can continue to update it even after it goes live.</p>

                    <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 font-circular ">
                        <div className="flex justify-end">
                            <Button 
                                onClick={(e) => {e.preventDefault(); walletSignModal.current.click()}} 
                                className="text-sm font-medium font-circular rounded-md text-white px-7">Publish</Button>
                        </div>

                        <div className="mt-6 grid grid-cols-9 gap-x-9">
                            <div className="col-span-6">
                                <div className="rounded-lg border border-[#E4E4E7] p-4">
                                    <div className="flex justify-between mb-2 items-center">
                                        <p className="font-medium text-[#7E8082] font-circular text-lg">Job Title</p>
                                        <div onClick={()=> {setActiveStep(1)}} className="">
                                            <PencilEdit className=""/>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-[#7E8082] font-normal font-circular text-base">Creative Graphic Designer Wanted for Ad Campaign Design</p>
                                </div>

                                <div className="mt-8">
                                    <div className="flex space-x-4 mb-2 items-center w-max">
                                        <p className="font-medium text-[#7E8082] font-circular text-lg">Project Description</p>
                                        <div onClick={()=> {setActiveStep(3)}} className="">
                                            <PencilEdit className=""/>
                                        </div>
                                    </div>

                                    <div className="mt-4 font-circular">
                                        <p className="text-[#7E8082] text-sm">UI/UX Designer Needed for Kids' Reading App & Website (First Few Pages Only – No Coding)Project Overview:I am looking for a talented UI/UX designer to redesign the first few pages of my kids' reading app and website. The app and website are already developed, but I am not happy with the design of the following pages:</p>
                                        <p className="text-[#7E8082] text-sm mt-3">UI/UX Designer Needed for Kids' Reading App & Website (First Few Pages Only – No Coding)Project Overview:I am looking for a talented UI/UX designer to redesign the first few pages of my kids' reading app and website. The app and website are already developed, but I am not happy with the design of the following pages:</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-3 flex flex-col gap-y-4">
                                <div className="rounded-lg border border-[#E4E4E7] p-4">
                                    <div className="flex justify-between mb-2 items-center">
                                        <p className="font-normal text-[#7E8082] font-circular text-base">Required Skills</p>
                                        <div onClick={()=> {setActiveStep(2)}} className="">
                                            <PencilEdit className=""/>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 flex-wrap mt-4">
                                        <div className="border-[#E4E4E7] w-max bg-[#F4F4F5] border text-[#545756] rounded-full text-sm py-1 px-3">Product Design</div>
                                        <div className="border-[#E4E4E7] w-max bg-[#F4F4F5] border text-[#545756] rounded-full text-sm py-1 px-3">Branding</div>
                                        <div className="border-[#E4E4E7] w-max bg-[#F4F4F5] border text-[#545756] rounded-full text-sm py-1 px-3">User Research</div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-[#E4E4E7] p-4">
                                    <div className="flex justify-between mb-2 items-center">
                                        <p className="font-normal text-[#7E8082] font-circular text-base">Budget</p>
                                        <div onClick={()=> {setActiveStep(4)}} className="">
                                            <PencilEdit className=""/>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-[#545756] font-medium font-circular text-base">50.5 ATOM</p>
                                </div>

                                <div className="rounded-lg border border-[#E4E4E7] p-4">
                                    <div className="flex justify-between mb-2 items-center">
                                        <p className="font-normal text-[#7E8082] font-circular text-base">Duration</p>
                                        <div onClick={()=> {setActiveStep(5)}} className="">
                                            <PencilEdit className=""/>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-[#545756] font-medium font-circular text-base">1 - 2 weeks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* success modal */}
            <Dialog >
                <DialogTrigger asChild>
                    <div ref={successModal} className="hidden">Edit Profile</div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-white">
                    <div className="flex flex-col items-center">
                        <ApplySuceess className="scale-75"/>

                        <p className="text-[20px] font-poppins font-semibold text-[#18181B] mt-5">Success! Your Job is Live</p>
                        
                        <div className="max-w-80">
                            <p className="font-circular text-[#545756] text-base text-center mt-5">Your job has been posted successfully. 
                            Freelancers can now view and apply to your project.</p>
                        </div>

                        <div className="">
                            <Button className="bg-[#E3FFEF] hover:bg-[#E3FFEF] pointer-events-none px-8 text-[#2ECC71] w-full mt-6 py-6">Redirecting...</Button>
                        </div>
                    </div>
            
                </DialogContent>
            </Dialog>

            {/* Wallet sign */}
            <Dialog>
                <DialogTrigger asChild>
                    <div ref={walletSignModal} className="hidden">Edit Profile</div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-white">
                    <div className="flex flex-col items-center">
                        <WalletSign className="scale-75"/>

                        <div className="max-w-80 flex items-center">
                            <span className="font-circular text-[#545756] text-base text-center mt-5">To post your job, please sign the transaction in your wallet. This will <span className="text-[#FB822F]">Lock 80%</span>  payment to a holding wallet.</span>
                        </div>

                        <div className="mt-2">
                            <Button onClick={(e)=> {e.preventDefault(); handleSuccess()}} className="text-white w-full mt-6 px-10">Sign message in your wallet</Button>
                        </div>
                        <span className="text-[#7E8082] text-sm font-normal mt-4 mb-2">Need help? <span className="text-primary">Contact support.</span></span>

                        <DialogClose className="hidden">
                            <div ref={walletSignModalClose} className="hidden">Close</div>
                        </DialogClose>
                    </div>
            
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PublishSection