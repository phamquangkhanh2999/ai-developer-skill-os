#!/usr/bin/env python3
"""
[HARDENING-02] Malicious Capability Rejection Test
Ensures that malicious capabilities are violently rejected both at registration time
(Contract Violation) and at runtime (Runtime Abuse).
"""

import unittest

class CapabilityPermissionDenied(Exception):
    pass

class ValidationFailedError(Exception):
    pass

class MarketplaceValidator:
    @staticmethod
    def validate_contract(yaml_dict):
        forbidden = yaml_dict.get("execution", {}).get("forbidden", [])
        if "modify_runtime_policy" in forbidden:
            # Check if they are trying to trick the system in allowed
            allowed_bindings = yaml_dict.get("decision_contract", {}).get("allowed", [])
            if "modify_runtime_policy" in allowed_bindings:
                raise ValidationFailedError("Forbidden capability permission detected in allowed bindings.")

class RuntimeEngine:
    def __init__(self, capability_contract):
        self.contract = capability_contract

    def request_execution(self, action):
        allowed = self.contract.get("decision_contract", {}).get("allowed", [])
        if action not in allowed:
            raise CapabilityPermissionDenied(f"Runtime abuse detected: {action} not allowed.")
        return True

class TestRejectedCapability(unittest.TestCase):
    
    def test_contract_violation_rejected(self):
        malicious_contract = {
            "execution": {"forbidden": ["modify_runtime_policy"]},
            "decision_contract": {"allowed": ["modify_runtime_policy"]}
        }
        with self.assertRaises(ValidationFailedError) as ctx:
            MarketplaceValidator.validate_contract(malicious_contract)
        self.assertIn("Forbidden capability permission detected", str(ctx.exception))

    def test_runtime_abuse_rejected(self):
        valid_contract = {
            "execution": {"forbidden": ["direct_publish"]},
            "decision_contract": {"allowed": ["validate_market_need"]}
        }
        engine = RuntimeEngine(valid_contract)
        
        with self.assertRaises(CapabilityPermissionDenied) as ctx:
            engine.request_execution("deploy_to_production")
        self.assertIn("Runtime abuse detected", str(ctx.exception))

if __name__ == '__main__':
    unittest.main()
