#!/usr/bin/env python3
"""
EDAOS MCP Server (Model Context Protocol)
Exposes the EDAOS Governance Runtime to any compatible IDE client (Antigravity, VS Code, etc.).
"""

import json
import os
import yaml
from datetime import datetime, timezone

# We simulate reading the real YAML files by resolving their absolute paths.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def read_yaml(rel_path):
    path = os.path.join(BASE_DIR, rel_path)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    return {}

class MarketplaceRegistry:
    @classmethod
    def is_certified(cls, cap_id):
        registry = read_yaml("capabilities/registry.yaml")
        for cap in registry.get("capabilities", []):
            if cap.get("id") == cap_id and cap.get("status") == "certified":
                return True
        return False

class ObservationNormalizer:
    @staticmethod
    def normalize(raw_context, adapter_id):
        normalized_context = {
            "workspace": raw_context.get("workspace", "unknown"),
            "file": raw_context.get("file_reference", "unknown"),
            "target_content": raw_context.get("ast_node") or raw_context.get("selection", "")
        }
        provenance = {
            "editor": adapter_id,
            "adapter": f"{adapter_id}-gateway",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        return {"context": normalized_context, "provenance": provenance}

class GovernanceRuntime:
    @classmethod
    def execute_capability(cls, capability_id, observation, intent):
        # 1. Check Certification Gate
        if not MarketplaceRegistry.is_certified(capability_id):
            raise Exception(f"CapabilityNotCertified: {capability_id}")
            
        # 2. Check Execution Boundary (Hardcoded mock for GStack as an example)
        if capability_id == "gstack":
            forbidden = ["commit_code", "merge_pull_request", "deploy_application", "modify_file_directly"]
            if intent in forbidden:
                raise Exception(f"CapabilityPermissionDenied: {intent} is forbidden_by_capability_contract")
                
            return {
                "evidence": "code_quality_evidence",
                "decision": "implementation_plan",
                "routed_capability": capability_id,
                "provenance": observation["provenance"]
            }
            
        raise Exception(f"Capability {capability_id} routing not implemented in mock")


class EdaosMcpServer:
    """
    JSON-RPC MCP Server Handler
    """
    
    def handle_request(self, request):
        method = request.get("method")
        params = request.get("params", {})
        request_id = request.get("id")
        
        try:
            if method == "resources/list":
                result = self._handle_resources_list()
            elif method == "resources/read":
                result = self._handle_resources_read(params)
            elif method == "tools/list":
                result = self._handle_tools_list()
            elif method == "tools/call":
                result = self._handle_tools_call(params)
            else:
                raise Exception("MethodNotFound")
                
            return {"jsonrpc": "2.0", "id": request_id, "result": result}
        except Exception as e:
            return {"jsonrpc": "2.0", "id": request_id, "error": {"message": str(e)}}

    def _handle_resources_list(self):
        return {
            "resources": [
                {
                    "uri": "edaos://manifest",
                    "name": "EDAOS Architecture Manifest",
                    "mimeType": "application/x-yaml"
                },
                {
                    "uri": "edaos://registry",
                    "name": "EDAOS Capability Registry",
                    "mimeType": "application/x-yaml"
                }
            ]
        }
        
    def _handle_resources_read(self, params):
        uri = params.get("uri")
        
        if uri == "edaos://manifest":
            content = read_yaml("manifests/EDAOS-v1.1-manifest.yaml")
        elif uri == "edaos://registry":
            content = read_yaml("capabilities/registry.yaml")
        elif uri.startswith("edaos://capabilities/"):
            cap_id = uri.split("/")[-1]
            registry = read_yaml("capabilities/registry.yaml")
            content = None
            for cap in registry.get("capabilities", []):
                if cap.get("id") == cap_id:
                    content = cap
                    break
            if not content:
                raise Exception("ResourceNotFound")
        else:
            raise Exception("ResourceNotFound")
            
        return {
            "contents": [
                {
                    "uri": uri,
                    "mimeType": "application/x-yaml",
                    "text": yaml.dump(content, sort_keys=False)
                }
            ]
        }

    def _handle_tools_list(self):
        return {
            "tools": [
                {
                    "name": "submit_edaos_observation",
                    "description": "Submits editor context to a certified EDAOS capability.",
                    "inputSchema": {
                        "type": "object",
                        "properties": {
                            "editor_source": {"type": "string"},
                            "capability_id": {"type": "string"},
                            "raw_context": {"type": "object"},
                            "intent": {"type": "string"}
                        },
                        "required": ["editor_source", "capability_id", "raw_context", "intent"]
                    }
                }
            ]
        }
        
    def _handle_tools_call(self, params):
        name = params.get("name")
        args = params.get("arguments", {})
        
        if name == "submit_edaos_observation":
            editor_source = args.get("editor_source")
            capability_id = args.get("capability_id")
            raw_context = args.get("raw_context")
            intent = args.get("intent")
            
            # 1. Normalize Observation
            observation = ObservationNormalizer.normalize(raw_context, editor_source)
            
            # 2. Execute via Governance Runtime
            result = GovernanceRuntime.execute_capability(capability_id, observation, intent)
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": json.dumps(result, indent=2)
                    }
                ]
            }
        
        raise Exception("ToolNotFound")
