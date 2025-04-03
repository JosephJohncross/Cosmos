import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/use-toast';
import { useXionWallet } from './xion-context';

interface JobData {
  title: string;
  description: string;
  budget: string;
}

interface ClientContextType {
  postJob: (jobData: JobData) => Promise<boolean>;
  acceptProposal: (
    jobId: number,
    freelancerAddress: string
  ) => Promise<boolean>;
  getJobDetails: (jobId: number) => Promise<any>;
  getJobProposals: (jobId: number) => Promise<any[]>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const { isConnected, address, executeContract, queryContract } =
    useXionWallet();
  const jobContractAddress = import.meta.env.VITE_JOB_CONTRACT_ADDRESS || '';

  const postJob = async (jobData: JobData): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet to post a job',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const msg = {
        post_job: {
          title: jobData.title,
          description: jobData.description,
          budget: jobData.budget,
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
      console.error('Error posting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to post job. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const acceptProposal = async (
    jobId: number,
    freelancerAddress: string
  ): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: 'Not connected',
        description: 'Please connect your wallet to accept this proposal',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const msg = {
        accept_proposal: {
          job_id: jobId,
          freelancer: freelancerAddress,
        },
      };

      const result = await executeContract(jobContractAddress, msg);

      if (result) {
        toast({
          title: 'Success',
          description: 'Proposal accepted successfully',
          variant: 'default',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept proposal. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getJobDetails = async (jobId: number): Promise<any> => {
    try {
      const query = {
        get_job_details: {
          job_id: jobId,
        },
      };

      const result = await queryContract(jobContractAddress, query);
      return result || null;
    } catch (error) {
      console.error('Error fetching job details:', error);
      return null;
    }
  };

  const getJobProposals = async (jobId: number): Promise<any[]> => {
    try {
      const query = {
        get_job_proposals: {
          job_id: jobId,
        },
      };

      const result = await queryContract(jobContractAddress, query);
      return result || [];
    } catch (error) {
      console.error('Error fetching job proposals:', error);
      return [];
    }
  };

  return (
    <ClientContext.Provider
      value={{
        postJob,
        acceptProposal,
        getJobDetails,
        getJobProposals,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }

  return context;
};
