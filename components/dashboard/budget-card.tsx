"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface BudgetCardProps {
  amount: number;
}

export function BudgetCard({ amount }: BudgetCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Monthly Budget
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">₹ {amount.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}