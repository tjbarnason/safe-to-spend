'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ConsequenceResult } from './ConsequenceResult';
import type { SimulationResult } from '@/domain/types';
import { DEBOUNCE_MS } from '@/lib/constants';

interface ConsequenceExplorerProps {
  currentCapacity: number;
}

/**
 * Formats a numeric string with commas for display.
 * e.g. "1234567" → "1,234,567"
 */
function formatWithCommas(value: string): string {
  // Remove non-digit characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, '');
  if (cleaned === '') return '';

  // Split on decimal if present
  const parts = cleaned.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  // Add commas to integer portion
  const withCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return withCommas + decimalPart;
}

/**
 * Parse the display value to integer cents.
 * e.g. "1,234.56" → 123456
 */
function parseToCents(displayValue: string): number | null {
  const cleaned = displayValue.replace(/[^0-9.]/g, '');
  if (cleaned === '' || cleaned === '.') return null;

  const dollars = parseFloat(cleaned);
  if (isNaN(dollars) || dollars <= 0) return null;

  return Math.round(dollars * 100);
}

export function ConsequenceExplorer({ currentCapacity }: ConsequenceExplorerProps) {
  const [inputValue, setInputValue] = useState('');
  const [amountCents, setAmountCents] = useState<number | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSimulation = useCallback(async (cents: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cents }),
      });

      if (response.ok) {
        const data: SimulationResult = await response.json();
        setResult(data);
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (amountCents === null || amountCents <= 0) {
      setResult(null);
      setIsLoading(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSimulation(amountCents);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [amountCents, fetchSimulation]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const formatted = formatWithCommas(raw);
    setInputValue(formatted);
    setAmountCents(parseToCents(formatted));
  }

  return (
    <div className="space-y-6">
      {/* Input section */}
      <div>
        <label
          htmlFor="spend-amount"
          className="block text-sm font-medium text-muted-foreground mb-2"
        >
          Hypothetical spending amount
        </label>
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground pointer-events-none"
            aria-hidden="true"
          >
            $
          </span>
          <input
            ref={inputRef}
            id="spend-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="0"
            aria-label="Enter a hypothetical spending amount in dollars"
            aria-describedby="spend-hint"
            className="w-full rounded-lg border border-input bg-background py-4 pl-10 pr-4 text-2xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-shadow"
          />
        </div>
        <p id="spend-hint" className="mt-1.5 text-xs text-muted-foreground">
          Enter a dollar amount to see how it would affect your position
        </p>
      </div>

      {/* Results section */}
      <div aria-live="polite" aria-atomic="true">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div
                className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
                aria-hidden="true"
              />
              <span>Calculating...</span>
            </div>
          </div>
        )}

        {!isLoading && result && (
          <ConsequenceResult
            result={result}
            currentCapacity={currentCapacity}
          />
        )}

        {!isLoading && !result && inputValue === '' && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Enter an amount to see what happens
          </p>
        )}
      </div>
    </div>
  );
}
