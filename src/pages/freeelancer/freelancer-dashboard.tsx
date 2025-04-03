import { ReactNode, useEffect, useRef, useState } from 'react';
import { useFreelancer } from '../../context/freelancer-context';
import { ApplicationRoutes } from '../../routes/routes-constant';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { LucideMoveLeft, LucideMoveUpRight, LucideSearch } from 'lucide-react';
import { Input } from '../../components/ui/input';
import ProjectListingComponent from '../../components/freelancer/project-listing-component';
import NotificationCard from '../../components/freelancer/notification-card';
import NoJobIcon from '../../components/icons/freelance/no-job-icon';
import { Button } from '../../components/ui/button';
import ActiveJobCard from '../../components/freelancer/active-job-card';
import { useXionWallet } from '../../context/xion-context';
import { useJobContract } from '../../hooks/useJobContract';
import ConnectionPrompt from '../../components/xion/ConnectionPrompt';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetClose,
} from '../../components/ui/sheet';
import FreelancCalendar from '../../components/icons/freelance/freelance-calendar';
import LocationIcon from '../../components/icons/freelance/location-icon';
import ApplicantIcon from '../../components/icons/freelance/applicant-icon';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../../components/ui/dialog';
import TerminateContract from '../../components/icons/freelance/terminate-contract';
import AcceptPayment from '../../components/icons/freelance/accept-payment';

