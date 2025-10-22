import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getTransactions, getCategories } from '@/lib/storage';

const CategoryPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const transactions = getTransactions().filter(t => new Date(t.date) <= today);
    const categories = getCategories();
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const monthlyExpenses = transactions.filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    });

    const categoryData = categories.map(cat => {
      const total = monthlyExpenses
        .filter(t => t.category === cat.name)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: cat.name,
        value: Math.round(total),
        color: cat.color
      };
    }).filter(item => item.value > 0);

    setData(categoryData);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dépenses par catégorie</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Aucune dépense ce mois-ci
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;