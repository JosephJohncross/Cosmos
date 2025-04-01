import { useFormContext } from 'react-hook-form';
import { PostJobStepperFormValues } from '../../../hooks/post-job-stepper';
import { Button } from '../../ui/button';
import { LucideChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useXionWallet } from '../../../context/xion-context';
import { useNavigate } from 'react-router-dom';
import { ApplicationRoutes } from '../../../routes/routes-constant';

type PublishSectionProps = {
  handleBack: () => void;
};

const PublishSection = ({ handleBack }: PublishSectionProps) => {
  const {
    getValues,
    formState: { isSubmitting },
  } = useFormContext<PostJobStepperFormValues>();

  const { isConnected, address, executeContract } = useXionWallet();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePublish = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet to publish your job');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const formData = getValues();
      // Format your job post data
      const jobData = {
        title: formData.title,
        description: formData.description,
        skills: formData.skills,
        budget: {
          amount: formData.budget.toString(),
          currency: 'ATOM',
        },
        // Removed timeline property as it does not exist on PostJobStepperFormValues
      };

      // Replace with your actual job contract address using env variable
      const jobContractAddress =
        import.meta.env.VITE_JOB_CONTRACT_ADDRESS || '';

      const msg = {
        create_job: {
          ...jobData,
          owner: address,
        },
      };

      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        // On success, navigate to the dashboard or show a success message
        navigate(ApplicationRoutes.CLIENT_DASHBOARD);
      }
    } catch (error: any) {
      console.error('Error publishing job:', error);
      setError(error.message || 'Failed to publish job');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className='mt-32 px-5 mb-36'>
      <div className='max-w-screen-lg mx-auto w-full'>
        <div className='flex flex-col items-center justify-center p-8 border border-gray-200 rounded-md'>
          <h2 className='text-2xl font-bold mb-6'>Ready to Publish</h2>
          <p className='text-gray-600 mb-8 text-center'>
            You're about to publish your job post. Your job will be visible to
            freelancers on the platform.
          </p>

          {!isConnected && (
            <div className='mb-6 p-4 bg-yellow-50 rounded-md text-yellow-800 w-full max-w-md text-center'>
              Please connect your wallet to publish your job
            </div>
          )}

          {error && (
            <div className='mb-6 p-4 bg-red-50 rounded-md text-red-800 w-full max-w-md text-center'>
              {error}
            </div>
          )}

          <div className='flex gap-4 w-full max-w-md'>
            <Button
              type='button'
              variant='outline'
              onClick={handleBack}
              className='flex-1'
            >
              <LucideChevronLeft size={18} className='mr-2' />
              Back
            </Button>

            <Button
              type='button'
              onClick={handlePublish}
              disabled={isPublishing || isSubmitting || !isConnected}
              className='flex-1'
            >
              {isPublishing ? 'Publishing...' : 'Publish Job'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublishSection;
