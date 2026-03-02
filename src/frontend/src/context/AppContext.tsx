import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type BatchStatus =
  | "Pending Verification"
  | "Verified"
  | "Failed"
  | "Minted"
  | "Distributed"
  | "Redeemed";

export interface Batch {
  id: string;
  producer: string;
  origin: string;
  variety: string;
  altitude: string;
  process: string;
  roastProfile: string;
  harvestDate: string;
  numberOfBags: number;
  bagSize: string;
  pricePerBag: number;
  status: BatchStatus;
  createdAt: string;
}

export type TokenStatus = "Active" | "Partially Redeemed" | "Fully Redeemed";

export interface Token {
  id: string;
  batchId: string;
  supply: number;
  remainingSupply: number;
  txHash: string;
  status: TokenStatus;
  mintedAt: string;
}

export type DistributorTier = "Bronze" | "Silver" | "Gold";

export interface Distributor {
  id: string;
  name: string;
  location: string;
  stake: number;
  tier: DistributorTier;
  registeredAt: string;
}

export interface StakingPosition {
  distributorId: string;
  amount: number;
  stakedAt: string;
}

export type DistributionOrderStatus = "Processing" | "Fulfilled" | "Cancelled";

export interface DistributionOrder {
  id: string;
  tokenId: string;
  distributorId: string;
  quantity: number;
  status: DistributionOrderStatus;
  createdAt: string;
}

export type RedemptionStatus =
  | "Requested"
  | "Token Burning"
  | "3PL Notified"
  | "In Transit"
  | "Delivered";

export interface Redemption {
  id: string;
  tokenId: string;
  batchId: string;
  quantity: number;
  deliveryAddress: string;
  status: RedemptionStatus;
  createdAt: string;
  statusUpdatedAt: string;
}

export type VerificationStatus =
  | "Pending"
  | "Processing"
  | "Verified"
  | "Failed";

