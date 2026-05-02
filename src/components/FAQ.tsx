import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "Is YNX a blockchain?",
      answer: "Yes. It is a public network where nodes jointly maintain the ledger.",
    },
    {
      question: "Is it mainnet now?",
      answer: "Currently in the public testnet phase, mainly for testing and ecosystem integration.",
    },
    {
      question: "Do test tokens have real value?",
      answer: "Testnet tokens are for testing and do not equal real mainnet assets.",
    },
    {
      question: "Can I participate without technical knowledge?",
      answer: "Yes. You can start by experiencing the wallet, explorer, and testnet.",
    },
    {
      question: "How do developers connect?",
      answer: "Use RPC + Docs + Faucet to run through the minimal contract and transaction flow.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 bg-surface relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-klein font-mono text-sm tracking-widest uppercase mb-4 block">
            Questions
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-ink">
            Frequently Asked
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white border border-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-inset"
              >
                <span className="text-lg font-display font-semibold text-ink">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-ink/50 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-klein" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-ink/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
