import { useFormContext } from 'react-hook-form';
import { PostJobStepperFormValues } from '../../../hooks/post-job-stepper';
import { Button } from '../../ui/button';
import { LucideChevronLeft, LucideCheck } from 'lucide-react';
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
  const [success, setSuccess] = useState(false);
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

      // Debug log to see what fields are available
      console.log('Form data before submission:', formData);

      const description = formData.description || '';

      // Check required fields with better logging
      const requiredFields = ['title', 'budget'];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (!description) {
        missingFields.push('description');
      }

      if (missingFields.length > 0) {
        console.log('Missing fields detected:', missingFields);
        throw new Error(
          `Please complete all required fields: ${missingFields.join(', ')}`
        );
      }

      // Format budget as integer (XIONs) - remove decimals
      let budgetStr = '0';
      if (formData.budget) {
        // Parse the budget as a number first
        const budgetNum = parseFloat(String(formData.budget));
        // Convert to integer by removing decimal places (contract expects whole numbers)
        budgetStr = Math.floor(budgetNum).toString();

        // Validate that budget is positive
        if (budgetNum <= 0) {
          throw new Error('Budget must be a positive number');
        }
      }

      // Safely prepare job data for the contract
      const jobData = {
        title: formData.title ? String(formData.title).trim() : '',
        description: description.trim(),
        budget: budgetStr, // Use the properly formatted budget value
        duration: formData.duration ? String(formData.duration).trim() : '',
        // Add these fields only if they exist in the form data
        ...(formData.category && {
          category: String(formData.category).trim(),
        }),
        ...(formData.location && {
          location: String(formData.location).trim(),
        }),
        client_address: address,
        // Handle skills array safely
        skills: Array.isArray(formData.skills)
          ? formData.skills
              .filter((skill) => skill !== null && skill !== undefined)
              .map((skill) => String(skill).trim())
              .filter(Boolean)
          : [],
      };

      console.log('Prepared job data for contract:', jobData);

      // Prepare the message for contract execution - FIXED: using PascalCase "PostJob" instead of snake_case "post_job"
      const msg = {
        PostJob: jobData, // Changed from "post_job" to "PostJob" to match contract expectations
      };

      const jobContractAddress =
        import.meta.env.VITE_JOB_CONTRACT_ADDRESS || '';

      if (!jobContractAddress) {
        throw new Error(
          'Job contract address is not configured in environment variables'
        );
      }

      console.log('Executing contract with message:', JSON.stringify(msg));
      console.log('Contract address:', jobContractAddress);

      // Execute the contract
      const result = await executeContract(jobContractAddress, msg);
      console.log('Contract execution result:', result);

      if (result) {
        setSuccess(true);

        // Show success state for a moment before navigating
        setTimeout(() => {
          navigate(ApplicationRoutes.CLIENT_DASHBOARD);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error publishing job:', error);

      // Improved error handling for contract transactions
      if (
        error.message?.includes('insufficient funds') ||
        error.message?.includes('spendable balance') ||
        error.message?.toLowerCase().includes('funds')
      ) {
        setError(
          'Transaction failed. This may be due to insufficient funds in the Xion treasury. Please contact support.'
        );
      } else {
        setError(error.message || 'Failed to publish job. Please try again.');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Display job summary for the client to review
  const renderJobSummary = () => {
    const formData = getValues();
    // Get description from the appropriate field (without project_description reference)
    const description = formData.description || '';

    return (
      <div className='bg-gray-50 p-4 rounded-md w-full max-w-md mb-8'>
        <h3 className='font-semibold mb-3'>Job Summary</h3>
        <div className='text-sm space-y-2'>
          <div>
            <span className='font-medium'>Title:</span>{' '}
            {formData?.title || 'Not provided'}
          </div>
          <div>
            <span className='font-medium'>Budget:</span>{' '}
            {formData?.budget || 'Not specified'} XION
          </div>
          <div>
            <span className='font-medium'>Duration:</span>{' '}
            {formData?.duration || 'Not specified'}
          </div>
          <div className='line-clamp-3'>
            <span className='font-medium'>Description:</span>{' '}
            {description || 'Not provided'}
          </div>
          {formData?.category && (
            <div>
              <span className='font-medium'>Category:</span> {formData.category}
            </div>
          )}
          {formData?.location && (
            <div>
              <span className='font-medium'>Location:</span> {formData.location}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className='mt-32 px-5 mb-36'>
      <div className='max-w-screen-lg mx-auto w-full'>
        <div className='flex flex-col items-center justify-center p-8 border border-gray-200 rounded-md'>
          <h2 className='text-2xl font-bold mb-6'>Ready to Publish</h2>

          {success ? (
            <div className='flex flex-col items-center justify-center mb-6'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <LucideCheck size={32} className='text-green-600' />
              </div>
              <p className='text-green-600 font-medium'>
                Job successfully published!
              </p>
              <p className='text-gray-500 text-sm mt-2'>
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
              <p className='text-gray-600 mb-8 text-center'>
                You're about to publish your job post. Your job will be visible
                to freelancers on the platform.
              </p>

              {renderJobSummary()}

              {!isConnected && (
                <div className='mb-6 p-4 bg-yellow-50 rounded-md text-yellow-800 w-full max-w-md text-center'>
                  Please connect your wallet to publish your job
                </div>
              )}

              {error && (
                <div className='mb-6 p-4 bg-red-50 rounded-md text-red-800 w-full max-w-md'>
                  <p className='font-medium'>Error:</p>
                  <p>{error}</p>
                  {error.includes('funds') && (
                    <p className='mt-2 text-sm'>
                      <strong>Need help?</strong> To complete this transaction,
                      you need XION tokens in your wallet for gas fees. You can
                      get XION tokens from the Xion testnet faucet.
                    </p>
                  )}
                </div>
              )}

              <div className='flex gap-4 w-full max-w-md'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleBack}
                  className='flex-1'
                  disabled={isPublishing}
                >
                  <LucideChevronLeft size={18} className='mr-2' />
                  Back
                </Button>

                <Button
                  type='button'
                  onClick={handlePublish}
                  disabled={isPublishing || isSubmitting || !isConnected}
                  className='flex-1 bg-primary text-white hover:bg-primary/90'
                >
                  {isPublishing ? 'Publishing...' : 'Publish Job'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default PublishSection;
