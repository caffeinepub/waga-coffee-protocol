import { NextStepButton } from "@/components/NextStepButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type RedemptionStatus, useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Flame,
  MapPin,
  Package2,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Warehouse,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const REDEMPTION_FLOW: RedemptionStatus[] = [
  "Requested",
  "Token Burning",
  "3PL Notified",
  "In Transit",
  "Delivered",
];

const FLOW_DELAYS = [3000, 3000, 3000, 5000];

const statusConfig: Record<
  RedemptionStatus,
  { color: string; icon: React.FC<{ className?: string }> }
> = {
  Requested: { color: "badge-gray", icon: Package2 },
  "Token Burning": { color: "badge-red", icon: Flame },
  "3PL Notified": { color: "badge-amber", icon: Truck },
  "In Transit": { color: "badge-blue", icon: Truck },
  Delivered: { color: "badge-green", icon: CheckCircle2 },
};

const burnCode = `// Burn tokens on redemption request
function redeemCoffee(
    uint256 tokenId,
    uint256 amount,
    bytes32 deliveryHash
) external whenNotPaused {
    require(balanceOf(msg.sender, tokenId) >= amount, "Insufficient balance");
    
    // Burn tokens permanently
    _burn(msg.sender, tokenId, amount);
    
    // Emit event for 3PL integration
    emit RedemptionRequested(
        msg.sender,
        tokenId,
        amount,
        deliveryHash,
        block.timestamp
    );
    
    // Update supply tracking
    tokenSupply[tokenId].redeemed += amount;
}`;

