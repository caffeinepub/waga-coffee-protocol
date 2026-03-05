import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";



actor {
  type Batch = {
    id : Nat;
    farmName : Text;
    region : Text;
    weightKg : Nat;
    grade : Text;
    status : BatchStatus;
  };

  type BatchStatus = {
    #pendingVerification;
    #verified;
    #minted;
  };

  type Token = {
    batchId : Nat;
    tokenSupply : Nat;
    transactionHash : Text;
    timestamp : Int;
  };

  type Distributor = {
    id : Nat;
    name : Text;
    region : Text;
    walletAddress : Text;
  };

  type DistributionOrder = {
    id : Nat;
    tokenId : Nat;
    distributorId : Nat;
    quantity : Nat;
    timestamp : Int;
  };

  type Redemption = {
    id : Nat;
    batchId : Nat;
    quantity : Nat;
    redeemer : Text;
    status : RedemptionStatus;
    timestamp : Int;
  };

  type RedemptionStatus = {
    #pending;
    #completed;
  };

  type BatchLifecycle = {
    batch : Batch;
    tokens : [Token];
    distributions : [DistributionOrder];
    redemptions : [Redemption];
  };

  let nextIdMap = Map.empty<Text, Nat>();
  let batches = Map.empty<Nat, Batch>();
  let tokens = Map.empty<Nat, Token>();
  let distributors = Map.empty<Nat, Distributor>();
  let distributionOrders = Map.empty<Nat, DistributionOrder>();
  let redemptions = Map.empty<Nat, Redemption>();

  // Get Next ID Function
  func getNextId(key : Text) : Nat {
    let currentId = switch (nextIdMap.get(key)) {
      case (?id) { id };
      case (null) { 1 };
    };
    nextIdMap.add(key, currentId + 1);
    currentId;
  };

  // Batch Management Functions
  public shared ({ caller }) func createBatch(farmName : Text, region : Text, weightKg : Nat, grade : Text) : async Nat {
    let id = getNextId("batch");
    let batch : Batch = {
      id;
      farmName;
      region;
      weightKg;
      grade;
      status = #pendingVerification;
    };
    batches.add(id, batch);
    id;
  };

  public query ({ caller }) func getBatch(id : Nat) : async ?Batch {
    batches.get(id);
  };

  public query ({ caller }) func getAllBatches() : async [Batch] {
    batches.values().toArray();
  };

  // Reserve Verification Function
  public shared ({ caller }) func verifyBatch(id : Nat) : async Bool {
    switch (batches.get(id)) {
      case (null) { false };
      case (?batch) {
        if (batch.status == #pendingVerification) {
          let updatedBatch = { batch with status = #verified };
          batches.add(id, updatedBatch);
          true;
        } else {
          false;
        };
      };
    };
  };

  // Token Minting Function
  public shared ({ caller }) func mintTokens(batchId : Nat, tokenSupply : Nat, transactionHash : Text) : async Bool {
    switch (batches.get(batchId)) {
      case (null) { false };
      case (?batch) {
        if (batch.status == #verified) {
          let tokenId = getNextId("token");
          let token : Token = {
            batchId;
            tokenSupply;
            transactionHash;
            timestamp = Time.now();
          };
          tokens.add(tokenId, token);

          let updatedBatch = { batch with status = #minted };
          batches.add(batchId, updatedBatch);
          true;
        } else {
          false;
        };
      };
    };
  };

  // Community Distribution Functions
  public shared ({ caller }) func registerDistributor(name : Text, region : Text, walletAddress : Text) : async Nat {
    let id = getNextId("distributor");
    let distributor : Distributor = {
      id;
      name;
      region;
      walletAddress;
    };
    distributors.add(id, distributor);
    id;
  };

  public shared ({ caller }) func placeDistributionOrder(tokenId : Nat, distributorId : Nat, quantity : Nat) : async Bool {
    switch (tokens.get(tokenId), distributors.get(distributorId)) {
      case (null, _) { false };
      case (_, null) { false };
      case (?token, ?distributor) {
        let orderId = getNextId("distributionOrder");
        let order : DistributionOrder = {
          id = orderId;
          tokenId;
          distributorId;
          quantity;
          timestamp = Time.now();
        };
        distributionOrders.add(orderId, order);
        true;
      };
    };
  };

  // Inventory Management Query Functions
  public query ({ caller }) func getTokenBalance(tokenId : Nat) : async ?Nat {
    switch (tokens.get(tokenId)) {
      case (null) { null };
      case (?token) { ?token.tokenSupply };
    };
  };

  public query ({ caller }) func getBatchInventory(batchId : Nat) : async ?Nat {
    var total = 0;
    for ((_, token) in tokens.entries()) {
      if (token.batchId == batchId) {
        total += token.tokenSupply;
      };
    };
    ?total;
  };

  // Token Redemption Request Function
  public shared ({ caller }) func submitRedemptionRequest(batchId : Nat, quantity : Nat, redeemer : Text) : async Nat {
    let id = getNextId("redemption");
    let redemption : Redemption = {
      id;
      batchId;
      quantity;
      redeemer;
      status = #pending;
      timestamp = Time.now();
    };
    redemptions.add(id, redemption);
    id;
  };

  // Complete Redemption Function
  public shared ({ caller }) func completeRedemptionRequest(id : Nat) : async Bool {
    switch (redemptions.get(id)) {
      case (null) { false };
      case (?redemption) {
        let updatedRedemption = { redemption with status = #completed };
        redemptions.add(id, updatedRedemption);
        true;
      };
    };
  };

  // QR Traceability Function
  public query ({ caller }) func getBatchLifecycle(batchId : Nat) : async ?BatchLifecycle {
    switch (batches.get(batchId)) {
      case (null) { null };
      case (?batch) {
        let tokenList = List.empty<Token>();
        let distributionList = List.empty<DistributionOrder>();
        let redemptionList = List.empty<Redemption>();

        for ((_, token) in tokens.entries()) {
          if (token.batchId == batchId) {
            tokenList.add(token);
          };
        };

        for ((_, order) in distributionOrders.entries()) {
          if (order.tokenId == batchId) {
            distributionList.add(order);
          };
        };

        for ((_, redemption) in redemptions.entries()) {
          if (redemption.batchId == batchId) {
            redemptionList.add(redemption);
          };
        };

        ?{
          batch;
          tokens = tokenList.toArray();
          distributions = distributionList.toArray();
          redemptions = redemptionList.toArray();
        };
      };
    };
  };
};
