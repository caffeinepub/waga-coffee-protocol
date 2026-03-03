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
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { CheckCircle2, Coins, Copy, Layers3, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const tokenStatusColors: Record<string, string> = {
  Active: "badge-blue",
  "Partially Redeemed": "badge-amber",
  "Fully Redeemed": "badge-gray",
};

export function TokenMinting() {
  const { batches, tokens, mintToken } = useApp();
  const verifiedBatches = batches.filter((b) => b.status === "Verified");

  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [quantity, setQuantity] = useState<number>(0);

  function handleBatchSelect(batchId: string) {
    setSelectedBatchId(batchId);
    const batch = batches.find((b) => b.id === batchId);
    if (batch) setQuantity(batch.numberOfBags);
  }

  function handleMint(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBatchId || quantity <= 0) return;

    const token = mintToken(selectedBatchId, quantity);
    toast.success(`Tokens minted! TX: ${token.txHash.slice(0, 10)}...`, {
      description: `Token ${token.id} · ${quantity.toLocaleString()} supply`,
    });
    setSelectedBatchId("");
    setQuantity(0);
  }

  function copyTx(hash: string) {
    navigator.clipboard.writeText(hash).then(() => {
      toast.info("Transaction hash copied");
    });
  }

  const infoCards = [
    {
      icon: Layers3,
      title: "Multi-Token Standard",
      desc: "ERC-1155 enables a single contract to manage both fungible and non-fungible tokens, perfect for batches with varying quantities and attributes.",
    },
    {
      icon: Shuffle,
      title: "Fractional Ownership",
      desc: "Each token represents a single bag of coffee, enabling fractional trading, distribution, and redemption at any quantity down to individual units.",
    },
    {
      icon: CheckCircle2,
      title: "On-Chain Metadata",
      desc: "All batch attributes — origin, process, altitude, harvest date — are stored on-chain as token metadata, providing permanent provenance records.",
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
        <div className="step-circle">03</div>
        <div>
          <h2 className="font-display text-2xl font-bold">Token Minting</h2>
          <p className="text-sm text-muted-foreground">
            Convert verified batches into ERC-1155 tokens
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Minting form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 card-hover h-fit"
        >
          <div className="flex items-center gap-2 mb-6">
            <Coins className="w-4 h-4 text-yellow" />
            <h3 className="font-display font-semibold">Mint New Tokens</h3>
          </div>

          {verifiedBatches.length === 0 ? (
            <div data-ocid="minting.empty_state" className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                <Coins className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No verified batches available.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Complete verification in Step 2 first.
              </p>
            </div>
          ) : (
            <form onSubmit={handleMint} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Select Verified Batch
                </Label>
                <Select
                  value={selectedBatchId}
                  onValueChange={handleBatchSelect}
                >
                  <SelectTrigger
                    data-ocid="minting.batch_select"
                    className="bg-muted/30 border-border focus:border-green/50"
                  >
                    <SelectValue placeholder="Choose a verified batch..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {verifiedBatches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        <span className="font-mono text-yellow">{b.id}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          · {b.producer} · {b.numberOfBags.toLocaleString()}{" "}
                          bags
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBatchId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl border border-yellow/20 bg-yellow/5 p-4 space-y-2"
                >
                  {(() => {
                    const b = batches.find((x) => x.id === selectedBatchId);
                    if (!b) return null;
                    return (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-muted-foreground">Producer</div>
                        <div className="text-foreground font-medium">
                          {b.producer}
                        </div>
                        <div className="text-muted-foreground">Origin</div>
                        <div className="text-foreground font-medium">
                          {b.origin}
                        </div>
                        <div className="text-muted-foreground">Process</div>
                        <div className="text-foreground font-medium">
                          {b.process}
                        </div>
                        <div className="text-muted-foreground">Bag Size</div>
                        <div className="text-foreground font-medium">
                          {b.bagSize}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Token Supply (= Bag Count)
                </Label>
                <Input
                  data-ocid="minting.quantity_input"
                  type="number"
                  value={quantity || ""}
                  onChange={(e) =>
                    setQuantity(Number.parseInt(e.target.value) || 0)
                  }
                  min={1}
                  className="bg-muted/30 border-border focus:border-green/50"
                  required
                />
              </div>

              {selectedBatchId && quantity > 0 && (
                <div className="rounded-lg bg-muted/20 border border-border p-3 text-xs text-muted-foreground">
                  Minting{" "}
                  <span className="text-green font-semibold">
                    {quantity.toLocaleString()} ERC-1155 tokens
                  </span>{" "}
                  on the OburugoAgroChain smart contract
                </div>
              )}

              <Button
                data-ocid="minting.submit_button"
                type="submit"
                disabled={!selectedBatchId || quantity <= 0}
                className="w-full bg-green text-background hover:opacity-90 font-semibold disabled:opacity-50"
              >
                <Coins className="w-4 h-4 mr-2" />
                Mint Tokens
              </Button>
            </form>
          )}
        </motion.div>

        {/* Minted tokens */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Minted Tokens</h3>
            <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border">
              {tokens.length} token{tokens.length !== 1 ? "s" : ""}
            </span>
          </div>

          {tokens.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/50 p-10 text-center">
              <Coins className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No tokens minted yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {tokens.map((token, idx) => (
                <motion.div
                  key={token.id}
                  data-ocid={`token.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-border bg-card p-4 card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-sm font-bold text-yellow">
                        {token.id}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Batch: {token.batchId}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full",
                        tokenStatusColors[token.status],
                      )}
                    >
                      {token.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-xs mb-3">
                    <div className="text-muted-foreground">Total Supply</div>
                    <div className="text-foreground font-medium">
                      {token.supply.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Remaining</div>
                    <div className="text-foreground font-medium">
                      {token.remainingSupply.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">Minted</div>
                    <div className="text-foreground font-medium">
                      {new Date(token.mintedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyTx(token.txHash)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-yellow transition-colors group"
                  >
                    <Copy className="w-3 h-3 group-hover:text-yellow" />
                    <span className="font-mono truncate max-w-[200px]">
                      {token.txHash.slice(0, 20)}...
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-display font-semibold mb-4 text-muted-foreground text-sm uppercase tracking-wider">
          About ERC-1155 Tokens
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {infoCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-border bg-card p-5 card-hover"
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
