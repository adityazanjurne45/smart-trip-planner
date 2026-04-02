import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, X, DollarSign, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  name: string;
}

interface SharedExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  category: string;
}

const CATEGORIES = ["Food", "Hotel", "Transport", "Activities", "Shopping", "Other"];

const GroupExpenseSplitter = () => {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "You" },
  ]);
  const [expenses, setExpenses] = useState<SharedExpense[]>([]);
  const [newMember, setNewMember] = useState("");
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", paidBy: "1", category: "Food" });
  const [showAddExpense, setShowAddExpense] = useState(false);

  const addMember = () => {
    if (!newMember.trim() || members.length >= 10) return;
    setMembers((prev) => [...prev, { id: `m-${Date.now()}`, name: newMember.trim() }]);
    setNewMember("");
  };

  const removeMember = (id: string) => {
    if (id === "1") return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setExpenses((prev) => prev.filter((e) => e.paidBy !== id));
  };

  const addExpense = () => {
    const amt = parseFloat(newExpense.amount);
    if (!newExpense.description.trim() || isNaN(amt) || amt <= 0) return;
    setExpenses((prev) => [
      ...prev,
      { id: `e-${Date.now()}`, description: newExpense.description.trim(), amount: amt, paidBy: newExpense.paidBy, category: newExpense.category },
    ]);
    setNewExpense({ description: "", amount: "", paidBy: "1", category: "Food" });
    setShowAddExpense(false);
  };

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = members.length > 0 ? totalExpenses / members.length : 0;

  // Calculate balances
  const balances = members.map((m) => {
    const paid = expenses.filter((e) => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0);
    return { ...m, paid, owes: perPerson - paid };
  });

  return (
    <Card className="travel-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Group Expense Splitter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Members */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Members ({members.length})</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {members.map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
              >
                {m.name}
                {m.id !== "1" && (
                  <button onClick={() => removeMember(m.id)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add member..."
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
              className="rounded-xl text-sm"
            />
            <Button size="sm" variant="outline" onClick={addMember} className="rounded-xl">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Add Expense */}
        {!showAddExpense ? (
          <Button
            variant="outline"
            className="w-full gap-2 rounded-xl"
            onClick={() => setShowAddExpense(true)}
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        ) : (
          <div className="space-y-2 p-3 rounded-xl bg-muted/50 border border-border animate-fade-in">
            <Input
              placeholder="What was it for?"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="rounded-xl text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Amount ($)"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="rounded-xl text-sm"
              />
              <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
                <SelectTrigger className="rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={newExpense.paidBy} onValueChange={(v) => setNewExpense({ ...newExpense, paidBy: v })}>
              <SelectTrigger className="rounded-xl text-sm">
                <SelectValue placeholder="Paid by" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button size="sm" onClick={addExpense} className="rounded-xl flex-1">Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowAddExpense(false)} className="rounded-xl">Cancel</Button>
            </div>
          </div>
        )}

        {/* Summary */}
        {expenses.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-bold text-foreground">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50 border border-border">
              <span className="text-sm text-muted-foreground">Per Person</span>
              <span className="font-semibold text-foreground">${perPerson.toFixed(2)}</span>
            </div>

            {/* Settlement */}
            <p className="text-sm font-medium text-foreground">Settlement</p>
            <div className="space-y-2">
              {balances.map((b) => (
                <div key={b.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium text-foreground">{b.name}</span>
                  <span className={cn("text-sm font-semibold", b.owes > 0.01 ? "text-destructive" : "text-travel-forest")}>
                    {b.owes > 0.01 ? `Owes $${b.owes.toFixed(2)}` : b.owes < -0.01 ? `Gets back $${Math.abs(b.owes).toFixed(2)}` : "Settled ✓"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense List */}
        {expenses.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Expenses</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {expenses.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 group">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{e.category}</span>
                    <span className="text-sm text-foreground">{e.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">${e.amount.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">by {members.find((m) => m.id === e.paidBy)?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupExpenseSplitter;
