import { Injectable } from '@angular/core';
import { Task, Goal } from '../models/task.interface';
import { PeriodScope, PeriodService } from './period.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private sampleTaskTexts = [
    'Review quarterly performance metrics',
    'Schedule team sync meeting',
    'Update project documentation',
    'Complete code review for PR',
    'Prepare presentation slides',
    'Follow up with stakeholders',
    'Refactor authentication module',
    'Write unit tests for new features',
    'Review and approve budget proposal',
    'Organize team knowledge sharing session'
  ];

  private sampleGoalTexts = {
    week: [
      'Complete all sprint tasks',
      'Review team performance',
      'Ship new feature to production',
      'Reduce technical debt by 10%',
      'Improve code coverage'
    ],
    quarter: [
      'Launch v2.0 product release',
      'Hire 3 new team members',
      'Implement new CI/CD pipeline',
      'Achieve 95% customer satisfaction',
      'Complete platform migration'
    ],
    year: [
      'Double user base',
      'Expand to 5 new markets',
      'Achieve profitability',
      'Build world-class engineering team',
      'Establish thought leadership'
    ]
  };

  constructor(private periodService: PeriodService) {}

  /**
   * Migrate legacy data to include period keys
   */
  migrateLegacyData(
    items: (Task | Goal)[],
    currentPeriodKeys: Record<PeriodScope, string>,
    scope?: 'week' | 'quarter' | 'year'
  ): void {
    const now = new Date().toISOString();

    items.forEach((item: Task | Goal) => {
      // If scope is provided, treat as goals; otherwise check for date property to determine type
      if (scope) {
        // It's a Goal - add periodKey and scope
        const goal = item as Goal;
        if (!goal.periodKey) {
          goal.scope = scope;
          goal.periodKey = currentPeriodKeys[scope];
          goal.createdAt = now;
          goal.updatedAt = now;
        }
      } else if ('date' in item || !scope) {
        // It's a Task - add date field
        const task = item as Task;
        if (!task.date) {
          task.date = currentPeriodKeys.day;
          task.createdAt = now;
          task.updatedAt = now;
        }
      }
    });
  }

  /**
   * Generate historical data for multiple past weeks
   */
  generateHistoricalData(weeksBack: number): { tasks: Task[], goals: Goal[] } {
    const tasks: Task[] = [];
    const goals: Goal[] = [];

    // Generate data for each past week
    for (let weekOffset = -weeksBack; weekOffset < 0; weekOffset++) {
      const weekKey = this.periodService.getPeriodKeyFromOffset(weekOffset, 'week');
      const weekStart = this.periodService.getWeekStartDate(weekKey);

      // Generate tasks for each day of the week (3-5 tasks per day)
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + dayOffset);
        const dateKey = this.periodService.getCurrentPeriodKey('day');
        const actualDateKey = date.toISOString().split('T')[0];

        const tasksForDay = this.generateTasksForDate(actualDateKey, 3 + Math.floor(Math.random() * 3));
        tasks.push(...tasksForDay);
      }

      // Generate weekly goals (2-4 per week)
      const weeklyGoals = this.generateGoalsForPeriod('week', weekKey, 2 + Math.floor(Math.random() * 3));
      goals.push(...weeklyGoals);
    }

    // Generate quarterly goals (2-3 per quarter that overlaps with the generated weeks)
    const currentQuarter = this.periodService.getCurrentPeriodKey('quarter');
    const quarterlyGoals = this.generateGoalsForPeriod('quarter', currentQuarter, 2 + Math.floor(Math.random() * 2));
    goals.push(...quarterlyGoals);

    // Generate yearly goals (3-5 for current year)
    const currentYear = this.periodService.getCurrentPeriodKey('year');
    const yearlyGoals = this.generateGoalsForPeriod('year', currentYear, 3 + Math.floor(Math.random() * 3));
    goals.push(...yearlyGoals);

    return { tasks, goals };
  }

  /**
   * Generate sample tasks for a specific date
   */
  generateTasksForDate(dateKey: string, count: number = 5): Task[] {
    const tasks: Task[] = [];
    const isPastDate = new Date(dateKey) < new Date(new Date().toISOString().split('T')[0]);

    for (let i = 0; i < count; i++) {
      const text = this.sampleTaskTexts[Math.floor(Math.random() * this.sampleTaskTexts.length)];
      const completed = isPastDate ? Math.random() > 0.3 : false; // 70% completion rate for past

      tasks.push({
        id: Date.now() + Math.random() * 10000,
        text,
        completed,
        tags: [],
        showTagInput: false,
        date: dateKey,
        createdAt: new Date(dateKey).toISOString(),
        updatedAt: new Date(dateKey).toISOString()
      });
    }

    return tasks;
  }

  /**
   * Generate sample goals for a period
   */
  generateGoalsForPeriod(scope: 'week' | 'quarter' | 'year', periodKey: string, count: number = 5): Goal[] {
    const goals: Goal[] = [];
    const isPastPeriod = this.periodService.isPastPeriod(periodKey, scope);
    const goalTexts = this.sampleGoalTexts[scope];

    for (let i = 0; i < Math.min(count, goalTexts.length); i++) {
      const text = goalTexts[i];
      const completed = isPastPeriod ? Math.random() > 0.4 : false; // 60% completion rate for past

      goals.push({
        id: Date.now() + Math.random() * 10000,
        text,
        completed,
        tags: [],
        showTagInput: false,
        scope,
        periodKey,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return goals;
  }
}
