export class LoopDetector {
  private static executionStack: Map<string, number> = new Map();
  private static MAX_RECURSION_DEPTH = 5;

  /**
   * Track call stack to prevent infinite recursive triggers
   */
  public static enterExecution(workflowId: string): { safe: boolean; error?: string } {
    const currentDepth = this.executionStack.get(workflowId) || 0;
    if (currentDepth >= this.MAX_RECURSION_DEPTH) {
      return {
        safe: false,
        error: `Infinite loop detected for workflow '${workflowId}'. Reached max recursion depth limit of ${this.MAX_RECURSION_DEPTH}. Execution aborted.`,
      };
    }
    this.executionStack.set(workflowId, currentDepth + 1);
    return { safe: true };
  }

  /**
   * Exit call stack on completion
   */
  public static exitExecution(workflowId: string): void {
    const currentDepth = this.executionStack.get(workflowId) || 0;
    if (currentDepth <= 1) {
      this.executionStack.delete(workflowId);
    } else {
      this.executionStack.set(workflowId, currentDepth - 1);
    }
  }
}
