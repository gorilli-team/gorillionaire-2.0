"use client";

import React, { useState, useEffect } from "react";
import { Pagination } from "flowbite-react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { getTimeAgo } from "@/app/utils/time";

interface Investor {
  rank: number;
  address: string;
  points: number;
  activitiesList: Activity[];
}

interface Activity {
  action: string;
  amount: string;
  token: string;
  date: string;
}

const LeaderboardComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const { address } = useAccount();

  const onPageChange = (page: number) => setCurrentPage(page);
  const onActivitiesPageChange = (page: number) => setActivitiesPage(page);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/track/leaderboard`
      );
      const data = await response.json();
      console.log("leaderboard", data);
      setInvestors(data.users || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setInvestors([]);
    }
  };

  const fetchMe = async () => {
    try {
      if (!address) return;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/track/me?address=${address}`
      );
      const data = await response.json();
      console.log("me", data);
      setActivities(data?.activitiesList || []);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      setActivities([]);
    }
  };

  // Fetch data when component mounts and when address changes
  useEffect(() => {
    fetchLeaderboard();
    fetchMe();

    // Set up an interval to refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchLeaderboard();
      fetchMe();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [address]); //eslint-disable-line

  // Update filtered investors when investors or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInvestors(investors);
    } else {
      const filtered = investors.filter((investor) =>
        investor.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvestors(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, investors]);

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
    <div className="w-full bg-gray-100 px-2">
      <div className="w-full mx-auto px-1 sm:px-4 md:px-6 pt-4">
        <div className="bg-white rounded-lg shadow-sm p-1 sm:p-3 md:p-6 mt-4">
          {/* Search */}
          <div className="mb-3 sm:mb-6 px-1 sm:px-0">
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

          {/* Table with reduced padding on mobile */}
          <div className="overflow-x-auto -mx-1 sm:-mx-3 md:-mx-6">
            <div className="px-1 sm:px-3 md:px-6">
              <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[680px] overflow-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-2 pr-1 sm:pr-2 font-medium">RANK</th>
                      <th className="pb-2 pr-1 sm:pr-2 font-medium">INVESTOR</th>
                      <th className="pb-2 pr-1 sm:pr-2 font-medium text-center">ACTIVITIES</th>
                      <th className="pb-2 font-medium">POINTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvestors.map((investor) => (
                      <tr
                        key={investor.address}
                        className="border-b border-gray-100"
                      >
                        <td className="py-3 sm:py-4 h-14 sm:h-16 text-gray-700 pr-1 sm:pr-2">
                          {investor.rank}
                        </td>
                        <td className="py-3 sm:py-4 h-14 sm:h-16 pr-1 sm:pr-2">
                          <div className="flex items-center">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 overflow-hidden">
                              <Image
                                src={`/avatar_${investor.rank % 6}.png`}
                                alt="User Avatar"
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-gray-700 font-bold truncate max-w-[100px] sm:max-w-[200px] md:max-w-full">
                              {investor.address}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 h-14 sm:h-16 text-center text-gray-700 pr-1 sm:pr-2">
                          {investor.activitiesList.length}
                        </td>
                        <td className="py-3 sm:py-4 h-14 sm:h-16 text-gray-700">
                          {investor.points}
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows to maintain fixed height when fewer items */}
                    {emptyInvestorRows.map((_, index) => (
                      <tr
                        key={`empty-${index}`}
                        className="border-b border-gray-100"
                      >
                        <td className="h-14 sm:h-16"></td>
                        <td className="h-14 sm:h-16"></td>
                        <td className="h-14 sm:h-16"></td>
                        <td className="h-14 sm:h-16"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between px-1 sm:px-0">
            <span className="text-sm text-gray-500 mb-3 sm:mb-0 font-bold">
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
        <div className="bg-white rounded-lg shadow-sm p-1 sm:p-3 md:p-6 mt-4 sm:mt-6 mb-6">
          <h2 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 ml-1 sm:ml-0">My activities</h2>

          {/* Activities table with reduced padding on mobile */}
          <div className="overflow-x-auto -mx-1 sm:-mx-3 md:-mx-6">
            <div className="px-1 sm:px-3 md:px-6">
              <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[680px] overflow-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-2 font-medium">ACTIVITY</th>
                      <th className="pb-2 font-medium text-right">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentActivities.length > 0 ? (
                      currentActivities.map((activity, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 sm:py-4 h-14 sm:h-16">
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-2">
                                {activity.action === "Bought" ? "💰" : "💸"}
                              </span>
                              <span className="truncate max-w-[120px] sm:max-w-[250px] md:max-w-full">
                                {activity.action} {activity.amount} {activity.token}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 sm:py-4 h-14 sm:h-16 text-right text-gray-500">
                            {getTimeAgo(activity.date)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-100">
                        <td colSpan={2} className="py-6 sm:py-8 text-center text-gray-500">
                          No activities yet
                        </td>
                      </tr>
                    )}
                    {/* Empty rows to maintain fixed height when fewer items */}
                    {emptyActivityRows.map((_, index) => (
                      <tr
                        key={`empty-activity-${index}`}
                        className="border-b border-gray-100"
                      >
                        <td className="h-14 sm:h-16"></td>
                        <td className="h-14 sm:h-16"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activities Pagination centered */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between px-1 sm:px-0">
            <span className="text-sm text-gray-500 mb-3 sm:mb-0 font-bold">
              <span className="font-normal">Showing</span>{" "}
              {activities.length > 0 ? indexOfFirstActivity + 1 : 0}-
              {Math.min(indexOfLastActivity, activities.length)}{" "}
              <span className="font-normal">of</span> {activities.length}
            </span>
            <div className="flex-grow flex justify-center">
              <Pagination
                currentPage={activitiesPage}
                totalPages={totalActivityPages > 0 ? totalActivityPages : 1}
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

export default LeaderboardComponent;