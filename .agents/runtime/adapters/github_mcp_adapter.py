#!/usr/bin/env python3
"""
EDAOS v15 — Reference GitHub MCP Adapter
Implements Adapter Contract v1.0
Translates GitHub state (Issues, PRs, Comments) into EDAOS generic structures.
"""

import time
import random
from datetime import datetime, timezone
from typing import List, Dict, Any

from adapter_contract import (
    EDAOSAdapter, Observation, ExecutionPlan, ExecutionResult,
    ExecutionContext, CapabilityDescriptor, HealthStatus
)

class GitHubMCPAdapter(EDAOSAdapter):
    
    def __init__(self, token: str = "mock-token"):
        self.token = token
        self._connected = True

    @property
    def adapter_id(self) -> str:
        return "github-mcp"

    @property
    def contract_version(self) -> str:
        return "1.0"

    def health(self) -> HealthStatus:
        # Simulate an API check to GitHub
        if not self._connected:
            return HealthStatus(
                status="UNHEALTHY", latency_ms=0, version="v3",
                authenticated=False, message="Connection refused"
            )
            
        latency = random.randint(30, 150)
        return HealthStatus(
            status="HEALTHY",
            latency_ms=latency,
            version="v3/mcp-1.2",
            authenticated=bool(self.token),
            message="Connected to GitHub API"
        )

    def capabilities(self) -> CapabilityDescriptor:
        return CapabilityDescriptor(
            observations=["pull_request", "issue", "review"],
            actions=["comment", "merge", "label", "assign"],
            supports_rollback=True,  # e.g., unlabel, unassign (cannot un-merge)
            supports_streaming=False,
            supports_batch=True,
            version="1.0.0"
        )

    def observe(self, context: Dict[str, Any]) -> List[Observation]:
        """
        In reality, this would hit `GET /repos/{owner}/{repo}/issues`
        Here we mock the response to test the deterministic mapping.
        """
        ts = datetime.now(timezone.utc).isoformat()
        target_type = context.get("target_type", "issue")
        
        observations = []
        if target_type == "issue":
            observations.append(Observation(
                id=f"gh-issue-{context.get('issue_number', 101)}",
                type="issue",
                source=self.adapter_id,
                payload={
                    "title": "Bug in Adapter",
                    "body": "NullReferenceException when parsing YAML",
                    "labels": ["bug", "high-priority"]
                },
                timestamp=ts
            ))
        elif target_type == "review":
            observations.append(Observation(
                id=f"gh-review-{context.get('pr_number', 42)}",
                type="review",
                source=self.adapter_id,
                payload={
                    "state": "APPROVED",
                    "author": "qkhanh",
                    "commit_id": "sha-12345"
                },
                timestamp=ts
            ))
            
        return observations

    def execute(self, plan: ExecutionPlan) -> ExecutionResult:
        """
        Translates plan into actual GitHub API calls.
        For reference, we mock execution.
        """
        logs = []
        exec_id = f"exec-gh-{int(time.time()*1000)}"
        
        for call in plan.tool_calls:
            tool = call.get("tool")
            args = call.get("args", {})
            logs.append(f"Executing {tool} with {args}")
            
            # Simulate failure condition
            if tool == "github.merge" and args.get("sha") == "bad-sha":
                return ExecutionResult(
                    status="FAILED",
                    execution_id=exec_id,
                    logs=logs,
                    error="Merge conflict or invalid SHA"
                )
                
        return ExecutionResult(
            status="SUCCESS",
            execution_id=exec_id,
            logs=logs
        )

    def rollback(self, context: ExecutionContext) -> bool:
        """
        Attempts to revert operations if supported.
        E.g. If we added a label, remove it. 
        """
        plan = context.plan
        result = context.result
        
        if result.status != "SUCCESS":
            return False # Nothing to rollback
            
        for call in plan.tool_calls:
            tool = call.get("tool")
            if tool == "github.merge":
                # Cannot rollback a merge easily in standard API without a revert commit
                return False
            elif tool == "github.label":
                # Simulated un-label API call
                pass
                
        return True
