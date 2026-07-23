import { ContextExtractor } from './context_extractor';
import { McpClient } from './mcp_client';
import { WebviewRenderer } from './webview_renderer';

/**
 * STRICT BOUNDARY:
 * This is the VS Code Extension entry point.
 * It wires components together but holds no AI logic.
 */
export function activate() {
    const extractor = new ContextExtractor();
    const client = new McpClient();
    const renderer = new WebviewRenderer();

    client.connect();

    // Mock command execution
    async function onUserActionTriggered(intent: string, capabilityId: string) {
        // 1. Gather context
        const observation = extractor.extract("/workspace", "app.ts", "selected text", intent, capabilityId);
        
        // 2. Submit to Governance Runtime
        const response = await client.submitObservation(observation);
        
        // 3. Render result
        renderer.render(response);
    }
}

export function deactivate() {
    // Disconnect MCP
}
