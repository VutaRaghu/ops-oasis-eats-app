
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailySales } from '@/types';

interface CategoryBreakdownProps {
  salesData: DailySales[];
}

export function CategoryBreakdown({ salesData }: CategoryBreakdownProps) {
  // Early return if no data
  if (!salesData.length) return null;
  
  // Get categories from the first day's data
  const categories = Object.keys(salesData[0].categories);
  
  // Calculate totals for each category across all days
  const categoryTotals = categories.reduce((acc, category) => {
    const total = salesData.reduce(
      (sum, day) => sum + (day.categories[category]?.totalAmount || 0), 
      0
    );
    return { ...acc, [category]: total };
  }, {} as Record<string, number>);
  
  // Calculate grand total
  const grandTotal = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  
  // Sort categories by total amount (descending)
  const sortedCategories = categories.sort(
    (a, b) => categoryTotals[b] - categoryTotals[a]
  );

  return (
    <Card className="col-span-1 md:col-span-2 fade-in">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCategories.map(category => {
            const percentage = grandTotal ? (categoryTotals[category] / grandTotal) * 100 : 0;
            
            return (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category}</span>
                  <span className="font-medium">₹{categoryTotals[category].toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
