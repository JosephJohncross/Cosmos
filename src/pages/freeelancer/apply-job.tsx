import { Link } from "react-router-dom"
import { ApplicationRoutes } from "../../routes/routes-constant"
import { LucideMoveLeft, LucideMoveRight } from "lucide-react"

const ApplyForJobPage = () => {
    return (
        <>
            <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">
                    <div className="bg-white relative rounded-xl p-10 mt-9">
                        <Link to={ApplicationRoutes.FREELANCER_DASHBOARD}>
                            <LucideMoveLeft size={20}/>
                        </Link>

                        <div className="flex mt-6">
                            <div className="w-4/6">
                                <h2 className="font-poppins text-[24px] text-[#18181B] font-semibold">Application Form</h2>
                            </div>

                            <div className="w-2/6"></div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ApplyForJobPage