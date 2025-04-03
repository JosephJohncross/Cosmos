import { useState, useRef, useEffect } from 'react';
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
import ConnectionPrompt from '../../components/xion/ConnectionPrompt';

// Import the corrected utilities
import {
  buildSubmitProposalMsg,
  buildGetJobDetailsQuery,
  formatJobForDisplay,
  getJobContractAddress,
} from '../../utils/contract-utils';

// Simplified form schema
const formSchema = z.object({
  coverLetter: z
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
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
});

const ApplyForJobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const successModal = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isConnected, address, executeContract, queryContract } =
    useXionWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);

  // Initialize form with simplified validation schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverLetter: '',
      bidAmount: '',
      email: '',
      phone: '',
    },
  });

  // Load job details directly using the correct query method
  useEffect(() => {
    console.log('Job ID from route:', jobId); // Debugging log

    if (!jobId) {
      setError('Invalid job ID. Please try again.');
      setIsLoading(false);
      return;
    }

    const loadJobDetails = async () => {
      if (!isConnected || !jobId) {
        setIsLoading(false);
        if (!isConnected) {
          setError('Please connect your wallet to view job details');
        } else if (!jobId) {
          setError('Invalid job ID');
        }
        return;
      }

      try {
        setIsLoading(true);
        const contractAddress = getJobContractAddress();
        const query = buildGetJobDetailsQuery(jobId);

        console.log('Fetching job details for ID:', jobId); // Debugging log
        console.log('Query:', JSON.stringify(query));

        const result = await queryContract(contractAddress, query);
        console.log('Job details result:', result);

        if (result) {
          // Format the job for display
          const formattedJob = formatJobForDisplay({
            ...result,
            id: jobId,
          });
          setJobDetails(formattedJob);
          setError(null);
        } else {
          setError(`Job with ID ${jobId} not found`);
        }
      } catch (err) {
        console.error('Error loading job details:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load job details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadJobDetails();
  }, [jobId, isConnected, queryContract]);

  // Simplified submit function
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isConnected || !address) {
      setError('Please connect your wallet to apply for this job');
      return;
    }

    if (!jobId) {
      setError('Job ID is missing');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const contractAddress = getJobContractAddress();
      const proposal = buildSubmitProposalMsg(
        jobId,
        data.bidAmount,
        data.coverLetter,
        address
      );

      const result = await executeContract(contractAddress, proposal);

      if (result) {
        setTxHash(result.transactionHash || 'Transaction completed');
        handleSuccess();
      } else {
        throw new Error('Failed to submit proposal');
      }
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to submit proposal'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle successful submission
  const handleSuccess = () => {
    if (successModal.current) {
      successModal.current.click();

      const timeout = setTimeout(() => {
        navigate(ApplicationRoutes.FREELANCER_DASHBOARD);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className='mt-32 px-5 mb-36'>
        <div className='max-w-screen-lg mx-auto w-full text-center'>
          <p>Loading job details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className='mt-32 px-5 mb-36'>
      <div className='max-w-screen-lg mx-auto w-full'>
        <div className='bg-white rounded-xl p-10'>
          <Link to={ApplicationRoutes.FREELANCER_DASHBOARD}>
            <LucideMoveLeft size={20} />
          </Link>

          <div className='mt-6'>
            <h2 className='text-2xl font-semibold mb-4'>
              Apply for {jobDetails?.title || 'Job'}
            </h2>

            {error && (
              <Alert className='mb-6 bg-red-50 border-red-200'>
                <AlertDescription className='text-red-800'>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='bidAmount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Amount (ATOM)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='0.1'
                          step='0.1'
                          placeholder='Enter your bid'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='coverLetter'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Why are you a good fit for this project?'
                          className='h-32'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='Your email address'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type='tel'
                          placeholder='Your phone number'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isConnected ? (
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                  </Button>
                ) : (
                  <ConnectionPrompt compact={true} />
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <div ref={successModal} className='hidden' />
        </DialogTrigger>
        <DialogContent>
          <div className='text-center'>
            <h3 className='text-lg font-semibold mb-2'>Proposal Submitted!</h3>
            <p className='mb-4'>
              Your proposal has been submitted successfully. You will be
              notified if selected.
            </p>
            {txHash && (
              <p className='text-xs text-gray-500 break-all'>
                Transaction: {txHash}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default ApplyForJobPage;
