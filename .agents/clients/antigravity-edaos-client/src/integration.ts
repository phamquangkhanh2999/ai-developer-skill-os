import { ContextExtractor } from './context_extractor';
import { McpClient } from './mcp_client';
import { WebviewRenderer } from './webview_renderer';

/**
 * STRICT BOUNDARY:
 * This is the Antigravity IDE Integration entry point.
 * It wires components together but holds no AI logic.
 */
export class AntigravityIntegration {
    private extractor = new ContextExtractor();
    private client = new McpClient();
    private renderer = new WebviewRenderer();

    public async init() {
        this.client.connect();
    }

    // Mock command execution from native UI
    public async onUserActionTriggered(intent: string, capabilityId: string) {
        // 1. Gather context (simulating native AST injection)
        const observation = this.extractor.extract("/workspace", "app.ts", { type: "AST_NODE" }, intent, capabilityId);
        
        // 2. Submit to Governance Runtime
        const response = await this.client.submitObservation(observation);
        
        // 3. Render result natively
        this.renderer.render(response);
    }
}