export function TokenRedemption() {
  const {
    tokens,
    redemptions,
    batches,
    addRedemption,
    updateRedemptionStatus,
  } = useApp();
  const availableTokens = tokens.filter((t) => t.remainingSupply > 0);

  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [address, setAddress] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTokenId || quantity <= 0 || !address.trim()) return;

    const token = tokens.find((t) => t.id === selectedTokenId);
    if (!token) return;

    addRedemption({
      tokenId: selectedTokenId,
      batchId: token.batchId,
      quantity,
      deliveryAddress: address.trim(),
    });

    toast.success("Redemption request submitted", {
      description: `${quantity.toLocaleString()} tokens → ${address.slice(0, 30)}...`,
    });

    setSelectedTokenId("");
    setQuantity(0);
    setAddress("");
  }

  // Advance redemption statuses over time
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const r of redemptions) {
      const currentIndex = REDEMPTION_FLOW.indexOf(r.status);
      if (currentIndex >= 0 && currentIndex < REDEMPTION_FLOW.length - 1) {
        const delay = FLOW_DELAYS[currentIndex] ?? 3000;
        const timer = setTimeout(() => {
          updateRedemptionStatus(r.id, REDEMPTION_FLOW[currentIndex + 1]);
        }, delay);
        timers.push(timer);
      }
    }
    return () => {
      for (const t of timers) clearTimeout(t);
    };
  }, [redemptions, updateRedemptionStatus]);

  const fulfillmentCards = [
    {
      icon: Zap,
      title: "Automated Dispatch",
      desc: "Smart contract events trigger instant notifications to 3PL partners, automating warehouse pick-and-pack instructions within seconds of token burning.",
    },
    {
      icon: Warehouse,
      title: "Warehouse Instructions",
      desc: "QR-coded packing slips link each physical shipment to its blockchain redemption record, enabling full traceability through the last-mile delivery.",
    },
    {
      icon: ShieldCheck,
      title: "Blockchain Verification",
      desc: "Delivery confirmation is cryptographically signed and recorded on-chain, closing the loop between digital token burning and physical fulfilment.",
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
        <div className="step-circle">06</div>
        <div>
          <h2 className="font-display text-2xl font-bold">Token Redemption</h2>
          <p className="text-sm text-muted-foreground">
            Exchange tokens for physical coffee delivery
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Redemption form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 h-fit"
        >
          <div className="flex items-center gap-2 mb-6">
            <RefreshCcw className="w-4 h-4 text-amber" />
            <h3 className="font-display font-semibold">
              New Redemption Request
            </h3>
          </div>

          {availableTokens.length === 0 ? (
            <div
              data-ocid="redemption.empty_state"
              className="text-center py-8"
            >
              <RefreshCcw className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No tokens available for redemption.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Mint tokens in Step 3 first.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Select Token / Batch
                </Label>
                <Select
                  value={selectedTokenId}
                  onValueChange={setSelectedTokenId}
                >
                  <SelectTrigger
                    data-ocid="redemption.token_select"
                    className="bg-muted/30 border-border focus:border-amber/50"
                  >
                    <SelectValue placeholder="Choose a token..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {availableTokens.map((t) => {
                      const batch = batches.find((b) => b.id === t.batchId);
                      return (
                        <SelectItem key={t.id} value={t.id}>
                          <span className="font-mono text-amber">{t.id}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            · {batch?.origin ?? t.batchId} ·{" "}
                            {t.remainingSupply.toLocaleString()} avail
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Quantity
                </Label>
                <Input
                  data-ocid="redemption.quantity_input"
                  type="number"
                  value={quantity || ""}
                  onChange={(e) =>
                    setQuantity(Number.parseInt(e.target.value) || 0)
                  }
                  min={1}
                  max={
                    availableTokens.find((t) => t.id === selectedTokenId)
                      ?.remainingSupply
                  }
                  placeholder="Number of bags to redeem"
                  className="bg-muted/30 border-border focus:border-amber/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Delivery Address
                </Label>
                <Input
                  data-ocid="redemption.address_input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Coffee Lane, Oslo, Norway"
                  className="bg-muted/30 border-border focus:border-amber/50"
                  required
                />
              </div>

              {selectedTokenId && quantity > 0 && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-destructive mb-1">
                    <Flame className="w-3 h-3" />
                    <span className="font-semibold">Token Burning Notice</span>
                  </div>
                  <p className="text-muted-foreground">
                    Redeeming {quantity.toLocaleString()} tokens will
                    permanently burn them from the smart contract. This action
                    cannot be undone.
                  </p>
                </div>
              )}

              <Button
                data-ocid="redemption.submit_button"
                type="submit"
                disabled={!selectedTokenId || quantity <= 0 || !address.trim()}
                className="w-full bg-amber text-background hover:bg-amber/90 font-semibold disabled:opacity-50"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Submit Redemption Request
              </Button>
            </form>
          )}
        </motion.div>

        {/* Redemption list */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Redemption Requests</h3>
            <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border">
              {redemptions.length}
            </span>
          </div>

          {redemptions.length === 0 ? (
            <div
              data-ocid="redemption.list.empty_state"
              className="rounded-xl border border-border/60 bg-card/50 p-8 text-center"
            >
              <Package2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No redemption requests yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <AnimatePresence>
                {redemptions.map((r, idx) => {
                  const config = statusConfig[r.status];
                  const StatusIcon = config.icon;
                  const currentFlowIdx = REDEMPTION_FLOW.indexOf(r.status);
                  return (
                    <motion.div
                      key={r.id}
                      data-ocid={`redemption.item.${idx + 1}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-border bg-card p-4 card-hover"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-mono text-sm font-bold text-amber">
                            {r.id}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {r.quantity.toLocaleString()} tokens ·{" "}
                            {r.deliveryAddress.slice(0, 30)}
                            {r.deliveryAddress.length > 30 ? "..." : ""}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1",
                            config.color,
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {r.status}
                        </span>
                      </div>

                      {/* Progress indicator */}
                      <div className="flex items-center gap-1 mb-2">
                        {REDEMPTION_FLOW.map((step, si) => (
                          <div
                            key={step}
                            className={cn(
                              "flex-1 h-1 rounded-full transition-all duration-500",
                              si <= currentFlowIdx ? "bg-amber" : "bg-border",
                            )}
                          />
                        ))}
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground/60">
                        <span>Requested</span>
                        <span>Delivered</span>
                      </div>

                      <p className="text-xs text-muted-foreground/60 mt-2">
                        Updated:{" "}
                        {new Date(r.statusUpdatedAt).toLocaleTimeString()}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Redemption Process */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="font-display font-semibold mb-5">
          The Redemption Process
        </h3>
        <div className="space-y-3">
          {REDEMPTION_FLOW.map((status, idx) => {
            const config = statusConfig[status];
            const StatusIcon = config.icon;
            const descriptions: Record<RedemptionStatus, string> = {
              Requested:
                "User submits redemption request with delivery address. Smart contract validates token balance.",
              "Token Burning":
                "ERC-1155 tokens are permanently burned from the contract, reducing total supply on-chain.",
              "3PL Notified":
                "Third-party logistics partner receives automated notification with shipping instructions.",
              "In Transit":
                "Physical coffee shipped from warehouse to delivery address with tracking number.",
              Delivered:
                "Shipment confirmed delivered. Blockchain record updated with delivery proof.",
            };
            return (
              <div key={status} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold",
                      "bg-amber/10 border-amber/30 text-amber",
                    )}
                  >
                    {idx + 1}
                  </div>
                  {idx < REDEMPTION_FLOW.length - 1 && (
                    <div className="w-px h-6 bg-amber/20 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusIcon className="w-3.5 h-3.5 text-amber" />
                    <span className="font-display font-semibold text-sm">
                      {status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {descriptions[status]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Burn code */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-destructive" />
            <span className="text-sm font-semibold">
              redeemCoffee() — Burn Function
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
          </div>
        </div>
        <pre className="code-block rounded-none border-none text-[0.75rem] leading-relaxed overflow-x-auto">
          <code>
            {burnCode.split("\n").map((line, i) => {
              const isComment = line.trim().startsWith("//");
              const isKeyword =
                /^\s*(function|require|emit|bytes32|uint256|address|memory|external|bool|mapping)\b/.test(
                  line,
                );
              const lineKey = `line-${i}`;
              return (
                <span
                  key={lineKey}
                  className={cn(
                    "block",
                    isComment
                      ? "text-muted-foreground/60"
                      : isKeyword
                        ? "text-amber"
                        : "text-foreground/80",
                  )}
                >
                  {line}
                </span>
              );
            })}
          </code>
        </pre>
      </motion.div>

      {/* Fulfillment workflow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {fulfillmentCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-border bg-card p-5 card-hover"
          >
            <div className="w-9 h-9 rounded-lg bg-amber/10 border border-amber/20 flex items-center justify-center mb-3">
              <card.icon className="w-4 h-4 text-amber" />
            </div>
            <h4 className="font-display font-semibold text-sm mb-2">
              {card.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {card.desc}
            </p>
          </div>
        ))}
      </motion.div>

      <NextStepButton />
    </div>
  );
}
