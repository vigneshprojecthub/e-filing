import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Info, IndianRupee, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Reveal } from './Reveal';

export default function TaxCalculator() {
  const [income, setIncome] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [isSalaried, setIsSalaried] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<'2020-21' | '2021-22' | '2022-23' | '2023-24' | '2024-25' | '2025-26'>('2025-26');
  const [taxResult, setTaxResult] = useState<{ old: number; new: number } | null>(null);

  const calculateTax = () => {
    const oldTax = calculateOldRegime(income, deductions);
    const newTax = calculateNewRegime(income, selectedYear);
    setTaxResult({ old: oldTax, new: newTax });
  };

  const calculateOldRegime = (totalIncome: number, totalDeductions: number) => {
    const standardDeduction = isSalaried ? 50000 : 0;
    const taxableIncome = Math.max(0, totalIncome - totalDeductions - standardDeduction);
    
    let tax = 0;
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.3;
    }

    // Rebate u/s 87A for Old Regime (up to 5L taxable income)
    if (taxableIncome <= 500000) tax = 0;

    // Surcharge for income > 50L
    let surcharge = 0;
    if (taxableIncome > 5000000) {
      surcharge = tax * 0.10;
    }

    return (tax + surcharge) * 1.04; // 4% Cess
  };

  const calculateNewRegime = (totalIncome: number, year: string) => {
    let standardDeduction = 0;
    if (isSalaried) {
      standardDeduction = 75000;
    }

    let tax = 0;
    let rebateLimit = 500000;
    const taxableIncome = Math.max(0, totalIncome - standardDeduction);

    if (year === '2025-26') {
      rebateLimit = 1200000;
      if (taxableIncome <= 400000) tax = 0;
      else if (taxableIncome <= 800000) tax = (taxableIncome - 400000) * 0.05;
      else if (taxableIncome <= 1200000) tax = 20000 + (taxableIncome - 800000) * 0.1;
      else if (taxableIncome <= 1600000) tax = 60000 + (taxableIncome - 1200000) * 0.15;
      else if (taxableIncome <= 2000000) tax = 120000 + (taxableIncome - 1600000) * 0.2;
      else if (taxableIncome <= 2400000) tax = 200000 + (taxableIncome - 2000000) * 0.25;
      else tax = 300000 + (taxableIncome - 2400000) * 0.3;

      // Marginal Relief for 12L limit (introduced in Budget 2025)
      if (taxableIncome <= rebateLimit) {
        tax = 0;
      } else {
        const excessIncome = taxableIncome - rebateLimit;
        tax = Math.min(tax, excessIncome);
      }
    } else if (year === '2024-25') {
      rebateLimit = 700000;
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 700000) tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 1000000) tax = 20000 + (taxableIncome - 700000) * 0.1;
      else if (taxableIncome <= 1200000) tax = 50000 + (taxableIncome - 1000000) * 0.15;
      else if (taxableIncome <= 1500000) tax = 80000 + (taxableIncome - 1200000) * 0.2;
      else tax = 140000 + (taxableIncome - 1500000) * 0.3;

      // Marginal Relief for 7L limit (introduced in Budget 2023)
      if (taxableIncome <= rebateLimit) {
        tax = 0;
      } else {
        const excessIncome = taxableIncome - rebateLimit;
        tax = Math.min(tax, excessIncome);
      }
    } else if (year === '2023-24') {
      rebateLimit = 700000;
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
      else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
      else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
      else tax = 150000 + (taxableIncome - 1500000) * 0.3;

      // Marginal Relief for 7L limit
      if (taxableIncome <= rebateLimit) {
        tax = 0;
      } else {
        const excessIncome = taxableIncome - rebateLimit;
        tax = Math.min(tax, excessIncome);
      }
    } else {
      // FY 2020-21 to 2022-23
      rebateLimit = 500000;
      const taxableIncomeVal = taxableIncome;

      if (taxableIncomeVal <= 250000) tax = 0;
      else if (taxableIncomeVal <= 500000) tax = (taxableIncomeVal - 250000) * 0.05;
      else if (taxableIncomeVal <= 750000) tax = 12500 + (taxableIncomeVal - 500000) * 0.1;
      else if (taxableIncomeVal <= 1000000) tax = 37500 + (taxableIncomeVal - 750000) * 0.15;
      else if (taxableIncomeVal <= 1250000) tax = 75000 + (taxableIncomeVal - 1000000) * 0.2;
      else if (taxableIncomeVal <= 1500000) tax = 125000 + (taxableIncomeVal - 1250000) * 0.25;
      else tax = 187500 + (taxableIncomeVal - 1500000) * 0.3;

      if (taxableIncomeVal <= rebateLimit) tax = 0;
      // No marginal relief for 5L limit in these years
    }

    // Surcharge for income > 50L
    let surcharge = 0;
    if (taxableIncome > 5000000) {
      surcharge = tax * 0.10;
    }

    return (tax + surcharge) * 1.04; // 4% Cess
  };

  const getStandardDeductionText = () => {
    if (!isSalaried) return '₹0 (Standard deduction only for salaried)';
    return '₹75,000 (New) / ₹50,000 (Old)';
  };

  const getRebateText = () => {
    if (selectedYear === '2025-26') return '₹12L (New) / ₹5L (Old)';
    if (selectedYear === '2024-25' || selectedYear === '2023-24') return '₹7L (New) / ₹5L (Old)';
    return '₹5L (New) / ₹5L (Old)';
  };

  return (
    <section id="tax-calculator" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
                Income Tax <span className="text-accent">Calculator</span>
              </h2>
              <p className="text-text-muted mb-10 leading-relaxed">
                Compare your tax liability between the Old and New Tax Regimes. 
                Updated with Marginal Relief rules and salaried standard deductions.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-text-main font-bold mb-1">Standard Deduction</h4>
                    <p className="text-text-muted text-sm">
                      {getStandardDeductionText()} standard deduction is applied automatically for salaried persons.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                    <IndianRupee className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-text-main font-bold mb-1">Rebate & Marginal Relief</h4>
                    <p className="text-text-muted text-sm">
                      Zero tax for income up to {getRebateText()}. Marginal relief ensures tax doesn't exceed excess income above the limit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
              
              <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted ml-1">Financial Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value as any)}
                      className="w-full bg-surface border border-gray-100 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold appearance-none"
                    >
                      <option value="2025-26">FY 2025-26 (AY 2026-27)</option>
                      <option value="2024-25">FY 2024-25 (AY 2025-26)</option>
                      <option value="2023-24">FY 2023-24 (AY 2024-25)</option>
                      <option value="2022-23">FY 2022-23 (AY 2023-24)</option>
                      <option value="2021-22">FY 2021-22 (AY 2022-23)</option>
                      <option value="2020-21">FY 2020-21 (AY 2021-22)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted ml-1">Annual Gross Income (₹)</label>
                    <input
                      type="number"
                      value={income || ''}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="w-full bg-surface border border-gray-100 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                      placeholder="e.g., 1200000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-muted ml-1">Total Deductions (80C, etc.)</label>
                    <input
                      type="number"
                      value={deductions || ''}
                      onChange={(e) => setDeductions(Number(e.target.value))}
                      className="w-full bg-surface border border-gray-100 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                      placeholder="e.g., 150000"
                    />
                  </div>
                  <div className="flex items-center space-x-3 bg-surface p-4 rounded-2xl border border-gray-100">
                    <input
                      type="checkbox"
                      id="isSalaried"
                      checked={isSalaried}
                      onChange={(e) => setIsSalaried(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-100 bg-white text-primary focus:ring-primary/50"
                    />
                    <label htmlFor="isSalaried" className="text-text-muted font-medium cursor-pointer select-none">
                      Salaried Person?
                    </label>
                  </div>
                </div>

                <button
                  onClick={calculateTax}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 flex items-center justify-center space-x-3 group"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Calculate Tax Liability</span>
                </button>

                {taxResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className={cn(
                        "p-6 rounded-3xl border transition-all",
                        taxResult.old <= taxResult.new ? "bg-primary/5 border-primary/30" : "bg-surface border-gray-100"
                      )}>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Old Regime</p>
                        <p className="text-2xl font-bold text-text-main">₹{Math.round(taxResult.old).toLocaleString('en-IN')}</p>
                        <div className="mt-3 space-y-1">
                          <p className="text-[10px] text-text-muted">Std. Ded: ₹{isSalaried ? '50,000' : '0'}</p>
                          {taxResult.old <= taxResult.new && <p className="text-[10px] text-primary font-bold uppercase">Recommended</p>}
                        </div>
                      </div>
                      <div className={cn(
                        "p-6 rounded-3xl border transition-all",
                        taxResult.new < taxResult.old ? "bg-primary/5 border-primary/30" : "bg-surface border-gray-100"
                      )}>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">New Regime</p>
                        <p className="text-2xl font-bold text-text-main">₹{Math.round(taxResult.new).toLocaleString('en-IN')}</p>
                        <div className="mt-3 space-y-1">
                          <p className="text-[10px] text-text-muted">
                            Std. Ded: ₹{isSalaried ? '75,000' : '0'}
                          </p>
                          {taxResult.new < taxResult.old && <p className="text-[10px] text-primary font-bold uppercase">Recommended</p>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-surface border border-gray-100 rounded-2xl text-center">
                      <p className="text-text-muted text-xs">
                        Net Taxable Income (New Regime): <span className="text-text-main font-bold">₹{Math.max(0, income - (isSalaried ? 75000 : 0)).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
