#!/usr/bin/env python3
"""
EDAOS v15 — Adapter Contract v1.0
Stable integration interface for external systems (MCP, Webhooks, APIs).
"""

import time
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime, timezone

# ── Domain Types ────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class Observation:
    """Raw data collected from the external system (e.g. Issue, PR, Log)."""
    id: str
    type: str               # e.g., 'pull_request', 'issue', 'review'
    source: str             # e.g., 'github', 'vscode'
    payload: Dict[str, Any]
    timestamp: str

@dataclass(frozen=True)
class ExecutionPlan:
    """The specific tools and arguments the Runtime decided to execute."""
    decision_id: str
    tool_calls: List[Dict[str, Any]] # e.g., [{"tool": "github.merge", "args": {"sha": "..."}}]
    context: Dict[str, Any]          # Additional metadata required for rollback/journaling
    
@dataclass(frozen=True)
class ExecutionResult:
    """Result of executing a plan via the external system."""
    status: str             # 'SUCCESS', 'FAILED', 'PARTIAL'
    execution_id: str
    logs: List[str]
    error: Optional[str] = None
    
@dataclass(frozen=True)
class ExecutionContext:
    """Context required to rollback an execution."""
    execution_id: str
    plan: ExecutionPlan
    result: ExecutionResult
    
@dataclass(frozen=True)
class CapabilityDescriptor:
    """Describes what this adapter can observe and execute."""
    observations: List[str]
    actions: List[str]
    supports_rollback: bool
    supports_streaming: bool
    supports_batch: bool
    version: str

@dataclass(frozen=True)
class HealthStatus:
    """Detailed health state of the adapter's connection to its backend."""
    status: str             # 'HEALTHY', 'DEGRADED', 'UNHEALTHY'
    latency_ms: int
    version: str
    authenticated: bool
    message: str

# ── Adapter Interface ───────────────────────────────────────────────────────

class EDAOSAdapter(ABC):
    """
    Standard interface that all Ecosystem Adapters MUST implement.
    The Runtime only interacts with Adapters via this contract.
    """
    
    @property
    @abstractmethod
    def adapter_id(self) -> str:
        """Unique identifier (e.g., 'github-mcp', 'vscode-mcp')."""
        pass

    @property
    @abstractmethod
    def contract_version(self) -> str:
        """Version of the EDAOS Adapter Contract implemented (e.g., '1.0')."""
        pass

    @abstractmethod
    def health(self) -> HealthStatus:
        """Check if backend is reachable, authenticated, and not rate-limited."""
        pass

    @abstractmethod
    def capabilities(self) -> CapabilityDescriptor:
        """Declare supported observations and actions."""
        pass

    @abstractmethod
    def observe(self, context: Dict[str, Any]) -> List[Observation]:
        """Translate backend data into generic Observations."""
        pass

    @abstractmethod
    def execute(self, plan: ExecutionPlan) -> ExecutionResult:
        """Execute a plan against the backend system."""
        pass

    @abstractmethod
    def rollback(self, context: ExecutionContext) -> bool:
        """Revert a previous execution if supported by the backend."""
        pass
