import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Layouts & Hooks */
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth.jsx';

/* API */
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

/* Utils */
import { addThousandsSeparator } from '../../utils/helper.js';

/* Icons */
import { IoMdCard } from "react-icons/io";
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';

/* Components */
import InfoCard from '../../components/Cards/InfoCard.jsx';
import RecentTransactions from '../../components/Dashboard/RecentTransactions.jsx';
import FinanceOverview from '../../components/Dashboard/FinanceOverview.jsx';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions.jsx';
import Last30DaysExpense from '../../components/Dashboard/Last30DaysExpense.jsx';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart.jsx';
import RecentIncome from '../../components/Dashboard/RecentIncome.jsx';

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_DATA
      );

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpense?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpense
            data={dashboardData?.last30DaysExpense?.transactions || []}
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 2) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
