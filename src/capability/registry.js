/**
 * AI Code Skin OS - Capability Manifest Registry (ESM Standard)
 * Phase 3: Capability Governance & Discovery Plane
 * Central authoritative repository binding admitted manifests to driver instances:
 *  - Enforces unknown capability rejection boundary
 *  - Support dynamic implementation replacement behind invariant URN contracts
 */

export class CapabilityRegistry {
  constructor() {
    this._registryMap = new Map();
  }

  /**
   * Registers a loaded manifest and driver implementation into the discovery plane.
   */
  register(manifest, driverInstance) {
    if (!manifest || !manifest.capability_manifest_id || !driverInstance) {
      throw new Error('[REGISTRY INTEGRITY FAULT]: Cannot register capability without valid manifest identity and driver instance.');
    }

    this._registryMap.set(manifest.capability_manifest_id, {
      manifest,
      driver: driverInstance,
      registered_at: new Date().toISOString()
    });

    return true;
  }

  /**
   * Swaps a driver implementation behind an unchanged URN contract without touching kernel code!
   */
  replaceImplementation(manifestId, newDriverInstance) {
    const entry = this._registryMap.get(manifestId);
    if (!entry) {
      throw new Error(`Cannot replace implementation for unregistered manifest ID '${manifestId}'.`);
    }

    this._registryMap.set(manifestId, {
      ...entry,
      driver: newDriverInstance,
      replaced_at: new Date().toISOString()
    });

    return true;
  }

  lookup(manifestId) {
    return this._registryMap.get(manifestId) || null;
  }

  isRegistered(manifestId) {
    return this._registryMap.has(manifestId);
  }

  listManifestIds() {
    return Array.from(this._registryMap.keys());
  }
}
