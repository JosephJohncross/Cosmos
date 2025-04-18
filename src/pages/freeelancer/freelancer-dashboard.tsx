import { useEffect, useRef, useState } from 'react';
import { ApplicationRoutes } from '../../routes/routes-constant';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { LucideMoveLeft, LucideSearch } from 'lucide-react';
import { Input } from '../../components/ui/input';
import ProjectListingComponent from '../../components/freelancer/project-listing-component';
import NotificationCard from '../../components/freelancer/notification-card';
import NoJobIcon from '../../components/icons/freelance/no-job-icon';
import { Button } from '../../components/ui/button';
import ActiveJobCard from '../../components/freelancer/active-job-card';
import { useXionWallet } from '../../context/xion-context';
import ConnectionPrompt from '../../components/xion/ConnectionPrompt';
import XionBalance from '../../components/xion/XionBalance';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetClose,
} from '../../components/ui/sheet';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../../components/ui/dialog';
import TerminateContract from '../../components/icons/freelance/terminate-contract';
import AcceptPayment from '../../components/icons/freelance/accept-payment';
import { Alert, AlertDescription } from '../../components/ui/alert';
import ApplySuceess from '../../components/icons/freelance/apply-success';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import AppliedJobs from '../../components/freelancer/applied-jobs';

// Import the utilities
import {
  buildGetJobDetailsQuery,
  buildAcceptPaymentMsg,
  buildTerminateContractMsg,
  buildCompleteJobMsg,
  buildGetPaymentStatusQuery,
  formatJobForDisplay,
  getJobContractAddress,
} from '../../utils/contract-utils';

// Job interface for better type safety
interface Job {
  id: string;
  title?: string;
  role?: string;
  description?: string;
  detail?: string;
  budget?: string;
  funding?: string;
  client_address?: string;
  status?: string;
  payment_status?: string;
  skills?: string[];
  freelancer_address?: string;
  assigned_freelancer?: string;
}

