#!/usr/bin/env python3
"""
VS Code Adapter Gateway Simulator
Asserts Input Surface Governance: VS Code cannot bypass EDAOS Runtime boundaries.
"""

import unittest
from datetime import datetime, timezone

class CapabilityPermissionDenied(Exception):
    pass

class CapabilityNotCertified(Exception):
    pass

class MarketplaceRegistry:
    # Simulating the verified state from Manifest v1.1
    CERTIFIED_CAPABILITIES = ["market-research-last30days", "understand-anything", "gstack"]
    
    @classmethod
    def is_certified(cls, cap_id):
        return cap_id in cls.CERTIFIED_CAPABILITIES

class Observation:
    def __init__(self, raw_context):
        self.workspace = raw_context.get("workspace")
        self.file_reference = raw_context.get("file_reference")
        self.provenance = {
            "source_type": "vscode",
            "adapter_id": "vscode",
            "adapter_version": "1.0.0",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

class EDAOSGatewayRuntime:
    def __init__(self, adapter_permissions):
        self.adapter_permissions = adapter_permissions
        self.allowed = self.adapter_permissions.get("allowed", [])
        self.forbidden = self.adapter_permissions.get("forbidden", [])
        
    def submit_request(self, capability_id, action, raw_context=None):
        # 1. Adapter Boundary Check
        if action in self.forbidden:
            raise CapabilityPermissionDenied(f"adapter_forbidden_action: {action}")
            
        if "submit_capability_request" not in self.allowed:
            raise CapabilityPermissionDenied("Adapter not allowed to submit requests")
            
        # 2. Certification Check
        if not MarketplaceRegistry.is_certified(capability_id):
            raise CapabilityNotCertified(f"missing_certification_record: {capability_id}")
            
        # 3. Observation Creation (Adapter does not execute, it creates Observations)
        observation = Observation(raw_context or {})
        
        # 4. Mocking Capability Execution -> Decision Record -> Implementation Plan
        return "Implementation Plan"

class TestVSCodeGateway(unittest.TestCase):
    
    def setUp(self):
        self.adapter_permissions = {
            "allowed": ["read_workspace_context", "create_observation", "submit_capability_request"],
            "forbidden": ["execute_shell", "modify_files_directly", "bypass_runtime"]
        }
        self.gateway = EDAOSGatewayRuntime(self.adapter_permissions)
        
    def test_A_valid_routing(self):
        """Test A: Valid VS Code -> GStack flow"""
        context = {"workspace": "/project", "file_reference": "main.py"}
        # VS Code submits a valid request to a certified capability
        result = self.gateway.submit_request("gstack", "submit_capability_request", context)
        self.assertEqual(result, "Implementation Plan")

    def test_B_bypass_attempt(self):
        """Test B: Adapter bypass attempt"""
        # VS Code tries to bypass the runtime and modify files directly
        with self.assertRaises(CapabilityPermissionDenied) as ctx:
            self.gateway.submit_request("gstack", "modify_files_directly")
        self.assertIn("adapter_forbidden_action", str(ctx.exception))

    def test_C_uncertified_capability_attempt(self):
        """Test C: Uncertified capability attempt"""
        # VS Code tries to call an uncertified external agent
        with self.assertRaises(CapabilityNotCertified) as ctx:
            self.gateway.submit_request("experimental-agent-x", "submit_capability_request")
        self.assertIn("missing_certification_record", str(ctx.exception))

if __name__ == '__main__':
    unittest.main()
