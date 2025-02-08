interface Depositor {
    investor: string;
    deposits: number;
    withdraws: number;
    image: string;
  }
  
  interface VaultDepositorsProps {
    depositors: Depositor[];
  }
  
  const VaultDepositors: React.FC<VaultDepositorsProps> = ({ depositors }) => {
    return (
      <div className="p-4">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Investor</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Deposits</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Withdraws</th>
            </tr>
          </thead>
          <tbody>
            {depositors.map((depositor, index) => (
              <tr key={index}>
                <td className="border-b border-l border-gray-300 px-4 py-2 flex items-center gap-2">
                  <img
                    src={depositor.image}
                    alt="Investor Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  {depositor.investor}
                </td>
                <td className="border border-gray-300 px-4 py-2">{depositor.deposits}</td>
                <td className="border border-gray-300 px-4 py-2">{depositor.withdraws}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default VaultDepositors;
  