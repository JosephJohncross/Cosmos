import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { useXionWallet } from './xion-context';
import { useToast } from '../hooks/use-toast';

type FreelancerContextProps = {
  submitJob: (jobData: any) => Promise<boolean>;
  applyForJob: (jobId: string, proposal: any) => Promise<boolean>;
  fetchFreelancerJobs: () => Promise<any[]>;
};

type FreelancerProviderProps = {
  children?: React.ReactNode;
};

export const FreelancerContext = createContext<FreelancerContextProps | null>(
  null
);

const FreelancerProvider = ({ children }: FreelancerProviderProps) => {
  const { executeContract, queryContract, address, isConnected } =
    useXionWallet();
  const { toast } = useToast();

  // Example contract address - should be replaced with actual contract in production
  const jobContractAddress = import.meta.env.VITE_JOB_CONTRACT_ADDRESS || '';

  const submitJob = async (jobData: any): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please join to submit a job',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const msg = {
        create_job: {
          ...jobData,
          owner: address,
        },
      };

      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        toast({
          title: 'Success',
          description: 'Job posted successfully',
          variant: 'default',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error submitting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit job. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const applyForJob = async (
    jobId: string,
    proposal: any
  ): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet to apply for this job',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Format according to contract expectations
      const msg = {
        SubmitProposal: {
          job_id: parseInt(jobId),
          bid_amount: proposal.bidAmount,
          cover_letter: proposal.message,
          contact_info: {
            email: proposal.email,
            phone: proposal.phone || '',
          },
          freelancer_address: address,
        },
      };

      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        toast({
          title: 'Success',
          description: 'Application submitted successfully',
          variant: 'default',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply for job. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const fetchFreelancerJobs = async (): Promise<any[]> => {
    if (!isConnected) return [];

    try {
      const query = {
        GetFreelancerJobs: {
          freelancer_address: address,
        },
      };

      const result = await queryContract(jobContractAddress, query);
      return result?.jobs || [];
    } catch (error) {
      console.error('Error fetching freelancer jobs:', error);
      return [];
    }
  };

  return (
    <FreelancerContext.Provider
      value={{
        submitJob,
        applyForJob,
        fetchFreelancerJobs,
      }}
    >
      {children}
    </FreelancerContext.Provider>
  );
};

export const useFreelancer = () => {
  const context = useContext(FreelancerContext);
  if (!context) {
    throw new Error('useFreelancer must be used within an FreelancerProvider');
  }

  return context;
};

export default FreelancerProvider;
