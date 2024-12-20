'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Label, Pie, PieChart,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { MonthlyReport } from '@/lib/types/transaction';
import { getMonthlyReport } from '@/lib/services/transaction.service';
import { auth } from '@/lib/firebase';
import { format } from 'date-fns';
import { config } from 'node:process';
import { AddTransactionDialog } from '../transactions/add-transaction-dialog';
// import { ChartIcon } from 'lucide-react';


const categoryColors: { [key: string]: string } = {
  Food: '#FF6384',
  Transportation: '#FFCE56',
  Entertainment: '#4BC0C0',
  Shopping: '#9966FF',
  Bills: '#FF9F40',
  Education: '#FFCD56',
  Other: '#4BC0C0',
  // Add more categories and colors as needed
};

interface MonthlyReportCardProps {
  monthlyBudget: number;
}

export function MonthlyReportCard({ monthlyBudget }: MonthlyReportCardProps) {
  const [report, setReport] = useState<MonthlyReport | null>(null);

  const loadReport = async () => {
    const user = auth.currentUser;
    if (user) {
      const monthlyReport = await getMonthlyReport(
        user.uid,
        new Date(),
        monthlyBudget
      );
      setReport(monthlyReport);
    }
  };

  useEffect(() => {
    loadReport();
  }, [monthlyBudget]);

  if (!report) {
    return null;
  }

  const chartData = Object.entries(report.categoryBreakdown).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
      fill: categoryColors[category] || '#8884d8',
    })
  );

  const chartConfig: ChartConfig = Object.entries(report.categoryBreakdown).reduce(
    (config, [category, amount]) => {
      config[category] = {
        label: category,
        color: categoryColors[category] || 'hsl(var(--chart-default))',
      };
      return config;
    },
    {} as ChartConfig
  );

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Monthly Report ({format(new Date(), 'MMMM yyyy')})</span>
          <AddTransactionDialog 
            onSuccess={loadReport} 
            remainingBudget={report?.remainingBudget || 0} 
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="text-sm font-medium">Total Spent</div>
            <div className="text-2xl font-bold">
            ₹ {report.totalSpent.toFixed(2)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="text-sm font-medium">Monthly Budget</div>
            <div className="text-2xl font-bold">
            ₹ {monthlyBudget.toFixed(2)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="text-sm font-medium">Remaining</div>
            <div className="text-2xl font-bold">
            ₹ {report.remainingBudget.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
          <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {report.totalSpent.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Spends
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    
  );
}
