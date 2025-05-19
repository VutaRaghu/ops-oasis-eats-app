
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { MenuItem } from '@/types';
import sheetService from '@/services/sheetService';
import { X, Edit, Plus } from 'lucide-react';

export function CatalogManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    catalogueNumber: 0,
    itemName: '',
    price: 0,
    category: ''
  });
  
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setIsLoading(true);
        const items = await sheetService.getMenuItems();
        setMenuItems(items);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to load menu items:", error);
        toast({
          title: "Error",
          description: "Failed to load catalog items. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMenuItems();
  }, [toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'catalogueNumber' || name === 'price') {
      const numValue = value === '' ? 0 : parseInt(value, 10);
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };
  
  const handleNewCategory = (value: string) => {
    if (!categories.includes(value)) {
      setCategories([...categories, value]);
    }
    setFormData({ ...formData, category: value });
  };
  
  const resetForm = () => {
    setFormData({
      catalogueNumber: menuItems.length > 0 ? Math.max(...menuItems.map(item => item.catalogueNumber)) + 1 : 1,
      itemName: '',
      price: 0,
      category: ''
    });
    setIsEditing(false);
  };
  
  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (item: MenuItem) => {
    setFormData({ ...item });
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  const handleSave = async () => {
    if (!formData.itemName || !formData.category || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for duplicate catalogue number if adding new item
    if (!isEditing && menuItems.some(item => item.catalogueNumber === formData.catalogueNumber)) {
      toast({
        title: "Duplicate Catalogue Number",
        description: "This catalogue number is already in use. Please use a different number.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isEditing) {
        await sheetService.updateMenuItem(formData);
        
        // Update local state
        setMenuItems(menuItems.map(item => 
          item.catalogueNumber === formData.catalogueNumber ? formData : item
        ));
        
        toast({
          title: "Success",
          description: "Menu item updated successfully."
        });
      } else {
        await sheetService.addMenuItem(formData);
        
        // Update local state
        setMenuItems([...menuItems, formData]);
        
        toast({
          title: "Success",
          description: "Menu item added successfully."
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save menu item:", error);
      toast({
        title: "Error",
        description: "Failed to save menu item. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (catalogueNumber: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await sheetService.deleteMenuItem(catalogueNumber);
      
      // Update local state
      setMenuItems(menuItems.filter(item => item.catalogueNumber !== catalogueNumber));
      
      toast({
        title: "Success",
        description: "Menu item deleted successfully."
      });
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Filter menu items based on search term
  const filteredItems = menuItems.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.catalogueNumber.toString().includes(searchTerm)
  );

  return (
    <Card className="w-full scale-in-center">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Catalog Manager</CardTitle>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-shimmer inline-block h-8 w-3/4 rounded-md bg-gradient-to-r from-transparent via-muted to-transparent bg-[length:800px_100%]"></div>
            <div className="animate-shimmer inline-block h-40 w-full mt-4 rounded-md bg-gradient-to-r from-transparent via-muted to-transparent bg-[length:800px_100%]"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price (₹)</TableHead>
                  <TableHead className="text-right w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.catalogueNumber}>
                      <TableCell>{item.catalogueNumber}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.catalogueNumber)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="catalogueNumber">Catalogue Number</Label>
                <Input
                  id="catalogueNumber"
                  name="catalogueNumber"
                  type="number"
                  value={formData.catalogueNumber}
                  onChange={handleInputChange}
                  readOnly={isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Add New Category</SelectItem>
                  </SelectContent>
                </Select>
                
                {formData.category === 'new' && (
                  <div className="mt-2">
                    <Label htmlFor="newCategory">New Category Name</Label>
                    <Input
                      id="newCategory"
                      placeholder="Enter new category name"
                      className="mt-1"
                      onBlur={(e) => handleNewCategory(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {isEditing ? 'Update' : 'Add'} Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
