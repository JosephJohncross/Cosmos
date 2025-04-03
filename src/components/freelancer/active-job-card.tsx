import FreelancCalendar from '../icons/freelance/freelance-calendar';
import { Button } from '../ui/button';
import { useState } from 'react';

type ActiveJobCardProps = {
  acceptPayModal: React.MutableRefObject<HTMLDivElement>;
  terminateContract: React.MutableRefObject<HTMLDivElement>;
  jobId?: string;
  jobData?: {
    title: string;
    amount: string;
    duration: string;
  };
};

const ActiveJobCard = ({
  acceptPayModal,
  terminateContract,
  jobId = '1',
  jobData = {
    title: 'Web Designer - UIUX Role',
    amount: '50.5',
    duration: '1 - 2 weeks',
  },
}: ActiveJobCardProps) => {
  return (
    <div className=''>
      <div className='flex space-x-3'>
        <div className='h-8 rounded-full w-8 bg-primary flex items-center justify-center text-white font-poppins text-[24px] font-semibold'>
          A
        </div>

        <div className=''>
          <div className='flex justify-between items-center font-circular space-x-5'>
            <p className=' text-sm text-[#545756]'>{jobData.title}</p>
            <span className='text-[#7E8082] text-sm '>
              <span className='text-[#18181B]'>{jobData.amount}</span> ATOM
            </span>
          </div>

          <div className='flex items-center space-x-5 font-circular text-sm mt-4'>
            <div className='flex items-center space-x-1'>
              <FreelancCalendar />
              <p className='font-circular text-[#7E8082] text-sm'>
                {jobData.duration}
              </p>
            </div>

            <p className='text-[#7E8082] text-xs'>Now</p>

            <div className='flex items-center space-x-1'>
              <span className='h-1 w-1 bg-[#2ECC71] block rounded-full'></span>
              <p className='text-[#2ECC71] text-sm'>Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center space-x-5 font-circular text-sm mt-4'>
        <Button
          onClick={() => {
            terminateContract.current.click();
          }}
          className='w-1/2 bg-white hover:bg-white rounded-full focus:bg-white border-[#FB822F] text-[#FB822F] border'
          data-job-id={jobId}
        >
          Terminate
        </Button>
        <Button
          onClick={() => {
            acceptPayModal.current.click();
          }}
          className='w-1/2 bg-[#F4F4F5] hover:bg-[#F4F4F5] rounded-full focus:bg-[#F4F4F5] text-[#7E8082] border-[#E4E4E7] border'
          data-job-id={jobId}
        >
          Accept pay
        </Button>
      </div>
    </div>
  );
};

export default ActiveJobCard;
