import { motion } from "motion/react";
import { Activity, CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useTranslation } from "../contexts/LanguageContext";
import { motionEase, revealSoft, stagger } from "../lib/motion";

export function NetworkStatusGrid() {
  const { status, loading, error, refetch } = useNetworkStatus();
  const { t } = useTranslation();

  if (loading && !status) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-surface rounded-2xl border border-border" />
        ))}
      </div>
    );
  }

  const services = [
    { id: "rpc", name: "RPC", icon: <Activity className="w-4 h-4" /> },
    { id: "evm", name: "EVM", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "indexer", name: "Indexer", icon: <Activity className="w-4 h-4" /> },
    { id: "faucet", name: "Faucet", icon: <RefreshCw className="w-4 h-4" /> },
    { id: "ai", name: "AI Gateway", icon: <Activity className="w-4 h-4" /> },
    { id: "web4", name: "Web4 Hub", icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ink">{t("status.title")}</h3>
          <p className="text-sm text-ink/60">{t("status.desc")}</p>
        </div>
        <button 
          onClick={refetch}
          className="p-2 hover:bg-surface rounded-full transition-colors text-ink/40 hover:text-klein"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {services.map((svc) => {
          const svcStatus = status?.[svc.id];
          const isOnline = svcStatus?.status === "online";
          const isDegraded = svcStatus?.status === "degraded";
          const isOffline = svcStatus?.status === "offline";
          const isUnknown = !status;
          
          return (
            <motion.div
              key={svc.id}
              variants={revealSoft}
              whileHover={{ y: -4, scale: 1.015 }}
              transition={{ duration: 0.18, ease: motionEase.standard }}
              className="p-4 rounded-2xl bg-white border border-border flex flex-col gap-3 shadow-sm relative overflow-hidden"
            >
              {isOnline && (
                <motion.div
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: services.findIndex((item) => item.id === svc.id) * 0.18 }}
                />
              )}
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-surface text-ink/40 text-xs font-bold uppercase tracking-wider">
                  {svc.name}
                </div>
                {isOnline ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                ) : isDegraded ? (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                ) : isOffline ? (
                  <XCircle className="w-4 h-4 text-rose-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-ink/20" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.span
                  className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 
                  isDegraded ? 'bg-amber-500 animate-pulse' : 
                  isOffline ? 'bg-rose-500 animate-pulse' : 
                  'bg-ink/10'
                }`}
                  animate={isOnline ? { scale: [1, 1.45, 1], opacity: [1, 0.7, 1] } : undefined}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-sm font-medium text-ink/80">
                  {isOnline ? t("status.online") : 
                   isDegraded ? t("status.degraded") : 
                   isOffline ? t("status.offline") : 
                   "Unknown"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {error && (
        <p className="text-xs text-rose-500 text-center">
          Connection warning: {error}. Data may be stale.
        </p>
      )}
    </div>
  );
}
