#!/usr/bin/env python3
"""
[HARDENING-05] Multi-Capability Conflict Test
Ensures that opposing evidence intents against the same target block execution
and generate a DecisionConflictRecord rather than arbitrary decision-making.
"""

import unittest
from datetime import datetime, timezone
import uuid

class DecisionConflictRecord:
    def __init__(self, target_entity, domain, evidences):
        self.id = f"conflict_{uuid.uuid4().hex[:8]}"
        self.detected_at = datetime.now(timezone.utc).isoformat()
        self.target = {"entity": target_entity, "decision_domain": domain}
        self.conflicting_evidence = evidences
        self.conflict_type = "opposing_intent"
        self.resolution_state = "pending_human_review"
        self.execution = {"blocked": True}

class ConflictDetector:
    @staticmethod
    def evaluate(evidences, target_entity, domain):
        intents = set([e["intent"] for e in evidences])
        # If we have opposing intents (e.g., both support and reject)
        if "support" in intents and "reject" in intents:
            return DecisionConflictRecord(target_entity, domain, evidences)
        return None

class TestCapabilityConflict(unittest.TestCase):
    
    def test_decision_tension_generates_conflict_record(self):
        # 1. Marketing Capability Evidence (Support)
        evidence_a = {
            "source_capability": "market-research-last30days",
            "evidence_hash": "sha256:a123",
            "observation_ids": ["obs_001"],
            "intent": "support",
            "confidence": 0.90
        }
        
        # 2. Engineering Capability Evidence (Reject)
        evidence_b = {
            "source_capability": "cost-analysis-agent",
            "evidence_hash": "sha256:b456",
            "observation_ids": ["obs_002"],
            "intent": "reject",
            "confidence": 0.85
        }
        
        # 3. Runtime Detection
        conflict = ConflictDetector.evaluate([evidence_a, evidence_b], "feature_x", "product_priority")
        
        # 4. Assertions
        self.assertIsNotNone(conflict)
        self.assertEqual(conflict.conflict_type, "opposing_intent")
        self.assertEqual(conflict.resolution_state, "pending_human_review")
        self.assertTrue(conflict.execution["blocked"])
        self.assertEqual(len(conflict.conflicting_evidence), 2)
        
        # Ensure it didn't just pick the one with higher confidence
        intent_a = conflict.conflicting_evidence[0]["intent"]
        intent_b = conflict.conflicting_evidence[1]["intent"]
        self.assertNotEqual(intent_a, intent_b)

if __name__ == '__main__':
    unittest.main()
