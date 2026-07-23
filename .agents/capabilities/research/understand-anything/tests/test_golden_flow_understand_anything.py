#!/usr/bin/env python3
"""
Golden Flow Verification for Understand Anything Capability (#002)
Asserts observation -> evidence hash chain -> decision support record boundaries.
"""

import unittest
import hashlib
import json

class Observation:
    def __init__(self, source_url, content_snippet):
        self.id = "obs_001"
        self.source = source_url
        self.snippet = content_snippet

class KnowledgeEvidence:
    def __init__(self, observation, capability_id, extraction_data):
        self.observation_id = observation.id
        self.source_reference = observation.source
        self.source_capability = capability_id
        self.extraction = extraction_data
        
        canonical_str = json.dumps({
            "observation_id": self.observation_id,
            "source_reference": self.source_reference,
            "source_capability": self.source_capability,
            "extraction": self.extraction
        }, sort_keys=True, separators=(',', ':'))
        
        self.hash = hashlib.sha256(canonical_str.encode()).hexdigest()

def recompute_hash(evidence):
    canonical_str = json.dumps({
        "observation_id": evidence.observation_id,
        "source_reference": evidence.source_reference,
        "source_capability": evidence.source_capability,
        "extraction": evidence.extraction
    }, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(canonical_str.encode()).hexdigest()

class DecisionSupportRecord:
    def __init__(self, evidence):
        self.source_capability = evidence.source_capability
        self.evidence_hash = evidence.hash

class TestUnderstandAnythingGoldenFlow(unittest.TestCase):
    
    def test_golden_flow_assertions(self):
        # 1. Source Document -> Observation Node
        obs = Observation(
            source_url="https://internal.wiki/architecture-v2",
            content_snippet="The system uses event sourcing."
        )
        
        # 2. Observation -> Knowledge Evidence Bundle
        extraction = {
            "concept_map": ["event sourcing", "system"],
            "claim_relationship": "system IMPLEMENTS event sourcing"
        }
        evidence = KnowledgeEvidence(obs, "understand-anything", extraction)
        
        # 3. Evidence -> Decision Support Record
        decision = DecisionSupportRecord(evidence)
        
        # Golden Assertions
        # 3a. Provenance intact
        self.assertEqual(evidence.source_reference, obs.source, "Evidence must explicitly reference source observation.")
        
        # 3b. Hash integrity
        self.assertEqual(evidence.hash, recompute_hash(evidence), "Evidence hash must match recomputed canonical hash.")
        
        # 3c. Decision ownership
        self.assertEqual(decision.source_capability, "understand-anything", "Decision record must trace back to the exact capability.")

if __name__ == '__main__':
    unittest.main()
