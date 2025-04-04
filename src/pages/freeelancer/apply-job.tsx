import { useEffect, useRef, useState } from 'react';
import { LucideMoveLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ApplicationRoutes } from '../../routes/routes-constant';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { useXionWallet } from '../../context/xion-context';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import FreelancCalendar from '../../components/icons/freelance/freelance-calendar';
import LocationIcon from '../../components/icons/freelance/location-icon';
import ApplicantIcon from '../../components/icons/freelance/applicant-icon';
import ApplySuceess from '../../components/icons/freelance/apply-success';
import { useJobContract } from '../../hooks/useJobContract';
import ConnectionPrompt from '../../components/xion/ConnectionPrompt';

// Form schema for the job application that matches contract requirements
const formSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Cover letter must be at least 10 characters')
    .max(2000, 'Cover letter cannot exceed 2000 characters'),
  bidAmount: z
    .string()
    .min(1, 'Please enter a bid amount')
    .refine((val) => !isNaN(Number(val)), {
      message: 'Bid amount must be a valid number',
    })
    .refine((val) => Number(val) > 0, {
      message: 'Bid amount must be greater than 0',
    }),
});

const ApplyForJobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const successModal = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isConnected, address, executeContract } = useXionWallet();
  const { rawJobs: jobs, isLoading: loadingJobs, refetch } = useJobContract();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      email: '',
      message: '',
      bidAmount: '',
    },
  });

  // Force fetch jobs on component mount
  useEffect(() => {
    console.log('Apply job component mounted, forcing job fetch');
    if (isConnected) {
      refetch();
    }
  }, [isConnected, refetch]);

  // Enhanced useEffect for better job loading
  useEffect(() => {
    window.scrollTo(0, 0);

    console.log('Jobs data in apply page:', jobs);
    console.log('Looking for job ID:', jobId);

    if (jobs && jobs.length > 0 && jobId) {
      const job = jobs.find((j) => j.id === jobId);
      console.log('Found job?', job ? 'Yes' : 'No', job);

      if (job) {
        setJobDetails({
          ...job,
          timePosted: formatTimePosted(job.created_at),
          role: job.title || 'Untitled Job',
          location: job.location || 'Remote',
          applicants: '0 to 5',
          funding: `${job.budget || '0'} ATOM`,
          hourlyPay: calculateHourlyRate(job.budget || '0', job.duration || ''),
        });
      } else if (loadAttempts < 3) {
        // If job not found and we haven't tried too many times yet
        console.log(
          `Job with ID ${jobId} not found, attempt ${loadAttempts + 1}/3`
        );
        setLoadAttempts((prev) => prev + 1);
        // Try to refetch
        setTimeout(() => {
          refetch();
        }, 1000);
      } else {
        console.error(`Job with ID ${jobId} not found after multiple attempts`);
        setError(
          'Job not found. Please go back to the dashboard and try again.'
        );
      }
    } else if (!isConnected) {
      setError('Please connect your wallet to view job details');
    } else if (jobs && jobs.length === 0 && !loadingJobs && loadAttempts < 3) {
      // No jobs loaded yet, try to fetch them
      console.log('No jobs found, attempting to fetch', loadAttempts + 1);
      setLoadAttempts((prev) => prev + 1);
      setTimeout(() => {
        refetch();
      }, 1000);
    }
  }, [jobs, jobId, isConnected, refetch, loadingJobs, loadAttempts]);

  // Helper functions for formatting job details
  const formatTimePosted = (timestamp?: number): string => {
    if (!timestamp) return 'Recently';

    const now = new Date();
    const postDate = new Date(timestamp * 1000);
    const diffHours = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const calculateHourlyRate = (budget: string, duration: string): string => {
    const budgetNum = parseFloat(budget) || 0;
    return (budgetNum / 40).toFixed(1); // Assume 40 hours of work
  };

  // Function to handle job application submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isConnected || !address) {
      setError('Please connect your wallet to apply for this job');
      return;
    }

    if (!jobId) {
      setError('Job ID is missing. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Get contract address from environment variable
      const jobContractAddress =
        import.meta.env.VITE_JOB_CONTRACT_ADDRESS || '';

      if (!jobContractAddress) {
        throw new Error('Job contract address not configured');
      }

      console.log(`Preparing proposal for job #${jobId}`);

      // Format proposal to match contract expectations - using SubmitProposal
      const proposal = {
        SubmitProposal: {
          job_id: parseInt(jobId),
          bid_amount: data.bidAmount,
          cover_letter: data.message,
          contact_info: {
            email: data.email,
            phone: data.phone || '',
          },
          freelancer_address: address,
        },
      };

      console.log('Submitting proposal to contract:', proposal);

      // Execute contract call
      const result = await executeContract(jobContractAddress, proposal);

      if (result) {
        console.log('Proposal submitted successfully:', result);
        setTxHash(result.transactionHash || 'Transaction completed');
        handleSuccess();
      } else {
        throw new Error('Failed to submit proposal');
      }
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = () => {
    if (successModal.current) {
      successModal.current.click();

      const timeout2 = setTimeout(() => {
        navigate(ApplicationRoutes.FREELANCER_DASHBOARD);
      }, 3000);

      return () => clearTimeout(timeout2);
    }
  };

  if (loadingJobs) {
    return (
      <main className='mt-32 px-5 mb-36'>
        <div className='max-w-screen-lg mx-auto w-full text-center'>
          <p>Loading job details...</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className='mt-32 px-5 mb-36'>
        <div className='max-w-screen-lg mx-auto w-full'>
          <div className='bg-white relative rounded-xl p-10 mt-9'>
            <Link to={ApplicationRoutes.FREELANCER_DASHBOARD}>
              <LucideMoveLeft size={20} />
            </Link>

            {!jobDetails && !loadingJobs && error ? (
              <div className='py-10 text-center'>
                <Alert className='bg-red-50 border-red-200'>
                  <AlertDescription className='text-red-800'>
                    {error}
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() =>
                    navigate(ApplicationRoutes.FREELANCER_DASHBOARD)
                  }
                  className='mt-4 bg-primary text-white'
                >
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <div className='flex mt-6 gap-x-9'>
                <div className='w-3/5'>
                  <h2 className='font-poppins text-[24px] text-[#18181B] font-semibold'>
                    Application Form for{' '}
                    {jobDetails?.title || jobDetails?.role || 'Job'}
                  </h2>
                  <p className='text-[#7E8082] font-circular text-base'>
                    Please share your contact details and bid information to
                    apply for this job.
                  </p>

                  {!isConnected && (
                    <Alert className='mt-6 bg-yellow-50 border-yellow-200'>
                      <AlertDescription className='text-yellow-800'>
                        Please connect your wallet to apply for this job
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert className='mt-6 bg-red-50 border-red-200'>
                      <AlertDescription className='text-red-800'>
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className='mt-12'>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-y-5'
                      >
                        <FormField
                          control={form.control}
                          name='email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-[#545756] font-circular font-normal'>
                                Email Address
                              </FormLabel>

                              <FormControl>
                                <Input
                                  placeholder='Your email address'
                                  className='bg-[#F4F4F5] placeholder:font-circular border-gray-300 font-circular placeholder:text-[#7E8082]'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-xs font-circular font-normal' />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='phone'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-[#545756] font-circular font-normal'>
                                Phone Number (optional)
                              </FormLabel>

                              <FormControl>
                                <Input
                                  placeholder='Your phone number'
                                  className='bg-[#F4F4F5] placeholder:font-circular border-gray-300 font-circular placeholder:text-[#7E8082]'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-xs font-circular font-normal' />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='bidAmount'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-[#545756] font-circular font-normal'>
                                Bid Amount (ATOM)
                              </FormLabel>

                              <FormControl>
                                <Input
                                  placeholder='Enter your bid in ATOM'
                                  className='bg-[#F4F4F5] placeholder:font-circular border-gray-300 font-circular placeholder:text-[#7E8082]'
                                  type='number'
                                  min='0.1'
                                  step='0.1'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-xs font-circular font-normal' />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='message'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-[#545756] font-circular font-normal'>
                                Cover Letter
                              </FormLabel>

                              <FormControl>
                                <Textarea
                                  className='h-28 bg-[#F4F4F5] placeholder:font-circular border-gray-300 font-circular placeholder:text-[#7E8082] resize-none'
                                  placeholder="Introduce yourself, describe your relevant experience, and explain why you're a good fit for this project."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='text-xs font-circular font-normal' />
                            </FormItem>
                          )}
                        />

                        <FormItem>
                          <FormLabel className='text-[#545756] font-circular font-normal'>
                            ATOM wallet address
                          </FormLabel>

                          <FormControl>
                            <div className='relative'>
                              <Input
                                disabled
                                value={address || 'Please connect wallet'}
                                className='bg-[#F4F4F5] placeholder:font-circular border-gray-300 font-circular placeholder:text-[#7E8082]'
                              />

                              <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                                {isConnected ? (
                                  <svg
                                    width='20'
                                    height='20'
                                    viewBox='0 0 20 20'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M16.875 5L7.5 14.375L3.125 10'
                                      stroke='#2ECC71'
                                      strokeWidth='1.25'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />
                                  </svg>
                                ) : (
                                  <div className='text-yellow-500'>!</div>
                                )}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>

                        {!isConnected ? (
                          <div className='mt-4'>
                            <ConnectionPrompt compact={true} />
                          </div>
                        ) : (
                          <Button
                            type='submit'
                            className='bg-primary text-white mt-4'
                            disabled={isSubmitting}
                          >
                            {isSubmitting
                              ? 'Submitting...'
                              : 'Submit Application'}
                          </Button>
                        )}
                      </form>
                    </Form>
                  </div>
                </div>

                <div className='w-2/5'>
                  {jobDetails ? (
                    <>
                      <div className='bg-white p-3 px-4 rounded-md'>
                        <p className='text-[#7E8082] text-sm font-normal'>
                          {jobDetails.timePosted || 'Recently posted'}
                        </p>
                        <p className='text-[#18181B] text-lg font-medium'>
                          {jobDetails.title || jobDetails.role || 'Job Title'}
                        </p>
                      </div>

                      <div className='mt-4 flex flex-col gap-y-3'>
                        <div className='flex items-center space-x-2 text-sm'>
                          <svg
                            width='18'
                            height='18'
                            viewBox='0 0 18 18'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M2.08067 8.35792C1.32831 9.19822 1.31213 10.4659 2.00262 11.3578C3.37283 13.1275 4.87256 14.6272 6.64225 15.9973C7.53405 16.6879 8.80178 16.6717 9.64208 15.9193C11.9234 13.8766 14.0126 11.7419 16.0289 9.39592C16.2283 9.16402 16.3529 8.87978 16.3809 8.5752C16.5047 7.22849 16.7589 3.3485 15.7052 2.2948C14.6515 1.24111 10.7715 1.49533 9.4248 1.61907C9.12023 1.64706 8.83598 1.77175 8.604 1.97108C6.25809 3.98734 4.12336 6.07658 2.08067 8.35792Z'
                              stroke='#545756'
                              strokeWidth='1.125'
                            />
                            <path
                              d='M10.3413 9.2749C10.3573 8.97415 10.4417 8.42395 9.98438 8.00583M9.98438 8.00583C9.84285 7.87645 9.6495 7.75968 9.38618 7.66683C8.44373 7.33468 7.28613 8.44645 8.10503 9.46413C8.5452 10.0111 8.88458 10.1794 8.85263 10.8006C8.83013 11.2376 8.4009 11.6941 7.83518 11.868C7.3437 12.0191 6.80157 11.8191 6.45867 11.4359C6.03999 10.9681 6.08228 10.527 6.07869 10.3348M9.98438 8.00583L10.5005 7.48975M6.49598 11.4942L6.00586 11.9844'
                              stroke='#545756'
                              strokeWidth='1.125'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                          <p className='text-[#7E8082]'>Funding</p>
                          <p className='text-[#545756] font-medium'>
                            {jobDetails?.funding || '50 ATOM'}
                          </p>
                        </div>

                        <div className='flex items-center space-x-2 text-sm'>
                          <ApplicantIcon />
                          <p className='text-[#7E8082]'>Applicants</p>
                          <p className='text-[#545756] font-medium'>
                            {jobDetails?.applicants || '0 to 5'}
                          </p>
                        </div>

                        <div className='flex items-center space-x-2 text-sm'>
                          <FreelancCalendar />
                          <p className='text-[#7E8082]'>Estimated Time</p>
                          <p className='text-[#545756] font-medium'>
                            {jobDetails?.duration || '1 - 3 weeks'}
                          </p>
                        </div>

                        <div className='flex items-center space-x-2 text-sm'>
                          <LocationIcon />
                          <p className='text-[#7E8082]'>Location</p>
                          <p className='text-[#545756] font-medium'>
                            {jobDetails?.location || 'Remote'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='bg-white p-3 px-4 rounded-md'>
                      <p className='text-[#7E8082] text-base'>
                        Loading job details...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog>
        <DialogTrigger asChild>
          <div ref={successModal} className='hidden'>
            Edit Profile
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white'>
          <div className='flex flex-col items-center'>
            <ApplySuceess className='scale-75' />

            <p className='text-[20px] font-poppins font-semibold text-[#18181B] mt-5'>
              Application Submitted!
            </p>

            <div className='max-w-80'>
              <p className='font-circular text-[#545756] text-base text-center mt-5'>
                Thank you for applying! We've received your proposal for job #
                {jobId} and will notify you if you're selected.
              </p>

              {txHash && (
                <p className='mt-2 text-xs text-gray-600 break-all text-center'>
                  Transaction: {txHash}
                </p>
              )}
            </div>

            <div className=''>
              <Button className='bg-[#E3FFEF] hover:bg-[#E3FFEF] pointer-events-none px-8 text-[#2ECC71] w-full mt-6 py-6'>
                Redirecting...
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplyForJobPage;
