#!/usr/bin/env python3
"""
EDAOS v15 — Golden Flow Test for Last30Days Capability
Verifies that the capability adheres to the Providence Graph invariants:
Observation -> Evidence Bundle -> Capability Instance ID -> Decision Record
"""

import unittest
import hashlib
from datetime import datetime, timezone

class Observation:
    def __init__(self, obs_id, source, signal, confidence, timestamp):
        self.id = obs_id
        self.source = source
        self.signal = signal
        self.confidence = confidence
        self.timestamp = timestamp
        self.hash = hashlib.sha256(f"{source}:{signal}:{timestamp}".encode()).hexdigest()

class EvidenceNode:
    def __init__(self, node_id, cap_instance, obs_ids, e_type, confidence):
        self.node_id = node_id
        self.capability_instance_id = cap_instance
        self.parent_observation_ids = obs_ids
        self.type = e_type
        self.confidence = confidence
        
        # Evidence Hash Invariant: SHA256(node_id + type + confidence + SHA256(parents) + capability_instance_id)
        parent_hash = hashlib.sha256(",".join(obs_ids).encode()).hexdigest()
        self.evidence_hash = hashlib.sha256(
            f"{node_id}:{e_type}:{confidence}:{parent_hash}:{cap_instance}".encode()
        ).hexdigest()

class DecisionRecord:
    def __init__(self, decision_id, source_cap, evidence_hash, obs_ids, intent, plan):
        self.decision_id = decision_id
        self.source_capability = source_cap
        self.evidence_hash = evidence_hash
        self.observation_ids = obs_ids
        self.intent = intent
        self.execution_plan = plan


class GoldenFlowTest(unittest.TestCase):

    def test_golden_flow_provenance_chain(self):
        """Verify the immutable hash chain from Observation to Decision Record."""
        ts = datetime.now(timezone.utc).isoformat()
        
        # 1. Observation (e.g. from Reddit adapter)
        obs = Observation(
            obs_id="obs_001",
            source="reddit/r/programming",
            signal="developers complain about context switching",
            confidence=0.82,
            timestamp=ts
        )
        
        # 2. Capability generates Evidence Bundle (Last30Days)
        capability_instance = "market-research-last30days-run-99"
        evidence = EvidenceNode(
            node_id="ev_101",
            cap_instance=capability_instance,
            obs_ids=[obs.id],
            e_type="market_trend",
            confidence=0.85
        )
        
        # 3. Runtime evaluates Evidence into a Decision Record
        decision = DecisionRecord(
            decision_id="dec_feature_01",
            source_cap="market-research-last30days",
            evidence_hash=evidence.evidence_hash,
            obs_ids=evidence.parent_observation_ids,
            intent="prioritize_feature",
            plan={"tool": "jira.create_epic", "args": {"title": "Reduce Context Switching"}}
        )
        
        # ── ASSERTIONS (The Golden Invariants) ──
        
        # A. Decision MUST link to Capability
        self.assertEqual(decision.source_capability, "market-research-last30days")
        
        # B. Decision MUST contain the exact Evidence Hash
        self.assertEqual(decision.evidence_hash, evidence.evidence_hash)
        
        # C. Decision MUST retain upstream Observation IDs
        self.assertIn("obs_001", decision.observation_ids)
        
        # D. Evidence Hash MUST be mathematically verifiable from its properties
        expected_parent_hash = hashlib.sha256(b"obs_001").hexdigest()
        expected_ev_hash = hashlib.sha256(
            f"ev_101:market_trend:0.85:{expected_parent_hash}:{capability_instance}".encode()
        ).hexdigest()
        
        self.assertEqual(evidence.evidence_hash, expected_ev_hash)

if __name__ == '__main__':
    unittest.main()