const FreelancerDashboard = () => {
  const { isNewFreelanceUser } = useAuth();
  const navigate = useNavigate();
  const jobDetailsBtn = useRef<HTMLDivElement>(null);
  const acceptPayModal = useRef<HTMLDivElement>(null);
  const terminateModal = useRef<HTMLDivElement>(null);
  const completeJobModal = useRef<HTMLDivElement>(null);
  const paymentSuccessModal = useRef<HTMLDivElement>(null);
  const closeAcceptPayModal = useRef<HTMLDivElement>(null);
  const { isConnected, address, connect, executeContract, queryContract } =
    useXionWallet();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('0');
  const [txResult, setTxResult] = useState<string | null>(null);

  // Improved job fetching by querying individual job IDs
  const fetchJobs = async () => {
    if (!isConnected) {
      setAuthError('Please connect to fetch jobs');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const contractAddress = getJobContractAddress();
      const fetchedJobs: Job[] = [];

      console.log('Fetching individual job details...');

      // Try to fetch more jobs to ensure we get some results
      for (let i = 1; i <= 30; i++) {
        try {
          const query = buildGetJobDetailsQuery(i);
          const result = await queryContract(contractAddress, query);

          if (result) {
            // Convert status to lowercase for consistent comparison - contract uses "Open"/"InProgress" etc.
            const contractStatus = result.status
              ? result.status.toString()
              : 'Open';

            console.log(`Job ${i} status:`, contractStatus);
            console.log(
              `Job ${i} assigned freelancer:`,
              result.assigned_freelancer
            );
            console.log(`Current wallet address:`, address);

            // Map contract status values to frontend expected values
            let normalizedStatus = contractStatus.toLowerCase();
            if (contractStatus === 'Open') normalizedStatus = 'open';
            if (contractStatus === 'InProgress')
              normalizedStatus = 'in_progress';
            if (contractStatus === 'Completed') normalizedStatus = 'completed';
            if (contractStatus === 'Cancelled') normalizedStatus = 'cancelled';

            // Check if this job is assigned to current freelancer
            const isAssignedToMe =
              result.assigned_freelancer &&
              address &&
              result.assigned_freelancer.toString() === address.toString();

            if (isAssignedToMe) {
              console.log(
                `Job ${i} is assigned to current freelancer with status: ${normalizedStatus}`
              );
            }

            // Ensure job has proper display properties
            const formattedJob = {
              ...formatJobForDisplay({
                ...result,
                id: i.toString(),
              }),
              // Make sure these fields are properly defined
              id: i.toString(),
              status: normalizedStatus, // Use normalized status
              title: result.title || 'Untitled Job',
              role: result.title || 'Untitled Job',
              detail: result.description || 'No description provided',
              assigned_freelancer: result.assigned_freelancer?.toString(),
              freelancer_address: result.assigned_freelancer?.toString(),
              client_address: result.poster?.toString(),
            };

            // Also fetch payment status if available
            try {
              const paymentQuery = buildGetPaymentStatusQuery(i);
              const paymentStatus = await queryContract(
                contractAddress,
                paymentQuery
              );
              if (paymentStatus) {
                formattedJob.payment_status = paymentStatus.status;
              }
            } catch (err) {
              console.log(`No payment status for job ${i}`);
            }

            console.log(`Found job ${i}:`, formattedJob);
            fetchedJobs.push(formattedJob);
          }
        } catch (err) {
          // Just log the error and continue with the next ID
          console.log(`No job found with ID ${i} or error fetching it`);
        }
      }

      if (fetchedJobs.length > 0) {
        setJobs(fetchedJobs);
        console.log(`Found ${fetchedJobs.length} jobs`);
      } else {
        console.log('No jobs found');
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isNewFreelanceUser) {
      navigate(ApplicationRoutes.FREELANCER_SETUP);
    }
  }, [isNewFreelanceUser, navigate]);

  useEffect(() => {
    if (isConnected) {
      fetchJobs();
    }
  }, [isConnected]);

  const handleConnect = async () => {
    try {
      setAuthError(null);
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setAuthError('Failed to connect to Xion wallet. Please try again.');
    }
  };

  const handleViewJobDetails = (job: Job) => {
    console.log('Setting selected job:', job);
    setSelectedJob(job);

    // Set payment amount from job budget if available
    if (job.funding) {
      const amount = job.funding.replace(' XION', '');
      setPaymentAmount(amount);
    } else if (job.budget) {
      setPaymentAmount(job.budget);
    }

    if (jobDetailsBtn.current) {
      jobDetailsBtn.current.click();
    }
  };

  const handleAcceptPayment = async (jobId: string) => {
    if (!isConnected || !address) {
      setAuthError('Please connect your wallet first');
      return;
    }

    if (!selectedJob) {
      setAuthError('No job selected');
      return;
    }

    setIsProcessingPayment(true);
    setAuthError(null);

    try {
      const contractAddress = getJobContractAddress();
      const msg = buildAcceptPaymentMsg(jobId, address);

      console.log('Accepting payment for job:', jobId);
      const result = await executeContract(contractAddress, msg);
      console.log('Payment accepted:', result);

      if (result) {
        setTxResult(result.transactionHash);

        // Close payment confirmation and show success
        if (closeAcceptPayModal.current) {
          closeAcceptPayModal.current.click();
        }

        if (paymentSuccessModal.current) {
          paymentSuccessModal.current.click();
        }

        // Refresh jobs list after action
        fetchJobs();
      }
    } catch (err) {
      console.error('Error accepting payment:', err);

      // Handle specific fee limit error
      const errorMessage = err instanceof Error ? err.message : String(err);

      if (
        errorMessage.includes('fee limit exceeded') ||
        errorMessage.includes('not allowed to pay fees')
      ) {
        setAuthError(
          'Transaction failed: You have insufficient XION tokens to pay transaction fees. Please add more XION to your wallet.'
        );
      } else {
        setAuthError(errorMessage || 'Failed to accept payment');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleTerminateContract = async (jobId: string) => {
    if (!isConnected || !address) {
      setAuthError('Please connect first');
      return;
    }

    setIsProcessingPayment(true);
    setAuthError(null);

    try {
      const contractAddress = getJobContractAddress();
      const msg = buildTerminateContractMsg(jobId, address);

      console.log('Terminating contract for job:', jobId);
      const result = await executeContract(contractAddress, msg);

      if (result) {
        console.log('Contract terminated:', result);
        setTxResult(result.transactionHash);

        // Refresh jobs data
        fetchJobs();
      } else {
        throw new Error('Transaction failed to execute');
      }
    } catch (err) {
      console.error('Error terminating contract:', err);
      setAuthError(
        err instanceof Error ? err.message : 'Failed to terminate contract'
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    if (!isConnected || !address) {
      setAuthError('Please connect first');
      return;
    }

    setIsProcessingPayment(true);
    setAuthError(null);

    try {
      const contractAddress = getJobContractAddress();
      const msg = buildCompleteJobMsg(jobId);

      console.log('Marking job as complete:', jobId);
      const result = await executeContract(contractAddress, msg);

      if (result) {
        console.log('Job marked as complete:', result);
        setTxResult(result.transactionHash);

        // Refresh jobs data
        fetchJobs();
      } else {
        throw new Error('Transaction failed to execute');
      }
    } catch (err) {
      console.error('Error completing job:', err);
      setAuthError(
        err instanceof Error ? err.message : 'Failed to complete job'
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const filteredJobs = searchTerm
    ? jobs.filter(
        (job) =>
          job.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.detail?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : jobs;

  return (
    <>
      <main className='mt-32 px-5 mb-36'>
        <div className='max-w-screen-lg mx-auto w-full'>
          <div className='flex items-center justify-between'>
            <h1 className='font-poppins font-semibold text-[32px]'>
              Job Board
            </h1>

            <div className='flex items-center space-x-3'>
              {!isConnected ? (
                <Button onClick={handleConnect} className='text-white'>
                  Connect wallet
                </Button>
              ) : (
                <div className='flex items-center space-x-3'>
                  <div className='flex items-center px-3 py-1 bg-green-50 rounded-lg'>
                    <span className='inline-block w-2 h-2 rounded-full bg-green-500 mr-2'></span>
                    <span className='text-sm text-green-800'>
                      Xion Connected
                    </span>
                  </div>
                  <XionBalance className='text-[#545756] ml-2' />
                  <Button
                    onClick={fetchJobs}
                    size='sm'
                    variant='outline'
                    className='bg-gray-100'
                  >
                    Refresh Jobs
                  </Button>
                </div>
              )}
            </div>
          </div>

          {authError && (
            <Alert variant='destructive' className='mt-4'>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue='available' className='mt-8'>
            <TabsList className='bg-[#F4F4F5] p-1'>
              <TabsTrigger value='available' className='rounded-md'>
                Available Jobs
              </TabsTrigger>
              <TabsTrigger value='applied' className='rounded-md'>
                My Applications
              </TabsTrigger>
              <TabsTrigger value='active' className='rounded-md'>
                Active Contracts
              </TabsTrigger>
            </TabsList>

            <TabsContent value='available' className='mt-6'>
              <div className='bg-white relative rounded-xl p-6'>
                <div className='mt-6'>
                  {isLoading ? (
                    <div className='flex justify-center py-10'>
                      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
                    </div>
                  ) : error ? (
                    <div className='text-center py-10'>
                      <p className='text-red-500'>{error}</p>
                      <Button
                        onClick={fetchJobs}
                        className='mt-4 bg-primary text-white'
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className='text-center py-10'>
                      <p className='text-gray-500'>
                        No jobs available at the moment.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {jobs
                        .filter(
                          (job) =>
                            // Show jobs that are explicitly open OR have no status (which defaults to open)
                            (job.status === 'open' || !job.status) &&
                            // Don't show jobs assigned to this freelancer
                            job.freelancer_address !== address &&
                            job.assigned_freelancer !== address &&
                            // Apply search term filter if any
                            (searchTerm === '' ||
                              job.role
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              job.detail
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()))
                        )
                        .map((job) => (
                          <ProjectListingComponent
                            key={job.id}
                            data={job}
                            jobDetailsModal={jobDetailsBtn}
                            onViewDetails={() => handleViewJobDetails(job)}
                          />
                        ))}

                      {jobs.filter(
                        (job) =>
                          (job.status === 'open' || !job.status) &&
                          job.freelancer_address !== address &&
                          job.assigned_freelancer !== address
                      ).length === 0 && (
                        <div className='text-center py-10'>
                          <p className='text-gray-500'>
                            No available jobs found matching your criteria.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value='applied' className='mt-6'>
              <div className='bg-white relative rounded-xl p-6'>
                <AppliedJobs />
              </div>
            </TabsContent>

            <TabsContent value='active' className='mt-6'>
              <div className='bg-white relative rounded-xl p-6'>
                <div className='mt-6'>
                  {isLoading ? (
                    <div className='flex justify-center py-10'>
                      <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
                    </div>
                  ) : (
                    <div>
                      {/* Debug info to understand what jobs we have */}
                      <div className='bg-gray-100 p-2 rounded-md mb-4 text-xs'>
                        <p>Number of jobs found: {jobs.length}</p>
                        <p>Your address: {address}</p>
                        <p>
                          Looking for jobs with 'in_progress' status assigned to
                          you
                        </p>
                      </div>

                      {jobs
                        .filter((job) => {
                          // Check if a job should be displayed in active contracts
                          const isActiveStatus =
                            job.status === 'in_progress' ||
                            job.status === 'InProgress';
                          const isCompletedStatus =
                            job.status === 'completed' ||
                            job.status === 'Completed';
                          const isAssignedToMe =
                            (job.freelancer_address &&
                              job.freelancer_address === address) ||
                            (job.assigned_freelancer &&
                              job.assigned_freelancer === address);

                          console.log(
                            `Job ${job.id} - Status: ${job.status}, Assigned to you: ${isAssignedToMe}`
                          );
                          console.log(
                            `  - freelancer_address: ${job.freelancer_address}`
                          );
                          console.log(
                            `  - assigned_freelancer: ${job.assigned_freelancer}`
                          );

                          // Return true if job should be displayed
                          return (
                            (isActiveStatus || isCompletedStatus) &&
                            isAssignedToMe
                          );
                        })
                        .map((job) => (
                          <ActiveJobCard
                            key={job.id}
                            jobId={job.id}
                            jobData={{
                              title: job.title || job.role || 'Untitled Job',
                              amount:
                                job.budget ||
                                job.funding?.replace(' XION', '') ||
                                '0',
                              duration: '1-3 weeks', // Default or get actual duration from contract
                              status: job.status,
                            }}
                            terminateContract={terminateModal}
                            completeJobModal={completeJobModal}
                            showCompleteButton={
                              job.status === 'in_progress' ||
                              job.status === 'InProgress'
                            }
                          />
                        ))}

                      {jobs.filter((job) => {
                        const isActiveStatus =
                          job.status === 'in_progress' ||
                          job.status === 'InProgress';
                        const isCompletedStatus =
                          job.status === 'completed' ||
                          job.status === 'Completed';
                        const isAssignedToMe =
                          (job.freelancer_address &&
                            job.freelancer_address === address) ||
                          (job.assigned_freelancer &&
                            job.assigned_freelancer === address);

                        return (
                          (isActiveStatus || isCompletedStatus) &&
                          isAssignedToMe
                        );
                      }).length === 0 && (
                        <div className='text-center py-10'>
                          <p className='text-gray-500'>
                            No active contracts found.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Job details sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <div ref={jobDetailsBtn} className='hidden'>
            Open
          </div>
        </SheetTrigger>

        <SheetContent
          side='bottom'
          className='h-[90vh] custom-scrollbar max-w-screen-lg mx-auto rounded-2xl mb-10 bg-white font-circular'
        >
          <SheetHeader>
            <SheetDescription className='hidden'>
              Job description
            </SheetDescription>
          </SheetHeader>

          <div className='w-full px-5'>
            <div className='flex items-center justify-between pb-2'>
              <SheetClose>
                <LucideMoveLeft size={20} />
              </SheetClose>
              {isConnected ? (
                <Link
                  to={`${ApplicationRoutes.JOB_APPLY.replace(
                    ':jobId',
                    selectedJob?.id || ''
                  )}`}
                  className='z-10'
                >
                  <Button className='text-white bg-primary rounded-md font-circular'>
                    Apply for Job
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleConnect}
                  className='text-white bg-primary rounded-md font-circular'
                >
                  Connect to Apply
                </Button>
              )}
            </div>

            <div className='font-circular h-[70vh] overflow-auto custom-scrollbar'>
              <p className='mt-3 font-medium text-lg text-[#18181B]'>
                {selectedJob?.role || 'Job Title'}
              </p>

              <p className='text-base mt-5 font-normal text-[#545756]'>
                {selectedJob?.detail || 'No job description available.'}
              </p>

              <div className='mt-7'>
                <p className='text-[#7E8082]'>Skills Required:</p>
                <div className='flex items-center space-x-3 mt-2 flex-wrap gap-y-2'>
                  {selectedJob?.skills?.map((skill: string, index: number) => (
                    <div
                      key={index}
                      className='border-[#E4E4E7] bg-[#F4F4F5] text-[#545756] rounded-full text-sm py-1 px-3'
                    >
                      {skill}
                    </div>
                  )) || (
                    <p className='text-[#7E8082]'>No specific skills listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Accept payment dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={acceptPayModal} className='hidden'>
            Accept Payment
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white font-circular'>
          <div className='flex flex-col items-center'>
            <p className='text-[20px] font-poppins font-semibold text-[#18181B] mt-5'>
              Receive Payment
            </p>
            <div className='max-w-80 flex justify-center'>
              <span className='text-[#7E8082] font-normal font-circular text-sm text-center mt-5'>
                You're about to receive{' '}
                <span className='text-[#18181B] font-medium'>
                  {paymentAmount} XION
                </span>{' '}
                for {selectedJob?.role || 'this job'}. Once confirmed, the
                payment will be sent to your wallet.
              </span>
            </div>

            <AcceptPayment className='scale-75' />
            <span className='text-base text-[#7E8082]'>
              Receiving{' '}
              <span className='text-lg text-black'>{paymentAmount} XION</span>
            </span>

            {authError && (
              <Alert variant='destructive' className='mt-4'>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <div className=''>
              <Button
                onClick={() => handleAcceptPayment(selectedJob?.id || '1')}
                disabled={isProcessingPayment || !isConnected}
                className='text-white w-full mt-6 px-28'
              >
                {isProcessingPayment ? 'Processing...' : 'Accept payment'}
              </Button>
            </div>
            <span className='text-[#7E8082] text-sm font-normal mt-4 mb-2'>
              Need help? <span className='text-primary'>Contact support.</span>
            </span>
          </div>
        </DialogContent>

        <DialogClose className='hidden'>
          <div
            ref={closeAcceptPayModal}
            className='w-full text-white px-9 mt-6 py-5 pb-6'
          >
            Okay
          </div>
        </DialogClose>
      </Dialog>

      {/* Payment Success Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={paymentSuccessModal} className='hidden'>
            Payment Success
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white'>
          <div className='flex flex-col items-center'>
            <ApplySuceess className='scale-75' />

            <p className='text-[20px] font-poppins font-semibold text-[#18181B] mt-5'>
              Payment Received
            </p>

            <div className='max-w-80'>
              <p className='font-circular text-[#545756] text-base text-center mt-5'>
                You've successfully received {paymentAmount} XION for{' '}
                {selectedJob?.role || 'your work'}. The payment has been
                transferred to your wallet.
              </p>

              {txResult && (
                <p className='font-circular text-xs text-green-600 text-center mt-2 break-all'>
                  Transaction Hash: {txResult}
                </p>
              )}
            </div>

            <DialogClose className=''>
              <Button className='w-full text-white px-9 mt-6 py-5 pb-6'>
                Okay
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terminate contract dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={terminateModal} className='hidden'>
            Terminate Contract
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white'>
          <div className='flex flex-col items-center'>
            <p className='text-[20px] mb-4 font-poppins font-semibold text-[#18181B] mt-5'>
              Terminate Project
            </p>

            <TerminateContract className='scale-75' />
            <span className='text-sm text-[#7E8082]'>Freelancer</span>

            <div className=' flex justify-center'>
              <span className='text-[#7E8082] font-normal font-circular text-sm text-center mt-5'>
                Terminating this contract requires mutual agreement. Confirm to
                notify{' '}
                {selectedJob?.client_address
                  ? selectedJob.client_address.slice(0, 12) + '...'
                  : 'the client'}
                .
              </span>
            </div>

            {authError && (
              <Alert variant='destructive' className='mt-4'>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className='mb-3 flex space-x-3'>
            <DialogClose className='w-full'>
              <Button className='text-white w-full mt-6 border border-gray-300 bg-white text-primary hover:bg-white focus:bg-white'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => handleTerminateContract(selectedJob?.id || '1')}
              disabled={isProcessingPayment}
              className='w-full mt-6 bg-[#FB822F] text-white hover:bg-[#FB822F] focus:bg-[#FB822F]'
            >
              {isProcessingPayment ? 'Processing...' : 'End Contract'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Job Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <div ref={completeJobModal} className='hidden'>
            Complete Job
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white'>
          <div className='flex flex-col items-center'>
            <p className='text-[20px] mb-4 font-poppins font-semibold text-[#18181B] mt-5'>
              Mark Job as Complete
            </p>

            <img
              src='/images/client/client.png'
              alt='client'
              className='mb-2'
            />
            <span className='text-sm text-[#7E8082]'>Client</span>

            <div className='flex justify-center'>
              <span className='text-[#7E8082] font-normal font-circular text-sm text-center mt-5'>
                Marking this job as complete will notify the client to review
                your work and process payment.
              </span>
            </div>

            {authError && (
              <Alert variant='destructive' className='mt-4'>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className='mb-3 flex space-x-3'>
            <DialogClose className='w-full'>
              <Button className='text-white w-full mt-6 border border-gray-300 bg-white text-primary hover:bg-white focus:bg-white'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => handleCompleteJob(selectedJob?.id || '1')}
              disabled={isProcessingPayment}
              className='w-full mt-6 bg-green-600 text-white hover:bg-green-700 focus:bg-green-700'
            >
              {isProcessingPayment ? 'Processing...' : 'Mark as Complete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreelancerDashboard;
