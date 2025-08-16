import { useState, useEffect } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosCall, IoIosInformation } from "react-icons/io";
import { apiService } from "../services/api";

interface SpinRecord {
  id: string;
  prizeCents: number;
  createdAt: string;
}

interface WinData {
  totalCents: number;
  count: number;
  items: SpinRecord[];
}

export default function AdminDashboard() {
  const [winData, setWinData] = useState<WinData>({ totalCents: 0, count: 0, items: [] });
  const [selectedMonth, setSelectedMonth] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load win data on component mount
  useEffect(() => {
    loadWinData();
  }, []);

  const loadWinData = async () => {
    try {
      setLoading(true);
      // Try to get results from the new backend
      const data = await apiService.getSpinResults(50, 0);
      if (data.success) {
        // Transform data to match expected format using new backend structure
        const transformedData = {
          totalCents: data.statistics.totalPrizeAmount * 100, // Convert dollars to cents
          count: data.statistics.totalSpins,
          items: data.results
            .filter((result: any) => result.spin_time) // Only include results that have been spun
            .map((result: any) => ({
              id: result.spin_id?.toString() || result.code,
              prizeCents: (result.prize || 0) * 100, // Convert dollars to cents
              createdAt: result.spin_time,
            }))
        };
        setWinData(transformedData);
      } else {
        // Fallback to empty data
        setWinData({ totalCents: 0, count: 0, items: [] });
      }
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load data");
      console.error("Failed to load win data:", err);
      // Set empty data on error
      setWinData({ totalCents: 0, count: 0, items: [] });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    try {
      setIsGenerating(true);
      setError("");
      // Generate 5-digit code using new backend
      const response = await apiService.generateCode();
      if (response.success) {
        setGeneratedCode(response.code.toString());
        // Store the validity info for display
        localStorage.setItem('lastGeneratedCodeInfo', JSON.stringify({
          code: response.code,
          validFor: response.validFor || "3 hours",
          validUntil: response.validUntil
        }));
      } else {
        setError("Failed to generate code");
      }
      // Refresh win data to show updated stats
      await loadWinData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate code");
      console.error("Failed to generate code:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Filter records by month if selected
  const filteredRecords = selectedMonth
    ? winData.items.filter((r) => r.createdAt.startsWith(selectedMonth))
    : winData.items;

  return (
    <div className="py-4 px-2 sm:px-6 md:px-12">
      <div className="space-y-6 backdrop-blur-xl bg-white/5 rounded-xl p-4 sm:p-6">
        {/* Welcome Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <img
            src="/jpg/admin.png"
            alt="avatar"
            className="w-14 h-14 rounded-full"
          />
          <div>
            <p className="text-[22px] sm:text-[28px] font-semibold text-gray-400 leading-7">
              Welcome back Admin! - Total Wins: {formatCurrency(winData.totalCents)}
            </p>
            <p className="text-sm sm:text-base mt-2 text-[#AEB9E1]">
              {winData.count} total spins • Analyze your player's spin wheel reports and status.
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Generate Code Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-xl p-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-center sm:items-center gap-6">
            <p className="text-[20px] sm:text-[26px] font-bold text-secondary">
              GENERATE NEW ONE TIME 5 DIGIT CODE
            </p>
            <button 
              className="button-primary px-4 py-2 w-full sm:w-auto disabled:opacity-50"
              onClick={generateCode}
              disabled={isGenerating}
            >
              <span className="button-content">
                {isGenerating ? "GENERATING..." : "GENERATE CODE"}
              </span>
            </button>
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {generatedCode.split('').map((digit, i) => (
              <input
                key={i}
                value={digit}
                readOnly
                type="text"
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border border-gray-300 rounded-md bg-gray-100 text-gray-800"
              />
            ))}
            {/* Show empty inputs if no code generated yet */}
            {!generatedCode && [0, 1, 2, 3, 4].map((i) => (
              <input
                key={i}
                readOnly
                type="text"
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-bold border border-gray-300 rounded-md text-secondary"
                placeholder="-"
              />
            ))}
          </div>

                            {generatedCode && (
                    <div className="text-center">
                      <p className="text-green-400 text-sm">✅ Code generated successfully! Valid for 3 hours.</p>
                      <p className="text-gray-300 text-xs mt-1">Code: <span className="font-mono font-bold">{generatedCode}</span></p>
                      {(() => {
                        const codeInfo = localStorage.getItem('lastGeneratedCodeInfo');
                        if (codeInfo) {
                          const info = JSON.parse(codeInfo);
                          if (info.validUntil) {
                            return <p className="text-gray-400 text-xs mt-1">Expires: {new Date(info.validUntil).toLocaleString()}</p>;
                          }
                        }
                        return null;
                      })()}
                    </div>
                  )}
        </div>

        {/* Spin Records Table */}
        <div className="backdrop-blur-xl bg-white/5 rounded-xl p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <p className="text-secondary text-[24px] font-semibold">
              Recent Spin Records ({filteredRecords.length})
            </p>
            <div className="flex gap-2">
              <button 
                onClick={loadWinData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white px-3 py-1 rounded-md text-sm"
              >
                <option value="">All Records</option>
                <option value="2025-01">January 2025</option>
                <option value="2024-12">December 2024</option>
                <option value="2024-11">November 2024</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading spin records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No spin records found</p>
              <p className="text-gray-500 text-sm mt-1">Generate codes and let players spin to see results here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-200">
                <thead>
                  <tr className="border-b border-gray-700 whitespace-nowrap">
                    <th className="px-2 py-2">S.N</th>
                    <th className="px-2 py-2">Spin ID</th>
                    <th className="px-2 py-2">Date & Time</th>
                    <th className="px-2 py-2">Prize Won</th>
                    <th className="px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, idx) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-700 hover:bg-white/10 transition"
                    >
                      <td className="px-2 py-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-md text-center text-white text-sm font-semibold flex items-center justify-center">
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <span className="font-mono text-xs">#{record.id.slice(-8)}</span>
                      </td>
                      <td className="px-2 py-2">{formatDateTime(record.createdAt)}</td>
                      <td className="px-2 py-2">
                        <span className={`font-bold ${record.prizeCents > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                          {formatCurrency(record.prizeCents)}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold inline-block text-white bg-green-600">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <button 
              onClick={loadWinData}
              className="button-primary px-4 py-2 text-sm"
              disabled={loading}
            >
              <span className="button-content">
                {loading ? "Loading..." : "Refresh Data"}
              </span>
            </button>
          </div>
        </div>
        <p className="text-secondary text-[18px] sm:text-[20px] font-semibold text-center mt-20">
          CONNECT WITH US
        </p>

        {/* Social Icons */}
        <div className="flex gap-4 justify-center mt-4">
          <div className="circle-button w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
            <FaTelegramPlane size={20} className="text-black" />
          </div>
          <div className="circle-button w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
            <IoIosCall size={20} className="text-black" />
          </div>
          <div className="circle-button w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            <IoIosInformation size={32} className="text-black" />
          </div>
        </div>

        {/* Copyright */}
        <p className="text-secondary text-[14px] sm:text-[16px] mt-4 text-center font-regular">
          © Copyright 2025, All Rights Reserved by{" "}
          <strong>Acesweeps.com</strong>
        </p>
      </div>
    </div>
  );
}
