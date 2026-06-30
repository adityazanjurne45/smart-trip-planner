import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CurrencyInfo, getCurrencyForDestination, getAllCurrencies, getCurrencyByCode } from "@/lib/currency";
import { ChevronDown, Coins } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CurrencyContextValue {
  currency: CurrencyInfo;
  setCurrencyByCode: (code: string) => void;
  resetToDestination: () => void;
  /** Format a numeric amount that is already in `currency`'s units */
  formatAmount: (amount: number) => string;
  /** Reformat any price string ("$120", "USD 50", "₹4,500/night", "$15-25") into the active currency */
  formatPriceString: (text: string | number | undefined | null) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

interface ProviderProps {
  destination?: string;
  children: React.ReactNode;
}

export const CurrencyProvider: React.FC<ProviderProps> = ({ destination, children }) => {
  const [override, setOverride] = useState<CurrencyInfo | null>(null);

  const detected = useMemo(
    () => (destination ? getCurrencyForDestination(destination) : getCurrencyForDestination("")),
    [destination]
  );

  // Reset override when destination changes so detection takes over
  useEffect(() => {
    setOverride(null);
  }, [destination]);

  const currency = override ?? detected;

  const formatAmount = (amount: number) => {
    if (!Number.isFinite(amount)) return `${currency.symbol}0`;
    try {
      return new Intl.NumberFormat(currency.locale || "en-US", {
        style: "currency",
        currency: currency.code,
        maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
      }).format(amount);
    } catch {
      return `${currency.symbol}${Math.round(amount).toLocaleString()}`;
    }
  };

  const formatPriceString = (text: string | number | undefined | null) => {
    if (text === null || text === undefined) return "";
    if (typeof text === "number") return formatAmount(convertToActive(text, getCurrencyByCode("USD")!, currency));

    const raw = String(text).trim();
    if (!raw) return "";
    // Pass-through non-numeric labels like "Included", "Free", "Varies"
    if (!/\d/.test(raw)) return raw;

    // Try to detect a source currency from symbol or code
    const source = detectSourceCurrency(raw) ?? getCurrencyByCode("USD")!;

    // Extract numbers (supports "120", "1,200", "15-25", "$15 - $25", "120.50")
    const nums = (raw.match(/[\d,]+(?:\.\d+)?/g) || []).map((n) => parseFloat(n.replace(/,/g, "")));
    if (nums.length === 0) return raw;

    // Preserve suffix like "/night", "per person", "approx"
    let suffix = "";
    const slashMatch = raw.match(/\/\s*(night|day|person|hour|pax|head|week|month)\b/i);
    if (slashMatch) suffix = `/${slashMatch[1].toLowerCase()}`;
    else if (/\bper\s+\w+/i.test(raw)) {
      const m = raw.match(/\bper\s+\w+/i);
      if (m) suffix = ` ${m[0].toLowerCase()}`;
    }

    const converted = nums.map((n) => convertToActive(n, source, currency));
    const formatted = converted.map((n) => formatAmount(n));
    const out = formatted.length > 1 ? `${formatted[0]} - ${formatted[formatted.length - 1]}` : formatted[0];
    return suffix ? `${out}${suffix}` : out;
  };

  const value: CurrencyContextValue = {
    currency,
    setCurrencyByCode: (code) => {
      const c = getCurrencyByCode(code);
      if (c) setOverride(c);
    },
    resetToDestination: () => setOverride(null),
    formatAmount,
    formatPriceString,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Safe fallback so components don't crash outside a provider
    const fallback = getCurrencyForDestination("");
    return {
      currency: fallback,
      setCurrencyByCode: () => {},
      resetToDestination: () => {},
      formatAmount: (n: number) => `${fallback.symbol}${Math.round(n).toLocaleString()}`,
      formatPriceString: (t: any) => (t == null ? "" : String(t)),
    } as CurrencyContextValue;
  }
  return ctx;
};

// ---------- helpers ----------

function convertToActive(amount: number, source: CurrencyInfo, target: CurrencyInfo): number {
  if (source.code === target.code) return amount;
  const usd = amount / (source.rate || 1);
  return usd * (target.rate || 1);
}

const SYMBOL_TO_CODE: Array<[string, string]> = [
  ["CHF", "CHF"], ["AED", "AED"], ["SGD", "SGD"], ["AUD", "AUD"], ["CAD", "CAD"],
  ["MYR", "MYR"], ["IDR", "IDR"], ["NPR", "NPR"], ["INR", "INR"], ["USD", "USD"],
  ["EUR", "EUR"], ["GBP", "GBP"], ["JPY", "JPY"], ["CNY", "CNY"], ["KRW", "KRW"],
  ["THB", "THB"], ["VND", "VND"], ["PHP", "PHP"], ["LKR", "LKR"], ["MXN", "MXN"],
  ["BRL", "BRL"], ["TRY", "TRY"], ["RUB", "RUB"], ["SEK", "SEK"], ["NOK", "NOK"],
  ["DKK", "DKK"], ["NZD", "NZD"], ["ZAR", "ZAR"], ["EGP", "EGP"], ["KES", "KES"],
  ["SAR", "SAR"],
  ["₹", "INR"], ["€", "EUR"], ["£", "GBP"], ["¥", "JPY"], ["₩", "KRW"],
  ["฿", "THB"], ["₫", "VND"], ["₱", "PHP"], ["₺", "TRY"], ["₽", "RUB"],
  ["Rp", "IDR"], ["RM", "MYR"], ["Rs", "LKR"], ["रू", "NPR"],
  ["$", "USD"],
];

function detectSourceCurrency(text: string): CurrencyInfo | null {
  for (const [token, code] of SYMBOL_TO_CODE) {
    if (text.includes(token)) {
      const c = getCurrencyByCode(code);
      if (c) return c;
    }
  }
  return null;
}

// ---------- Currency Selector UI ----------

export const CurrencySelector: React.FC<{ className?: string }> = ({ className }) => {
  const { currency, setCurrencyByCode, resetToDestination } = useCurrency();
  const all = getAllCurrencies();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-1.5 ${className || ""}`}>
          <Coins className="w-4 h-4" />
          <span className="font-medium">{currency.symbol}</span>
          <span className="text-xs text-muted-foreground">{currency.code}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto bg-background z-[60]">
        <DropdownMenuLabel className="text-xs">Display Currency</DropdownMenuLabel>
        <DropdownMenuItem onClick={resetToDestination} className="text-xs">
          Auto (destination default)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {all.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrencyByCode(c.code)}
            className={`gap-2 text-sm ${c.code === currency.code ? "bg-primary/10 font-medium" : ""}`}
          >
            <span className="w-8 text-muted-foreground">{c.symbol}</span>
            <span className="font-medium">{c.code}</span>
            <span className="text-xs text-muted-foreground truncate">{c.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Convenience render components used inside CurrencyProvider
export const Price: React.FC<{ value: number | string | null | undefined; suffix?: string; className?: string }> = ({ value, suffix, className }) => {
  const { formatPriceString } = useCurrency();
  const text = formatPriceString(value as any);
  return <span className={className}>{text}{suffix || ""}</span>;
};
