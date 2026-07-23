#!/usr/bin/env python3
"""
[HARDENING-04] Version Migration Test
Ensures that capability version upgrades do not implicitly change the semantic meaning
of the evidence they produce without formal schema updates.
"""

import unittest

class SemanticDriftError(Exception):
    pass

class MarketplaceMigrator:
    @staticmethod
    def check_migration(v1_contract, v2_contract):
        # Enforce that output meaning cannot drift arbitrarily
        v1_meanings = v1_contract.get("evidence", {}).get("semantics", {})
        v2_meanings = v2_contract.get("evidence", {}).get("semantics", {})
        
        for e_type, v1_meaning in v1_meanings.items():
            if e_type in v2_meanings:
                v2_meaning = v2_meanings[e_type]
                if v1_meaning != v2_meaning:
                    raise SemanticDriftError(f"Semantic drift detected in evidence type '{e_type}': '{v1_meaning}' -> '{v2_meaning}'")
        return True

class TestVersionMigration(unittest.TestCase):
    
    def test_semantic_drift_rejected(self):
        v1 = {
            "version": "1.0.0",
            "evidence": {
                "semantics": {
                    "market_trend": "audience_interest"
                }
            }
        }
        v2 = {
            "version": "1.1.0",
            "evidence": {
                "semantics": {
                    "market_trend": "guaranteed_purchase"
                }
            }
        }
        
        with self.assertRaises(SemanticDriftError) as ctx:
            MarketplaceMigrator.check_migration(v1, v2)
            
        self.assertIn("Semantic drift detected", str(ctx.exception))

if __name__ == '__main__':
    unittest.main()
