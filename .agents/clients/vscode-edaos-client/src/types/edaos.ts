/**
 * EDAOS MCP Schema
 * This file mirrors the EDAOS Governance Runtime contracts.
 * The client MUST NOT redefine these or add reasoning logic.
 */

export interface ObservationRequest {
    editor_source: 'vscode';
    capability_id: string;
    raw_context: {
        workspace: string;
        file_reference: string;
        selection?: string;
    };
    intent: string;
}

export interface GovernanceResponse {
    status?: 'accepted' | 'certified';
    evidence?: any;
    decision?: any;
    error?: string;
}
