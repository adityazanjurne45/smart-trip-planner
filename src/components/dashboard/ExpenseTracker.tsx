import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, Plus, Trash2, Utensils, Building2, Car, Ticket, ShoppingBag,
  TrendingUp, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CurrencyInfo } from "@/lib/currency";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

const CATEGORIES = [
  { value: "food", label: "Food & Dining", icon: Utensils, color: "text-orange-500", bg: "bg-orange-500" },
  { value: "hotel", label: "Hotel", icon: Building2, color: "text-primary", bg: "bg-primary" },
  { value: "transport", label: "Transport", icon: Car, color: "text-blue-500", bg: "bg-blue-500" },
  { value: "activities", label: "Activities", icon: Ticket, color: "text-purple-500", bg: "bg-purple-500" },
  { value: "shopping", label: "Shopping", icon: ShoppingBag, color: "text-pink-500", bg: "bg-pink-500" },
];

interface ExpenseTrackerProps {
  totalBudget: number;
  tripId?: string;
  currency?: CurrencyInfo;
}

const ExpenseTracker = ({ totalBudget, currency }: ExpenseTrackerProps) => {
  const sym = currency?.symbol || "$";
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercent = Math.min((totalSpent / totalBudget) * 100, 100);
  const isOverBudget = totalSpent > totalBudget;

  const categoryTotals = CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses.filter((e) => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
  }));

  const addExpense = () => {
    if (!newCategory || !newDescription.trim() || !newAmount) return;
    const expense: Expense = {
      id: Date.now().toString(),
      category: newCategory,
      description: newDescription.trim(),
      amount: parseFloat(newAmount),
      date: new Date().toISOString(),
    };
    setExpenses((prev) => [...prev, expense]);
    setNewCategory("");
    setNewDescription("");
    setNewAmount("");
    setShowForm(false);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const getCategoryInfo = (value: string) => CATEGORIES.find((c) => c.value === value);

  return (
    <Card className="travel-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Expense Tracker
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1 rounded-xl" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className={cn("font-semibold", isOverBudget ? "text-destructive" : "text-foreground")}>
              {sym}{totalSpent.toFixed(0)} / {sym}{totalBudget}
            </span>
          </div>
          <Progress
            value={spentPercent}
            className={cn("h-3", isOverBudget && "[&>div]:bg-destructive")}
          />
          <div className="flex items-center gap-2 text-sm">
            {isOverBudget ? (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                Over budget by {sym}{Math.abs(remaining).toFixed(0)}
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 bg-travel-forest/10 text-travel-forest border-travel-forest/20">
                <CheckCircle2 className="w-3 h-3" />
                ${remaining.toFixed(0)} remaining
              </Badge>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        {expenses.length > 0 && (
          <div className="grid grid-cols-5 gap-2">
            {categoryTotals.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.value} className="text-center">
                  <div className={cn("w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-1", `${cat.bg}/10`)}>
                    <Icon className={cn("w-4 h-4", cat.color)} />
                  </div>
                  <p className="text-xs font-medium text-foreground">${cat.total.toFixed(0)}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{cat.label.split(" ")[0]}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Expense Form */}
        {showForm && (
          <div className="space-y-3 p-4 rounded-xl bg-muted/50 border border-border animate-fade-in">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="rounded-xl"
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="pl-7 rounded-xl"
                />
              </div>
              <Button onClick={addExpense} size="sm" className="rounded-xl">
                Add
              </Button>
            </div>
          </div>
        )}

        {/* Expense List */}
        {expenses.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {expenses.map((expense) => {
              const cat = getCategoryInfo(expense.category);
              const Icon = cat?.icon || DollarSign;
              return (
                <div key={expense.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border group">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", `${cat?.bg || "bg-muted"}/10`)}>
                    <Icon className={cn("w-4 h-4", cat?.color || "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{cat?.label}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">${expense.amount.toFixed(0)}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeExpense(expense.id)}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {expenses.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No expenses yet. Click "Add" to start tracking.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseTracker;
