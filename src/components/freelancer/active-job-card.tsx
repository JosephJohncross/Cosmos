import FreelancCalendar from "../icons/freelance/freelance-calendar"
import { Button } from "../ui/button"

type ActiveJobCardProps = {

}

const ActiveJobCard = () => {
    return (
        <>
            <div className="">
                <div className="flex space-x-3">
                    <div className="h-8 rounded-full w-8 bg-primary flex items-center justify-center text-white font-poppins text-[24px] font-semibold">A</div>

                    <div className="">
                        <div className="flex justify-between items-center font-circular space-x-5">
                            <p className=" text-sm text-[#545756]">Web Designer - UIUX Role</p>
                                <span className="text-[#7E8082] text-sm "><span className="text-[#18181B]">50.5</span> ATOM</span>
                        </div>

                        <div className="flex items-center space-x-3 flex-wrap mt-1 font-circular">
                            <div className="flex items-center space-x-1">
                                <FreelancCalendar/>
                                <p className="font-circular text-[#7E8082] text-sm">1 - 2 weeks</p>
                            </div>

                            <p className="text-[#7E8082] text-xs">Now</p>

                            <div className="flex items-center space-x-1">
                                <span className="h-1 w-1 bg-[#2ECC71] block rounded-full"></span>
                                <p className="text-[#2ECC71] text-sm">Active</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex items-center space-x-5 font-circular text-sm mt-4">
                    <Button className="w-1/2 bg-white hover:bg-white rounded-full focus:bg-white border-[#FB822F] text-[#FB822F] border">Terminate</Button>
                    <Button className="w-1/2 bg-[#F4F4F5] hover:bg-[#F4F4F5] rounded-full focus:bg-[#F4F4F5] text-[#7E8082] border-[#E4E4E7] border">Accept pay</Button>
                </div>
            </div>
        </>
    )
}

export default ActiveJobCard