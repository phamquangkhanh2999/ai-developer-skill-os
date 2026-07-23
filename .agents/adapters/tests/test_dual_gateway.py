#!/usr/bin/env python3
"""
Dual-Adapter Gateway Simulator (VS Code & Antigravity)
Asserts Input Surface Independence: Capabilities receive normalized observations
and are governed identically regardless of the input source.
"""

import unittest
from datetime import datetime, timezone

class CapabilityPermissionDenied(Exception):
    pass

class CanonicalObservation:
    def __init__(self, normalized_context, provenance):
        self.context = normalized_context
        self.provenance = provenance

class ObservationNormalizer:
    @staticmethod
    def normalize(raw_context, adapter_id):
        # Strip IDE-specific quirks and create a clean CanonicalObservation
        normalized_context = {
            "workspace": raw_context.get("workspace", "unknown"),
            "file": raw_context.get("file_reference", "unknown"),
            # Normalize AST nodes or raw text into a standard "target_content"
            "target_content": raw_context.get("ast_node") or raw_context.get("selection", "")
        }
        
        provenance = {
            "editor": adapter_id,
            "adapter": f"{adapter_id}-gateway",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        return CanonicalObservation(normalized_context, provenance)

class GStackCapability:
    def execute(self, observation, requested_action):
        forbidden = ["modify_file_directly", "commit_code", "merge_pull_request"]
        if requested_action in forbidden:
            raise CapabilityPermissionDenied("Capability execution boundary crossed")
            
        return {
            "evidence": "code_quality_evidence",
            "decision": "implementation_plan",
            "routed_capability": "gstack"
        }

class EDAOSRuntime:
    def __init__(self):
        self.capabilities = {"gstack": GStackCapability()}
        
    def process(self, adapter_id, raw_context, capability_id, action):
        # 1. Normalize Observation
        observation = ObservationNormalizer.normalize(raw_context, adapter_id)
        
        # 2. Route to Capability
        cap = self.capabilities.get(capability_id)
        if not cap:
            raise Exception("Capability not found")
            
        # 3. Capability execution & Governance enforcement
        result = cap.execute(observation, action)
        result["provenance"] = observation.provenance
        return result

class TestDualGateway(unittest.TestCase):
    
    def setUp(self):
        self.runtime = EDAOSRuntime()
        self.vscode_context = {"workspace": "/project", "file_reference": "main.py", "selection": "def foo():"}
        self.antigravity_context = {"workspace": "/project", "file_reference": "main.py", "ast_node": "FunctionDef(foo)"}
        
    def test_A_same_capability_routing(self):
        """Test A: Both adapters successfully route to the same capability"""
        res_v = self.runtime.process("vscode", self.vscode_context, "gstack", "analyze")
        res_a = self.runtime.process("antigravity", self.antigravity_context, "gstack", "analyze")
        
        self.assertEqual(res_v["routed_capability"], "gstack")
        self.assertEqual(res_a["routed_capability"], "gstack")

    def test_B_same_governance_outcome(self):
        """Test B: Both adapters yield the exact same governed outcome"""
        res_v = self.runtime.process("vscode", self.vscode_context, "gstack", "analyze")
        res_a = self.runtime.process("antigravity", self.antigravity_context, "gstack", "analyze")
        
        self.assertEqual(res_v["evidence"], "code_quality_evidence")
        self.assertEqual(res_v["decision"], "implementation_plan")
        
        self.assertEqual(res_a["evidence"], "code_quality_evidence")
        self.assertEqual(res_a["decision"], "implementation_plan")

    def test_C_provenance_isolation(self):
        """Test C: Provenance reflects the isolated adapters"""
        res_v = self.runtime.process("vscode", self.vscode_context, "gstack", "analyze")
        res_a = self.runtime.process("antigravity", self.antigravity_context, "gstack", "analyze")
        
        self.assertEqual(res_v["provenance"]["editor"], "vscode")
        self.assertEqual(res_v["provenance"]["adapter"], "vscode-gateway")
        
        self.assertEqual(res_a["provenance"]["editor"], "antigravity")
        self.assertEqual(res_a["provenance"]["adapter"], "antigravity-gateway")

    def test_D_shared_execution_boundary(self):
        """Test D: The execution boundary holds firmly for both inputs"""
        with self.assertRaises(CapabilityPermissionDenied):
            self.runtime.process("vscode", self.vscode_context, "gstack", "modify_file_directly")
            
        with self.assertRaises(CapabilityPermissionDenied):
            self.runtime.process("antigravity", self.antigravity_context, "gstack", "modify_file_directly")

if __name__ == '__main__':
    unittest.main()
