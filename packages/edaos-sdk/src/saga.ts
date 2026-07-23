/**
 * SagaManager
 * Spec 24 — Saga Manager & Rollback Engine
 *
 * Executes actions with guaranteed compensating rollback on any failure.
 * Enforces Zero Data Loss (Constitution Article 5).
 *
 * Pattern:
 *   CHECKPOINT → execute fn() → COMMITTED
 *                             ↓ on throw
 *                        execute rollback() → ROLLED_BACK
 */

import type { ExecutionStatus } from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// SAGA TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SagaResult<T = unknown> {
  status:    ExecutionStatus
  value?:    T
  error?:    Error
  rolledBack: boolean
}

export interface SagaStep<T = unknown> {
  action: string
  execute: () => Promise<T>
  rollback?: () => Promise<void>
}

// ─────────────────────────────────────────────────────────────────────────────
// SAGA MANAGER
// ─────────────────────────────────────────────────────────────────────────────

export class SagaManager {
  private readonly onCheckpoint?: (action: string) => void
  private readonly onCommit?:     (action: string) => void
  private readonly onRollback?:   (action: string, error: Error) => void

  constructor(hooks: {
    onCheckpoint?: (action: string) => void
    onCommit?:     (action: string) => void
    onRollback?:   (action: string, error: Error) => void
  } = {}) {
    if (hooks.onCheckpoint !== undefined) this.onCheckpoint = hooks.onCheckpoint
    if (hooks.onCommit     !== undefined) this.onCommit     = hooks.onCommit
    if (hooks.onRollback   !== undefined) this.onRollback   = hooks.onRollback
  }

  /**
   * Execute single `fn` with Saga rollback guarantee.
   */
  async execute<T>(
    action: string,
    fn: () => Promise<T>,
    rollback?: () => Promise<void>,
  ): Promise<SagaResult<T>> {
    this.onCheckpoint?.(action)

    try {
      const value = await fn()
      this.onCommit?.(action)
      return { status: 'COMMITTED', value, rolledBack: false }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      this.onRollback?.(action, error)

      if (rollback !== undefined) {
        await rollback()
        return { status: 'ROLLED_BACK', error, rolledBack: true }
      }

      return { status: 'ROLLED_BACK', error, rolledBack: false }
    }
  }

  /**
   * Execute a Multi-Step Saga (DAG).
   * Executes steps sequentially. If a step fails, rolls back ALL previously
   * completed steps in REVERSE order.
   *
   * @param name   Human-readable saga name
   * @param steps  Array of Saga steps
   */
  async executeDAG<T = unknown>(name: string, steps: SagaStep[]): Promise<SagaResult<T[]>> {
    this.onCheckpoint?.(name)
    const completedSteps: SagaStep[] = []
    const results: any[] = []

    for (const step of steps) {
      try {
        const val = await step.execute()
        results.push(val)
        completedSteps.push(step)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        this.onRollback?.(step.action, error)

        // Reverse compensation
        const reverseSteps = [...completedSteps].reverse()
        let rollbackSuccess = true
        for (const rStep of reverseSteps) {
          if (rStep.rollback !== undefined) {
            try {
              await rStep.rollback()
            } catch (rErr) {
              // Rollback failure in DAG is critical, but we continue attempting others
              rollbackSuccess = false
            }
          }
        }
        return { status: 'ROLLED_BACK', error, rolledBack: rollbackSuccess }
      }
    }

    this.onCommit?.(name)
    return { status: 'COMMITTED', value: results, rolledBack: false }
  }

  /**
   * Simulate execution without side-effects (for Digital Twin / Spec 64).
   * Always returns COMMITTED but never calls fn().
   */
  simulate(action: string): SagaResult {
    return {
      status:    'COMMITTED',
      value:     `[SIMULATED] ${action}`,
      rolledBack: false,
    }
  }
}
