
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ExpenseCategory, Expense } from '@/types';
import { expenseCategories } from '@/services/mockData';
import sheetService from '@/services/sheetService';

export function ExpenseForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subCategories, setSubCategories] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    amount: '',
    description: '',
    paidBy: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setFormData({ ...formData, category: value, subCategory: '' });
    
    // Find subcategories for the selected category
    const category = expenseCategories.find(cat => cat.name === value);
    if (category) {
      setSubCategories(category.subCategories);
    } else {
      setSubCategories([]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubCategoryChange = (value: string) => {
    setFormData({ ...formData, subCategory: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.subCategory || !formData.amount || !formData.description || !formData.paidBy) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const expenseData: Expense = {
        id: `EXP-${Date.now().toString().slice(-8)}`,
        category: formData.category,
        subCategory: formData.subCategory,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        paidBy: formData.paidBy
      };
      
      await sheetService.saveExpense(expenseData);
      
      toast({
        title: "Success",
        description: "Expense has been recorded successfully.",
      });
      
      // Reset form
      setFormData({
        category: '',
        subCategory: '',
        amount: '',
        description: '',
        paidBy: '',
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedCategory('');
      setSubCategories([]);
    } catch (error) {
      console.error("Failed to save expense:", error);
      toast({
        title: "Error",
        description: "Failed to record expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto scale-in-center">
      <CardHeader>
        <CardTitle>Record Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub-Category</Label>
              <Select 
                value={formData.subCategory} 
                onValueChange={handleSubCategoryChange}
                disabled={!selectedCategory}
              >
                <SelectTrigger id="subCategory">
                  <SelectValue placeholder="Select sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter expense details..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Input
              id="paidBy"
              name="paidBy"
              placeholder="Enter name"
              value={formData.paidBy}
              onChange={handleChange}
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Recording Expense..." : "Record Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
