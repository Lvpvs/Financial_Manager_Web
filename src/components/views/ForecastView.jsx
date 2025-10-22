import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getAccountBalance } from '@/lib/storage';
import { generateForecastData } from '@/lib/forecast';
import ForecastChart from '@/components/forecast/ForecastChart';

const ForecastView = () => {
  const [forecastDate, setForecastDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectedBalance, setProjectedBalance] = useState(0);
  const [forecastPeriod, setForecastPeriod] = useState(3);
  const [chartData, setChartData] = useState([]);

  const calculateProjection = (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(23, 59, 59, 999);

    const totalProjectedBalance = getAccountBalance(null, targetDate);
    setProjectedBalance(totalProjectedBalance);
  };

  useEffect(() => {
    calculateProjection(forecastDate);
    const data = generateForecastData(forecastPeriod);
    setChartData(data);
  }, [forecastPeriod]);

  const handleDateChange = (e) => {
    setForecastDate(e.target.value);
  };

  const handleCalculate = () => {
    calculateProjection(forecastDate);
  };

  const handlePeriodChange = (months) => {
    setForecastPeriod(months);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prévisions</h1>
        <p className="text-gray-600 mt-1">Projection de vos finances futures</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculer le solde à une date précise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full sm:w-auto flex-grow">
              <Label htmlFor="forecast-date">Date de prévision</Label>
              <Input
                id="forecast-date"
                type="date"
                value={forecastDate}
                onChange={handleDateChange}
                className="mt-1"
              />
            </div>
            <Button onClick={handleCalculate}>Calculer</Button>
          </div>

          <div className="pt-6 text-center">
            <p className="text-lg text-gray-600">Solde total projeté au {new Date(forecastDate).toLocaleDateString('fr-FR')}</p>
            <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mt-2">
              {projectedBalance.toFixed(2)} €
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Évolution des finances</CardTitle>
            <div className="flex gap-2">
              {[1, 3, 6].map(p => (
                <Button
                  key={p}
                  variant={forecastPeriod === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodChange(p)}
                >
                  {p} mois
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ForecastChart data={chartData} period={`${forecastPeriod} mois`} />
          ) : (
            <p>Aucune donnée à afficher.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastView;