#!/usr/bin/env python3
"""
EDAOS Public Compatibility Registry
Equivalent to CNCF Landscape / Docker Hub for EDAOS-certified runtimes.

Tracks: runtime name, vendor, certification level, expiry, conformance score.
Usage:
    python edaos_compatibility_registry.py
    python edaos_compatibility_registry.py --register
    python edaos_compatibility_registry.py --verify "My Runtime"
"""

import sys
import json
import time
import hashlib
from dataclasses import dataclass, field, asdict
from typing import Optional
from datetime import datetime, timezone

# ─────────────────────────────────────────────────────────────────────────────
# DATA MODEL
# ─────────────────────────────────────────────────────────────────────────────

CERT_LEVELS = {
    "L1": "Evidence Exchange",
    "L2": "Decision Provenance",
    "L3": "Governance Compliance",
    "L4": "Autonomous Execution Safety",
    "ENTERPRISE": "L4 + Independent Audit (Spec 87)",
}


@dataclass
class RegistryEntry:
    runtime_name: str
    vendor: str
    version: str
    cert_level: str                      # L1 / L2 / L3 / L4 / ENTERPRISE
    conformance_score: float             # e.g. 15/15 = 1.0
    certified_at: str                    # ISO 8601
    expires_at: str                      # ISO 8601
    spec_version: str = "11.0.0"
    open_source: bool = True
    repo_url: str = ""
    fingerprint: str = field(default="")

    def __post_init__(self):
        if not self.fingerprint:
            raw = f"{self.runtime_name}{self.vendor}{self.version}{self.cert_level}"
            self.fingerprint = hashlib.sha256(raw.encode()).hexdigest()[:20]

    def is_valid(self) -> bool:
        expiry = datetime.fromisoformat(self.expires_at.replace("Z", "+00:00"))
        return expiry > datetime.now(timezone.utc)

    def cert_label(self) -> str:
        return CERT_LEVELS.get(self.cert_level, self.cert_level)


# ─────────────────────────────────────────────────────────────────────────────
# REGISTRY STORE  (in-memory; production would use PostgreSQL)
# ─────────────────────────────────────────────────────────────────────────────

REGISTRY: list[RegistryEntry] = [
    RegistryEntry(
        runtime_name="EDAOS Reference Runtime",
        vendor="EDAOS Foundation",
        version="11.0.0",
        cert_level="L4",
        conformance_score=1.0,           # 15/15
        certified_at="2026-07-22T04:15:00Z",
        expires_at="2027-07-22T04:15:00Z",
        open_source=True,
        repo_url="github.com/edaos-foundation/edaos-runtime",
    ),
    RegistryEntry(
        runtime_name="EDAOS Cloud Runtime (AWS)",
        vendor="Example Cloud Corp",
        version="2.1.0",
        cert_level="L4",
        conformance_score=1.0,
        certified_at="2026-07-22T06:00:00Z",
        expires_at="2027-07-22T06:00:00Z",
        open_source=False,
        repo_url="cloud.example.com/edaos",
    ),
    RegistryEntry(
        runtime_name="OpenEDAOS Community",
        vendor="Community",
        version="1.0.0-beta",
        cert_level="L3",
        conformance_score=0.93,          # 14/15
        certified_at="2026-07-22T07:00:00Z",
        expires_at="2027-07-22T07:00:00Z",
        open_source=True,
        repo_url="github.com/openedaos/openedaos",
    ),
    RegistryEntry(
        runtime_name="MicroEDAOS Embedded",
        vendor="IoT Engineering Ltd",
        version="0.9.0",
        cert_level="L1",
        conformance_score=1.0,           # 4/4 L1 only
        certified_at="2026-07-22T08:00:00Z",
        expires_at="2027-07-22T08:00:00Z",
        open_source=False,
        repo_url="iot-engineering.example/micro-edaos",
    ),
]


# ─────────────────────────────────────────────────────────────────────────────
# REGISTRY OPERATIONS
# ─────────────────────────────────────────────────────────────────────────────

class CompatibilityRegistry:
    def __init__(self, entries: list[RegistryEntry]):
        self.entries = entries

    def all_valid(self) -> list[RegistryEntry]:
        return [e for e in self.entries if e.is_valid()]

    def by_level(self, level: str) -> list[RegistryEntry]:
        return [e for e in self.all_valid() if e.cert_level == level]

    def lookup(self, name: str) -> Optional[RegistryEntry]:
        name_lower = name.lower()
        for e in self.entries:
            if name_lower in e.runtime_name.lower():
                return e
        return None

    def landscape(self):
        """Print CNCF-landscape-style overview."""
        print("\n  EDAOS COMPATIBLE RUNTIME LANDSCAPE")
        print("  registry.edaos.org  |  EDAOS Foundation  |  "
              f"Updated {datetime.now().strftime('%Y-%m-%d')}")
        print()

        level_order = ["ENTERPRISE", "L4", "L3", "L2", "L1"]
        for level in level_order:
            entries = self.by_level(level)
            if not entries:
                continue
            label = CERT_LEVELS[level]
            print(f"  [{level}] {label}")
            print(f"  " + "-" * 58)
            for e in entries:
                oss = "OSS" if e.open_source else "COM"
                score_pct = int(e.conformance_score * 100)
                valid_tag = "VALID" if e.is_valid() else "EXPIRED"
                print(f"    {e.runtime_name:<36}  [{oss}] [{valid_tag}]"
                      f"  score={score_pct}%")
                print(f"    {e.vendor:<36}  v{e.version}")
                print(f"    {e.repo_url}")
                print(f"    fingerprint: {e.fingerprint}  expires: {e.expires_at[:10]}")
                print()

        total = len(self.all_valid())
        levels = {l: len(self.by_level(l)) for l in level_order}
        print(f"  SUMMARY: {total} certified runtime(s)")
        for l, count in levels.items():
            if count:
                print(f"    {l}: {count}")

    def verify(self, name: str):
        entry = self.lookup(name)
        if entry is None:
            print(f"\n  [NOT FOUND] No certified runtime matching '{name}'")
            print("  Run 'edaos certify' or check registry.edaos.org")
            return

        valid = entry.is_valid()
        print(f"\n  EDAOS CERTIFICATION VERIFICATION")
        print(f"  " + "-" * 50)
        print(f"  Runtime     : {entry.runtime_name}")
        print(f"  Vendor      : {entry.vendor}")
        print(f"  Version     : {entry.version}")
        print(f"  Cert Level  : {entry.cert_level} — {entry.cert_label()}")
        print(f"  Score       : {int(entry.conformance_score*100)}%")
        print(f"  Spec Version: EDAOS {entry.spec_version}")
        print(f"  Fingerprint : {entry.fingerprint}")
        print(f"  Expires     : {entry.expires_at[:10]}")
        print(f"  Status      : {'VALID' if valid else 'EXPIRED'}")
        print(f"  " + "-" * 50)


# ─────────────────────────────────────────────────────────────────────────────
# ADOPTION METRICS  (from registry data)
# ─────────────────────────────────────────────────────────────────────────────

def print_adoption_metrics(registry: CompatibilityRegistry):
    valid = registry.all_valid()
    oss_count = sum(1 for e in valid if e.open_source)
    com_count = sum(1 for e in valid if not e.open_source)
    avg_score = sum(e.conformance_score for e in valid) / len(valid) if valid else 0

    print(f"\n  EDAOS ECOSYSTEM ADOPTION METRICS")
    print(f"  " + "-" * 50)
    print(f"  Certified Runtimes  : {len(valid)}")
    print(f"    Open Source       : {oss_count}")
    print(f"    Commercial        : {com_count}")
    print(f"  Avg Conformance     : {avg_score:.0%}")
    print(f"  Highest Level       : L4 Autonomous Execution Safety")
    print(f"  Spec Coverage       : 100 specs (EDAOS v11.0)")
    print(f"  " + "-" * 50)


# ─────────────────────────────────────────────────────────────────────────────
# CLI ENTRYPOINT
# ─────────────────────────────────────────────────────────────────────────────

def main():
    registry = CompatibilityRegistry(REGISTRY)
    args = sys.argv[1:]

    if "--verify" in args:
        idx = args.index("--verify")
        name = args[idx + 1] if idx + 1 < len(args) else ""
        registry.verify(name)
    elif "--metrics" in args:
        print_adoption_metrics(registry)
    else:
        # default: print full landscape
        registry.landscape()
        print_adoption_metrics(registry)


if __name__ == "__main__":
    main()
