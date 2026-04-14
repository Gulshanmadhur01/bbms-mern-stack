import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityTrendChart = ({ recentActivity }) => {
  if (!recentActivity || recentActivity.length === 0) {
    return <div className="text-gray-500 text-center py-10">No recent activity to display.</div>;
  }

  // Aggregate activity by day for the chart
  const activityMap = {};

  // Sort activity incrementally
  const sortedActivity = [...recentActivity].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  sortedActivity.forEach((activity) => {
    const dateObj = new Date(activity.timestamp);
    const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

    if (!activityMap[dateStr]) {
      activityMap[dateStr] = { date: dateStr, count: 0 };
    }
    
    activityMap[dateStr].count += 1;
  });

  const data = Object.values(activityMap);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs text-gray-600" />
          <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-600" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#ef4444" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCount)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityTrendChart;
