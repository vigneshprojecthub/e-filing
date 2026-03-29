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
    <section id="tax-calculator" className="py-32 bg-surface/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(var(--primary-rgb),0.03),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div>
              <span className="text-accent font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">Tax Planning</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary uppercase leading-none mb-10">
                Income Tax <br />
                <span className="text-accent">Calculator</span>
              </h2>
              <p className="text-text-muted mb-12 leading-relaxed font-medium max-w-lg">
                Compare your tax liability between the Old and New Tax Regimes. 
                Updated with Marginal Relief rules and salaried standard deductions.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-white border border-line rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-1">Standard Deduction</h4>
                    <p className="text-text-muted text-sm font-medium leading-relaxed">
                      {getStandardDeductionText()} standard deduction is applied automatically for salaried persons.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-14 h-14 bg-white border border-line rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <IndianRupee className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-primary font-black text-sm uppercase tracking-widest mb-1">Rebate & Marginal Relief</h4>
                    <p className="text-text-muted text-sm font-medium leading-relaxed">
                      Zero tax for income up to {getRebateText()}. Marginal relief ensures tax doesn't exceed excess income above the limit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="kratz-card bg-white shadow-3xl p-10 md:p-16">
              <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Financial Year</label>
                    <div className="relative">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value as any)}
                        className="w-full bg-surface border border-line rounded-2xl py-5 px-6 text-primary font-bold focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer"
                      >
                        <option value="2025-26">FY 2025-26 (AY 2026-27)</option>
                        <option value="2024-25">FY 2024-25 (AY 2025-26)</option>
                        <option value="2023-24">FY 2023-24 (AY 2024-25)</option>
                        <option value="2022-23">FY 2022-23 (AY 2023-24)</option>
                        <option value="2021-22">FY 2021-22 (AY 2022-23)</option>
                        <option value="2020-21">FY 2020-21 (AY 2021-22)</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Annual Gross Income (₹)</label>
                    <input
                      type="number"
                      value={income || ''}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="w-full bg-surface border border-line rounded-2xl py-5 px-6 text-primary font-bold focus:outline-none focus:border-accent transition-all placeholder:text-text-muted/30"
                      placeholder="e.g., 1200000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Total Deductions (80C, etc.)</label>
                    <input
                      type="number"
                      value={deductions || ''}
                      onChange={(e) => setDeductions(Number(e.target.value))}
                      className="w-full bg-surface border border-line rounded-2xl py-5 px-6 text-primary font-bold focus:outline-none focus:border-accent transition-all placeholder:text-text-muted/30"
                      placeholder="e.g., 150000"
                    />
                  </div>
                  <div className="flex items-center space-x-4 bg-surface p-6 rounded-2xl border border-line cursor-pointer select-none" onClick={() => setIsSalaried(!isSalaried)}>
                    <div className={cn(
                      "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                      isSalaried ? "bg-accent border-accent" : "bg-white border-line"
                    )}>
                      {isSalaried && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer">
                      Salaried Person?
                    </label>
                  </div>
                </div>

                <button
                  onClick={calculateTax}
                  className="kratz-button-primary w-full justify-center group"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Calculate Tax Liability</span>
                </button>

                {taxResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <div className={cn(
                        "p-8 rounded-3xl border-2 transition-all",
                        taxResult.old <= taxResult.new ? "bg-primary border-primary text-white" : "bg-surface border-line text-primary"
                      )}>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest mb-3", taxResult.old <= taxResult.new ? "text-white/50" : "text-text-muted")}>Old Regime</p>
                        <p className="text-3xl font-black">₹{Math.round(taxResult.old).toLocaleString('en-IN')}</p>
                        <div className="mt-4 space-y-1">
                          <p className={cn("text-[10px] font-bold uppercase tracking-widest", taxResult.old <= taxResult.new ? "text-white/40" : "text-text-muted")}>Std. Ded: ₹{isSalaried ? '50,000' : '0'}</p>
                          {taxResult.old <= taxResult.new && <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-2">Recommended</p>}
                        </div>
                      </div>
                      <div className={cn(
                        "p-8 rounded-3xl border-2 transition-all",
                        taxResult.new < taxResult.old ? "bg-primary border-primary text-white" : "bg-surface border-line text-primary"
                      )}>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest mb-3", taxResult.new < taxResult.old ? "text-white/50" : "text-text-muted")}>New Regime</p>
                        <p className="text-3xl font-black">₹{Math.round(taxResult.new).toLocaleString('en-IN')}</p>
                        <div className="mt-4 space-y-1">
                          <p className={cn("text-[10px] font-bold uppercase tracking-widest", taxResult.new < taxResult.old ? "text-white/40" : "text-text-muted")}>
                            Std. Ded: ₹{isSalaried ? '75,000' : '0'}
                          </p>
                          {taxResult.new < taxResult.old && <p className="text-[10px] text-accent font-black uppercase tracking-[0.2em] mt-2">Recommended</p>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-surface border border-line rounded-2xl text-center">
                      <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                        Net Taxable Income (New Regime): <span className="text-primary">₹{Math.max(0, income - (isSalaried ? 75000 : 0)).toLocaleString('en-IN')}</span>
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
