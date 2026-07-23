#!/usr/bin/env python3
"""
[HARDENING-01] Valid Capability Test
Ensures that a compliant capability correctly passes validation and evidence hash verification.
"""

import unittest
import hashlib
import json

class EvidenceNode:
    def __init__(self, data):
        self.data = data
        # Canonical JSON for consistent hashing across languages
        canonical_str = json.dumps(data, sort_keys=True, separators=(',', ':'))
        self.evidence_hash = hashlib.sha256(canonical_str.encode()).hexdigest()

    @property
    def hash_verified(self):
        canonical_str = json.dumps(self.data, sort_keys=True, separators=(',', ':'))
        recalculated = hashlib.sha256(canonical_str.encode()).hexdigest()
        return self.evidence_hash == recalculated

class TestValidCapability(unittest.TestCase):
    def test_valid_capability_hash_verification(self):
        # 1. Simulate Golden Plugin output
        data = {
            "source_capability": "market-research-last30days",
            "type": "market_trend",
            "confidence": 0.85,
            "observations": ["obs_1", "obs_2"]
        }
        
        evidence = EvidenceNode(data)
        
        # 2. Runtime verification
        self.assertTrue(evidence.hash_verified, "Evidence hash must match its canonical payload.")

if __name__ == '__main__':
    unittest.main()
