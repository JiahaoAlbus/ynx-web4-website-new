import { motion } from "motion/react";
import { Activity, CheckCircle2, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useTranslation } from "../contexts/LanguageContext";

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {services.map((svc) => {
          const svcStatus = status?.[svc.id];
          const isOnline = svcStatus?.status === "online";
          const isDegraded = svcStatus?.status === "degraded";
          const isOffline = svcStatus?.status === "offline";
          const isUnknown = !status;
          
          return (
            <motion.div
              key={svc.id}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl bg-white border border-border flex flex-col gap-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-surface text-ink/40 text-xs font-bold uppercase tracking-wider">
                  {svc.name}
                </div>
                {isOnline ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isDegraded ? (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                ) : isOffline ? (
                  <XCircle className="w-4 h-4 text-rose-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-ink/20" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 
                  isDegraded ? 'bg-amber-500 animate-pulse' : 
                  isOffline ? 'bg-rose-500 animate-pulse' : 
                  'bg-ink/10'
                }`} />
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
      </div>
      
      {error && (
        <p className="text-xs text-rose-500 text-center">
          Connection warning: {error}. Data may be stale.
        </p>
      )}
    </div>
  );
}
