
import React, { useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useTokenStore } from "@/stores/tokenStore";
import { useWallet } from "@/contexts/WalletContext";
import { format, subDays } from "date-fns";

export const TokenEarningsChart: React.FC = () => {
  const { address } = useWallet();
  const { getUserTransactions } = useTokenStore();
  
  const chartData = useMemo(() => {
    if (!address) return [];
    
    const transactions = getUserTransactions(address);
    const today = new Date();
    const dataPoints = [];
    
    // Generate data for the last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, "MMM dd");
      
      // Filter transactions for this day
      const dayTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.timestamp);
        return format(txDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      });
      
      // Calculate values
      const tokensBought = dayTransactions
        .filter(tx => tx.type === 'buy')
        .reduce((sum, tx) => sum + tx.amount, 0);
        
      const tokensSold = dayTransactions
        .filter(tx => tx.type === 'sell')
        .reduce((sum, tx) => sum + tx.amount, 0);
        
      const rewards = dayTransactions
        .filter(tx => tx.type === 'reward')
        .reduce((sum, tx) => sum + (tx.amount * tx.price), 0);
      
      dataPoints.push({
        date: dateString,
        tokens: tokensBought - tokensSold,
        rewards: parseFloat(rewards.toFixed(4)),
        value: parseFloat((dayTransactions
          .filter(tx => tx.type === 'sell' || tx.type === 'reward')
          .reduce((sum, tx) => sum + (tx.amount * tx.price), 0)).toFixed(4))
      });
    }
    
    return dataPoints;
  }, [address, getUserTransactions]);
  
  // If no data, show placeholder
  if (chartData.length === 0 || chartData.every(d => d.tokens === 0 && d.rewards === 0 && d.value === 0)) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-md">
        <p className="text-muted-foreground">No earnings data available yet</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value} AR`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'tokens') return [`${value} tokens`, 'Tokens'];
              if (name === 'rewards') return [`${value} AR`, 'Rewards'];
              return [`${value} AR`, 'Value'];
            }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="value" 
            name="Earnings (AR)"
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="tokens" 
            name="Tokens"
            stroke="#82ca9d" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
