import { LucidePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ActiveHireJob from '../../components/client/active-project-card';
import ExpertCard, {
  ExpertCardType,
} from '../../components/client/expert-card';
import PostJobCard from '../../components/client/job-card';
import NotificationCard from '../../components/freelancer/notification-card';
import { ProjectListingComponentType } from '../../components/freelancer/project-listing-component';
import NoPostIcon from '../../components/icons/client/no-post-icon';
import ApplySuceess from '../../components/icons/freelance/apply-success';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../../components/ui/dialog';
import { useAuth } from '../../context/auth-context';
import { useXionWallet } from '../../context/xion-context';
import XionWalletConnect from '../../components/xion/XionWalletConnect';
import XionBalance from '../../components/xion/XionBalance';
import ConnectionPrompt from '../../components/xion/ConnectionPrompt';
import { ApplicationRoutes } from '../../routes/routes-constant';
import { useJobContract } from '../../hooks/useJobContract';

const dummyClient: ExpertCardType[] = [
  {
    details:
      'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
    jobs: 55,
    name: 'Onest Man',
    rate: '3 XION/hr',
    rating: 4.9,
    title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
    location: 'Nigeria',
  },
  {
    details:
      'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
    jobs: 55,
    name: 'Onest Man',
    rate: '3 XION/hr',
    rating: 4.9,
    title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
    location: 'Nigeria',
  },
  {
    details:
      'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
    jobs: 55,
    name: 'Onest Man',
    rate: '3 XION/hr',
    rating: 4.9,
    title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
    location: 'Nigeria',
  },
  {
    details:
      'I am a highly creative designer with over three years of experience in the design industry. I have a deep understanding...',
    jobs: 55,
    name: 'Onest Man',
    rate: '3 XION/hr',
    rating: 4.9,
    title: 'UIUX Designer, Illustrator, Motion & Brand Designer',
    location: 'Nigeria',
  },
];

const ClientDashboard = () => {
  const editJob = useRef<HTMLDivElement>(null);
  const { hasJob } = useAuth();
  const confirmPayment = useRef<HTMLDivElement>(null);
  const closeConfirmPayment = useRef<HTMLDivElement>(null);
  const terminateContractModal = useRef<HTMLDivElement>(null);
  const paymentSuccessModal = useRef<HTMLDivElement>(null);
  const { isConnected, address, executeContract } = useXionWallet();
  const [isPosting, setIsPosting] = useState(false);
  const [txResult, setTxResult] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);

  const { jobs, isLoading, error: jobError, refetch } = useJobContract();

  useEffect(() => {
    console.log('Client dashboard - Current jobs:', jobs);
    console.log('Client dashboard - Jobs loading state:', isLoading);
    console.log('Client dashboard - Jobs error state:', jobError);
  }, [jobs, isLoading, jobError]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log('Dashboard detected connection change:', isConnected);
    setConnectionStatus(isConnected);
    if (isConnected) {
      console.log('Wallet connected, fetching jobs...');
      refetch();
    }
  }, [isConnected, refetch]);

  const handlePostJob = async (jobData: any) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet with Xion Abstraction first');
      return;
    }

    setIsPosting(true);
    setTxError(null);

    try {
      const jobContractAddress = import.meta.env.VITE_JOB_CONTRACT_ADDRESS;

      if (!jobContractAddress) {
        throw new Error('Job contract address not configured');
      }

      const msg = {
        create_job: {
          ...jobData,
          owner: address,
        },
      };

      const result = await executeContract(jobContractAddress, msg);
      if (result) {
        setTxResult(result.transactionHash);
      } else {
        throw new Error('Transaction failed to execute');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      setTxError(
        typeof error === 'object' && error !== null
          ? (error as Error).message
          : 'Unknown error occurred'
      );
    } finally {
      setIsPosting(false);
    }
  };

  const handleForceRefetch = () => {
    console.log('Manually triggering job refetch');
    refetch();
  };

  // Always show post job button when connected
  const showPostJobButton = isConnected;

  return (
    <>
      <main className='mt-32 mb-20'>
        <div className='app-container'>
          <div className='flex justify-between items-center mb-5'>
            <div className='flex items-center'>
              {isConnected && (
                <div className='flex items-center gap-2'>
                  <div className='flex items-center px-3 py-1 bg-green-50 rounded-lg'>
                    <span className='inline-block w-2 h-2 rounded-full bg-green-500 mr-2'></span>
                    <span className='text-sm text-green-800'>
                      Xion Connected
                    </span>
                  </div>
                  <XionBalance className='text-[#545756] ml-2' />
                </div>
              )}
            </div>

            {showPostJobButton && (
              <Link to={ApplicationRoutes.POST_A_JOB}>
                <Button className='flex items-center text-white space-x-2'>
                  <LucidePlus size={20} />
                  <p className='font-circular font-medium text-sm'>
                    Post a project
                  </p>
                </Button>
              </Link>
            )}
          </div>

          <div className='mt-4 mb-5'>
            <ConnectionPrompt
              onConnectionChange={(connected) => setConnectionStatus(connected)}
            />
          </div>

          {/* {process.env.NODE_ENV === 'development' && (
            <div className='mb-4'>
              <Button
                onClick={handleForceRefetch}
                size='sm'
                variant='outline'
                className='bg-gray-100'
              >
                Debug: Refresh Jobs
              </Button>
            </div>
          )} */}

          {txResult && (
            <div className='mt-4 p-4 bg-green-100 rounded-md mb-4'>
              <p className='text-green-800 font-medium'>
                Transaction successful!
              </p>
              <p className='text-sm break-all'>TX Hash: {txResult}</p>
              <div className='flex items-center mt-1'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  className='mr-1'
                  fill='currentColor'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M12 2L2 7L12 12L22 7L12 2Z' fill='currentColor' />
                  <path
                    d='M2 17L12 22L22 17'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M2 12L12 17L22 12'
                    stroke='currentColor'
                    strokeWidth='1.5'
                  />
                </svg>
                <p className='text-xs text-green-700'>
                  Processed through Xion Abstraction
                </p>
              </div>
            </div>
          )}

          {txError && (
            <div className='mt-4 p-4 bg-red-100 rounded-md mb-4'>
              <p className='text-red-800 font-medium'>Transaction failed</p>
              <p className='text-sm'>{txError}</p>
              <p className='text-xs text-red-700 mt-1'>
                Please ensure your Xion wallet has sufficient balance
              </p>
            </div>
          )}

          <div className=' grid grid-cols-12 gap-x-3'>
            <div className='bg-white shadow-md h-[90vh] overflow-hidden rounded-lg col-span-8 p-6 px-8'>
              <div className='border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg'>
                Project Overview
              </div>

              {!isConnected ? (
                <div className='pt-20 flex flex-col items-center font-circular'>
                  <NoPostIcon className='scale-90' />
                  <p className='text-[#545756] my-9'>
                    Please connect your wallet to view job posts
                  </p>
                  <ConnectionPrompt compact={true} />
                </div>
              ) : isLoading ? (
                <div className='flex items-center justify-center py-10'>
                  <p className='text-gray-500'>Loading jobs...</p>
                </div>
              ) : jobError ? (
                <div className='flex flex-col items-center justify-center py-10'>
                  <p className='text-red-500 mb-3'>Error: {jobError}</p>
                  <Button onClick={refetch} variant='outline' size='sm'>
                    Try Again
                  </Button>
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className='divide-y divide-gray-300 flex flex-col gap-y-10 pt-8 h-[70vh] overflow-y-auto custom-scrollbar pb-20'>
                  {jobs.map((post, index) => (
                    <PostJobCard
                      key={`job-${index}-${post.role || 'undefined'}`}
                      data={post}
                      editJob={editJob}
                    />
                  ))}
                </div>
              ) : (
                <div className='pt-20 flex flex-col items-center font-circular'>
                  <NoPostIcon className='scale-90' />
                  <p className='text-[#545756] my-9'>
                    No active job posts found. Try posting a new job!
                  </p>
                  <Link to={ApplicationRoutes.POST_A_JOB} className=''>
                    <Button className='flex items-center text-primary bg-white space-x-3 border border-primary rounded-md hover:bg-white focus:bg-white'>
                      <LucidePlus size={19} />
                      <p className='font-medium text-base'>Post a project</p>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className='col-span-4 pb-10 overflow-y-auto custom-scrollbar flex flex-col gap-y-6 font-circular'>
              <div className='bg-white rounded-lg shadow-md min-h-52'>
                <div className='border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg'>
                  Notifications
                </div>

                <div className='p-4'>
                  <NotificationCard />
                </div>
              </div>

              {hasJob && (
                <div className='bg-white rounded-lg font-circular shadow-md min-h-52'>
                  <div className='border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg'>
                    Active Projects
                  </div>

                  <div className='p-4'>
                    <div className=''>
                      <ActiveHireJob
                        acceptPayModal={confirmPayment}
                        terminateContract={terminateContractModal}
                      />
                    </div>
                  </div>
                </div>
              )}

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

                <div className='absolute bottom-0 right-0'>
                  <svg
                    width='72'
                    height='72'
                    viewBox='0 0 72 72'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M23.0405 26.1139C23.1074 25.3881 23.3539 24.639 23.9965 23.9964C24.6391 23.3538 25.3881 23.1073 26.114 23.0404C26.6855 22.9876 27.4435 23.0512 28.0271 23.1003C31.812 23.4154 35.5891 24.688 38.5745 27.6733L40.8744 29.9732C41.9077 31.0065 42.293 31.3646 42.609 31.5342L42.6131 31.5365C42.7251 31.5965 43.03 31.6508 43.7526 31.54C45.0767 31.2453 47.4999 30.706 49.3813 32.5874C50.2268 33.4329 50.9546 34.5104 51.0002 35.8316C51.0469 37.191 50.3581 38.2934 49.5156 39.1359L39.1359 49.5156C38.2934 50.3581 37.191 51.0469 35.8318 51.0001C34.5105 50.9544 33.433 50.2267 32.5875 49.3812C30.7061 47.4998 31.2454 45.0766 31.54 43.7525C31.6509 43.0299 31.5967 42.7249 31.5366 42.6131L31.5343 42.6089C31.3646 42.2929 31.0065 41.9077 29.9733 40.8744L27.6734 38.5745C24.688 35.5891 23.4155 31.812 23.1004 28.0271C23.0513 27.4434 22.9877 26.6854 23.0405 26.1139Z'
                      fill='url(#paint0_linear_230_660)'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M35.3833 64.3965C33.3949 61.1257 33.658 56.7622 36.5726 53.8476C37.5267 52.8935 39.052 52.8718 39.9795 53.7994C40.9071 54.7269 40.8855 56.2522 39.9313 57.2063C38.6035 58.5342 38.4894 60.9471 40.1389 62.5966L41.8182 64.276L40.0906 66.0036C38.7628 67.3315 38.6487 69.7444 40.2983 71.3941C41.9478 73.0436 44.3608 72.9294 45.6886 71.6016C46.6428 70.6475 48.1681 70.6258 49.0956 71.5534C50.0231 72.4809 50.0015 74.0062 49.0474 74.9604C45.6046 78.4031 40.1402 78.1463 36.8432 74.8493C34.0628 72.0689 33.4443 67.7472 35.3833 64.3965ZM53.8003 39.9786C52.8727 39.0511 52.8943 37.5259 53.8485 36.5716C56.7631 33.6571 61.1266 33.3941 64.3973 35.3824C67.7481 33.4434 72.0698 34.0619 74.8501 36.8423C78.1472 40.1393 78.4041 45.6037 74.9612 49.0466C74.0071 50.0006 72.4819 50.0222 71.5543 49.0947C70.6268 48.1671 70.6483 46.6419 71.6024 45.6878C72.9303 44.3599 73.0445 41.9469 71.395 40.2974C69.7454 38.6477 67.3324 38.7619 66.0044 40.0898C65.0503 41.0439 63.5251 41.0655 62.5976 40.1379C60.9481 38.4884 58.5351 38.6026 57.2073 39.9304C56.2531 40.8846 54.7278 40.9062 53.8003 39.9786ZM43.4348 50.3441C44.3889 49.3901 45.9141 49.3685 46.8416 50.296L55.2385 58.6929C56.1661 59.6205 56.1445 61.1457 55.1905 62.0998C54.2362 63.054 52.7109 63.0756 51.7834 62.1481L43.3865 53.7512C42.459 52.8236 42.4806 51.2983 43.4348 50.3441ZM50.345 43.4339C51.2992 42.4797 52.8245 42.4581 53.752 43.3857L57.1108 46.7444C58.0383 47.672 58.0168 49.1972 57.0625 50.1514C56.1085 51.1055 54.5832 51.1271 53.6557 50.1995L50.2969 46.8408C49.3694 45.9132 49.3909 44.388 50.345 43.4339Z'
                      fill='url(#paint1_linear_230_660)'
                    />
                    <defs>
                      <linearGradient
                        id='paint0_linear_230_660'
                        x1='23.9965'
                        y1='23.9964'
                        x2='44.3258'
                        y2='44.3257'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='#8C57E8' />
                        <stop offset='1' stopColor='#F146C0' />
                      </linearGradient>
                      <linearGradient
                        id='paint1_linear_230_660'
                        x1='33.8084'
                        y1='33.8075'
                        x2='62.0043'
                        y2='62.0034'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='#8C57E8' />
                        <stop offset='0.250784' stopColor='#F146C0' />
                        <stop offset='1' stopColor='#FFC755' />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-14'>
            <h3 className='font-poppins font-semibold text-[24px]'>
              Talk to top experts to review your project details.
            </h3>

            <div className='grid grid-cols-4 gap-6 mt-7'>
              {dummyClient.map((client, index) => {
                return (
                  <ExpertCard
                    details={client.details}
                    jobs={client.jobs}
                    name={client.name}
                    rate={client.rate}
                    rating={client.rating}
                    title={client.title}
                    key={index}
                    location={client.location}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Dialog>
        <DialogTrigger asChild>
          <div ref={confirmPayment} className='hidden'>
            Edit Profile
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white font-circular'>
          <div className='flex flex-col items-center'>
            <p className='text-[20px] font-poppins font-semibold text-[#18181B] mt-5'>
              Receive Payment
            </p>
            <div className='max-w-80 flex justify-center mb-5'>
              <span className='text-[#7E8082] font-normal font-circular text-sm text-center mt-5'>
                You’re about to pay Onest Man{' '}
                <span className='text-[#18181B] font-medium'>50.5 XION</span>{' '}
                for Web Design. Once confirmed, the payment will be sent.
              </span>
            </div>

            <img src='/images/client/client.png' alt='client' />
            <span className='text-base text-[#7E8082]'>
              Sending <span className='text-lg text-black'>50.5 XION</span>
            </span>

            <div className=''>
              <Button
                onClick={() => {
                  closeConfirmPayment.current.click();
                  paymentSuccessModal.current.click();
                }}
                className='text-white w-full mt-6 px-28'
              >
                Confirm payment
              </Button>
            </div>
            <span className='text-[#7E8082] text-sm font-normal mt-4 mb-2'>
              Need help? <span className='text-primary'>Contact support.</span>
            </span>
          </div>
        </DialogContent>

        <DialogClose className='hidden'>
          <div
            ref={closeConfirmPayment}
            className='w-full text-white px-9 mt-6 py-5 pb-6'
          >
            Okay
          </div>
        </DialogClose>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <div ref={terminateContractModal} className='hidden'>
            Edit Profile
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white'>
          <div className='flex flex-col items-center'>
            <p className='text-[20px] mb-6 font-poppins font-semibold text-[#18181B] mt-5'>
                Terminate Freelancer
            </p>

            <img src='/images/client/client.png' alt='client' />
            <span className='text-sm text-[#7E8082]'>Freelancer</span>

            <div className=' flex justify-center'>
              <span className='text-[#7E8082] font-normal font-circular text-sm text-center mt-5'>
                Terminating this contract requires mutual agreement. Confirm to
                notify Onest Man.
              </span>
            </div>
          </div>

          <div className='mb-3 flex space-x-3'>
            <DialogClose className='w-full'>
              <Button className='text-white w-full mt-6 border border-gray-300 bg-white text-primary hover:bg-white focus:bg-white'>
                Cancel
              </Button>
            </DialogClose>
            <Button className='w-full mt-6 bg-[#FB822F] text-white hover:bg-[#FB822F] focus:bg-[#FB822F]'>
              End Contract
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <div ref={paymentSuccessModal} className='hidden'>
            Edit Profile
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white'>
          <div className='flex flex-col items-center'>
            <ApplySuceess className='scale-75' />

            <p className='text-[20px] font-poppins font-semibold text-[#18181B] mt-5'>
              Payment Successful
            </p>

            <div className='max-w-80'>
              <p className='font-circular text-[#545756] text-base text-center mt-5'>
                Your payment of 50.5 XION has been successfully sent to Onest
                Man. Thank you for completing the transaction!
              </p>
            </div>

            <DialogClose className=''>
              <Button className='w-full text-white px-9 mt-6 py-5 pb-6'>
                Okay
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientDashboard;
