import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BloodInventoryChart = ({ inventoryDepth }) => {
  if (!inventoryDepth || Object.keys(inventoryDepth).length === 0) {
    return <div className="text-gray-500 text-center py-10">No inventory data available.</div>;
  }

  // Convert object { "A+": 10, "B+": 5 } to array [{ name: "A+", amount: 10 }, ...]
  const data = Object.keys(inventoryDepth).map(key => ({
    name: key,
    amount: inventoryDepth[key],
  }));

  // Sort logically (A, B, AB, O)
  const order = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

  // Custom colors based on blood group for visual flair
  const getBarColor = (name) => {
    if (name.includes('A')) return '#ef4444'; // red-500
    if (name.includes('B')) return '#f97316'; // orange-500
    if (name.includes('O')) return '#eab308'; // yellow-500
    return '#8b5cf6'; // violet-500
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }}
            contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
            }}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BloodInventoryChart;
