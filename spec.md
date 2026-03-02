# WAGA Coffee Protocol

## Current State
Step 7 (QR Traceability) renders a decorative SVG that looks like a QR code but is not scannable by any real QR reader. It has a "Simulate QR Scan" button that reveals batch info in-app. The blockchain modal uses static hardcoded data (FAKE_TX). The displayed batch info already pulls from AppContext (real batch data if available, fallback static), but the QR image itself encodes nothing real.

## Requested Changes (Diff)

### Add
- Install `qrcode` npm package to generate a real, scannable QR code image
- Generate a data URL from `qrcode` that encodes a JSON payload containing the full batch cycle: batch metadata (id, producer, origin, variety, altitude, process, roastProfile, harvestDate, bags, pricePerBag), verification status + timestamps, token info (id, supply, txHash, mintedAt), distribution orders count, redemptions count
- Render the generated QR code `<img>` in place of the SVG mock
- When scanned with any phone camera or QR reader, the scan result is the batch JSON data (or a formatted text string if JSON is too long)
- The "Complete Cycle" display: show all 7 protocol steps with their completion status, driven by real AppContext state (batch created, verified, minted, distributed, redeemed, QR generated)

### Modify
- Replace the decorative SVG QR code with a dynamically generated real QR code image (`<img src={qrDataUrl} />`)
- Encode the QR with a human-readable summary URL-style string or compact JSON of the full cycle batch data
- Update the blockchain record modal to use real batch/token data from AppContext where available, falling back to static for demo
- The "Supply Chain Journey" timeline should already reflect real batch data (it does), keep as is

### Remove
- The static SVG QR code (all the `<rect>` and `<circle>` elements)
- The decorative corner accent overlays (no longer needed since we have a real QR image)

## Implementation Plan
1. Install `qrcode` and `@types/qrcode` in frontend package
2. In QRTraceability.tsx, add a `useEffect` that generates QR data URL via `QRCode.toDataURL(text, options)` whenever `coffeeInfo` changes
3. The encoded text = a compact string with all key batch cycle fields:
   - WAGA Coffee Protocol | Batch: {id} | Producer: {producer} | Origin: {origin} | Process: {process} | Status: {batchStatus} | Token: {tokenId} | Supply: {supply} | TxHash: {txHash} | Verified: {verifiedAt} | Redeemed: {redemptionCount}
4. Render `<img src={qrDataUrl} />` with white background, replacing SVG mock
5. Add a "Complete Cycle" summary section below the QR panel showing all 7 steps as checkmarks (completed vs pending), driven by real AppContext state
6. Wire blockchain modal to use real token txHash and real batch data
