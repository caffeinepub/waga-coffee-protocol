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
import { Calendar, DollarSign, Layers, Package, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface BatchFormData {
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
}

const defaultForm: BatchFormData = {
  producer: "Yirgacheffe Cooperative",
  origin: "Ethiopia",
  variety: "Heirloom",
  altitude: "1,800-2,200 masl",
  process: "Washed",
  roastProfile: "Light",
  harvestDate: "",
  numberOfBags: 1000,
  bagSize: "1kg",
  pricePerBag: 12.99,
};

const statusColors: Record<string, string> = {
  "Pending Verification": "badge-gray",
  Verified: "badge-green",
  Failed: "badge-red",
  Minted: "badge-blue",
  Distributed: "badge-amber",
  Redeemed: "badge-gray",
};

export function BatchCreation() {
  const { addBatch, batches } = useApp();
  const [form, setForm] = useState<BatchFormData>(defaultForm);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const batch = addBatch(form);
    toast.success(`Batch created: ${batch.id}`, {
      description: `${batch.producer} · ${batch.origin} · ${batch.numberOfBags} bags`,
    });
    setForm((prev) => ({
      ...prev,
      producer: defaultForm.producer,
      origin: defaultForm.origin,
    }));
  }

  function updateField<K extends keyof BatchFormData>(
    key: K,
    value: BatchFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="step-circle">01</div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Batch Creation
            </h2>
            <p className="text-sm text-muted-foreground">
              Register a new coffee batch on the blockchain
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="rounded-2xl border border-border bg-card p-6 card-hover">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-4 h-4 text-amber" />
              <h3 className="font-display font-semibold text-foreground">
                New Batch Details
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Producer */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Producer
                  </Label>
                  <Input
                    data-ocid="batch.producer_input"
                    value={form.producer}
                    onChange={(e) => updateField("producer", e.target.value)}
                    placeholder="Yirgacheffe Cooperative"
                    className="bg-muted/30 border-border focus:border-amber/50"
                    required
                  />
                </div>

                {/* Origin */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Origin
                  </Label>
                  <Input
                    data-ocid="batch.origin_input"
                    value={form.origin}
                    onChange={(e) => updateField("origin", e.target.value)}
                    placeholder="Ethiopia"
                    className="bg-muted/30 border-border focus:border-amber/50"
                    required
                  />
                </div>

                {/* Variety */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Variety
                  </Label>
                  <Input
                    value={form.variety}
                    onChange={(e) => updateField("variety", e.target.value)}
                    placeholder="Heirloom"
                    className="bg-muted/30 border-border focus:border-amber/50"
                  />
                </div>

                {/* Altitude */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Altitude
                  </Label>
                  <Input
                    value={form.altitude}
                    onChange={(e) => updateField("altitude", e.target.value)}
                    placeholder="1,800-2,200 masl"
                    className="bg-muted/30 border-border focus:border-amber/50"
                  />
                </div>

                {/* Process */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Process
                  </Label>
                  <Select
                    value={form.process}
                    onValueChange={(v) => updateField("process", v)}
                  >
                    <SelectTrigger
                      data-ocid="batch.process_select"
                      className="bg-muted/30 border-border focus:border-amber/50"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {["Washed", "Natural", "Honey", "Anaerobic"].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Roast Profile */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Roast Profile
                  </Label>
                  <Select
                    value={form.roastProfile}
                    onValueChange={(v) => updateField("roastProfile", v)}
                  >
                    <SelectTrigger className="bg-muted/30 border-border focus:border-amber/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {["Light", "Medium", "Medium-Dark", "Dark"].map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Harvest Date */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Harvest Date
                  </Label>
                  <Input
                    type="date"
                    value={form.harvestDate}
                    onChange={(e) => updateField("harvestDate", e.target.value)}
                    className="bg-muted/30 border-border focus:border-amber/50"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                {/* Number of Bags */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Package className="w-3 h-3" /> Number of Bags
                  </Label>
                  <Input
                    data-ocid="batch.bags_input"
                    type="number"
                    value={form.numberOfBags}
                    onChange={(e) =>
                      updateField(
                        "numberOfBags",
                        Number.parseInt(e.target.value) || 0,
                      )
                    }
                    min={1}
                    className="bg-muted/30 border-border focus:border-amber/50"
                    required
                  />
                </div>

                {/* Bag Size */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Bag Size
                  </Label>
                  <Select
                    value={form.bagSize}
                    onValueChange={(v) => updateField("bagSize", v)}
                  >
                    <SelectTrigger className="bg-muted/30 border-border focus:border-amber/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {["250g", "500g", "1kg"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price per Bag */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Price per Bag ($)
                  </Label>
                  <Input
                    type="number"
                    value={form.pricePerBag}
                    onChange={(e) =>
                      updateField(
                        "pricePerBag",
                        Number.parseFloat(e.target.value) || 0,
                      )
                    }
                    step={0.01}
                    min={0}
                    className="bg-muted/30 border-border focus:border-amber/50"
                  />
                </div>
              </div>

              <Button
                data-ocid="batch.submit_button"
                type="submit"
                className="w-full bg-amber text-background hover:bg-amber/90 font-semibold mt-2 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Batch
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Batch list */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">
              Created Batches
            </h3>
            <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full border border-border">
              {batches.length} total
            </span>
          </div>

          {batches.length === 0 ? (
            <div
              data-ocid="batch.empty_state"
              className="rounded-2xl border border-border/60 bg-card/50 p-10 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                <Layers className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No batches created yet.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Fill out the form to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {batches.map((batch, idx) => (
                <motion.div
                  key={batch.id}
                  data-ocid={`batch.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-border bg-card p-4 card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-mono text-sm font-bold text-amber">
                        {batch.id}
                      </div>
                      <div className="text-sm font-medium text-foreground mt-0.5">
                        {batch.producer}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full",
                        statusColors[batch.status] || "badge-gray",
                      )}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin</span>
                      <span className="text-foreground/80 font-medium">
                        {batch.origin}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Process</span>
                      <span className="text-foreground/80 font-medium">
                        {batch.process}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bags</span>
                      <span className="text-foreground/80 font-medium">
                        {batch.numberOfBags.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size</span>
                      <span className="text-foreground/80 font-medium">
                        {batch.bagSize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="text-foreground/80 font-medium">
                        ${batch.pricePerBag}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Roast</span>
                      <span className="text-foreground/80 font-medium">
                        {batch.roastProfile}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info card */}
          <div className="rounded-xl border border-amber/20 bg-amber/5 p-4">
            <div className="text-xs font-semibold text-amber mb-1.5">
              On-Chain Registration
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Each batch receives a unique blockchain ID encoding origin,
              cooperative, harvest year, and a sequential counter. Batches move
              through the verification pipeline automatically.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
