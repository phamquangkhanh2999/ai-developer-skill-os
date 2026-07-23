/**
 * EDAOS MCP Schema
 * This file mirrors the EDAOS Governance Runtime contracts.
 * The client MUST NOT redefine these or add reasoning logic.
 */

export interface ObservationRequest {
    editor_source: 'antigravity';
    capability_id: string;
    raw_context: {
        workspace: string;
        file_reference: string;
        ast_node?: any;
    };
    intent: string;
}

export interface GovernanceResponse {
    status?: 'accepted' | 'certified';
    evidence?: any;
    decision?: any;
    error?: string;
}
