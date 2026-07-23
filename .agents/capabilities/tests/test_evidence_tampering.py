#!/usr/bin/env python3
"""
[HARDENING-03] Evidence Tampering Test
Ensures that if an Evidence node's canonical representation is altered after hash generation,
it is caught as HASH_MISMATCH.
"""

import unittest
from test_valid_capability import EvidenceNode

class HashMismatchError(Exception):
    pass

class EvidenceEngine:
    @staticmethod
    def verify_and_accept(evidence: EvidenceNode):
        if not evidence.hash_verified:
            raise HashMismatchError("HASH_MISMATCH: Evidence rejected due to tampering.")
        return True

class TestEvidenceTampering(unittest.TestCase):
    
    def test_tampered_confidence_rejected(self):
        # 1. Genuine creation
        data = {
            "source_capability": "market-research-last30days",
            "type": "market_trend",
            "confidence": 0.85,
            "observations": ["obs_1"]
        }
        evidence = EvidenceNode(data)
        
        # 2. Malicious modification after hash is generated
        evidence.data["confidence"] = 0.99
        
        # 3. Detection
        with self.assertRaises(HashMismatchError) as ctx:
            EvidenceEngine.verify_and_accept(evidence)
            
        self.assertIn("HASH_MISMATCH", str(ctx.exception))

if __name__ == '__main__':
    unittest.main()
