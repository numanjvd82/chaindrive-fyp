import { useQuery } from "react-query";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { ethers } from "ethers";

interface TermsConfig {
  lateFeePerHour: string;
  maxLateFeeMultiplier: number;
  damageAssessmentPeriod: number;
  violationPenaltyRate: number;
}

interface ContractTerms {
  termsAndConditions: string;
  termsConfig: TermsConfig;
}

const fetchContractTerms = async (
  signer: ethers.Signer
): Promise<ContractTerms> => {
  const contract = getContractInstance(signer);

  const [termsAndConditions, termsConfig] = await Promise.all([
    contract.getTermsAndConditions(),
    contract.getTermsConfig(),
  ]);

  return {
    termsAndConditions,
    termsConfig: {
      lateFeePerHour: ethers.formatEther(termsConfig.lateFeePerHour),
      maxLateFeeMultiplier: Number(termsConfig.maxLateFeeMultiplier),
      damageAssessmentPeriod: Number(termsConfig.damageAssessmentPeriod),
      violationPenaltyRate: Number(termsConfig.violationPenaltyRate),
    },
  };
};

export const useContractTerms = () => {
  const { signer, account } = useWallet();

  return useQuery<ContractTerms, Error>(
    ["contractTerms", account],
    () => fetchContractTerms(signer!),
    {
      enabled: !!signer,
      staleTime: 10 * 60 * 1000, // Cache for 10 minutes
      onError: (error) => {
        console.error("Error fetching contract terms:", error);
      },
    }
  );
};
