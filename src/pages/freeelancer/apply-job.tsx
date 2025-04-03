import { zodResolver } from '@hookform/resolvers/zod';
import { LucideMoveLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PhoneInput } from '../../components/freelancer/phone-input';
import ApplicantIcon from '../../components/icons/freelance/applicant-icon';
import ApplySuceess from '../../components/icons/freelance/apply-success';
import FreelancCalendar from '../../components/icons/freelance/freelance-calendar';
import LocationIcon from '../../components/icons/freelance/location-icon';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ApplicationRoutes } from '../../routes/routes-constant';
import { useXionWallet } from '../../context/xion-context';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  phone: z.string().min(2, {
    message: 'please provide a valid phone number',
  }),
  email: z
    .string()
    .min(2, {
      message: 'Email is required',
    })
    .email({ message: 'Please provide a valid email' }),
  message: z
    .string({
      required_error: 'Please provide a message to the client',
    })
    .min(10, {
      message: 'Message should be at least 10 characters',
    }),
  bidAmount: z
    .string()
    .min(1, {
      message: 'Bid amount is required',
    })
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
      message: 'Bid amount must be a positive number',
    }),
});

const ApplyForJobPage = () => {
  const successModal = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isConnected, address, executeContract } = useXionWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  // Get the job ID from URL if available, otherwise use a default
  // In a real app, you'd get this from URL parameters
  const currentJobId = '1'; // This should come from route params

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      email: '',
      message: '',
      bidAmount: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isConnected || !address) {
      setError('Please connect your wallet to apply for this job');
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

      // Prepare the proposal data with bid_amount as a string
      const proposal = {
        submit_proposal: {
          job_id: parseInt(currentJobId),
          bid_amount: data.bidAmount.toString(), // ensure Uint128 is passed as a string
          cover_letter: data.message,
        },
      };

      // Execute contract call
      const result = await executeContract(jobContractAddress, proposal);

      if (result) {
        setTxHash(result.transactionHash || 'Transaction completed');
        setJobId(currentJobId);
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
    successModal.current?.click();

    const timeout2 = setTimeout(() => {
      navigate(ApplicationRoutes.FREELANCER_DASHBOARD);
    }, 3000);
  };

  return (
    <>
      <main className='mt-32 px-5 mb-36'>
        <div className='max-w-screen-lg mx-auto w-full'>
          <div className='bg-white relative rounded-xl p-10 mt-9'>
            <Link to={ApplicationRoutes.FREELANCER_DASHBOARD}>
              <LucideMoveLeft size={20} />
            </Link>

            <div className='flex mt-6 gap-x-9'>
              <div className='w-3/5'>
                <h2 className='font-poppins text-[24px] text-[#18181B] font-semibold'>
                  Application Form
                </h2>
                <p className='text-[#7E8082] font-circular text-base'>
                  Please share your contact details and bid information to apply
                  for this job.
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
                              Email address
                            </FormLabel>

                            <FormControl>
                              <Input
                                className='bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]'
                                placeholder='your@email.com'
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
                            <FormLabel className='text-[#545756] text-sm font-normal font-circular'>
                              Phone Number*
                            </FormLabel>
                            <FormControl>
                              <PhoneInput {...field} />
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
                            <FormLabel className='text-[#545756] font-normal font-circular'>
                              Your Bid (ATOM)
                            </FormLabel>

                            <FormControl>
                              <Input
                                className='bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]'
                                placeholder='50.5'
                                type='number'
                                step='0.01'
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
                            <FormLabel className='text-[#545756] font-normal font-circular'>
                              Cover Letter
                            </FormLabel>

                            <FormControl>
                              <Textarea
                                className='bg-white h-32 resize-none placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE] placeholder:text-sm'
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
                              <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M2.08398 6.82247C2.1707 5.0727 2.43013 3.98176 3.20618 3.2057C3.98225 2.42964 5.07319 2.17021 6.82296 2.0835M17.9173 6.82247C17.8306 5.0727 17.5712 3.98176 16.7952 3.2057C16.0191 2.42964 14.9281 2.17021 13.1783 2.0835M13.1783 17.9168C14.9281 17.8301 16.0191 17.5706 16.7952 16.7946C17.5712 16.0186 17.8306 14.9276 17.9173 13.1778M6.82295 17.9168C5.07319 17.8301 3.98225 17.5706 3.20618 16.7946C2.43013 16.0186 2.1707 14.9276 2.08398 13.1778'
                                  stroke='#7E8082'
                                  stroke-width='1.25'
                                  stroke-linecap='round'
                                  stroke-linejoin='round'
                                />
                                <path
                                  d='M7.91715 8.79548C7.91715 8.09406 7.80699 7.0112 8.2305 6.3798C9.1659 4.9852 11.1505 5.17046 11.8505 6.5317C12.1941 7.1998 12.0646 8.13385 12.0805 8.79548M7.91715 8.79548C6.83604 8.79548 6.61584 9.41439 6.4505 9.89981C6.29788 10.4459 6.1425 11.7498 6.3805 13.1786C6.55856 14.0887 7.25448 14.4891 7.85296 14.5398C8.42532 14.5883 10.8419 14.5698 11.5415 14.5698C12.6256 14.5698 13.3025 14.3315 13.6205 13.2392C13.7732 12.3897 13.8149 10.8706 13.5605 9.89981C13.2235 8.92889 12.5441 8.79548 12.0805 8.79548M7.91715 8.79548C9.06182 8.75006 11.4261 8.75906 12.0805 8.79548'
                                  stroke='#7E8082'
                                  stroke-width='1.25'
                                  stroke-linecap='round'
                                />
                              </svg>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className='text-xs font-circular font-normal' />
                      </FormItem>

                      <div className='mt-7'>
                        <Button
                          type='submit'
                          className='text-white w-full'
                          disabled={isSubmitting || !isConnected}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Submitting...
                            </>
                          ) : (
                            'Submit Application'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>

              <div className='w-2/5 font-circular'>
                <div className='bg-[#F4F4F5] border border-[#E4E4E7] rounded-md p-4 py-6'>
                  <div className='bg-white p-3 px-4 rounded-md'>
                    <p className='text-[#7E8082] text-sm font-normal'>
                      Posted 3 hours ago
                    </p>
                    <p className='text-[#18181B] text-lg font-medium'>
                      Web Designer - UIUX
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
                          d='M13.125 3.75C13.7463 3.75 14.25 4.25368 14.25 4.875C14.25 5.49632 13.7463 6 13.125 6C12.5037 6 12 5.49632 12 4.875C12 4.25368 12.5037 3.75 13.125 3.75Z'
                          stroke='#545756'
                          stroke-width='1.125'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M2.08067 8.35792C1.32831 9.19822 1.31213 10.4659 2.00262 11.3578C3.37283 13.1275 4.87256 14.6272 6.64225 15.9973C7.53405 16.6879 8.80178 16.6717 9.64208 15.9193C11.9234 13.8766 14.0126 11.7419 16.0289 9.39592C16.2283 9.16402 16.3529 8.87978 16.3809 8.5752C16.5047 7.22849 16.7589 3.3485 15.7052 2.2948C14.6515 1.24111 10.7715 1.49533 9.4248 1.61907C9.12023 1.64706 8.83598 1.77175 8.604 1.97108C6.25809 3.98734 4.12336 6.07658 2.08067 8.35792Z'
                          stroke='#545756'
                          stroke-width='1.125'
                        />
                        <path
                          d='M10.3413 9.2749C10.3573 8.97415 10.4417 8.42395 9.98438 8.00583M9.98438 8.00583C9.84285 7.87645 9.6495 7.75968 9.38618 7.66683C8.44373 7.33468 7.28613 8.44645 8.10503 9.46413C8.5452 10.0111 8.88458 10.1794 8.85263 10.8006C8.83013 11.2376 8.4009 11.6941 7.83518 11.868C7.3437 12.0191 6.80157 11.8191 6.45867 11.4359C6.03999 10.9681 6.08228 10.527 6.07869 10.3348M9.98438 8.00583L10.5005 7.48975M6.49598 11.4942L6.00586 11.9844'
                          stroke='#545756'
                          stroke-width='1.125'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                      <p className='text-[#7E8082]'>Funding</p>
                      <p className='text-[#545756] font-medium'>50.5 ATOM</p>
                    </div>

                    <div className='flex items-center space-x-2 text-sm'>
                      <ApplicantIcon />
                      <p className='text-[#7E8082]'>Applicants</p>
                      <p className='text-[#545756] font-medium'>5 to 10</p>
                    </div>

                    <div className='flex items-center space-x-2 text-sm'>
                      <FreelancCalendar />
                      <p className='text-[#7E8082]'>Estimated Time</p>
                      <p className='text-[#545756] font-medium'>1 - 3 weeks</p>
                    </div>

                    <div className='flex items-center space-x-2 text-sm'>
                      <LocationIcon />
                      <p className='text-[#7E8082]'>Location</p>
                      <p className='text-[#545756] font-medium'>Canada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
