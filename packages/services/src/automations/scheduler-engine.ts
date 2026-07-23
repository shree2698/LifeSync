import { WorkflowSchedule } from "@lifesync/types";

export class SchedulerEngine {
  private static schedules: Map<string, WorkflowSchedule> = new Map();

  /**
   * Calculate next run timestamp from cron expression
   */
  public static calculateNextRun(cronExpression: string): string {
    // Simple 24h interval calculation for standard daily cron
    const nextDate = new Date(Date.now() + 24 * 3600 * 1000);
    return nextDate.toISOString();
  }

  public static scheduleWorkflow(workflowId: string, cronExpression: string): WorkflowSchedule {
    const id = `sched_${Date.now()}`;
    const schedule: WorkflowSchedule = {
      id,
      workflowId,
      cronExpression,
      nextRunAt: this.calculateNextRun(cronExpression),
      lastRunAt: null,
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.schedules.set(id, schedule);
    return schedule;
  }

  public static listSchedules(): WorkflowSchedule[] {
    return Array.from(this.schedules.values());
  }
}
