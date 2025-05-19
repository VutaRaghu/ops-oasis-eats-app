
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { CatalogManager } from '@/components/catalog/CatalogManager';

const CatalogPage = () => {
  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 container py-6">
          <header className="mb-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold ml-2">Catalog Manager</h1>
            </div>
            <p className="text-muted-foreground mt-1">Manage menu items and categories</p>
          </header>
          
          <CatalogManager />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CatalogPage;
