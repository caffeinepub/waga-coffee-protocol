import { NextStepButton } from "@/components/NextStepButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { generateQRDataUrl } from "@/utils/qrCanvas";
import {
  Box,
  Calendar,
  CheckCircle2,
  Circle,
  Coffee,
  Cog,
  Eye,
  Hash,
  MapPin,
  QrCode,
  Scan,
  ShoppingBag,
  Sprout,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const STATIC_BATCH = {
  product: "Yirgacheffe Single Origin",
  origin: "Yirgacheffe, Ethiopia",
  harvestDate: "October 2024",
  process: "Washed",
  distribution: "Nordic Coffee Traders, Oslo",
  batchId: "ETH-YIR-2024-001",
};

function formatDate(offset: number, base?: string): string {
  const d = base ? new Date(base) : new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const FAKE_TX = {
  txHash: "0x8d3f2a1b4c9e7f6a5d8c3b2e1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2",
  blockNumber: "19847234",
  blockHash: "0x7f6e5d4c3b2a1f0e9d8c7b6a5e4f3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f",
  timestamp: new Date().toISOString(),
  from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  to: "0xOAC_PROTOCOL_CONTRACT_v2_0x5FbDB2315678",
  gasUsed: "142,381",
  gasPrice: "12.4 Gwei",
  contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  eventLogs: [
    {
      event: "TokensMinted",
      args: "batchId: ETH-YIR-2024-001, tokenId: TKN-A1B2C3D4, supply: 1000",
    },
    {
      event: "BatchVerified",
      args: "batchId: ETH-YIR-2024-001, oracle: 0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
    {
      event: "OwnershipTransferred",
      args: "from: 0x0000...0000, to: 0xf39F...2266",
    },
  ],
};

export function QRTraceability() {
  const { batches, verifications, tokens, distributionOrders, redemptions } =
    useApp();
  const [scanned, setScanned] = useState(false);
  const [showBlockchain, setShowBlockchain] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const verifiedBatch = batches.find(
    (b) => b.status !== "Pending Verification" && b.status !== "Failed",
  );

  const coffeeInfo = verifiedBatch
    ? {
        product: `${verifiedBatch.variety} ${verifiedBatch.roastProfile} Roast`,
        origin: `${verifiedBatch.origin}`,
        harvestDate: verifiedBatch.harvestDate
          ? new Date(verifiedBatch.harvestDate).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })
          : "October 2024",
        process: verifiedBatch.process,
        distribution: "Global Distribution Network",
        batchId: verifiedBatch.id,
        altitude: verifiedBatch.altitude,
        producer: verifiedBatch.producer,
      }
    : {
        ...STATIC_BATCH,
        altitude: "1,800-2,200 masl",
        producer: "Yirgacheffe Cooperative",
      };

  // Find token for this batch
  const batchToken = tokens.find((t) => t.batchId === coffeeInfo.batchId);
  const batchStatus =
    batches.find((b) => b.id === coffeeInfo.batchId)?.status ??
    "Pending Verification";

  // Generate QR code using npm package
  useEffect(() => {
    const qrText = [
      "OburugoAgroChain",
      `Batch: ${coffeeInfo.batchId}`,
      `Producer: ${coffeeInfo.producer}`,
      `Origin: ${coffeeInfo.origin}`,
      `Process: ${coffeeInfo.process}`,
      `Harvest: ${coffeeInfo.harvestDate}`,
      `Altitude: ${coffeeInfo.altitude}`,
      `Status: ${batchStatus}`,
      `Token: ${batchToken?.id ?? "Pending"}`,
      `Supply: ${batchToken?.supply ?? "N/A"}`,
      `TxHash: ${batchToken?.txHash ?? "N/A"}`,
    ].join("\n");

    const url = generateQRDataUrl(qrText, 200, "#1a0f00", "#f5f0e8");
    if (url) setQrDataUrl(url);
  }, [
    coffeeInfo.batchId,
    coffeeInfo.producer,
    coffeeInfo.origin,
    coffeeInfo.process,
    coffeeInfo.harvestDate,
    coffeeInfo.altitude,
    batchStatus,
    batchToken,
  ]);

  const baseDate = verifiedBatch?.harvestDate || "2024-10-01";

  const timelineSteps = [
    {
      icon: Sprout,
      title: "Farm Harvest",
      desc: `Hand-picked at ${coffeeInfo.altitude} in ${coffeeInfo.origin}`,
      date: formatDate(0, baseDate),
      color: "text-success",
    },
    {
      icon: Cog,
      title: "Processing",
      desc: `${coffeeInfo.process} method — 18-21 day fermentation`,
      date: formatDate(7, baseDate),
      color: "text-yellow",
    },
    {
      icon: Coffee,
      title: "Roasting",
      desc: "Precision roasting at certified facility",
      date: formatDate(21, baseDate),
      color: "text-coffee",
    },
    {
      icon: Truck,
      title: "Distribution",
      desc: coffeeInfo.distribution,
      date: formatDate(30, baseDate),
      color: "text-info",
    },
    {
      icon: ShoppingBag,
      title: "Consumer Purchase",
      desc: "Verified authenticity via QR scan",
      date: formatDate(45, baseDate),
      color: "text-cream",
    },
  ];

  // Protocol cycle completion checks
  const cycleSteps = [
    {
      label: "Batch Creation",
      step: 1,
      done: batches.length > 0,
    },
    {
      label: "Reserve Verification",
      step: 2,
      done: Object.values(verifications).some((v) => v.status === "Verified"),
    },
    {
      label: "Token Minting",
      step: 3,
      done: tokens.length > 0,
    },
    {
      label: "Community Distribution",
      step: 4,
      done: distributionOrders.length > 0,
    },
    {
      label: "Inventory Management",
      step: 5,
      done: tokens.some((t) => t.status !== "Active"),
    },
    {
      label: "Token Redemption",
      step: 6,
      done: redemptions.length > 0,
    },
    {
      label: "QR Traceability",
      step: 7,
      done: true,
    },
  ];

  const completedCount = cycleSteps.filter((s) => s.done).length;

  // Real blockchain data with fallback
  const realTxHash = batchToken?.txHash ?? FAKE_TX.txHash;
  const realTimestamp = batchToken?.mintedAt ?? FAKE_TX.timestamp;
  const realTokenId = batchToken?.id ?? "TKN-A1B2C3D4";
  const realSupply = batchToken?.supply ?? 1000;

  const blockchainRows = [
    { label: "Transaction Hash", value: realTxHash, mono: true },
    { label: "Block Number", value: FAKE_TX.blockNumber, mono: true },
    {
      label: "Block Hash",
      value: `${FAKE_TX.blockHash.slice(0, 42)}...`,
      mono: true,
    },
    {
      label: "Timestamp",
      value: new Date(realTimestamp).toLocaleString(),
      mono: false,
    },
    { label: "From", value: FAKE_TX.from, mono: true },
    { label: "Contract", value: FAKE_TX.contractAddress, mono: true },
    { label: "Gas Used", value: FAKE_TX.gasUsed, mono: false },
    { label: "Gas Price", value: FAKE_TX.gasPrice, mono: false },
  ];

  const eventLogs = [
    {
      event: "TokensMinted",
      args: `batchId: ${coffeeInfo.batchId}, tokenId: ${realTokenId}, supply: ${realSupply}`,
    },
    {
      event: "BatchVerified",
      args: `batchId: ${coffeeInfo.batchId}, oracle: 0x514910771AF9Ca656af840dff83E8264EcF986CA`,
    },
    {
      event: "OwnershipTransferred",
      args: "from: 0x0000...0000, to: 0xf39F...2266",
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
        <div className="step-circle">07</div>
        <div>
          <h2 className="font-display text-2xl font-bold">QR Traceability</h2>
          <p className="text-sm text-muted-foreground">
            Scan to reveal the complete farm-to-cup journey
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: QR + Protocol cycle + Scanned info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* QR Code panel */}
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center gap-6">
            {/* Real QR Code */}
            <div className="relative">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="OburugoAgroChain QR Code"
                  width={200}
                  height={200}
                  className="rounded-xl"
                />
              ) : (
                <div className="w-[200px] h-[200px] rounded-xl bg-muted/30 flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="font-mono text-xs text-muted-foreground mb-1">
                OAC/{coffeeInfo.batchId}
              </p>
              <p className="text-xs text-muted-foreground/60">
                Scan with any QR reader or click below
              </p>
            </div>

            <Button
              data-ocid="qr.scan_button"
              onClick={() => setScanned(true)}
              size="lg"
              className={cn(
                "w-full font-semibold transition-all duration-300",
                scanned
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-green text-background hover:opacity-90 glow-green-sm",
              )}
            >
              <Scan className="w-4 h-4 mr-2" />
              {scanned ? "QR Code Scanned ✓" : "Simulate QR Scan"}
            </Button>
          </div>

          {/* Protocol Cycle Status — always visible */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            data-ocid="qr.cycle_status.card"
            className="rounded-2xl border border-yellow/30 bg-yellow/5 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow" />
                <h3 className="font-display font-semibold text-sm text-yellow">
                  Protocol Cycle Status
                </h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                {completedCount}/{cycleSteps.length} complete
              </span>
            </div>

            <div className="space-y-2">
              {cycleSteps.map((step) => (
                <div
                  key={step.step}
                  className="flex items-center gap-3"
                  data-ocid={`qr.cycle_status.item.${step.step}`}
                >
                  {step.done ? (
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-xs",
                      step.done
                        ? "text-foreground font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    <span className="font-mono text-muted-foreground/60 mr-1.5">
                      {String(step.step).padStart(2, "0")}
                    </span>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {completedCount === cycleSteps.length && (
              <div className="mt-4 pt-3 border-t border-success/20 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span className="text-xs text-success font-semibold">
                  Full protocol cycle complete
                </span>
              </div>
            )}
          </motion.div>

          {/* Scanned info card */}
          <AnimatePresence>
            {scanned && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-success/30 bg-success/5 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <h3 className="font-display font-semibold text-success text-sm">
                    Coffee Information
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: Coffee,
                      label: "Product",
                      value: coffeeInfo.product,
                    },
                    { icon: MapPin, label: "Origin", value: coffeeInfo.origin },
                    {
                      icon: Calendar,
                      label: "Harvest Date",
                      value: coffeeInfo.harvestDate,
                    },
                    { icon: Cog, label: "Process", value: coffeeInfo.process },
                    {
                      icon: Truck,
                      label: "Distribution",
                      value: coffeeInfo.distribution,
                    },
                    {
                      icon: Hash,
                      label: "Batch ID",
                      value: coffeeInfo.batchId,
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-md bg-success/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-3.5 h-3.5 text-success" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-success/20">
                  <Button
                    data-ocid="qr.blockchain_record_button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBlockchain(true)}
                    className="w-full border-success/30 text-success hover:bg-success/10 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5 mr-2" />
                    View Complete Blockchain Record
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Supply Chain Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="font-display font-semibold">Supply Chain Journey</h3>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="relative space-y-0">
              {timelineSteps.map((step, idx) => {
                const isLast = idx === timelineSteps.length - 1;
                return (
                  <div key={step.title} className="relative flex gap-4">
                    {/* Connector line */}
                    {!isLast && (
                      <div className="absolute left-[1.15rem] top-10 bottom-0 w-0.5 bg-gradient-to-b from-yellow/50 to-yellow/10" />
                    )}

                    {/* Icon circle */}
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center w-9 h-9 rounded-full border flex-shrink-0 mt-1",
                        "bg-yellow/10 border-yellow/30",
                      )}
                    >
                      <step.icon className={cn("w-4 h-4", step.color)} />
                    </div>

                    {/* Content */}
                    <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-display font-semibold text-sm">
                          {step.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Producer info */}
          <div className="rounded-xl border border-yellow/20 bg-yellow/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sprout className="w-3.5 h-3.5 text-yellow" />
              <span className="text-xs font-semibold text-yellow">
                Producer Details
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-muted-foreground">Cooperative</div>
              <div className="text-foreground">{coffeeInfo.producer}</div>
              <div className="text-muted-foreground">Origin</div>
              <div className="text-foreground">{coffeeInfo.origin}</div>
              <div className="text-muted-foreground">Altitude</div>
              <div className="text-foreground">{coffeeInfo.altitude}</div>
              <div className="text-muted-foreground">Process</div>
              <div className="text-foreground">{coffeeInfo.process}</div>
            </div>
          </div>

          {!scanned && (
            <div className="rounded-xl border border-border/60 bg-muted/10 p-4 flex items-center gap-3 text-sm text-muted-foreground">
              <QrCode className="w-4 h-4 text-yellow flex-shrink-0" />
              <span>
                Click "Simulate QR Scan" to reveal the full provenance record.
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Blockchain Record Modal */}
      <Dialog open={showBlockchain} onOpenChange={setShowBlockchain}>
        <DialogContent
          data-ocid="qr.blockchain_record_modal"
          className="max-w-2xl bg-card border-border text-foreground max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow" />
              Blockchain Transaction Record
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Transaction details */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              {blockchainRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-1.5 border-b border-border/40 last:border-0"
                >
                  <span className="text-xs text-muted-foreground w-32 flex-shrink-0">
                    {row.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs text-foreground break-all",
                      row.mono && "font-mono text-yellow",
                    )}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Event logs */}
            <div>
              <h4 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                <Box className="w-4 h-4 text-yellow" />
                Event Logs
              </h4>
              <div className="space-y-2">
                {eventLogs.map((log, idx) => (
                  <div
                    key={log.event}
                    className="rounded-lg border border-border bg-background p-3"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-yellow">
                        {log.event}
                      </span>
                      <span className="text-xs text-muted-foreground/60">
                        Log #{idx}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground break-all">
                      {log.args}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              data-ocid="qr.blockchain_record_modal.close_button"
              onClick={() => setShowBlockchain(false)}
              variant="outline"
              className="w-full border-border"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <NextStepButton />
    </div>
  );
}
