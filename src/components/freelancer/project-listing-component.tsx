import { useXionWallet } from '../../context/xion-context';
import FreelancCalendar from '../icons/freelance/freelance-calendar';

export type ProjectListingComponentProps = {
  data: ProjectListingComponentType;
  jobDetailsModal: React.MutableRefObject<HTMLDivElement>;
  onViewDetails?: () => void;
};

export type ProjectListingComponentType = {
  timePosted: string;
  role: string;
  hourlyPay: string;
  duration: string;
  detail: string;
  skills: string[];
  verified: boolean;
  funding: string;
  applicants: string;
  location: string;
  id?: string;
};

const ProjectListingComponent = ({
  data: {
    applicants,
    detail,
    duration,
    funding,
    hourlyPay,
    location,
    role,
    skills,
    timePosted,
    verified,
    id,
  },
  jobDetailsModal,
  onViewDetails,
}: ProjectListingComponentProps) => {
  const { isConnected } = useXionWallet();

  const handleClick = () => {
    console.log('Job clicked:', { id, role });

    if (onViewDetails) {
      onViewDetails();
    } else {
      jobDetailsModal.current.click();
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className='pt-5 font-circular cursor-pointer first:pt-0'
      >
        <p className='text-[#7E8082] text-sm'>Posted {timePosted}</p>
        <p className='mt-2 font-medium text-lg text-[#18181B]'>{role}</p>

        <div className='py-4 flex items-center text-[#7E8082] text-sm space-x-2'>
          <p className=''>Hourly {hourlyPay}</p>
          <p className=''>-</p>
          <p className=''>Est. Time: {duration}</p>
          {verified && (
            <div className='flex items-center px-2 py-0.5 bg-green-50 rounded-lg'>
              <span className='inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1'></span>
              <span className='text-xs text-green-800'>Verified</span>
            </div>
          )}
        </div>

        <p className='text-base font-normal text-[#545756] line-clamp-2'>
          {detail}
        </p>

        <div className='mt-5 flex items-center space-x-3 flex-wrap gap-y-2'>
          {skills.map((skill, index) => (
            <div
              key={index}
              className='border-[#E4E4E7] bg-[#F4F4F5] text-[#545756] rounded-full text-sm py-1 px-3'
            >
              {skill}
            </div>
          ))}
        </div>

        <div className='flex items-center space-x-6 mt-5 flex-wrap'>
          <div className='flex items-center space-x-1'>
            <p className='text-sm font-normal text-[#7E8082]'>Funding:</p>
            <p className='text-[#545756]'>{funding}</p>
          </div>

          <div className='flex items-center space-x-1'>
            <p className='text-sm font-normal text-[#7E8082]'>Applicants:</p>
            <p className='text-[#545756]'>{applicants}</p>
          </div>

          <div className='flex items-center space-x-1'>
            <FreelancCalendar />
            <p className='text-sm font-normal text-[#7E8082]'>{duration}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectListingComponent;
