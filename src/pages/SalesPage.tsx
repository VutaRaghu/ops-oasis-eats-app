
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { OrderForm } from '@/components/sales/OrderForm';

const SalesPage = () => {
  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 container py-6">
          <header className="mb-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold ml-2">New Order</h1>
            </div>
            <p className="text-muted-foreground mt-1">Create and process customer orders</p>
          </header>
          
          <OrderForm />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SalesPage;
