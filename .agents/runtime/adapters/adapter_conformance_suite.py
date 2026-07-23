#!/usr/bin/env python3
"""
EDAOS v15 — Adapter Conformance Suite
Verifies that any Ecosystem Adapter strictly adheres to the Adapter Contract v1.0
"""

import unittest
from adapter_contract import (
    EDAOSAdapter, Observation, ExecutionPlan, ExecutionResult,
    ExecutionContext, CapabilityDescriptor, HealthStatus
)
from github_mcp_adapter import GitHubMCPAdapter

class AdapterConformanceTests(unittest.TestCase):
    
    def setUp(self):
        # We test the reference GitHub adapter
        self.adapter: EDAOSAdapter = GitHubMCPAdapter()

    def test_adp_01_health_check(self):
        """[ADP-01] Adapter MUST return a strictly typed HealthStatus."""
        health = self.adapter.health()
        self.assertIsInstance(health, HealthStatus)
        self.assertIn(health.status, ["HEALTHY", "DEGRADED", "UNHEALTHY"])
        self.assertTrue(isinstance(health.latency_ms, int))

    def test_adp_02_observation_schema(self):
        """[ADP-02] observe() MUST return list of typed Observation objects."""
        obs_list = self.adapter.observe({"target_type": "issue"})
        self.assertTrue(isinstance(obs_list, list))
        self.assertGreater(len(obs_list), 0)
        
        obs = obs_list[0]
        self.assertIsInstance(obs, Observation)
        self.assertTrue(obs.id.startswith("gh-issue-"))
        self.assertEqual(obs.source, "github-mcp")

    def test_adp_03_capability_schema(self):
        """[ADP-03] capabilities() MUST return strongly-typed CapabilityDescriptor."""
        caps = self.adapter.capabilities()
        self.assertIsInstance(caps, CapabilityDescriptor)
        self.assertTrue(isinstance(caps.observations, list))
        self.assertTrue(isinstance(caps.actions, list))
        self.assertTrue(isinstance(caps.supports_rollback, bool))

    def test_adp_04_execution_success(self):
        """[ADP-04] execute() MUST translate ExecutionPlan into ExecutionResult on success."""
        plan = ExecutionPlan(
            decision_id="dec-123",
            tool_calls=[{"tool": "github.comment", "args": {"body": "Approved"}}],
            context={"repo": "owner/repo"}
        )
        res = self.adapter.execute(plan)
        self.assertIsInstance(res, ExecutionResult)
        self.assertEqual(res.status, "SUCCESS")
        self.assertTrue(res.execution_id.startswith("exec-gh-"))

    def test_adp_05_execution_failure(self):
        """[ADP-05] execute() MUST normalize backend errors into ExecutionResult failure."""
        plan = ExecutionPlan(
            decision_id="dec-123",
            tool_calls=[{"tool": "github.merge", "args": {"sha": "bad-sha"}}],
            context={"repo": "owner/repo"}
        )
        res = self.adapter.execute(plan)
        self.assertIsInstance(res, ExecutionResult)
        self.assertEqual(res.status, "FAILED")
        self.assertIsNotNone(res.error)

    def test_adp_06_rollback_supported(self):
        """[ADP-06] rollback() MUST revert state if supported."""
        plan = ExecutionPlan(
            decision_id="dec-123",
            tool_calls=[{"tool": "github.label", "args": {"name": "bug"}}],
            context={"repo": "owner/repo"}
        )
        res = self.adapter.execute(plan)
        context = ExecutionContext(execution_id=res.execution_id, plan=plan, result=res)
        
        rollback_success = self.adapter.rollback(context)
        self.assertTrue(rollback_success)

    def test_adp_07_rollback_unsupported(self):
        """[ADP-07] rollback() MUST return False or fail gracefully for unsupported operations."""
        plan = ExecutionPlan(
            decision_id="dec-123",
            tool_calls=[{"tool": "github.merge", "args": {"sha": "good-sha"}}],
            context={"repo": "owner/repo"}
        )
        res = self.adapter.execute(plan) # Returns SUCCESS by default mock
        context = ExecutionContext(execution_id=res.execution_id, plan=plan, result=res)
        
        rollback_success = self.adapter.rollback(context)
        self.assertFalse(rollback_success) # Cannot rollback a merge easily

    def test_adp_08_deterministic_mapping(self):
        """[ADP-08] observe() MUST be deterministic: identical context yields identical payload state."""
        ctx = {"target_type": "review", "pr_number": 99}
        obs_1 = self.adapter.observe(ctx)[0]
        obs_2 = self.adapter.observe(ctx)[0]
        
        self.assertEqual(obs_1.id, obs_2.id)
        self.assertEqual(obs_1.payload, obs_2.payload)
        self.assertEqual(obs_1.type, obs_2.type)
        # Note: timestamp might differ by milliseconds depending on implementation,
        # but the core identity and payload must be identical.

def run_adapter_conformance():
    print("=" * 64)
    print(" [EDAOS] Adapter Conformance Suite (Contract v1.0)")
    print("=" * 64)
    
    suite = unittest.TestLoader().loadTestsFromTestCase(AdapterConformanceTests)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "=" * 64)
    if result.wasSuccessful():
        print(" [PASS] Adapter is FULLY COMPLIANT")
        print("        STATUS: CERTIFIED")
        print(f"        Tests Passed: {result.testsRun}")
    else:
        print(f" [FAIL] FAILED {len(result.failures) + len(result.errors)} tests.")
    print("=" * 64)
    
if __name__ == '__main__':
    run_adapter_conformance()
