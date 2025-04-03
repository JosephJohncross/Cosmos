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

// Import the utilities
import {
  buildGetJobDetailsQuery,
  buildAcceptPaymentMsg,
  buildTerminateContractMsg,
  formatJobForDisplay,
  getJobContractAddress,
} from '../../utils/contract-utils';

const FreelancerDashboard = () => {
  const { isNewFreelanceUser } = useAuth();
  const navigate = useNavigate();
  const jobDetailsBtn = useRef<HTMLDivElement>(null);
  const acceptPayModal = useRef<HTMLDivElement>(null);
  const terminateModal = useRef<HTMLDivElement>(null);
  const { isConnected, address, connect, executeContract, queryContract } =
    useXionWallet();

  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Improved job fetching by querying individual job IDs
  const fetchJobs = async () => {
    if (!isConnected) {
      setAuthError('Please connect your wallet to fetch jobs');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const contractAddress = getJobContractAddress();
      const fetchedJobs = [];

      console.log('Fetching individual job details...');

      // Try to fetch first 10 jobs by ID (adjust as needed)
      for (let i = 1; i <= 10; i++) {
        try {
          const query = buildGetJobDetailsQuery(i);
          const result = await queryContract(contractAddress, query);

          if (result) {
            fetchedJobs.push(
              formatJobForDisplay({
                ...result,
                id: i.toString(),
              })
            );
            console.log(`Found job ${i}:`, result);
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

  const handleViewJobDetails = (job: any) => {
    console.log('Setting selected job:', job);
    setSelectedJob(job);
    if (jobDetailsBtn.current) {
      jobDetailsBtn.current.click();
    }
  };

  const handleAcceptPayment = async (jobId: string) => {
    if (!isConnected || !address) {
      setAuthError('Please connect your wallet first');
      return;
    }

    try {
      const contractAddress = getJobContractAddress();
      const msg = buildAcceptPaymentMsg(jobId, address);

      console.log('Accepting payment for job:', jobId);
      const result = await executeContract(contractAddress, msg);
      console.log('Payment accepted:', result);

      // Success notification
      setAuthError(null);
      // Could add a success toast here
      fetchJobs(); // Refresh jobs list after action
    } catch (err) {
      console.error('Error accepting payment:', err);
      setAuthError(
        err instanceof Error ? err.message : 'Failed to accept payment'
      );
    }
  };

  const handleTerminateContract = async (jobId: string) => {
    if (!isConnected || !address) {
      setAuthError('Please connect your wallet first');
      return;
    }

    try {
      const contractAddress = getJobContractAddress();
      const msg = buildTerminateContractMsg(jobId, address);

      console.log('Terminating contract for job:', jobId);
      const result = await executeContract(contractAddress, msg);
      console.log('Contract terminated:', result);

      // Success notification
      setAuthError(null);
      // Could add a success toast here
      fetchJobs(); // Refresh jobs list after action
    } catch (err) {
      console.error('Error terminating contract:', err);
      setAuthError(
        err instanceof Error ? err.message : 'Failed to terminate contract'
      );
    }
  };

  const filteredJobs = searchTerm
    ? jobs.filter(
        (job) =>
          job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.detail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : jobs;

  return (
    <>
      <main className='mt-32 mb-20'>
        <div className='app-container grid grid-cols-12 gap-x-3'>
          <div className='bg-white shadow-md h-[110vh] overflow-hidden rounded-lg col-span-8 p-6 px-8'>
            <div className='pb-6'>
              <div className='relative'>
                <LucideSearch
                  className='absolute text-[#545756] top-1/2 -translate-y-1/2 left-6'
                  size={20}
                />
                <Input
                  placeholder='Search for projects'
                  className='w-full py-4 placeholder:text-[#BEBEBE] font-circular pl-14 bg-transparent border border-gray-300'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className='mt-4 flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  {isConnected && (
                    <>
                      <div className='flex items-center px-3 py-1 bg-green-50 rounded-lg'>
                        <span className='inline-block w-2 h-2 rounded-full bg-green-500 mr-2'></span>
                        <span className='text-sm text-green-800'>
                          Xion Connected
                        </span>
                      </div>
                      <XionBalance className='text-[#545756] ml-2' />
                    </>
                  )}
                </div>

                <div className='flex items-center gap-2'>
                  {isConnected ? (
                    <Button
                      onClick={fetchJobs}
                      size='sm'
                      variant='outline'
                      className='bg-gray-100'
                    >
                      Refresh Jobs
                    </Button>
                  ) : (
                    <ConnectionPrompt compact={true} />
                  )}
                </div>
              </div>

              {authError && (
                <Alert className='mt-4 bg-red-50 border-red-200'>
                  <AlertDescription className='text-red-800'>
                    {authError}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className='divide-y divide-gray-300 flex flex-col gap-y-10 pt-4 h-[80vh] overflow-y-auto custom-scrollbar pb-20'>
              {!isConnected ? (
                <div className='flex flex-col items-center justify-center py-10'>
                  <NoJobIcon />
                  <p className='text-sm mt-3 text-[#7E8082] font-normal'>
                    Please connect your wallet to view available jobs
                  </p>
                  <div className='mt-4'>
                    <ConnectionPrompt compact={true} />
                  </div>
                </div>
              ) : isLoading ? (
                <div className='flex items-center justify-center py-10'>
                  <p className='text-gray-500'>Loading available jobs...</p>
                </div>
              ) : error ? (
                <div className='flex flex-col items-center justify-center py-10'>
                  <p className='text-red-500 mb-3'>Error: {error}</p>
                  <Button onClick={fetchJobs} variant='outline' size='sm'>
                    Try Again
                  </Button>
                </div>
              ) : filteredJobs && filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <ProjectListingComponent
                    key={`job-${index}-${job.role || 'undefined'}`}
                    data={job}
                    jobDetailsModal={jobDetailsBtn}
                    onViewDetails={() => handleViewJobDetails(job)}
                  />
                ))
              ) : (
                <div className='flex flex-col items-center justify-center py-10'>
                  <NoJobIcon />
                  <p className='text-sm mt-3 text-[#7E8082] font-normal'>
                    {searchTerm
                      ? 'No matching jobs found. Try a different search term.'
                      : 'No jobs available at the moment'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rest of the dashboard UI */}
          <div className='col-span-4  pb-10 overflow-y-auto custom-scrollbar flex flex-col gap-y-6 font-circular'>
            {/* Notifications section */}
            <div className='bg-white rounded-lg shadow-md min-h-52'>
              <div className='border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg'>
                Notifications
              </div>

              <div className='p-4'>
                <NotificationCard />
              </div>
            </div>

            {/* Active projects section */}
            <div className='bg-white rounded-lg font-circular shadow-md min-h-52'>
              <div className='border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg'>
                Active Projects
              </div>

              <div className='p-4'>
                <div className=''>
                  <ActiveJobCard
                    acceptPayModal={acceptPayModal}
                    terminateContract={terminateModal}
                  />
                </div>
              </div>
            </div>

            {/* Get started section */}
            <div className='bg-[#18181B] rounded-lg font-circular shadow-md min-h-52 mb-20 p-8 relative'>
              <p className='font-poppins text-white font-bold text-sm'>
                Get started
              </p>

              <p className=' font-circular text-base text-[#F4F4F5] mt-3'>
                Start your journey now and connect with clients to bring their
                projects to life.
              </p>

              <Button className='flex items-center space-x-2 text-white bg-[#545756] mt-6'>
                <p className=''>Learn more</p>
                <svg
                  className='scale-90'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M16.5 7.5L6 18'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                  <path
                    d='M8 6.18791C8 6.18791 16.0479 5.50949 17.2692 6.73079C18.4906 7.95209 17.812 16 17.812 16'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Button>

              {/* Decorative SVG */}
              <div className='absolute bottom-0 right-0'>
                {/* SVG Content */}
              </div>
            </div>
          </div>
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
                  Connect Wallet to Apply
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
                <span className='text-[#18181B] font-medium'>50.5 ATOM</span>{' '}
                for Web Design. Once confirmed, the payment will be sent to your
                wallet.
              </span>
            </div>

            <AcceptPayment className='scale-75' />
            <span className='text-base text-[#7E8082]'>
              Receiving <span className='text-lg text-black'>50.5 ATOM</span>
            </span>

            <div className=''>
              <Button
                onClick={() => handleAcceptPayment(selectedJob?.id || '1')}
                className='text-white w-full mt-6 px-28'
              >
                Accept payment
              </Button>
            </div>
            <span className='text-[#7E8082] text-sm font-normal mt-4 mb-2'>
              Need help? <span className='text-primary'>Contact support.</span>
            </span>
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
                notify the client.
              </span>
            </div>
          </div>

          <div className='mb-3 flex space-x-3'>
            <DialogClose className='w-full'>
              <Button className='text-white w-full mt-6 border border-gray-300 bg-white text-primary hover:bg-white focus:bg-white'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => handleTerminateContract(selectedJob?.id || '1')}
              className='w-full mt-6 bg-[#FB822F] text-white hover:bg-[#FB822F] focus:bg-[#FB822F]'
            >
              End Contract
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreelancerDashboard;
