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
    <section id="gst-calculator" className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Calculator className="w-4 h-4" />
              <span>Financial Tools</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-main">
              GST <span className="text-accent">Calculator</span>
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Quickly calculate GST amounts for your business transactions with our easy-to-use tool.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Input Section */}
          <Reveal delay={0.1}>
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-2xl">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-3">Amount (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="number"
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                      className="w-full bg-surface border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-3">GST Rate (%)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {gstRates.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setGstRate(rate)}
                        className={`py-3 rounded-xl text-sm font-bold transition-all border ${
                          gstRate === rate
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-surface border-gray-100 text-text-muted hover:border-primary/50'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-gray-100">
                    <span className="text-sm font-medium text-text-muted">GST Inclusive?</span>
                    <button
                      onClick={() => setIsInclusive(!isInclusive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        isInclusive ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isInclusive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-gray-100">
                    <span className="text-sm font-medium text-text-muted">Inter-state?</span>
                    <button
                      onClick={() => setIsInterState(!isInterState)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        isInterState ? 'bg-accent' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
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
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 p-8 rounded-3xl relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                    <div>
                      <p className="text-text-muted text-sm mb-1">Original Amount</p>
                      <h3 className="text-2xl font-bold text-text-main">₹{results.originalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-text-muted text-sm mb-1">GST ({gstRate}%)</p>
                      <h3 className="text-2xl font-bold text-accent">+ ₹{results.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                    </div>
                  </div>

                  <div>
                    <p className="text-text-muted text-sm mb-1">Total Amount</p>
                    <h3 className="text-5xl font-bold text-primary">₹{results.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h3>
                  </div>

                  <div className="pt-4">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                      <p className="text-primary text-sm font-medium">Calculation complete based on current GST rates.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isInterState ? (
                  <>
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <p className="text-text-muted text-xs uppercase tracking-wider font-bold mb-2">CGST ({(gstRate/2).toFixed(1)}%)</p>
                      <p className="text-xl font-bold text-text-main">₹{(results.gstAmount / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                      <p className="text-text-muted text-xs uppercase tracking-wider font-bold mb-2">SGST ({(gstRate/2).toFixed(1)}%)</p>
                      <p className="text-xl font-bold text-text-main">₹{(results.gstAmount / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <p className="text-text-muted text-xs uppercase tracking-wider font-bold mb-2">IGST ({gstRate}%)</p>
                    <p className="text-xl font-bold text-text-main">₹{results.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
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
