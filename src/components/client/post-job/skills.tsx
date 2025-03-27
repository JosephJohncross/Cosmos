import { LucideChevronLeft, LucideChevronRight, LucidePlus, LucideSearch } from "lucide-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { PostJobStepperFormValues } from "../../../hooks/post-job-stepper"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

type SkillSectionProps = {
    handleBack: () => void,
    handleNext: () => void
}

const dummySkills = [
    {
        name: "Branding",
        value: "branding"
    },
    {
        name: "Product Design",
        value: "product"
    },
    {
        name: "Branding",
        value: "branding"
    },
    {
        name: "Web Developer",
        value: "web"
    },
    {
        name: "Business Presentation",
        value: "bus"
    },
    {
        name: "Blockchain Analyst",
        value: "blockchain"
    },
    {
        name: "Electrical Engineer",
        value: "electrical"
    },
    {
        name: "Animation",
        value: "anime"
    },
    {
        name: "Software Developer",
        value: "software"
    },
    {
        name: "Marketing",
        value: "market"
    },
]
const SkillSection = ({handleBack, handleNext}: SkillSectionProps) => {

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
    
    
    return (
        <>
            <main className="mt-32 px-5 mb-36">
                <div className="max-w-screen-lg mx-auto w-full">
                    <p className="font-circular font-bold text-[#7E8082]">2/5</p>

                    <h1 className="font-poppins font-semibold text-[32px] mt-1"><span className="text-[#7E8082]">Almost there!</span> What skills are required for the project?</h1>

                    <p className="text-[#7E8082] font-circular text-base mt-2">The skills you select will help freelancers determine if they are well-equipped for this role.</p>

                    <div className="bg-white relative rounded-xl p-10 mt-9 pb-20">
                        <div className="w-3/4 relative">
                            <LucideSearch className="absolute text-[#545756] top-1/2 -translate-y-1/2 left-6" size={20}/>
                            <Input
                                placeholder="Search skills here"
                                onChange={(event) =>
                                    setValue("skills", [...getValues("skills"), event.target.value])
                                }
                                className="w-full py-6 placeholder:text-[#BEBEBE] font-circular pl-14 bg-transparent border border-gray-300"
                            />
                            <p className="absolute right-0 -bottom-8 font-circular text-sm text-[#7E8082]">Max 5 skills</p>
                        </div>
                        
                        <div className="mt-20">
                            <p className="text-base font-circular text-[#545756]">Suggested skills</p>

                            <div className="flex flex-wrap w-3/4 mt-6 gap-3">
                                { dummySkills.map(skill => {
                                    return (
                                        <div key={skill.value} className="rounded-full flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors font-circular text-base text-[#545756] border border-gray-200 py-2 px-4">
                                            <LucidePlus size={20}/>
                                            <p className="">{skill.name}</p>
                                        </div>
                                    )
                                })

                                }
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

export default SkillSection