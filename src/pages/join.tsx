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

const JoinPage = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(true); // Open the dialog when the component mounts
    }, []);

    return (
        <>
            <main className="app-container mt-10">
                {/* <div ref={clientTypeModal} className="hidden"></div> */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <div className="hidden">Edit Profile</div>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-poppins font-semibold text-[20px]">Join as a Client or Freelancer</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-y-4">
                            <div className="border-gray-300 rounded-md p-4 flex justify-between">
                                <div className="flex space-x-3">
                                    <LaptopIcon className=""/>

                                    <div className="">
                                        <p className="font-poppins font-semibold text-base text-[#545756]">I'm a Client</p>
                                        <p className="text-[14px] text-[#7E8082] font-normal">Hiring skill professionals</p>
                                    </div>
                                </div>

                                <div className="h-2 w-2 rounded-full border-gray-300"></div>
                            </div>
                        </div>
                
                    </DialogContent>
                </Dialog>
            </main>
        </>
    )
}

export default JoinPage