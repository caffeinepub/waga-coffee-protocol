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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTierFromStake, useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Network,
  Package,
  Plus,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const tierColors: Record<string, string> = {
  Bronze:
    "text-[oklch(0.65_0.12_50)] border-[oklch(0.65_0.12_50_/_0.3)] bg-[oklch(0.65_0.12_50_/_0.1)]",
  Silver:
    "text-[oklch(0.75_0.03_220)] border-[oklch(0.75_0.03_220_/_0.3)] bg-[oklch(0.75_0.03_220_/_0.1)]",
  Gold: "badge-amber",
};

const orderStatusColors: Record<string, string> = {
  Processing: "badge-amber",
  Fulfilled: "badge-green",
  Cancelled: "badge-red",
};

export function CommunityDistribution() {
  const {
    distributors,
    stakingPositions,
    tokens,
    distributionOrders,
    addDistributor,
    updateStake,
    addDistributionOrder,
  } = useApp();

  // Distributor form
  const [distName, setDistName] = useState("");
  const [distLocation, setDistLocation] = useState("");
  const [distStake, setDistStake] = useState<number>(1000);

  // Staking
  const [selectedDistForStake, setSelectedDistForStake] = useState("");
  const [stakeAmount, setStakeAmount] = useState<number>(0);

  // Distribution order
  const [orderTokenId, setOrderTokenId] = useState("");
  const [orderDistributorId, setOrderDistributorId] = useState("");
  const [orderQty, setOrderQty] = useState<number>(0);

  function handleRegisterDistributor(e: React.FormEvent) {
    e.preventDefault();
    if (!distName.trim()) return;
    const d = addDistributor({
      name: distName.trim(),
      location: distLocation.trim(),
      stake: distStake,
    });
    toast.success(`Distributor ${d.name} registered`, {
      description: `${d.tier} tier · Stake: ${d.stake.toLocaleString()} WAGA`,
    });
    setDistName("");
    setDistLocation("");
    setDistStake(1000);
  }

  function handleAddStake(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDistForStake || stakeAmount <= 0) return;
    const dist = distributors.find((d) => d.id === selectedDistForStake);
    if (!dist) return;
    const newStake = dist.stake + stakeAmount;
    updateStake(selectedDistForStake, newStake);
    toast.success(
      `Staked ${stakeAmount.toLocaleString()} WAGA for ${dist.name}`,
      {
        description: `New total: ${newStake.toLocaleString()} · Tier: ${getTierFromStake(newStake)}`,
      },
    );
    setStakeAmount(0);
  }

  function handleUnstake(distributorId: string, amount: number) {
    const dist = distributors.find((d) => d.id === distributorId);
    if (!dist) return;
    const newStake = Math.max(0, dist.stake - amount);
    updateStake(distributorId, newStake);
    toast.info(`Unstaked ${amount.toLocaleString()} WAGA from ${dist.name}`);
  }

  function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!orderTokenId || !orderDistributorId || orderQty <= 0) return;
    const order = addDistributionOrder({
      tokenId: orderTokenId,
      distributorId: orderDistributorId,
      quantity: orderQty,
    });
    const dist = distributors.find((d) => d.id === orderDistributorId);
    toast.success(`Distribution order ${order.id} created`, {
      description: `${orderQty.toLocaleString()} tokens → ${dist?.name ?? "Distributor"}`,
    });
    setOrderTokenId("");
    setOrderDistributorId("");
    setOrderQty(0);
  }

  const availableTokens = tokens.filter((t) => t.status !== "Fully Redeemed");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="step-circle">04</div>
        <div>
          <h2 className="font-display text-2xl font-bold">
            Community Distribution
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage distributor network, staking, and token allocation
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="distributors">
          <TabsList className="bg-muted/30 border border-border p-1 mb-6">
            <TabsTrigger
              data-ocid="distribution.tab.distributors"
              value="distributors"
              className="data-[state=active]:bg-amber data-[state=active]:text-background font-medium text-sm"
            >
              <Users className="w-3.5 h-3.5 mr-2" />
              Distributors
            </TabsTrigger>
            <TabsTrigger
              data-ocid="distribution.tab.staking"
              value="staking"
              className="data-[state=active]:bg-amber data-[state=active]:text-background font-medium text-sm"
            >
              <TrendingUp className="w-3.5 h-3.5 mr-2" />
              Staking
            </TabsTrigger>
            <TabsTrigger
              data-ocid="distribution.tab.orders"
              value="orders"
              className="data-[state=active]:bg-amber data-[state=active]:text-background font-medium text-sm"
            >
              <Package className="w-3.5 h-3.5 mr-2" />
              Distribution Orders
            </TabsTrigger>
          </TabsList>

          {/* ─── Distributors Tab ─── */}
          <TabsContent value="distributors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registration form */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber" />
                  Register Distributor
                </h3>
                <form
                  onSubmit={handleRegisterDistributor}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Distributor Name
                    </Label>
                    <Input
                      data-ocid="distribution.name_input"
                      value={distName}
                      onChange={(e) => setDistName(e.target.value)}
                      placeholder="e.g. Nordic Coffee Traders"
                      className="bg-muted/30 border-border focus:border-amber/50"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Location
                    </Label>
                    <Input
                      data-ocid="distribution.location_input"
                      value={distLocation}
                      onChange={(e) => setDistLocation(e.target.value)}
                      placeholder="e.g. Oslo, Norway"
                      className="bg-muted/30 border-border focus:border-amber/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Initial Staking Amount (min 1,000 WAGA)
                    </Label>
                    <Input
                      data-ocid="distribution.stake_input"
                      type="number"
                      value={distStake || ""}
                      onChange={(e) =>
                        setDistStake(Number.parseInt(e.target.value) || 0)
                      }
                      min={1000}
                      className="bg-muted/30 border-border focus:border-amber/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tier:{" "}
                      <span
                        className={cn(
                          "font-semibold",
                          distStake >= 10000
                            ? "text-amber"
                            : distStake >= 5000
                              ? "text-muted-foreground"
                              : "text-muted-foreground",
                        )}
                      >
                        {getTierFromStake(distStake)}
                      </span>{" "}
                      (Bronze: 1k–5k · Silver: 5k–10k · Gold: 10k+)
                    </p>
                  </div>
                  <Button
                    data-ocid="distribution.register_button"
                    type="submit"
                    className="w-full bg-amber text-background hover:bg-amber/90 font-semibold"
                  >
                    Register Distributor
                  </Button>
                </form>
              </div>

              {/* Distributor list */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold flex items-center justify-between">
                  <span>Registered Distributors</span>
                  <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border font-normal">
                    {distributors.length}
                  </span>
                </h3>

                {distributors.length === 0 ? (
                  <div
                    data-ocid="distribution.empty_state"
                    className="rounded-xl border border-border/60 bg-card/50 p-8 text-center"
                  >
                    <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No distributors yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {distributors.map((d, idx) => (
                      <div
                        key={d.id}
                        data-ocid={`distribution.item.${idx + 1}`}
                        className="rounded-xl border border-border bg-card p-4 card-hover"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-sm">
                              {d.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {d.location}
                            </div>
                          </div>
                          <span
                            className={cn(
                              "text-xs font-semibold px-2 py-0.5 rounded-full border",
                              tierColors[d.tier],
                            )}
                          >
                            {d.tier}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Stake</span>
                          <span className="text-amber font-mono font-semibold">
                            {d.stake.toLocaleString()} WAGA
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tier legend */}
                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                    Discount Tiers
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        tier: "Bronze",
                        range: "1,000 – 4,999",
                        discount: "5%",
                      },
                      {
                        tier: "Silver",
                        range: "5,000 – 9,999",
                        discount: "10%",
                      },
                      { tier: "Gold", range: "10,000+", discount: "15%" },
                    ].map((t) => (
                      <div
                        key={t.tier}
                        className="flex items-center justify-between text-xs"
                      >
                        <span
                          className={cn(
                            "font-semibold px-2 py-0.5 rounded-full border",
                            tierColors[t.tier],
                          )}
                        >
                          {t.tier}
                        </span>
                        <span className="text-muted-foreground">
                          {t.range} WAGA
                        </span>
                        <span className="text-success font-medium">
                          {t.discount} off
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── Staking Tab ─── */}
          <TabsContent value="staking">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add stake form */}
              <div className="rounded-2xl border border-border bg-card p-6 h-fit">
                <h3 className="font-display font-semibold mb-4">
                  Stake More WAGA
                </h3>
                {distributors.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Register a distributor first.
                  </p>
                ) : (
                  <form onSubmit={handleAddStake} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Distributor
                      </Label>
                      <Select
                        value={selectedDistForStake}
                        onValueChange={setSelectedDistForStake}
                      >
                        <SelectTrigger className="bg-muted/30 border-border focus:border-amber/50">
                          <SelectValue placeholder="Select distributor..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {distributors.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name} · {d.stake.toLocaleString()} WAGA
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Amount to Stake
                      </Label>
                      <Input
                        type="number"
                        value={stakeAmount || ""}
                        onChange={(e) =>
                          setStakeAmount(Number.parseInt(e.target.value) || 0)
                        }
                        min={1}
                        placeholder="Enter WAGA amount"
                        className="bg-muted/30 border-border focus:border-amber/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={!selectedDistForStake || stakeAmount <= 0}
                      className="w-full bg-amber text-background hover:bg-amber/90 font-semibold disabled:opacity-50"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Add Stake
                    </Button>
                  </form>
                )}
              </div>

              {/* Staking positions */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold">
                  Staking Positions
                </h3>
                {stakingPositions.length === 0 ? (
                  <div className="rounded-xl border border-border/60 bg-card/50 p-8 text-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No staking positions yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {distributors.map((dist, idx) => {
                      const sp = stakingPositions.find(
                        (s) => s.distributorId === dist.id,
                      );
                      return (
                        <div
                          key={dist.id}
                          data-ocid={`staking.item.${idx + 1}`}
                          className="rounded-xl border border-border bg-card p-4 card-hover"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-semibold text-sm flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-amber" />
                                {dist.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {dist.location}
                              </div>
                            </div>
                            <span
                              className={cn(
                                "text-xs font-semibold px-2 py-0.5 rounded-full border",
                                tierColors[dist.tier],
                              )}
                            >
                              {dist.tier}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl font-mono font-bold text-amber">
                              {dist.stake.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              WAGA staked
                            </div>
                          </div>

                          {/* Tier progress bar */}
                          <div className="space-y-1 mb-3">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Progress to next tier</span>
                              {dist.tier !== "Gold" && (
                                <span>
                                  {dist.tier === "Bronze"
                                    ? `${(5000 - dist.stake).toLocaleString()} to Silver`
                                    : `${(10000 - dist.stake).toLocaleString()} to Gold`}
                                </span>
                              )}
                              {dist.tier === "Gold" && (
                                <span className="text-amber">
                                  Max tier reached
                                </span>
                              )}
                            </div>
                            <div className="h-1.5 rounded-full bg-border overflow-hidden">
                              <div
                                className="h-full rounded-full bg-amber transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, (dist.stake / 10000) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnstake(dist.id, 500)}
                              className="flex-1 text-xs border-border hover:border-destructive/50 hover:text-destructive"
                            >
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Unstake 500
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnstake(dist.id, 1000)}
                              className="flex-1 text-xs border-border hover:border-destructive/50 hover:text-destructive"
                            >
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Unstake 1000
                            </Button>
                          </div>

                          {sp && (
                            <p className="text-xs text-muted-foreground/60 mt-2">
                              Staked since{" "}
                              {new Date(sp.stakedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ─── Orders Tab ─── */}
          <TabsContent value="orders">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create order form */}
              <div className="rounded-2xl border border-border bg-card p-6 h-fit">
                <h3 className="font-display font-semibold mb-4">
                  Create Distribution Order
                </h3>

                {availableTokens.length === 0 || distributors.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">
                      {availableTokens.length === 0
                        ? "Mint tokens in Step 3 first."
                        : "Register distributors first."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCreateOrder} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Select Token
                      </Label>
                      <Select
                        value={orderTokenId}
                        onValueChange={setOrderTokenId}
                      >
                        <SelectTrigger className="bg-muted/30 border-border focus:border-amber/50">
                          <SelectValue placeholder="Choose a token..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {availableTokens.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              <span className="font-mono text-amber">
                                {t.id}
                              </span>
                              <span className="text-muted-foreground ml-2 text-xs">
                                · {t.remainingSupply.toLocaleString()} avail
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Assign to Distributor
                      </Label>
                      <Select
                        value={orderDistributorId}
                        onValueChange={setOrderDistributorId}
                      >
                        <SelectTrigger className="bg-muted/30 border-border focus:border-amber/50">
                          <SelectValue placeholder="Choose a distributor..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {distributors.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                              <span
                                className={cn(
                                  "ml-2 text-xs px-1.5 py-0.5 rounded",
                                  tierColors[d.tier],
                                )}
                              >
                                {d.tier}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        value={orderQty || ""}
                        onChange={(e) =>
                          setOrderQty(Number.parseInt(e.target.value) || 0)
                        }
                        min={1}
                        className="bg-muted/30 border-border focus:border-amber/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        !orderTokenId || !orderDistributorId || orderQty <= 0
                      }
                      className="w-full bg-amber text-background hover:bg-amber/90 font-semibold disabled:opacity-50"
                    >
                      Create Order
                    </Button>
                  </form>
                )}
              </div>

              {/* Order list */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold">
                  Distribution Orders
                </h3>
                {distributionOrders.length === 0 ? (
                  <div
                    data-ocid="orders.empty_state"
                    className="rounded-xl border border-border/60 bg-card/50 p-8 text-center"
                  >
                    <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {distributionOrders.map((order, idx) => {
                      const dist = distributors.find(
                        (d) => d.id === order.distributorId,
                      );
                      const token = tokens.find((t) => t.id === order.tokenId);
                      return (
                        <div
                          key={order.id}
                          data-ocid={`orders.item.${idx + 1}`}
                          className="rounded-xl border border-border bg-card p-4 card-hover"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-mono text-sm font-bold text-amber">
                              {order.id}
                            </div>
                            <span
                              className={cn(
                                "text-xs font-semibold px-2.5 py-1 rounded-full",
                                orderStatusColors[order.status],
                              )}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="text-muted-foreground">Token</div>
                            <div className="font-mono text-foreground/80">
                              {token?.id ?? order.tokenId}
                            </div>
                            <div className="text-muted-foreground">
                              Distributor
                            </div>
                            <div className="text-foreground/80">
                              {dist?.name ?? order.distributorId}
                            </div>
                            <div className="text-muted-foreground">
                              Quantity
                            </div>
                            <div className="text-foreground/80">
                              {order.quantity.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Token Inventory System */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="font-display font-semibold mb-2">
          Token-Based Inventory System
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Each ERC-1155 token represents a physical unit of coffee. As tokens
          are distributed and redeemed, the on-chain record provides real-time
          inventory visibility across the entire supply chain — from cooperative
          to final consumer.
        </p>

        {/* Global Distribution Network visual */}
        <div className="rounded-xl border border-border/60 bg-background p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-6 text-center">
            Global Distribution Network
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              {
                icon: Network,
                label: "Producer",
                sub: "Coffee Cooperative",
                color: "text-coffee",
              },
              {
                icon: Users,
                label: "Distributor",
                sub: "Staked Partner",
                color: "text-amber",
              },
              {
                icon: User,
                label: "Consumer",
                sub: "End Customer",
                color: "text-cream",
              },
            ].map((node, idx) => (
              <>
                {idx > 0 && (
                  <div
                    key={`arrow-${node.label}`}
                    className="flex items-center text-muted-foreground/40"
                  >
                    <ArrowRight className="w-6 h-6 hidden sm:block" />
                    <div className="w-8 h-px bg-amber/30 block sm:hidden" />
                  </div>
                )}
                <div
                  key={node.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card min-w-[100px] text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center">
                    <node.icon className={cn("w-5 h-5", node.color)} />
                  </div>
                  <div className="font-semibold text-sm">{node.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {node.sub}
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
