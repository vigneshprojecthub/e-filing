import { useState, useEffect } from 'react';
import { Calculator, Percent, IndianRupee, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Reveal } from './Reveal';

export default function GSTCalculator() {
  const [amount, setAmount] = useState<number>(0);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [results, setResults] = useState({
    gstAmount: 0,
    totalAmount: 0,
    originalAmount: 0,
  });

  useEffect(() => {
    let gstAmt = 0;
    let totalAmt = 0;
    let originalAmt = 0;

    if (isInclusive) {
      // Amount is inclusive of GST
      totalAmt = amount;
      originalAmt = amount / (1 + gstRate / 100);
      gstAmt = totalAmt - originalAmt;
    } else {
      // Amount is exclusive of GST
      originalAmt = amount;
      gstAmt = (amount * gstRate) / 100;
      totalAmt = originalAmt + gstAmt;
    }

    setResults({
      gstAmount: gstAmt,
      totalAmount: totalAmt,
      originalAmount: originalAmt,
    });
  }, [amount, gstRate, isInclusive]);

  const gstRates = [5, 12, 18, 28];

  return (
    <section id="gst-calculator" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(var(--accent-rgb),0.03),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-accent font-black text-[11px] uppercase tracking-[0.3em] mb-4 block">Financial Tools</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary uppercase leading-none">
                GST <span className="text-accent">Calculator</span>
              </h2>
            </div>
            <p className="text-text-muted max-w-md font-medium">
              Quickly calculate GST amounts for your business transactions with our professional-grade financial tool.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Input Section */}
          <Reveal delay={0.1}>
            <div className="kratz-card bg-surface/30">
              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="number"
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                      className="w-full bg-white border border-line rounded-2xl py-5 pl-14 pr-6 text-primary font-bold focus:outline-none focus:border-accent transition-all text-xl placeholder:text-text-muted/30"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">GST Rate (%)</label>
                  <div className="grid grid-cols-4 gap-4">
                    {gstRates.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setGstRate(rate)}
                        className={`py-4 rounded-xl text-sm font-black transition-all border-2 ${
                          gstRate === rate
                            ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20'
                            : 'bg-white border-line text-text-muted hover:border-accent hover:text-accent'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-line">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">GST Inclusive?</span>
                    <button
                      onClick={() => setIsInclusive(!isInclusive)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                        isInclusive ? 'bg-accent' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                          isInclusive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-line">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Inter-state?</span>
                    <button
                      onClick={() => setIsInterState(!isInterState)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                        isInterState ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                          isInterState ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Results Section */}
          <Reveal delay={0.2}>
            <div className="space-y-8">
              <div className="bg-primary text-white p-12 rounded-[48px] relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                
                <div className="space-y-10 relative z-10">
                  <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-10">
                    <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Original Amount</p>
                      <h3 className="text-3xl font-black">₹{results.originalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">GST ({gstRate}%)</p>
                      <h3 className="text-3xl font-black text-accent">+ ₹{results.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Total Amount</p>
                    <h3 className="text-6xl md:text-7xl font-black text-white tracking-tighter">₹{results.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                  </div>

                  <div className="pt-4">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shrink-0">
                        <Calculator className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white/60 text-sm font-medium leading-tight">Calculation complete based on current GST rates and regulations.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isInterState ? (
                  <>
                    <div className="bg-surface border border-line p-8 rounded-3xl">
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-3">CGST ({(gstRate/2).toFixed(1)}%)</p>
                      <p className="text-3xl font-black text-primary">₹{(results.gstAmount / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-surface border border-line p-8 rounded-3xl">
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-3">SGST ({(gstRate/2).toFixed(1)}%)</p>
                      <p className="text-3xl font-black text-primary">₹{(results.gstAmount / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 bg-surface border border-line p-8 rounded-3xl">
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-3">IGST ({gstRate}%)</p>
                    <p className="text-3xl font-black text-primary">₹{results.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
