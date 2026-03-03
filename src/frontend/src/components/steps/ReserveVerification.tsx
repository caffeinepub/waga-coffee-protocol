import { NextStepButton } from "@/components/NextStepButton";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileCheck,
  Link2,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  Pending: "badge-gray",
  Processing: "badge-amber",
  Verified: "badge-green",
  Failed: "badge-red",
};

export function ReserveVerification() {
  const { batches, verifications, initiateVerification, updateVerification } =
    useApp();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const pendingBatches = batches.filter(
    (b) => b.status === "Pending Verification" && !verifications[b.id],
  );
  const allVerifications = Object.values(verifications);

  function handleInitiate(batchId: string) {
    initiateVerification(batchId);
    setProcessingIds((prev) => new Set([...prev, batchId]));
    toast.info(`Verification initiated for ${batchId}`, {
      description: "Chainlink oracle request sent...",
    });
  }

  // Auto-complete verifications
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const batchId of processingIds) {
      const v = verifications[batchId];
      if (v && v.status === "Processing") {
        const delay = 2000 + Math.random() * 1500;
        const timer = setTimeout(() => {
          const success = Math.random() < 0.9;
          if (success) {
            updateVerification(batchId, "Verified");
            toast.success(`Batch ${batchId} verified!`, {
              description: "Oracle confirmed reserve data on-chain.",
            });
          } else {
            updateVerification(batchId, "Failed");
            toast.error(`Verification failed for ${batchId}`, {
              description: "Oracle could not confirm reserve data.",
            });
          }
          setProcessingIds((prev) => {
            const next = new Set(prev);
            next.delete(batchId);
            return next;
          });
        }, delay);
        timers.push(timer);
      }
    }
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [processingIds, verifications, updateVerification]);

  const infoCards = [
    {
      icon: Link2,
      title: "Chainlink Oracle",
      desc: "Decentralized oracle network fetches off-chain data from certified QA labs, weighing stations, and cooperative records to confirm batch authenticity.",
    },
    {
      icon: Database,
      title: "Data Validation",
      desc: "Weight, moisture content, cupping scores, and origin certificates are cross-referenced against multiple independent data sources for tamper-resistance.",
    },
    {
      icon: FileCheck,
      title: "Blockchain Recording",
      desc: "Verification outcomes are immutably recorded on-chain. Only verified batches may proceed to token minting, ensuring supply integrity.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="step-circle">02</div>
        <div>
          <h2 className="font-display text-2xl font-bold">
            Reserve Verification
          </h2>
          <p className="text-sm text-muted-foreground">
            Oracle-based validation of physical coffee reserves
          </p>
        </div>
      </motion.div>

      {/* Pending batches */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow" />
          Pending Verification
          <span className="ml-auto text-xs font-normal text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border">
            {pendingBatches.length} batch
            {pendingBatches.length !== 1 ? "es" : ""}
          </span>
        </h3>

        {pendingBatches.length === 0 ? (
          <div
            data-ocid="verification.empty_state"
            className="text-center py-8"
          >
            <p className="text-sm text-muted-foreground">
              No batches pending verification.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Create batches in Step 1 first.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingBatches.map((batch, idx) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/60 bg-muted/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow/10 border border-yellow/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-yellow" />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold text-yellow">
                      {batch.id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {batch.producer} · {batch.origin} ·{" "}
                      {batch.numberOfBags.toLocaleString()} bags
                    </div>
                  </div>
                </div>
                <Button
                  data-ocid={`verification.initiate_button.${idx + 1}`}
                  onClick={() => handleInitiate(batch.id)}
                  size="sm"
                  className="bg-green text-background hover:opacity-90 font-semibold text-xs flex-shrink-0"
                >
                  Initiate Verification
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Verification Requests */}
      {allVerifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h3 className="font-display font-semibold mb-4">
            Verification Requests
          </h3>

          <div className="space-y-3">
            <AnimatePresence>
              {allVerifications.map((v) => {
                const batch = batches.find((b) => b.id === v.batchId);
                return (
                  <motion.div
                    key={v.batchId}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border",
                      v.status === "Verified"
                        ? "border-success/30 bg-success/5"
                        : v.status === "Failed"
                          ? "border-destructive/30 bg-destructive/5"
                          : "border-border/60 bg-muted/10",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        {v.status === "Verified" ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : v.status === "Failed" ? (
                          <XCircle className="w-5 h-5 text-destructive" />
                        ) : (
                          <Loader2 className="w-5 h-5 text-yellow animate-spin" />
                        )}
                      </div>
                      <div>
                        <div className="font-mono text-sm font-bold text-yellow">
                          {v.batchId}
                        </div>
                        {batch && (
                          <div className="text-xs text-muted-foreground">
                            {batch.producer} · {batch.origin}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground/60 mt-0.5">
                          Requested:{" "}
                          {new Date(v.requestedAt).toLocaleTimeString()}
                          {v.completedAt &&
                            ` · Completed: ${new Date(v.completedAt).toLocaleTimeString()}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {v.status === "Processing" && (
                        <div className="flex items-center gap-2 text-xs text-yellow">
                          <div className="flex gap-1">
                            {[0, 0.3, 0.6].map((delay) => (
                              <div
                                key={delay}
                                className="w-1.5 h-1.5 rounded-full bg-yellow animate-bounce"
                                style={{ animationDelay: `${delay}s` }}
                              />
                            ))}
                          </div>
                          <span>Querying oracle...</span>
                        </div>
                      )}
                      <span
                        className={cn(
                          "text-xs font-semibold px-2.5 py-1 rounded-full",
                          statusColors[v.status],
                        )}
                      >
                        {v.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-display font-semibold mb-4 text-muted-foreground text-sm uppercase tracking-wider">
          How Reserve Verification Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {infoCards.map((card, idx) => (
            <div
              key={card.title}
              className={cn(
                "rounded-xl border border-border bg-card p-5 card-hover",
              )}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-9 h-9 rounded-lg bg-yellow/10 border border-yellow/20 flex items-center justify-center mb-3">
                <card.icon className="w-4 h-4 text-yellow" />
              </div>
              <h4 className="font-display font-semibold text-sm mb-2">
                {card.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <NextStepButton />
    </div>
  );
}
