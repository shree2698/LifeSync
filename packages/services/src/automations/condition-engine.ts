import { WorkflowCondition } from "@lifesync/types";

export class ConditionEngine {
  /**
   * Evaluate a set of workflow conditions against execution context payload
   */
  public static evaluateConditions(
    conditions: WorkflowCondition[],
    contextPayload: Record<string, any>
  ): { passed: boolean; failedCondition?: WorkflowCondition; reasoning: string } {
    if (!conditions || conditions.length === 0) {
      return { passed: true, reasoning: "No conditions defined. Default to pass." };
    }

    for (const cond of conditions) {
      const fieldValue = contextPayload[cond.field];
      const targetValue = cond.value;

      let stepPassed = false;

      if (cond.operator === "EQUALS") {
        stepPassed = String(fieldValue) === String(targetValue);
      } else if (cond.operator === "NOT_EQUALS") {
        stepPassed = String(fieldValue) !== String(targetValue);
      } else if (cond.operator === "CONTAINS") {
        stepPassed = String(fieldValue || "").toLowerCase().includes(String(targetValue).toLowerCase());
      } else if (cond.operator === "GREATER_THAN") {
        stepPassed = Number(fieldValue) > Number(targetValue);
      } else if (cond.operator === "LESS_THAN") {
        stepPassed = Number(fieldValue) < Number(targetValue);
      }

      if (!stepPassed) {
        return {
          passed: false,
          failedCondition: cond,
          reasoning: `Condition failed: field '${cond.field}' (${fieldValue}) did not satisfy operator '${cond.operator}' target '${cond.value}'.`,
        };
      }
    }

    return { passed: true, reasoning: "All pipeline conditions evaluated successfully." };
  }
}
