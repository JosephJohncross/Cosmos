import { useFormContext } from "react-hook-form";
import { StepperFormValues } from "../../../hooks/hook-stepper";
import { Input } from "../../ui/input";
import { LucideChevronLeft, LucideChevronRight, LucidePlus, LucideSearch, X } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { MultiSelector } from "../../ui/multi-select";

type SkillsDetailsProps = {
  handleBack: () => void;
  handleNext: () => void;
};

const dummySkills = [
  "Branding",
  "Product Design",
  "Web Developer",
  "Business Presentation",
  "Blockchain Analyst",
  "Electrical Engineer",
  "Animation",
  "Software Developer",
  "Marketing"
];

const SkillsDetails = ({ handleBack, handleNext }: SkillsDetailsProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const {
    setValue,
    getValues,
  } = useFormContext<StepperFormValues>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Update form value when selectedSkills changes
    setValue("skills", selectedSkills);
  }, [selectedSkills, setValue]);

  const handleAddSkill = (skill: string) => {
    if (selectedSkills.length >= 5) return;
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext(); // Or whatever you want to do on form submission
  };

  return (
    <>
      <main className="mt-32 px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">2/5</p>

          <h1 className="font-poppins font-semibold text-[32px] mt-1">
            <span className="text-[#7E8082]">Almost there!</span> What work are you here to do?
          </h1>

          <p className="text-[#7E8082] font-circular text-base mt-2">
            Your skills show clients what you can do and help us suggest the best jobs for you.
          </p>
          <p className="text-[#7E8082] font-circular text-base ">
            <span className="text-[#545756]">Add, remove, or search for skills.</span> It's your choice!
          </p>

          <form onSubmit={handleFormSubmit}>
            <div className="bg-white relative rounded-xl p-10 mt-9 pb-20">
                <div className="w-3/4">
                    <MultiSelector
                        selected={selectedSkills}
                        onChange={setSelectedSkills}
                        maxSelections={5}
                    />
                    <div className="flex justify-end">
                        <p className="font-circular text-sm text-[#7E8082] mt-2">Max 5 skills</p>

                    </div>
                </div>

                <div className="mt-20">
                <p className="text-base font-circular text-[#545756]">Suggested skills</p>

                <div className="flex flex-wrap w-3/4 mt-6 gap-3">
                    {dummySkills.map((skill) => (
                    <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddSkill(skill)}
                        disabled={selectedSkills.length >= 5}
                        className={`rounded-full flex items-center space-x-2 cursor-pointer transition-colors font-circular text-base ${
                        selectedSkills.includes(skill)
                            ? "bg-primary text-white"
                            : "text-[#545756] hover:text-primary border border-gray-200"
                        } py-2 px-4`}
                    >
                        {!selectedSkills.includes(skill) && <LucidePlus size={20} />}
                        <p>{skill}</p>
                    </button>
                    ))}
                </div>
                </div>

                <div className="absolute flex items-center bottom-5 right-5 font-circular font-medium space-x-3">
                <Button
                    onClick={(e) =>{e.preventDefault(); handleBack()}}
                    className="flex hover:bg-white/80 items-center space-x-3 text-primary bg-transparent border border-primary"
                >
                    <LucideChevronLeft />
                    <p className="">Back</p>
                </Button>

                <Button
                    onClick={(e) =>{e.preventDefault(); handleNext()}}
                    className="flex items-center space-x-3 bg-primary text-white"
                >
                    <p className="">Next</p>
                    <LucideChevronRight />
                </Button>
                </div>
            </div>
          </form>

        </div>
      </main>
    </>
  );
};

export default SkillsDetails;