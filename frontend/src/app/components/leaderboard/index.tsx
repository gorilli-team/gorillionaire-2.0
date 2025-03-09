"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Pagination } from "flowbite-react";
import { useAccount } from "wagmi";
interface Investor {
  rank: number;
  username: string;
  avatar: string;
  signals: number;
  value: number;
  performance: number;
}

interface Activity {
  action: string;
  amount: string;
  token: string;
  date: string;
}

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([]);

  const { address } = useAccount();

  const onPageChange = (page: number) => setCurrentPage(page);
  const onActivitiesPageChange = (page: number) => setActivitiesPage(page);

  const investors = useMemo<Investor[]>(() => [], []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/track/leaderboard`
      );
      const data = await response.json();
      console.log("leaderboard", data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchMe = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/track/me?address=${address}`
      );
      const data = await response.json();
      console.log("me", data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchMe();
  }, []);

  useEffect(() => {
    setFilteredInvestors(investors);
  }, [investors]);

  // Filter investors based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInvestors(investors);
    } else {
      const filtered = investors.filter((investor) =>
        investor.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvestors(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, investors]);

  const activities = useMemo<Activity[]>(() => [], []);

  // Pagination logic for investors
  const itemsPerPage = 10;
  const totalInvestorPages = Math.ceil(filteredInvestors.length / itemsPerPage);

  // Get current investors for table based on page
  const indexOfLastInvestor = currentPage * itemsPerPage;
  const indexOfFirstInvestor = indexOfLastInvestor - itemsPerPage;
  const currentInvestors = filteredInvestors.slice(
    indexOfFirstInvestor,
    indexOfLastInvestor
  );

  // Pagination logic for activities
  const totalActivityPages = Math.ceil(activities.length / itemsPerPage);

  // Get current activities for table based on page
  const indexOfLastActivity = activitiesPage * itemsPerPage;
  const indexOfFirstActivity = indexOfLastActivity - itemsPerPage;
  const currentActivities = activities.slice(
    indexOfFirstActivity,
    indexOfLastActivity
  );

  // Function to create empty rows to maintain height
  const getEmptyRows = <T,>(items: T[], itemsPerPage: number): null[] => {
    const currentItemCount = items.length;
    if (currentItemCount < itemsPerPage) {
      return Array(itemsPerPage - currentItemCount).fill(null);
    }
    return [];
  };

  // Empty rows for both tables
  const emptyInvestorRows = getEmptyRows(currentInvestors, itemsPerPage);
  const emptyActivityRows = getEmptyRows(currentActivities, itemsPerPage);

  return (
    <div className="bg-gray-100">
      <div className="max-w-8xl mx-auto p-8 pt-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 border border-gray-200 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Table with fixed height container */}
          <div className="overflow-x-auto">
            <div className="h-[680px] overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-2 font-medium">RANK</th>
                    <th className="pb-2 font-medium">INVESTOR</th>
                    <th className="pb-2 font-medium text-center">
                      ACCEPTED SIGNALS
                    </th>
                    <th className="pb-2 font-medium">TOTAL VALUE</th>
                    <th className="pb-2 font-medium">OVERALL PERFORMANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvestors.map((investor) => (
                    <tr
                      key={investor.rank}
                      className="border-b border-gray-100"
                    >
                      <td className="py-4 h-16 text-gray-700">
                        {investor.rank}
                      </td>
                      <td className="py-4 h-16">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                            {investor.avatar}
                          </div>
                          <span className="text-gray-700 font-bold">
                            {investor.username}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 h-16 text-center text-gray-700">
                        {investor.signals}
                      </td>
                      <td className="py-4 h-16 text-gray-700">
                        ${" "}
                        {investor.value.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 h-16">
                        <span
                          className={`text-green-${
                            investor.performance >= 10 ? "500" : "400"
                          }`}
                        >
                          + {investor.performance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows to maintain fixed height when fewer items */}
                  {emptyInvestorRows.map((_, index) => (
                    <tr
                      key={`empty-${index}`}
                      className="border-b border-gray-100"
                    >
                      <td className="h-16"></td>
                      <td className="h-16"></td>
                      <td className="h-16"></td>
                      <td className="h-16"></td>
                      <td className="h-16"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
            <span className="text-sm text-gray-500 mb-4 sm:mb-0 font-bold">
              <span className="font-normal">Showing</span>{" "}
              {filteredInvestors.length > 0 ? indexOfFirstInvestor + 1 : 0}-
              {Math.min(indexOfLastInvestor, filteredInvestors.length)}{" "}
              <span className="font-normal">of</span> {filteredInvestors.length}
            </span>
            <div className="flex-grow flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalInvestorPages > 0 ? totalInvestorPages : 1}
                onPageChange={onPageChange}
                showIcons={true}
              />
            </div>
            <div className="hidden sm:block sm:w-32"></div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-medium mb-4">My activities</h2>

          {/* Activities table with fixed height */}
          <div className="overflow-x-auto">
            <div className="h-[680px] overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-2 font-medium">ACTIVITY</th>
                    <th className="pb-2 font-medium text-right">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentActivities.map((activity, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 h-16">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-2">
                            {activity.action === "Bought" ? "💰" : "💸"}
                          </span>
                          <span>
                            {activity.action} {activity.amount} {activity.token}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 h-16 text-right text-gray-500">
                        {activity.date}
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows to maintain fixed height when fewer items */}
                  {emptyActivityRows.map((_, index) => (
                    <tr
                      key={`empty-activity-${index}`}
                      className="border-b border-gray-100"
                    >
                      <td className="h-16"></td>
                      <td className="h-16"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activities Pagination centered */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between">
            <span className="text-sm text-gray-500 mb-4 sm:mb-0 font-bold">
              <span className="font-normal">Showing</span>{" "}
              {indexOfFirstActivity + 1}-
              {Math.min(indexOfLastActivity, activities.length)}{" "}
              <span className="font-normal">of</span> {activities.length}
            </span>
            <div className="flex-grow flex justify-center">
              <Pagination
                currentPage={activitiesPage}
                totalPages={totalActivityPages}
                onPageChange={onActivitiesPageChange}
                showIcons={true}
              />
            </div>
            <div className="hidden sm:block sm:w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
