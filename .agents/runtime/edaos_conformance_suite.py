#!/usr/bin/env python3
"""
EDAOS v15 — Conformance Test Suite (L1-L4)
Official certification runner for EDAOS Reference Agent Runtime.

Test areas:
  - Evidence (L1): Integrity, validation, sufficiency
  - Provenance (L2): Decision DAG, alternatives
  - Governance (L3): Human gates, authorization, invariants
  - Execution (L4): Journaling, Saga compensation
  - Identity (L4+): OIDC/Ed25519 hash chaining and signatures
  - Registry (L4+): Auto-Loader, checksum validation, immutability
"""

import sys
import json
import unittest
import hashlib
from pathlib import Path
from edaos_runtime_adapter import (
    EDACOSRuntimeAdapter,
    Evidence,
    DecisionRecord,
    JournalEntry
)
from identity_provider import SimulatedEd25519Provider
from registry_loader import (
    RegistryLoader,
    RegistryValidationError,
    DuplicateSkillError,
    UnknownCapabilityError,
    ChecksumMismatchError,
    ConflictError,
    ManifestMissingError,
    MCPCapabilityChecker
)

class EDAOSConformanceTests(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.test_dir = Path(".execution_test")
        cls.reg_dir = Path(".registry_test")
        if cls.test_dir.exists():
            import shutil
            shutil.rmtree(cls.test_dir)
        if cls.reg_dir.exists():
            import shutil
            shutil.rmtree(cls.reg_dir)
        cls.reg_dir.mkdir(parents=True)
            
    def setUp(self):
        # Clear registry dir before each test to ensure test isolation
        if self.__class__.reg_dir.exists():
            import shutil
            shutil.rmtree(self.__class__.reg_dir)
        self.__class__.reg_dir.mkdir(parents=True)
        
        self.identity = SimulatedEd25519Provider(agent_id="test-runner", secret_seed="test")
        self.adapter = EDACOSRuntimeAdapter(
            execution_base=str(self.__class__.test_dir), 
            identity=self.identity,
            registry_search_paths=["skills", ".agents/runtime/skills"],
            manifest_path="registry.manifest.yml"
        )

    # ── GOVERNANCE TESTS ──────────────────────────────────────────────────────

    def test_gov_01_invariant_no_evidence_blocked(self):
        """[GOV-01] Skill MUST be BLOCKED if no evidence is provided."""
        res = self.adapter.route_skill("qk-docs", "intent", None)
        self.assertEqual(res.status, "BLOCKED")
        self.assertIn("[INVARIANT]", res.message)
        
    def test_gov_02_invariant_insufficient_evidence_blocked(self):
        """[GOV-02] Skill MUST be BLOCKED if evidence confidence is below threshold."""
        ev = self.adapter.collect_evidence("qk-docs", "source", "fs", "payload", confidence=0.5)
        res = self.adapter.route_skill("qk-docs", "intent", ev)
        self.assertEqual(res.status, "BLOCKED")
        
    def test_gov_04_human_approval_gate(self):
        """[GOV-04] Destructive operations MUST require human approval."""
        ev = self.adapter.collect_evidence("qk-bug-resolution", "trace", "term", "err", confidence=0.99)
        res = self.adapter.route_skill("qk-bug-resolution", "fix", ev)
        self.assertEqual(res.status, "BLOCKED")
        self.assertEqual(res.decision.approved_by, "PENDING_HUMAN")

    # ── EVIDENCE & PROVENANCE TESTS ──────────────────────────────────────────

    def test_evd_01_evidence_signature(self):
        """[EVD-01] Evidence MUST have a deterministic signature/hash."""
        ev = self.adapter.collect_evidence("qk-docs", "source", "fs", "test data")
        self.assertTrue(ev.evidence_id.startswith("EV-QK-DOC-"))
        self.assertTrue(len(ev.evidence_hash) > 0)
        self.assertTrue(len(ev.obs_hash) > 0)

    def test_prv_01_decision_record_created(self):
        """[PRV-01] Decision Record MUST be persisted and chained to Evidence."""
        ev = self.adapter.collect_evidence("qk-docs", "source", "fs", "payload", confidence=0.9)
        res = self.adapter.route_skill("qk-docs", "intent", ev)
        
        decision_path = self.__class__.test_dir / "decisions" / f"{res.decision.decision_id}.yml"
        self.assertTrue(decision_path.exists())
        self.assertEqual(res.decision.evidence_hash, ev.evidence_hash)
        
    def test_exe_01_execution_journal_append(self):
        """[EXE-01] Every routing attempt MUST produce a journal entry."""
        initial = len(self.adapter.journal.read_all())
        ev = self.adapter.collect_evidence("qk-docs", "source", "fs", "payload", confidence=0.9)
        self.adapter.route_skill("qk-docs", "intent", ev)
        self.assertEqual(len(self.adapter.journal.read_all()), initial + 1)

    # ── IDENTITY TESTS ───────────────────────────────────────────────────────

    def test_idt_01_hash_chain_integrity(self):
        """[IDT-01] Provenance MUST form a cryptographic hash chain."""
        ev = self.adapter.collect_evidence("qk-docs", "source", "fs", "test-payload", confidence=0.99)
        res = self.adapter.route_skill("qk-docs", "chain-test", ev)
        
        self.assertEqual(res.decision.evidence_hash, ev.evidence_hash)
        self.assertEqual(res.journal_entry.decision_hash, res.decision.decision_hash)

    def test_idt_02_cryptographic_signature(self):
        """[IDT-02] Final Execution Hash MUST be signed by Agent Identity."""
        ev = self.adapter.collect_evidence("qk-docs", "source", "fs", "test-sig", confidence=0.99)
        res = self.adapter.route_skill("qk-docs", "sig-test", ev)
        
        entry = res.journal_entry
        self.assertEqual(entry.principal_id, "did:edaos:agent:test-runner")
        is_valid = self.identity.verify(
            payload=entry.execution_hash,
            signature=entry.signature,
            public_key=entry.public_key
        )
        self.assertTrue(is_valid)

    # ── REGISTRY AUTO-LOADER TESTS ───────────────────────────────────────────

    def _create_temp_registry(self, yaml_content: str, filename: str = "temp-skill.yml", manifest_override=None):
        skill_path = self.reg_dir / filename
        skill_content_bytes = yaml_content.encode('utf-8')
        skill_path.write_bytes(skill_content_bytes)
        
        actual_hash = hashlib.sha256(skill_content_bytes).hexdigest()
        manifest_content = manifest_override or f"""
registry_version: 1
files:
  {filename}:
    sha256: {actual_hash}
"""
        manifest_path = self.reg_dir / "manifest.yml"
        manifest_path.write_bytes(manifest_content.encode('utf-8'))
        return manifest_path

    def test_reg_01_registry_load(self):
        """[REG-01] Valid registry loads successfully."""
        manifest = self._create_temp_registry("skills:\n  test-skill:\n    capabilities: ['filesystem.read']\n    level: L1")
        loader = RegistryLoader([str(self.reg_dir)], str(manifest), MCPCapabilityChecker.AVAILABLE_PROVIDERS)
        reg = loader.load_and_freeze()
        self.assertIn("test-skill", reg)

    def test_reg_02_duplicate_skill(self):
        """[REG-02] Duplicate skill declaration MUST fail (Fail Fast)."""
        manifest = self._create_temp_registry("skills:\n  test-skill:\n    capabilities: ['filesystem.read']\n    level: L1")
        # create another file with the same skill
        dup_file = self.reg_dir / "dup.yml"
        dup_content_bytes = "skills:\n  test-skill:\n    capabilities: ['terminal.run']\n    level: L1".encode('utf-8')
        dup_file.write_bytes(dup_content_bytes)
        
        dup_hash = hashlib.sha256(dup_content_bytes).hexdigest()
        manifest_content = f"""
registry_version: 1
files:
  temp-skill.yml:
    sha256: {hashlib.sha256(self.reg_dir.joinpath('temp-skill.yml').read_bytes()).hexdigest()}
  dup.yml:
    sha256: {dup_hash}
"""
        manifest.write_bytes(manifest_content.encode('utf-8'))
        
        loader = RegistryLoader([str(self.reg_dir)], str(manifest), MCPCapabilityChecker.AVAILABLE_PROVIDERS)
        with self.assertRaises(DuplicateSkillError):
            loader.load_and_freeze()

    def test_reg_03_unknown_capability(self):
        """[REG-03] Unknown capability in config MUST fail (Fail Fast)."""
        manifest = self._create_temp_registry("skills:\n  test-skill:\n    capabilities: ['magic.cast']\n    level: L1")
        loader = RegistryLoader([str(self.reg_dir)], str(manifest), MCPCapabilityChecker.AVAILABLE_PROVIDERS)
        with self.assertRaises(UnknownCapabilityError):
            loader.load_and_freeze()

    def test_reg_04_checksum_mismatch(self):
        """[REG-04] Checksum mismatch MUST fail (Tamper detection)."""
        manifest_content = """
registry_version: 1
files:
  temp-skill.yml:
    sha256: badhash
"""
        manifest = self._create_temp_registry("skills:\n  test:\n    capabilities: []\n    level: L1", manifest_override=manifest_content)
        loader = RegistryLoader([str(self.reg_dir)], str(manifest), MCPCapabilityChecker.AVAILABLE_PROVIDERS)
        with self.assertRaises(ChecksumMismatchError):
            loader.load_and_freeze()

    def test_reg_05_registry_frozen(self):
        """[REG-05] API FROZEN: Capabilities and policies MUST be immutable."""
        with self.assertRaises(TypeError):
            # MappingProxyType throws TypeError on assignment
            self.adapter.capability_registry["new-skill"] = {}
        
        with self.assertRaises(RuntimeError):
            # EDACOSRuntimeAdapter throws RuntimeError when trying to change Identity or Loader
            self.adapter.identity = None

    def test_reg_06_runtime_starts(self):
        """[REG-06] Valid runtime initialization (Already tested in setUp)."""
        self.assertTrue(self.adapter._frozen)

    def test_reg_07_invalid_schema(self):
        """[REG-07] Missing capabilities in config MUST fail (Schema Validator)."""
        manifest = self._create_temp_registry("skills:\n  test-skill:\n    level: L1")
        loader = RegistryLoader([str(self.reg_dir)], str(manifest), MCPCapabilityChecker.AVAILABLE_PROVIDERS)
        with self.assertRaises(RegistryValidationError):
            loader.load_and_freeze()

    def test_reg_08_manifest_missing(self):
        """[REG-08] Missing manifest MUST fail."""
        manifest = self.reg_dir / "does_not_exist.yml"
        with self.assertRaises(ManifestMissingError):
            loader = RegistryLoader([str(self.reg_dir)], str(manifest), MCPCapabilityChecker.AVAILABLE_PROVIDERS)

def run_conformance():
    print("=" * 64)
    print(" [EDAOS] Reference Runtime Conformance Suite (API FROZEN Edition)")
    print("=" * 64)
    
    suite = unittest.TestLoader().loadTestsFromTestCase(EDAOSConformanceTests)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    print("\n" + "=" * 64)
    if result.wasSuccessful():
        print(" [PASS] EDAOS Runtime is FULLY COMPLIANT")
        print("        STATUS: FEATURE COMPLETE")
        print("        API:    FROZEN")
        print(f"        Tests Passed: {result.testsRun}")
    else:
        print(f" [FAIL] FAILED {len(result.failures) + len(result.errors)} tests.")
    print("=" * 64)
    
if __name__ == '__main__':
    run_conformance()
