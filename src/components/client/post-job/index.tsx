import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";

import { STEPPER_FORM_KEYS_FOR_FREELANCER_SETUP } from "../../../constants/freelancer-stepper-constant";
// import { StepperFormKeysType, StepperFormValues } from "../../../hooks/hook-stepper";
import { PostJobStepperFormKeysType, PostJobStepperFormValues } from "../../../hooks/post-job-stepper";

import { ApplicationRoutes } from "../../../routes/routes-constant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";
import { useToast } from "../../../hooks/use-toast";
import TitleSection from "./title";
import SkillSection from "./skills";
import DescriptionSection from "./project-description";
import BudgetSection from "./budget";
import TimelineSection from "./timeline";
import PublishSection from "./publish";

const PostAJobSteps = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [erroredInputName, setErroredInputName] = useState("");
    const methods = useForm<PostJobStepperFormValues>({
        mode: "onTouched",
    });
    const navigate = useNavigate()
    const {isNewFreelanceUser} = useAuth()

    const {toast} = useToast()

    const {
        trigger,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = methods;

    useEffect(() => {
        const erroredInputElement =
            document.getElementsByName(erroredInputName)?.[0];
        if (erroredInputElement instanceof HTMLInputElement) {
            erroredInputElement.focus();
            setErroredInputName("");
        }
    }, [erroredInputName]);

    const onSubmit = async (formData: PostJobStepperFormValues) => {
        console.log({ formData });
        // simulate api call
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                // resolve({
                //   title: "Success",
                //   description: "Form submitted successfully",
                // });
                reject({
                message: "There was an error submitting form",
                // message: "Field error",
                // errorKey: "fullName",
                });
            }, 2000);
        })
          .then(({ }) => {
            // toast({
            //   title,
            //   description,
            // });
          })
          .catch(({ message: errorMessage, errorKey }) => {
            if (
              errorKey &&
              Object.values(STEPPER_FORM_KEYS_FOR_FREELANCER_SETUP)
                .flatMap((fieldNames) => fieldNames)
                .includes(errorKey)
            ) {
                let erroredStep: number;
                // get the step number based on input name
                for (const [key, value] of Object.entries(STEPPER_FORM_KEYS_FOR_FREELANCER_SETUP)) {
                    if (value.includes(errorKey as never)) {
                    erroredStep = Number(key);
                    }
                }
                // set active step and error
                setActiveStep(erroredStep);
                setError(errorKey as PostJobStepperFormKeysType, {
                    message: errorMessage,
                });
                setErroredInputName(errorKey);
                } else {
                setError("root.formError", {
                    message: errorMessage,
                });
            }
          });
    };

    const handleNext = async () => {
        const isStepValid = await trigger(undefined, { shouldFocus: true });
        if (isStepValid) setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 1:
                return <TitleSection handleBack={handleBack} handleNext={handleNext}/>
            case 2:
                return <SkillSection handleBack={handleBack} handleNext={handleNext}/>;
            case 3:
                return <DescriptionSection handleBack={handleBack} handleNext={handleNext}/>;
            case 4:
                return <BudgetSection handleBack={handleBack} handleNext={handleNext}/>;
            case 5:
                return <TimelineSection handleBack={handleBack} handleNext={handleNext}/>;
            case 6:
                return <PublishSection setActiveStep={setActiveStep}/>;
          default:
            return "Unknown step";
        }
    }

    return (
        <>
            {/* Stepper indicator */}

            {errors.root?.formError && (
                <Alert variant="destructive" className="mt-[28px]">
                    {/* <ExclamationTriangleIcon className="h-4 w-4" /> */}
                    <AlertTitle>Form Error</AlertTitle>
                    <AlertDescription>{errors.root?.formError?.message}</AlertDescription>
                </Alert>
            )}

            <FormProvider {...methods}>
                <form noValidate>
                    {getStepContent(activeStep)}

                    <div className="flex justify-center space-x-[20px]">
                        {/* <Button
                            type="button"
                            className="w-[100px]"
                            variant="secondary"
                            onClick={handleBack}
                            disabled={activeStep === 1}
                        >
                            Back
                        </Button>

                        {activeStep === 5 ? (
                            <Button
                                className="w-[100px]"
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                            ) : (
                            <Button type="button" className="w-[100px]" onClick={handleNext}>
                                Next
                            </Button>
                        )} */}
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default PostAJobSteps