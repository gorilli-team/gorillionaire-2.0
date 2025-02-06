import React from "react";

interface Depositor {
  rank: number;
  investor: string;
  percentage: string;
  value: string;
  image: string;
}

const VaultDepositors: React.FC = () => {
  const depositors: Depositor[] = [
    { rank: 1, investor: "0x86fd0D762B53f21011e531fa57629D294d576A36", percentage: "10.00%", value: "$5,000", image: "/gorillionaire.jpg" },
    { rank: 2, investor: "0x86fd0D762B53f21011e531fa57629D294d576A36", percentage: "5.00%", value: "$2,500", image: "/gorillionaire.jpg" },
  ];

  return (
    <div className="p-4">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Investor</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Percentage</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          {depositors.map((depositor) => (
            <tr key={depositor.rank}>
              <td className="border border-gray-300 px-4 py-2">{depositor.rank}</td>
              <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                <img
                  src={depositor.image}
                  alt="Investor"
                  className="w-8 h-8 rounded-full"
                />
                {depositor.investor}
              </td>
              <td className="border border-gray-300 px-4 py-2">{depositor.percentage}</td>
              <td className="border border-gray-300 px-4 py-2">{depositor.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaultDepositors;