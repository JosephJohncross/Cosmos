import { useEffect, useRef, useState } from "react"
import PencilEdit from "../../icons/freelance/pencil-edit"
import { Button } from "../../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../components/ui/dialog"
import UploadSuccess from "../../icons/freelance/upload-success"
import { useAuth } from "../../../context/auth-context"
import { useNavigate } from "react-router-dom"
import { ApplicationRoutes } from "../../../routes/routes-constant"

type SubmitDetailsProps = {
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}

const SubmitDetails = ({setActiveStep}: SubmitDetailsProps) => {
    const successModal = useRef<HTMLDivElement>(null)
    const {setIsNewFreelanceUser} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0,0)
    }, [])

    const handleSuccess = () => {
        successModal.current.click()

        const timeout2 = setTimeout(() => {
            setIsNewFreelanceUser(false)
            navigate(ApplicationRoutes.FREELANCER_DASHBOARD)
        }, 3000)
    }
    
    return (
        <>
            <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">
                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Looking great, </span>Onesty!</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2 max-w-screen-md">Make any final edits, then submit your profile. You can continue to update it even after it goes live.</p>

                    <div className="bg-white relative rounded-xl p-10 mt-9">
                        <div className="flex justify-end">
                            <Button onClick={(e) => {e.preventDefault(); handleSuccess()}} className="text-sm font-medium font-circular rounded-md text-white">Submit profile</Button>
                        </div>

                        <div className="mt-6 grid grid-cols-9 gap-x-9">
                            <div className="col-span-3 flex flex-col gap-y-5">
                                <div className="rounded-lg items-center border border-[#E4E4E7] flex flex-col gap-y-3 p-4">
                                    <div className="relative">
                                        <img
                                            src={"/images/freelancer/file.svg"}
                                            alt="profile image"
                                            className="w-32 h-full"
                                        />
                                        
                                        <div onClick={()=> {setActiveStep(7)}} className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-full p-1">
                                            <PencilEdit className=""/>
                                        </div>
                                    </div>

                                    <p className="font-medium text-[#545756] font-circular text-[24px]">Onesty Ernest</p>

                                    <div className="flex space-x-2 items-center">
                                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.33398 15C4.80988 15.3431 3.83398 15.8703 3.83398 16.4614C3.83398 17.4953 6.81875 18.3333 10.5007 18.3333C14.1826 18.3333 17.1673 17.4953 17.1673 16.4614C17.1673 15.8703 16.1914 15.3431 14.6673 15" stroke="#7E8082" stroke-width="1.25" stroke-linecap="round"/>
                                        <path d="M12.5827 7.49996C12.5827 8.65054 11.6499 9.58329 10.4993 9.58329C9.34877 9.58329 8.41602 8.65054 8.41602 7.49996C8.41602 6.34937 9.34877 5.41663 10.4993 5.41663C11.6499 5.41663 12.5827 6.34937 12.5827 7.49996Z" stroke="#7E8082" stroke-width="1.25"/>
                                        <path d="M11.5472 14.578C11.2661 14.8486 10.8904 15 10.4995 15C10.1085 15 9.73285 14.8486 9.45177 14.578C6.87793 12.084 3.42867 9.29788 5.11077 5.25307C6.02027 3.06606 8.20347 1.66663 10.4995 1.66663C12.7955 1.66663 14.9787 3.06607 15.8882 5.25307C17.5682 9.29279 14.1273 12.0925 11.5472 14.578Z" stroke="#7E8082" stroke-width="1.25"/>
                                        </svg>

                                        <p className="text-[#7E8082] text-sm">Uyo, Akwa ibom</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-[#E4E4E7] p-4">
                                <div className="flex justify-between mb-2 items-center">
                                    <p className="font-medium text-[#545756] text-base font-circular">Language</p>
                                    <div onClick={()=> {setActiveStep(5)}} className="">
                                        <PencilEdit className=""/>
                                    </div>
                                </div>

                                <span className="text-[#7E8082] text-sm font-circular"><span className="text-[#545756]">English:</span> Fluent</span>
                                </div>

                                <div className="rounded-lg border border-[#E4E4E7] p-4">
                                <div className="flex justify-between mb-2 items-center">
                                    <p className="font-medium text-[#545756] font-circular text-lg">5 ATOM</p>
                                    <div onClick={()=> {setActiveStep(6)}} className="">
                                        <PencilEdit className=""/>
                                    </div>
                                </div>

                                <span className="text-[#7E8082] text-sm font-circular">Hourly rate</span>
                                </div>
                            </div>
                            
                            <div className="col-span-6 ">
                                <div className="rounded-lg border border-[#E4E4E7] p-4">
                                    <div className="flex justify-between mb-2 items-center">
                                        <p className="font-medium text-[#545756] font-circular text-lg">Skills</p>
                                        <div onClick={()=> {setActiveStep(3)}} className="">
                                            <PencilEdit className=""/>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 mt-4">
                                        <div className="border-[#E4E4E7] bg-[#F4F4F5] border text-[#545756] rounded-full text-sm py-1 px-3">Product Design</div>
                                        <div className="border-[#E4E4E7] bg-[#F4F4F5] border text-[#545756] rounded-full text-sm py-1 px-3">Branding</div>
                                        <div className="border-[#E4E4E7] bg-[#F4F4F5] border text-[#545756] rounded-full text-sm py-1 px-3">User Research</div>
                                    </div>
                                </div>

                                <div className=" mt-9 ">
                                    <div className="flex mb-6 justify-between items-center w-max space-x-5">
                                        <p className="font-medium text-[#545756] font-circular text-[20px]">Brand & UIUX Desiger</p>
                                        <div onClick={()=> {setActiveStep(4)}} className="">
                                            <PencilEdit className=""/>
                                        </div>
                                    </div>

                                    <div className="text-base font-circular text-[#7E8082]">
                                        <p className="">I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding of design principles and also possess exceptional skills designing products that enhances user experience for a wide range of users.</p>

                                        <p className="mt-3">My background in computer studies and design certification has equipped me with the skills and experience to infuse every project with a fresh perspective. In my free time, i listen to my cool playlist while exploring new ideas and staying up to date with the latest design trends to ensure my work remains at the forefront of innovation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Dialog >
                <DialogTrigger asChild>
                    <div ref={successModal} className="hidden">Edit Profile</div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-white">
                    <div className="flex flex-col items-center">
                        <UploadSuccess className="scale-75"/>

                        <p className="text-[20px] font-poppins font-semibold text-[#18181B] mt-5">Profile Updated</p>
                        
                        <div className="max-w-80">
                            <p className="font-circular text-[#545756] text-base text-center mt-5">Thanks for keeping your profile up to date! 
                            Let us know if you need anything else.</p>
                        </div>

                        <div className="">
                            <Button className="bg-[#E3FFEF] hover:bg-[#E3FFEF] pointer-events-none px-8 text-[#2ECC71] w-full mt-6 py-6">Redirecting...</Button>
                        </div>
                    </div>
            
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SubmitDetails