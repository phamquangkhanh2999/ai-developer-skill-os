import { GovernanceResponse } from './types/edaos';

/**
 * STRICT BOUNDARY:
 * This module is ONLY allowed to render responses.
 * Forbidden: Mini Decision Engine, state alteration logic.
 */
export class WebviewRenderer {
    public render(response: GovernanceResponse) {
        if (response.error) {
            this.showError(`EDAOS Runtime Error: ${response.error}`);
            // Cannot alter state here.
            return;
        }

        if (response.decision) {
            this.showDecision(response.decision);
        }
    }

    private showError(message: string) {
        // UI code to show red text
        console.error(message);
    }

    private showDecision(decision: any) {
        // UI code to render the decision plan
        console.log("Rendering Decision:", decision);
    }
}
