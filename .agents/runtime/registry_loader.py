#!/usr/bin/env python3
"""
EDAOS v15 — Registry Auto-Loader & Validator
Implements Plugin Discovery Mechanism with Checksums and MappingProxyType freezing.
"""

import os
import yaml
import hashlib
from types import MappingProxyType
from pathlib import Path
from typing import List, Dict, Any, Optional

# ── Exceptions ───────────────────────────────────────────────────────────────

class RegistryValidationError(Exception): pass
class DuplicateSkillError(RegistryValidationError): pass
class UnknownCapabilityError(RegistryValidationError): pass
class ChecksumMismatchError(RegistryValidationError): pass
class ConflictError(RegistryValidationError): pass
class ManifestMissingError(RegistryValidationError): pass

# ── MCP Capability Checker ───────────────────────────────────────────────────
from dataclasses import dataclass

@dataclass
class MCPCall:
    provider:   str
    tool:       str
    arguments:  Dict[str, Any]
    requires_approval: bool = False

class MCPCapabilityChecker:
    AVAILABLE_PROVIDERS = {
        "filesystem": ["read", "write", "list"],
        "git":        ["inspect", "log", "diff", "restore"],
        "terminal":   ["run"],
        "browser":    ["navigate", "screenshot", "lighthouse"],
        "network":    ["fetch"],
        "user_input": ["prompt"],
    }

    REQUIRES_APPROVAL = {
        "filesystem.write", "filesystem.delete",
        "git.commit",
        "terminal.run",
        "database.query", "database.migrate",
    }

    def is_available(self, provider: str, tool: str) -> bool:
        return tool in self.AVAILABLE_PROVIDERS.get(provider, [])

    def needs_approval(self, provider: str, tool: str) -> bool:
        return f"{provider}.{tool}" in self.REQUIRES_APPROVAL

    def resolve_calls(self, capabilities: List[str]) -> List[MCPCall]:
        calls = []
        for cap in capabilities:
            if "." in cap:
                provider, tool = cap.split(".", 1)
                if self.is_available(provider, tool):
                    calls.append(MCPCall(
                        provider=provider,
                        tool=tool,
                        arguments={},
                        requires_approval=self.needs_approval(provider, tool),
                    ))
        return calls

# ── Manifest & Checksum Validation ──────────────────────────────────────────

class ManifestValidator:
    def __init__(self, manifest_path: Path):
        self.manifest_path = manifest_path
        self.expected_checksums: Dict[str, str] = {}
        self.version = 1
        self._load_manifest()

    def _load_manifest(self):
        if not self.manifest_path.exists():
            # For strict mode, raise error. We'll let the loader decide to catch it.
            raise ManifestMissingError(f"Registry manifest not found at {self.manifest_path}")
        
        with open(self.manifest_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            self.version = data.get("registry_version", 1)
            files = data.get("files", {})
            for filename, meta in files.items():
                self.expected_checksums[filename] = meta.get("sha256")

    def verify_file(self, file_path: Path) -> bool:
        if file_path.name not in self.expected_checksums:
            # File not in manifest - fail strict verification
            raise ChecksumMismatchError(f"File {file_path.name} not declared in manifest")

        expected_hash = self.expected_checksums[file_path.name]
        with open(file_path, 'rb') as f:
            actual_hash = hashlib.sha256(f.read()).hexdigest()
        
        if expected_hash != actual_hash:
            raise ChecksumMismatchError(
                f"Checksum mismatch for {file_path.name}: expected {expected_hash}, got {actual_hash}"
            )
        return True


# ── Validator Engine ─────────────────────────────────────────────────────────

class RegistryValidator:
    def __init__(self, available_mcp_providers: Dict[str, List[str]]):
        self.mcp_providers = available_mcp_providers

    def validate_schema(self, skill_name: str, config: Dict[str, Any]):
        if "capabilities" not in config:
            raise RegistryValidationError(f"Skill '{skill_name}' missing 'capabilities'")
        if "level" not in config and "evidence_required" not in config:
            raise RegistryValidationError(f"Skill '{skill_name}' missing 'level' or 'evidence_required'")

    def validate_semantic(self, skill_name: str, config: Dict[str, Any]):
        # Example: if risk is low but approval_required is true -> warning/error
        # For EDAOS, we just do a basic check on capabilities being a list
        if not isinstance(config.get("capabilities"), list):
            raise RegistryValidationError(f"Skill '{skill_name}' capabilities must be a list")

    def validate_dependency(self, skill_name: str, config: Dict[str, Any]):
        for cap in config["capabilities"]:
            if "." not in cap:
                raise UnknownCapabilityError(f"Skill '{skill_name}' requested malformed capability '{cap}'")
            
            provider, tool = cap.split(".", 1)
            if provider not in self.mcp_providers:
                raise UnknownCapabilityError(f"Provider '{provider}' not found for capability '{cap}'")
            if tool not in self.mcp_providers[provider]:
                raise UnknownCapabilityError(f"Tool '{tool}' not found in provider '{provider}'")


# ── Registry Loader ──────────────────────────────────────────────────────────

class RegistryLoader:
    def __init__(self, search_paths: List[str], manifest_path: str, available_mcp_providers: Dict[str, List[str]]):
        self.search_paths = [Path(p) for p in search_paths]
        self.manifest_path = Path(manifest_path)
        self.validator = RegistryValidator(available_mcp_providers)
        self.manifest = None
        
        # We enforce manifest loading
        self.manifest = ManifestValidator(self.manifest_path)

    def load_and_freeze(self) -> MappingProxyType:
        raw_registry: Dict[str, Dict[str, Any]] = {}

        for search_path in self.search_paths:
            if not search_path.exists() or not search_path.is_dir():
                continue

            for file_path in search_path.glob("*.yml"):
                if file_path.name == self.manifest_path.name:
                    continue # Skip manifest itself

                # Phase 1: Checksum verification
                self.manifest.verify_file(file_path)

                # Phase 2: Parse
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = yaml.safe_load(f) or {}

                skills = data.get("skills", {})
                for skill_name, config in skills.items():
                    # Phase 3: Duplicate detection
                    if skill_name in raw_registry:
                        raise DuplicateSkillError(f"Skill '{skill_name}' is defined multiple times")

                    # Phase 4: Schema validation
                    self.validator.validate_schema(skill_name, config)

                    # Phase 5: Semantic validation
                    self.validator.validate_semantic(skill_name, config)

                    # Phase 6: Dependency validation
                    self.validator.validate_dependency(skill_name, config)

                    raw_registry[skill_name] = config

        # Phase 7: Freeze
        return MappingProxyType(raw_registry)
