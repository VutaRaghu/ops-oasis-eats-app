
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuItem } from '@/types';

interface PopularItemsProps {
  menuItems: MenuItem[];
}

export function PopularItems({ menuItems }: PopularItemsProps) {
  // In a real implementation, we would track popularity through order history
  // For now, we'll just use the price as a proxy for popularity
  const topItems = [...menuItems]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  return (
    <Card className="col-span-1 fade-in">
      <CardHeader>
        <CardTitle>Popular Items</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {topItems.map((item) => (
            <li key={item.catalogueNumber} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.itemName}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <div className="bg-primary/10 text-primary font-medium rounded-md px-2.5 py-0.5">
                ₹{item.price}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