const FreelancerDasboard = () => {
  const { isNewFreelanceUser } = useAuth();
  const navigate = useNavigate();
  const jobDetailsBtn = useRef<HTMLDivElement>(null);
  const acceptPayModal = useRef<HTMLDivElement>(null);
  const terminateModal = useRef<HTMLDivElement>(null);
  const { isConnected } = useXionWallet();

  const { jobs, isLoading, error, refetch } = useJobContract();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Freelancer dashboard - Current jobs:', jobs);
    console.log('Freelancer dashboard - Jobs loading state:', isLoading);
    console.log('Freelancer dashboard - Jobs error state:', error);
  }, [jobs, isLoading, error]);

  useEffect(() => {
    console.log(isNewFreelanceUser);
    if (isNewFreelanceUser) {
      navigate(ApplicationRoutes.FREELANCER_SETUP);
    }
  }, [isNewFreelanceUser, navigate]);

  useEffect(() => {
    if (isConnected) {
      console.log('Wallet connected in freelancer dashboard, fetching jobs');
      refetch();
    }
  }, [isConnected, refetch]);

  const handleForceRefetch = () => {
    console.log('Manually triggering job refetch');
    refetch();
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
            <div className='pb-10'>
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

              {process.env.NODE_ENV === 'development' && (
                <div className='mt-4'>
                  <Button
                    onClick={handleForceRefetch}
                    size='sm'
                    variant='outline'
                    className='bg-gray-100'
                  >
                    Debug: Refresh Jobs
                  </Button>
                </div>
              )}
            </div>

            <div className='divide-y divide-gray-300 flex flex-col gap-y-10 pt-4 h-[90vh] overflow-y-auto custom-scrollbar pb-20'>
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
                  <Button onClick={refetch} variant='outline' size='sm'>
                    Try Again
                  </Button>
                </div>
              ) : filteredJobs && filteredJobs.length > 0 ? (
                filteredJobs.map((post, index) => (
                  <ProjectListingComponent
                    key={`job-${index}-${post.role || 'undefined'}`}
                    data={post}
                    jobDetailsModal={jobDetailsBtn}
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

          <div className='col-span-4  pb-10 overflow-y-auto custom-scrollbar flex flex-col gap-y-6 font-circular'>
            <div className='bg-white rounded-lg shadow-md min-h-52'>
              <div className='border-b border-gray-200 p-4 text-[#7E8082] font-medium text-lg'>
                Notifications
              </div>

              <div className='p-4'>
                <NotificationCard />
              </div>
            </div>

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
                    stroke-width='1.5'
                    stroke-linecap='round'
                  />
                  <path
                    d='M8 6.18791C8 6.18791 16.0479 5.50949 17.2692 6.73079C18.4906 7.95209 17.812 16 17.812 16'
                    stroke='white'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
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
                    fill-rule='evenodd'
                    clip-rule='evenodd'
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
                      <stop stop-color='#8C57E8' />
                      <stop offset='1' stop-color='#F146C0' />
                    </linearGradient>
                    <linearGradient
                      id='paint1_linear_230_660'
                      x1='33.8084'
                      y1='33.8075'
                      x2='62.0043'
                      y2='62.0034'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stop-color='#8C57E8' />
                      <stop offset='0.250784' stop-color='#F146C0' />
                      <stop offset='1' stop-color='#FFC755' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Sheet>
        <SheetTrigger asChild>
          <div ref={jobDetailsBtn} className='hidden'>
            Open
          </div>
        </SheetTrigger>

        <SheetContent
          side='bottom'
          className='h-[90vh] custom-scrollbar max-w-screen-lg  mx-auto rounded-2xl mb-10 bg-white font-circular'
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
              <Link to={ApplicationRoutes.JOB_APPLY}>
                <Button className='text-white bg-primary rounded-md font-circular'>
                  Apply for job
                </Button>
              </Link>
            </div>

            <div className='font-circular h-[70vh] overflow-auto custom-scrollbar'>
              <p className='mt-3 font-medium text-lg text-[#18181B]'>
                Web Designer - UIUX
              </p>

              <p className='text-base mt-5 font-normal text-[#545756]'>
                We are seeking new freelancers for a UI/UX project focused on a
                sports niche website. The project involves designing four pages,
                including a homepage, with a minimalistic design approach.
                Candidates should be able to deliver rapid work while
                maintaining high-quality standards. If you are passionate about
                user experience and can create visually appealing interfaces, we
                want to hear from you!
              </p>

              <div className='border-t border-gray-200 mt-7 flex divide-x divide-gray-200 pt-5'>
                <div className='w-1/2'>
                  <p className='font-medium text-base text-[#18181B]'>Skill</p>
                  <p className='text-[#7E8082] font-normal text-base mt-1'>
                    UIUX Designer
                  </p>

                  <p className='text-[#545756] font-normal text-base mt-5'>
                    Expertise
                  </p>

                  <div className='flex items-center space-x-3 mt-2'>
                    <div className='border-[#E4E4E7] border bg-[#F4F4F5] text-[#545756] font-normal rounded-full text-sm py-1 px-3'>
                      Product Design
                    </div>
                    <div className='border-[#E4E4E7] border bg-[#F4F4F5] text-[#545756] font-normal rounded-full text-sm py-1 px-3'>
                      Branding
                    </div>
                    <div className='border-[#E4E4E7] border bg-[#F4F4F5] text-[#545756] font-normal rounded-full text-sm py-1 px-3'>
                      User Research
                    </div>
                  </div>
                </div>

                <div className='w-1/2 pl-8 flex flex-col gap-y-4'>
                  <div className='flex space-x-3'>
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

                    <div className='text-sm'>
                      <p className='text-[#18181B] text-base'>50.5 ATOM</p>
                      <p className='text-[#7E8082]'>Funding</p>
                    </div>
                  </div>

                  <div className='flex space-x-3'>
                    <svg
                      width='18'
                      height='18'
                      viewBox='0 0 18 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M3.16666 16.4961V13.8338C3.16666 12.8803 2.91695 12.3846 2.42611 11.5558C1.83772 10.5625 1.5 9.40312 1.5 8.16495C1.5 4.48399 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48399 14.8333 8.16495C14.8333 8.59972 14.8334 8.81715 14.8515 8.93903C14.8949 9.2304 15.0308 9.48105 15.1646 9.74047L16.5 12.3305L15.4504 12.8551C15.1462 13.0072 14.9942 13.0832 14.8882 13.2235C14.7823 13.3638 14.7525 13.5222 14.6928 13.8389L14.6869 13.8698C14.5503 14.5954 14.3995 15.3965 13.9747 15.9018C13.8247 16.0802 13.639 16.2252 13.4294 16.3274C13.0835 16.4961 12.6583 16.4961 11.8078 16.4961C11.4143 16.4961 11.0196 16.5052 10.6261 16.4956C9.69352 16.4729 9 15.6888 9 14.7783'
                        stroke='#545756'
                        stroke-width='1.125'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                      <path
                        d='M10.791 7.89862C10.4713 7.89862 10.1797 7.77765 9.9588 7.5786M10.791 7.89862C10.791 8.75805 10.2931 9.57435 9.33457 9.57435C8.37607 9.57435 7.87822 10.3906 7.87822 11.25M10.791 7.89862C12.403 7.89862 12.403 5.38513 10.791 5.38513C10.6445 5.38513 10.504 5.41052 10.3734 5.45718C10.4521 3.58364 7.75117 3.075 7.13942 4.83013M7.13942 4.83013C7.58497 5.13082 7.87822 5.64242 7.87822 6.22297M7.13942 4.83013C5.75056 3.89275 3.89912 5.57482 4.77993 7.07458C3.30169 7.2962 3.45974 9.57435 4.96537 9.57435C5.38758 9.57435 5.76083 9.3633 5.98675 9.04035'
                        stroke='#545756'
                        stroke-width='1.125'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>

                    <div className='text-sm'>
                      <p className='text-[#18181B] text-base'>Entry level</p>
                      <p className='text-[#7E8082] max-w-44'>
                        I’m looking for freelancers with the lowest rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='border-t border-gray-200 mt-7 flex divide-x divide-gray-200 pt-5 pb-10'>
                <div className='w-1/2'>
                  <p className='font-medium text-base text-[#18181B]'>
                    Job Activity Updates
                  </p>

                  <div className='font-circular text-sm font-normal mt-5 flex flex-col gap-y-2'>
                    <div className='flex items-center space-x-2'>
                      <ApplicantIcon />

                      <p className='text-[#7E8082]'>Applicants</p>
                      <p className='text-[#545756]'>5 to 10</p>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <FreelancCalendar />
                      <p className='text-[#7E8082]'>Estimated Time</p>
                      <p className='text-[#545756]'>1 - 3 weeks</p>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <LocationIcon />
                      <p className='text-[#7E8082]'>Location</p>
                      <p className='text-[#545756]'>Canada</p>
                    </div>
                  </div>
                </div>

                <div className='w-1/2 pl-8 flex flex-col gap-y-4'>
                  <div className=''>
                    <p className='text-[#545756]'>Job link</p>

                    <div className='rounded-md mt-2 w-max p-3 font-circular text-sm text-[#BEBEBE] bg-[#F4F4F5] border border-[#E4E4E7]'>
                      https://www.Work.com/jobs/
                    </div>

                    <p className='cursor-pointer underline text-primary mt-5 text-base'>
                      Copy link
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog>
        <DialogTrigger asChild>
          <div ref={acceptPayModal} className='hidden'>
            Edit Profile
          </div>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px] bg-white font-circular'>
          <div className='flex flex-col items-center'>
            <p className='text-[20px] font-poppins font-semibold text-[#18181B] mt-5'>
              Receive Payment
            </p>
            <div className='max-w-80 flex justify-center'>
              <span className='text-[#7E8082] font-normal font-circular text-sm text-center mt-5'>
                You’re about to receive{' '}
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
              <Button className='text-white w-full mt-6 px-28'>
                Accept payment
              </Button>
            </div>
            <span className='text-[#7E8082] text-sm font-normal mt-4 mb-2'>
              Need help? <span className='text-primary'>Contact support.</span>
            </span>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <div ref={terminateModal} className='hidden'>
            Edit Profile
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
            <Button className='w-full mt-6 bg-[#FB822F] text-white hover:bg-[#FB822F] focus:bg-[#FB822F]'>
              End Contract
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreelancerDasboard;
