import NewUserIcon from "../../icons/join/new-user"
import { Button } from "../../ui/button"

const NewUsersStartPage = ({handleNext}: { handleNext: () => void}) => {
    return (
        <>
            <main className="mt-32 px-4">
                <div className="max-w-lg rounded-xl bg-white mx-auto w-full p-10">
                    <h1 className="font-poppins font-semibold text-[32px] text-center">Hi Onesty</h1>

                    <div className="font-circular text-[#7E8082] flex flex-col items-center mt-2">
                        <span className="">Welcome to <span className="text-[#545756]">Work,</span></span>
                        <p className="">Let’s setup your account for you.</p>
                    </div>

                    <div className="flex justify-center w-full py-5">
                        <NewUserIcon className="max-w-16"/>
                    </div>

                    <div className="w-full">
                        <Button onClick={handleNext} className="w-full font-circular bg-primary text-white rounded-md py-5">Get started</Button>
                    </div>

                    <p className="text-center mt-4 text-sm font-circular text-[#545756]">It only takes 5–10 minutes, and you can always make edits later. 
                    We’ll save your progress automatically as you go.</p>
                </div>
            </main> 
        </>
    )
}

export default NewUsersStartPage