import { NextStepButton } from "@/components/NextStepButton";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Database,
  Link2,
  Package,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const statusColors: Record<string, string> = {
  "Pending Verification": "badge-gray",
  Verified: "badge-green",
  Failed: "badge-red",
  Minted: "badge-blue",
  Distributed: "badge-amber",
  Redeemed: "badge-gray",
};

const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract OburugoAgroChainProtocol is ERC1155, ChainlinkClient {
    mapping(bytes32 => Batch) public batches;
    mapping(uint256 => TokenMetadata) public tokenMeta;

    struct Batch {
        string origin;
        string producer;
        uint256 quantity;
        bool verified;
        uint256 mintedTokenId;
    }

    function mintBatchTokens(
        bytes32 batchId,
        uint256 quantity
    ) external onlyVerified(batchId) {
        uint256 tokenId = uint256(batchId);
        _mint(msg.sender, tokenId, quantity, "");
        emit TokensMinted(batchId, tokenId, quantity);
    }

    function redeemTokens(
        uint256 tokenId,
        uint256 amount
    ) external {
        _burn(msg.sender, tokenId, amount);
        emit TokensBurned(tokenId, amount, msg.sender);
    }
}`;

export function InventoryManagement() {
  const { batches, tokens, redemptions } = useApp();

  const totalBatches = batches.length;
  const verifiedCount = batches.filter((b) =>
    ["Verified", "Minted", "Distributed", "Redeemed"].includes(b.status),
  ).length;
  const mintedCount = batches.filter((b) =>
    ["Minted", "Distributed", "Redeemed"].includes(b.status),
  ).length;
  const redeemedCount = batches.filter((b) => b.status === "Redeemed").length;

  const verifiedPct =
    totalBatches > 0 ? Math.round((verifiedCount / totalBatches) * 100) : 0;
  const mintedPct =
    totalBatches > 0 ? Math.round((mintedCount / totalBatches) * 100) : 0;
  const redeemedPct =
    totalBatches > 0 ? Math.round((redeemedCount / totalBatches) * 100) : 0;

  const totalMinted = tokens.reduce((sum, t) => sum + t.supply, 0);
  const totalRedeemed = redemptions.reduce((sum, r) => sum + r.quantity, 0);
  const availableTokens = totalMinted - totalRedeemed;

  // Alerts: tokens with < 10% supply remaining
  const lowInventoryAlerts = tokens.filter(
    (t) =>
      t.supply > 0 &&
      t.remainingSupply / t.supply < 0.1 &&
      t.status !== "Fully Redeemed",
  );

  const statCards = [
    {
      label: "Total Batches",
      value: totalBatches,
      icon: Package,
      color: "text-amber",
    },
    {
      label: "Verified Batches",
      value: `${verifiedPct}%`,
      icon: Activity,
      color: "text-success",
      sub: `${verifiedCount} of ${totalBatches}`,
    },
    {
      label: "Tokenized Batches",
      value: `${mintedPct}%`,
      icon: TrendingUp,
      color: "text-info",
      sub: `${mintedCount} of ${totalBatches}`,
    },
    {
      label: "Redeemed Batches",
      value: `${redeemedPct}%`,
      icon: Database,
      color: "text-muted-foreground",
      sub: `${redeemedCount} of ${totalBatches}`,
    },
  ];

  const supplyCards = [
    {
      label: "Total Minted",
      value: totalMinted.toLocaleString(),
      color: "text-amber",
    },
    {
      label: "Total Redeemed",
      value: totalRedeemed.toLocaleString(),
      color: "text-destructive",
    },
    {
      label: "Available Tokens",
      value: availableTokens.toLocaleString(),
      color: "text-success",
    },
  ];

  const infoCards = [
    {
      icon: Activity,
      title: "Real-Time Tracking",
      desc: "On-chain events provide instant visibility into every token movement — minting, transfer, and redemption events sync across all nodes in milliseconds.",
    },
    {
      icon: AlertTriangle,
      title: "Smart Alerts",
      desc: "Automated monitoring detects low inventory thresholds, triggering notifications to distributors and cooperative managers before stockouts occur.",
    },
    {
      icon: Zap,
      title: "Chainlink Automation",
      desc: "Chainlink Keepers execute on-chain inventory reconciliation at configurable intervals, ensuring supply data matches physical warehouse records.",
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
        <div className="step-circle">05</div>
        <div>
          <h2 className="font-display text-2xl font-bold">
            Inventory Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time supply chain visibility and automated monitoring
          </p>
        </div>
      </motion.div>

      {/* Batch stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5 card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                {card.label}
              </span>
              <card.icon className={cn("w-4 h-4", card.color)} />
            </div>
            <div className={cn("text-2xl font-mono font-bold", card.color)}>
              {card.value}
            </div>
            {card.sub && (
              <div className="text-xs text-muted-foreground mt-1">
                {card.sub}
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Token supply */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {supplyCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5 card-hover"
          >
            <div className="text-xs text-muted-foreground mb-2">
              {card.label}
            </div>
            <div className={cn("text-3xl font-mono font-bold", card.color)}>
              {card.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">tokens</div>
          </div>
        ))}
      </motion.div>

      {/* System Alerts */}
      {lowInventoryAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-warning/30 bg-warning/5 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="font-display font-semibold text-warning">
              Low Inventory Alerts
            </h3>
          </div>
          <div className="space-y-2">
            {lowInventoryAlerts.map((token) => (
              <div
                key={token.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-warning/20 bg-warning/5"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
                  <span className="font-mono text-sm text-warning font-semibold">
                    {token.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Batch: {token.batchId}
                  </span>
                </div>
                <div className="text-xs font-medium text-warning">
                  {token.remainingSupply}/{token.supply} remaining (
                  {Math.round((token.remainingSupply / token.supply) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Batch Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber" />
            Batch Inventory
          </h3>
          <span className="text-xs text-muted-foreground">
            {batches.length} batches
          </span>
        </div>

        {batches.length === 0 ? (
          <div data-ocid="inventory.empty_state" className="p-10 text-center">
            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No batches to display.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs text-muted-foreground font-medium p-4">
                    Batch ID
                  </th>
                  <th className="text-left text-xs text-muted-foreground font-medium p-4">
                    Producer
                  </th>
                  <th className="text-left text-xs text-muted-foreground font-medium p-4 hidden md:table-cell">
                    Origin
                  </th>
                  <th className="text-right text-xs text-muted-foreground font-medium p-4">
                    Quantity
                  </th>
                  <th className="text-right text-xs text-muted-foreground font-medium p-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch, idx) => (
                  <tr
                    key={batch.id}
                    data-ocid={`inventory.item.${idx + 1}`}
                    className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-amber font-semibold">
                        {batch.id}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-foreground/80">
                      {batch.producer}
                    </td>
                    <td className="p-4 text-sm text-foreground/80 hidden md:table-cell">
                      {batch.origin}
                    </td>
                    <td className="p-4 text-sm text-right font-mono">
                      {batch.numberOfBags.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2.5 py-1 rounded-full",
                          statusColors[batch.status],
                        )}
                      >
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Smart contract code */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-amber" />
            <span className="text-sm font-semibold">
              OburugoAgroChainProtocol.sol
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
            {solidityCode.split("\n").map((line, i) => {
              const isComment = line.trim().startsWith("//");
              const isKeyword =
                /^\s*(pragma|import|contract|mapping|struct|function|event|emit|modifier)\b/.test(
                  line,
                );
              const hasType =
                /\b(uint256|bytes32|string|bool|address|memory|external|onlyVerified)\b/.test(
                  line,
                );
              const lineKey = `sol-${i}`;
              return (
                <span
                  key={lineKey}
                  className={cn(
                    "block",
                    isComment
                      ? "text-muted-foreground/60"
                      : isKeyword
                        ? "text-amber"
                        : hasType
                          ? "text-info"
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

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {infoCards.map((card) => (
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
