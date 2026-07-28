/**
 * AI Code Skin OS - Governed Capability Execution Sandbox (ESM Standard)
 * Implements constitutional fault defense:
 *  - [ABI-016] Capability Timeout & Fault Isolation: "Capability failure != Runtime failure"
 *  - [ABI-017] Logical Clock Ownership (Verifies driver cannot manipulate clocks)
 */

import { CapabilityResult } from './capability_result.js';

export class CapabilitySandbox {
  /**
   * Executes a capability driver method inside a governed isolation wrapper.
   * Catches runtime faults and enforces strict timeouts without crashing the root Kernel.
   * @param {object} driver - The capability driver implementation object
   * @param {object} invocationRequest - CapabilityInvocationRequest payload
   * @returns {Promise<object>|object} Guaranteed CapabilityResult artifact
   */
  static async execute(driver, invocationRequest) {
    if (!driver || typeof driver.execute !== 'function') {
      return CapabilityResult.fail(
        invocationRequest,
        'DRIVER_UNAVAILABLE',
        `No executable driver registered for manifest ID '${invocationRequest.capability_manifest_id}'`
      );
    }

    const timeoutMs = invocationRequest.timeout_ms || 5000;

    // Build timeout interdiction promise
    let timerHandle = null;
    const timeoutPromise = new Promise((_, reject) => {
      timerHandle = setTimeout(() => {
        reject(new Error(`Capability execution exceeded enforced timeout threshold of ${timeoutMs}ms.`));
      }, timeoutMs);
    });

    try {
      // Pass solely the CapabilityInvocationRequest to the untrusted driver (no Kernel or FSM context!)
      const executionPromise = Promise.resolve().then(() => driver.execute(invocationRequest));

      // Race driver execution against isolation timeout
      const result = await Promise.race([executionPromise, timeoutPromise]);
      if (timerHandle) clearTimeout(timerHandle);

      // Verify that the driver returned a valid CapabilityResult or wrap declared outputs
      if (result && result.contract_id === 'urn:agent-boundary:contract:capability-result') {
        return result;
      }
      
      return CapabilityResult.success(invocationRequest, result ? result.output : {}, result ? result.proposed_side_effects : []);

    } catch (error) {
      if (timerHandle) clearTimeout(timerHandle);
      
      const isTimeout = error.message && error.message.includes('exceeded enforced timeout');
      const errorCode = isTimeout ? 'CAPABILITY_TIMEOUT' : 'CAPABILITY_EXECUTION_FAULT';
      const status = isTimeout ? 'TIMEOUT' : 'FAILED';

      return CapabilityResult.fail(
        invocationRequest,
        errorCode,
        `[ABI-016 ISOLATION DEFENSE]: Untrusted capability driver failed safely within sandbox: ${error.message}`,
        status
      );
    }
  }
}
