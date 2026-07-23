import { ObservationRequest } from './types/edaos';

/**
 * STRICT BOUNDARY:
 * This module is ONLY allowed to extract state.
 * Forbidden: Capability routing, AI reasoning, Permission checks.
 */
export class ContextExtractor {
    public extract(workspacePath: string, filePath: string, astNode: any, intent: string, capabilityId: string): ObservationRequest {
        return {
            editor_source: 'antigravity',
            capability_id: capabilityId,
            raw_context: {
                workspace: workspacePath,
                file_reference: filePath,
                ast_node: astNode
            },
            intent: intent
        };
    }
}