export interface Verification {
  batchId: string;
  status: VerificationStatus;
  requestedAt: string;
  completedAt?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

let batchCounter = 1;

export function generateBatchId(origin: string, year: number): string {
  const originCode = origin.slice(0, 3).toUpperCase();
  const counter = String(batchCounter++).padStart(3, "0");
  return `${originCode}-YIR-${year}-${counter}`;
}

export function generateTxHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function generateTokenId(): string {
  const chars = "0123456789ABCDEF";
  let id = "TKN-";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function generateOrderId(): string {
  return `ORD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function generateRedemptionId(): string {
  return `RDM-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function getTierFromStake(stake: number): DistributorTier {
  if (stake >= 10000) return "Gold";
  if (stake >= 5000) return "Silver";
  return "Bronze";
}

// ── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  // Data
  batches: Batch[];
  verifications: Record<string, Verification>;
  tokens: Token[];
  distributors: Distributor[];
  stakingPositions: StakingPosition[];
  distributionOrders: DistributionOrder[];
  redemptions: Redemption[];

  // Batch actions
  addBatch: (batch: Omit<Batch, "id" | "status" | "createdAt">) => Batch;
  updateBatchStatus: (batchId: string, status: BatchStatus) => void;

  // Verification actions
  initiateVerification: (batchId: string) => void;
  updateVerification: (batchId: string, status: VerificationStatus) => void;

  // Token actions
  mintToken: (batchId: string, supply: number) => Token;
  updateTokenSupply: (tokenId: string, redeemedQty: number) => void;

  // Distributor actions
  addDistributor: (
    distributor: Omit<Distributor, "id" | "tier" | "registeredAt">,
  ) => Distributor;
  updateStake: (distributorId: string, newStake: number) => void;

  // Distribution order actions
  addDistributionOrder: (
    order: Omit<DistributionOrder, "id" | "status" | "createdAt">,
  ) => DistributionOrder;

  // Redemption actions
  addRedemption: (
    redemption: Omit<
      Redemption,
      "id" | "status" | "createdAt" | "statusUpdatedAt"
    >,
  ) => Redemption;
  updateRedemptionStatus: (
    redemptionId: string,
    status: RedemptionStatus,
  ) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [verifications, setVerifications] = useState<
    Record<string, Verification>
  >({});
  const [tokens, setTokens] = useState<Token[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>(
    [],
  );
  const [distributionOrders, setDistributionOrders] = useState<
    DistributionOrder[]
  >([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  // Batch
  const addBatch = useCallback(
    (data: Omit<Batch, "id" | "status" | "createdAt">): Batch => {
      const year = data.harvestDate
        ? new Date(data.harvestDate).getFullYear()
        : new Date().getFullYear();
      const batch: Batch = {
        ...data,
        id: generateBatchId(data.origin, year),
        status: "Pending Verification",
        createdAt: new Date().toISOString(),
      };
      setBatches((prev) => [...prev, batch]);
      return batch;
    },
    [],
  );

  const updateBatchStatus = useCallback(
    (batchId: string, status: BatchStatus) => {
      setBatches((prev) =>
        prev.map((b) => (b.id === batchId ? { ...b, status } : b)),
      );
    },
    [],
  );

  // Verification
  const initiateVerification = useCallback((batchId: string) => {
    const verification: Verification = {
      batchId,
      status: "Processing",
      requestedAt: new Date().toISOString(),
    };
    setVerifications((prev) => ({ ...prev, [batchId]: verification }));
  }, []);

  const updateVerification = useCallback(
    (batchId: string, status: VerificationStatus) => {
      setVerifications((prev) => ({
        ...prev,
        [batchId]: {
          ...prev[batchId],
          status,
          completedAt: new Date().toISOString(),
        },
      }));
      if (status === "Verified") {
        updateBatchStatus(batchId, "Verified");
      } else if (status === "Failed") {
        updateBatchStatus(batchId, "Failed");
      }
    },
    [updateBatchStatus],
  );

  // Token
  const mintToken = useCallback(
    (batchId: string, supply: number): Token => {
      const token: Token = {
        id: generateTokenId(),
        batchId,
        supply,
        remainingSupply: supply,
        txHash: generateTxHash(),
        status: "Active",
        mintedAt: new Date().toISOString(),
      };
      setTokens((prev) => [...prev, token]);
      updateBatchStatus(batchId, "Minted");
      return token;
    },
    [updateBatchStatus],
  );

  const updateTokenSupply = useCallback(
    (tokenId: string, redeemedQty: number) => {
      setTokens((prev) =>
        prev.map((t) => {
          if (t.id !== tokenId) return t;
          const newRemaining = Math.max(0, t.remainingSupply - redeemedQty);
          const status: TokenStatus =
            newRemaining === 0
              ? "Fully Redeemed"
              : newRemaining < t.supply
                ? "Partially Redeemed"
                : "Active";
          return { ...t, remainingSupply: newRemaining, status };
        }),
      );
    },
    [],
  );

  // Distributor
  const addDistributor = useCallback(
    (data: Omit<Distributor, "id" | "tier" | "registeredAt">): Distributor => {
      const distributor: Distributor = {
        ...data,
        id: `DIST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        tier: getTierFromStake(data.stake),
        registeredAt: new Date().toISOString(),
      };
      setDistributors((prev) => [...prev, distributor]);
      setStakingPositions((prev) => [
        ...prev,
        {
          distributorId: distributor.id,
          amount: data.stake,
          stakedAt: new Date().toISOString(),
        },
      ]);
      return distributor;
    },
    [],
  );

  const updateStake = useCallback((distributorId: string, newStake: number) => {
    setDistributors((prev) =>
      prev.map((d) =>
        d.id === distributorId
          ? { ...d, stake: newStake, tier: getTierFromStake(newStake) }
          : d,
      ),
    );
    setStakingPositions((prev) =>
      prev.map((sp) =>
        sp.distributorId === distributorId ? { ...sp, amount: newStake } : sp,
      ),
    );
  }, []);

  // Distribution Order
  const addDistributionOrder = useCallback(
    (
      data: Omit<DistributionOrder, "id" | "status" | "createdAt">,
    ): DistributionOrder => {
      const order: DistributionOrder = {
        ...data,
        id: generateOrderId(),
        status: "Processing",
        createdAt: new Date().toISOString(),
      };
      setDistributionOrders((prev) => [...prev, order]);
      return order;
    },
    [],
  );

  // Redemption
  const addRedemption = useCallback(
    (
      data: Omit<Redemption, "id" | "status" | "createdAt" | "statusUpdatedAt">,
    ): Redemption => {
      const redemption: Redemption = {
        ...data,
        id: generateRedemptionId(),
        status: "Requested",
        createdAt: new Date().toISOString(),
        statusUpdatedAt: new Date().toISOString(),
      };
      setRedemptions((prev) => [...prev, redemption]);
      updateTokenSupply(data.tokenId, data.quantity);
      return redemption;
    },
    [updateTokenSupply],
  );

  const updateRedemptionStatus = useCallback(
    (redemptionId: string, status: RedemptionStatus) => {
      setRedemptions((prev) =>
        prev.map((r) =>
          r.id === redemptionId
            ? { ...r, status, statusUpdatedAt: new Date().toISOString() }
            : r,
        ),
      );
    },
    [],
  );

  return (
    <AppContext.Provider
      value={{
        batches,
        verifications,
        tokens,
        distributors,
        stakingPositions,
        distributionOrders,
        redemptions,
        addBatch,
        updateBatchStatus,
        initiateVerification,
        updateVerification,
        mintToken,
        updateTokenSupply,
        addDistributor,
        updateStake,
        addDistributionOrder,
        addRedemption,
        updateRedemptionStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
