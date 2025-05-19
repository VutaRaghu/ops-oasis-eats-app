import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types';
import { Badge } from '@/components/ui/badge';

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  // Sort orders by date and take the 5 most recent
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if it's yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise, return the formatted date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="col-span-1 md:col-span-2 scale-in-center">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recentOrders.map((order) => (
            <li key={order.id} className="flex items-center justify-between border-b border-muted pb-3 last:border-0 last:pb-0">
              <div>
                <div className="font-medium">{order.id}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
                </div>
                <div className="text-sm mt-1">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold">₹{order.totalAmount}</span>
                <Badge
                  variant={
                    order.status === 'Completed' ? 'default' :
                    order.status === 'Draft' ? 'outline' : 'destructive'
                  }
                  className="text-xs"
                >
                  {order.status}
                </Badge>
                <span className="text-xs">{order.paymentMethod}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
