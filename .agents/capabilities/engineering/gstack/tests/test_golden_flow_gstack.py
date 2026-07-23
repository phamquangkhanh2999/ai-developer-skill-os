#!/usr/bin/env python3
"""
Golden Flow Verification for GStack Capability (#003)
Asserts the Execution Boundary Guarantee.
"""

import unittest

class CapabilityPermissionDenied(Exception):
    def __init__(self, blocked_action, reason):
        self.blocked_action = blocked_action
        self.reason = reason
        super().__init__(f"CapabilityPermissionDenied: {blocked_action} ({reason})")

class DecisionRecord:
    def __init__(self, capability, intent):
        self.source_capability = capability
        self.intent = intent

class ExecutionPlan:
    def __init__(self, decision_record):
        self.plan_id = "plan_001"
        self.decision = decision_record

class RuntimeEngine:
    def __init__(self, capability_contract):
        self.contract = capability_contract

    def evaluate_intent(self, request_payload):
        capability = request_payload.get("capability")
        intent = request_payload.get("intent")
        
        # Check against forbidden execution bounds
        forbidden = self.contract.get("execution", {}).get("forbidden", [])
        if intent in forbidden:
            raise CapabilityPermissionDenied(
                blocked_action=intent,
                reason="forbidden_by_capability_contract"
            )
            
        # If allowed, generate proposal (Decision Record -> Execution Plan)
        decision = DecisionRecord(capability, intent)
        plan = ExecutionPlan(decision)
        return plan

class TestGStackExecutionBoundary(unittest.TestCase):
    
    def setUp(self):
        # Scaffold the GStack contract
        self.gstack_contract = {
            "capability": {"id": "gstack"},
            "decision_contract": {
                "allowed": ["architecture_review", "code_quality_assessment", "implementation_planning", "create_implementation_plan"]
            },
            "execution": {
                "forbidden": ["commit_code", "merge_pull_request", "deploy_application", "modify_runtime_policy", "bypass_review_gate"]
            }
        }
        self.engine = RuntimeEngine(self.gstack_contract)
    
    def test_allowed_proposal_passes(self):
        """Test A - Allowed Proposal"""
        request = {
            "capability": "gstack",
            "intent": "create_implementation_plan"
        }
        
        # Should succeed and return an Execution Plan
        plan = self.engine.evaluate_intent(request)
        
        self.assertIsNotNone(plan)
        self.assertEqual(plan.decision.source_capability, "gstack")
        self.assertEqual(plan.decision.intent, "create_implementation_plan")

    def test_forbidden_mutation_rejected(self):
        """Test B - Forbidden Mutation"""
        request = {
            "capability": "gstack",
            "intent": "merge_pull_request"
        }
        
        # Should violently reject the autonomous mutation
        with self.assertRaises(CapabilityPermissionDenied) as ctx:
            self.engine.evaluate_intent(request)
            
        exception = ctx.exception
        self.assertEqual(exception.blocked_action, "merge_pull_request")
        self.assertEqual(exception.reason, "forbidden_by_capability_contract")

if __name__ == '__main__':
    unittest.main()
