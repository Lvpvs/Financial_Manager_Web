import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="label font-bold">{`${label}`}</p>
        <p className="text-blue-600">{`Solde : ${payload[0].value.toFixed(2)} €`}</p>
        <p className="text-green-600">{`Revenus : ${payload[1].value.toFixed(2)} €`}</p>
        <p className="text-red-600">{`Dépenses : ${payload[2].value.toFixed(2)} €`}</p>
      </div>
    );
  }
  return null;
};

const ForecastChart = ({ data }) => {
  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} name="Solde prévu" dot={false} />
          <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Revenus" dot={false} />
          <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Dépenses" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;