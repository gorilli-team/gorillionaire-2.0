import React from "react";
import { Card } from "../vault_card/index";
import styles from "./index.module.css";

interface FeedNewsProps {
    imageUrl: string;
    vaultName: string;
    onDepositClick: (vaultName: string) => void;
    onCardClick: (vaultName: string) => void;
    onWithdrawClick: (vaultName: string) => void;
    setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}   


const FeedNews: React.FC<FeedNewsProps> = ({ 
    imageUrl, 
    vaultName, 
    onDepositClick,
    onCardClick,
    onWithdrawClick,
    setSelectedPage,
}) => {
  const handleCardClick = (vaultName: string) => {
    onCardClick(vaultName);
    setSelectedPage("Vault");
  };

  return (
    <div className={`${styles.feedNews} pt-6 p-2 flex items-start gap-4 w-[600px]`}>
      <img src={imageUrl} alt="Profile" className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Gorillionaire</span>
          <span className="text-yellow-500">🦍</span>
          </div>
        <div className="mt-4">
          <Card
            title={vaultName}
            chainName="Base"
            chainImage="/base.jpg"
            onDeposit={() => onDepositClick(vaultName)}
            onCardClick={() => handleCardClick(vaultName)}
            onWithdraw={() => onWithdrawClick(vaultName)}
          />
        </div>
      </div>
    </div>
  );
};

  
export default FeedNews;
  