
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { MenuItem, OrderItem, Order, PaymentMethod } from '@/types';
import sheetService from '@/services/sheetService';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

export function OrderForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const items = await sheetService.getMenuItems();
        setMenuItems(items);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
        setCategories(uniqueCategories);
        
        // Set first category as active
        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error("Failed to load menu items:", error);
        toast({
          title: "Error",
          description: "Failed to load menu items. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    loadMenuItems();
  }, [toast]);
  
  // Update total whenever orderItems changes
  useEffect(() => {
    const newTotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalAmount(newTotal);
  }, [orderItems]);
  
  const addItemToOrder = (menuItem: MenuItem) => {
    // Check if item already exists in order
    const existingItem = orderItems.find(item => item.menuItem.catalogueNumber === menuItem.catalogueNumber);
    
    if (existingItem) {
      // Increment quantity of existing item
      const updatedItems = orderItems.map(item => {
        if (item.menuItem.catalogueNumber === menuItem.catalogueNumber) {
          const newQuantity = item.quantity + 1;
          return {
            ...item,
            quantity: newQuantity,
            subtotal: menuItem.price * newQuantity
          };
        }
        return item;
      });
      
      setOrderItems(updatedItems);
    } else {
      // Add new item
      const newItem: OrderItem = {
        menuItem,
        quantity: 1,
        subtotal: menuItem.price
      };
      
      setOrderItems([...orderItems, newItem]);
    }
  };
  
  const removeItemFromOrder = (catalogueNumber: number) => {
    setOrderItems(orderItems.filter(item => item.menuItem.catalogueNumber !== catalogueNumber));
  };
  
  const updateItemQuantity = (catalogueNumber: number, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(catalogueNumber);
      return;
    }
    
    const updatedItems = orderItems.map(item => {
      if (item.menuItem.catalogueNumber === catalogueNumber) {
        return {
          ...item,
          quantity,
          subtotal: item.menuItem.price * quantity
        };
      }
      return item;
    });
    
    setOrderItems(updatedItems);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add at least one item to the order.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const orderData: Order = {
        id: `ORDER-${Date.now().toString().slice(-6)}`,
        items: orderItems,
        totalAmount,
        paymentMethod,
        status: 'Completed',
        createdAt: new Date().toISOString(),
        customerName: customerName || undefined,
        tableNumber: tableNumber ? parseInt(tableNumber) : undefined
      };
      
      await sheetService.saveOrder(orderData);
      
      toast({
        title: "Success",
        description: "Order has been placed successfully.",
      });
      
      // Reset form
      setOrderItems([]);
      setCustomerName('');
      setTableNumber('');
      setPaymentMethod('Cash');
    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter menu items by category and search term
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = !activeCategory || item.category === activeCategory;
    const matchesSearch = !searchTerm || 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.catalogueNumber.toString().includes(searchTerm);
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in">
      {/* Menu Items Section */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <div className="mt-2">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <TabsList className="w-full h-auto flex flex-wrap">
              <TabsTrigger 
                value="" 
                onClick={() => setActiveCategory('')}
                className={!activeCategory ? "bg-primary text-primary-foreground" : ""}
              >
                All
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "bg-primary text-primary-foreground" : ""}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredItems.map(item => (
              <Button
                key={item.catalogueNumber}
                variant="outline"
                className="h-auto py-3 px-4 flex flex-col items-start text-left justify-between"
                onClick={() => addItemToOrder(item)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">{item.itemName}</span>
                  <Badge variant="outline">#{item.catalogueNumber}</Badge>
                </div>
                <div className="flex justify-between w-full mt-2">
                  <span className="text-sm text-muted-foreground">{item.category}</span>
                  <span className="font-bold">₹{item.price}</span>
                </div>
              </Button>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                No items found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Order Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {orderItems.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No items added to order
                </div>
              ) : (
                orderItems.map((item) => (
                  <div 
                    key={item.menuItem.catalogueNumber} 
                    className="flex items-center justify-between border-b border-border pb-2"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.menuItem.itemName}</span>
                        <span>₹{item.menuItem.price}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.menuItem.catalogueNumber, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.menuItem.catalogueNumber, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <span className="ml-auto">₹{item.subtotal}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={() => removeItemFromOrder(item.menuItem.catalogueNumber)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Total Amount */}
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>
            
            {/* Customer Info */}
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number (Optional)</Label>
              <Input
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter table number"
                type="text"
                inputMode="numeric"
              />
            </div>
            
            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="flex flex-wrap gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Cash" id="cash" />
                  <Label htmlFor="cash">Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Card" id="card" />
                  <Label htmlFor="card">Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="UPI" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Credit" id="credit" />
                  <Label htmlFor="credit">Credit</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting || orderItems.length === 0}
              className="w-full"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
