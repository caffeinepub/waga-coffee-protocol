import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DistributionOrder {
    id: bigint;
    tokenId: bigint;
    distributorId: bigint;
    timestamp: bigint;
    quantity: bigint;
}
export interface Batch {
    id: bigint;
    region: string;
    status: BatchStatus;
    farmName: string;
    weightKg: bigint;
    grade: string;
}
export interface Token {
    transactionHash: string;
    tokenSupply: bigint;
    timestamp: bigint;
    batchId: bigint;
}
export interface BatchLifecycle {
    distributions: Array<DistributionOrder>;
    tokens: Array<Token>;
    batch: Batch;
    redemptions: Array<Redemption>;
}
export interface Redemption {
    id: bigint;
    status: RedemptionStatus;
    redeemer: string;
    timestamp: bigint;
    quantity: bigint;
    batchId: bigint;
}
export enum BatchStatus {
    pendingVerification = "pendingVerification",
    verified = "verified",
    minted = "minted"
}
export enum RedemptionStatus {
    pending = "pending",
    completed = "completed"
}
export interface backendInterface {
    completeRedemptionRequest(id: bigint): Promise<boolean>;
    createBatch(farmName: string, region: string, weightKg: bigint, grade: string): Promise<bigint>;
    getAllBatches(): Promise<Array<Batch>>;
    getBatch(id: bigint): Promise<Batch | null>;
    getBatchInventory(batchId: bigint): Promise<bigint | null>;
    getBatchLifecycle(batchId: bigint): Promise<BatchLifecycle | null>;
    getTokenBalance(tokenId: bigint): Promise<bigint | null>;
    mintTokens(batchId: bigint, tokenSupply: bigint, transactionHash: string): Promise<boolean>;
    placeDistributionOrder(tokenId: bigint, distributorId: bigint, quantity: bigint): Promise<boolean>;
    registerDistributor(name: string, region: string, walletAddress: string): Promise<bigint>;
    submitRedemptionRequest(batchId: bigint, quantity: bigint, redeemer: string): Promise<bigint>;
    verifyBatch(id: bigint): Promise<boolean>;
}
