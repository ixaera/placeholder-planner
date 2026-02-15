import { TestBed } from '@angular/core/testing';
import { MockDataService } from './mock-data.service';
import { Task, Goal } from '../models/task.interface';
import { PeriodScope } from './period.service';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('migrateLegacyData', () => {
    it('should assign current day to tasks without dates', () => {
      const tasks: Task[] = [
        { id: 1, text: 'Task 1', completed: false, tags: [], showTagInput: false },
        { id: 2, text: 'Task 2', completed: true, tags: [], showTagInput: false }
      ];

      const currentPeriodKeys = {
        day: '2026-02-14',
        week: '2026-W07',
        quarter: '2026-Q1',
        year: '2026'
      };

      service.migrateLegacyData(tasks, currentPeriodKeys);

      tasks.forEach(task => {
        expect(task.date).toBe('2026-02-14');
        expect(task.createdAt).toBeDefined();
        expect(task.updatedAt).toBeDefined();
      });
    });

    it('should not modify tasks that already have dates', () => {
      const tasks: Task[] = [
        { id: 1, text: 'Task 1', completed: false, tags: [], showTagInput: false, date: '2026-01-01' }
      ];

      const currentPeriodKeys = {
        day: '2026-02-14',
        week: '2026-W07',
        quarter: '2026-Q1',
        year: '2026'
      };

      service.migrateLegacyData(tasks, currentPeriodKeys);

      expect(tasks[0].date).toBe('2026-01-01'); // Should not change
    });

    it('should assign current week to goals without periodKey', () => {
      const goals: Goal[] = [
        { id: 1, text: 'Goal 1', completed: false, tags: [], showTagInput: false }
      ];

      const currentPeriodKeys = {
        day: '2026-02-14',
        week: '2026-W07',
        quarter: '2026-Q1',
        year: '2026'
      };

      service.migrateLegacyData(goals, currentPeriodKeys, 'week');

      expect(goals[0].periodKey).toBe('2026-W07');
      expect(goals[0].scope).toBe('week');
      expect(goals[0].createdAt).toBeDefined();
      expect(goals[0].updatedAt).toBeDefined();
    });

    it('should assign current quarter to goals when scope is quarter', () => {
      const goals: Goal[] = [
        { id: 1, text: 'Goal 1', completed: false, tags: [], showTagInput: false }
      ];

      const currentPeriodKeys = {
        day: '2026-02-14',
        week: '2026-W07',
        quarter: '2026-Q1',
        year: '2026'
      };

      service.migrateLegacyData(goals, currentPeriodKeys, 'quarter');

      expect(goals[0].periodKey).toBe('2026-Q1');
      expect(goals[0].scope).toBe('quarter');
    });
  });

  describe('generateHistoricalData', () => {
    it('should generate tasks for past weeks', () => {
      const result = service.generateHistoricalData(2);

      expect(result.tasks.length).toBeGreaterThan(0);
      expect(result.goals.length).toBeGreaterThan(0);
    });

    it('should assign dates to all generated tasks', () => {
      const result = service.generateHistoricalData(1);

      result.tasks.forEach(task => {
        expect(task.date).toBeDefined();
        expect(task.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('should assign periodKeys to all generated goals', () => {
      const result = service.generateHistoricalData(1);

      result.goals.forEach(goal => {
        expect(goal.periodKey).toBeDefined();
        expect(goal.scope).toBeDefined();
      });
    });

    it('should mark most past tasks as completed', () => {
      const result = service.generateHistoricalData(4);

      const completedCount = result.tasks.filter(t => t.completed).length;
      const totalCount = result.tasks.length;

      // At least 50% should be completed for historical data
      expect(completedCount / totalCount).toBeGreaterThan(0.5);
    });

    it('should generate goals with different scopes', () => {
      const result = service.generateHistoricalData(4);

      const weekGoals = result.goals.filter(g => g.scope === 'week');
      const quarterGoals = result.goals.filter(g => g.scope === 'quarter');
      const yearGoals = result.goals.filter(g => g.scope === 'year');

      expect(weekGoals.length).toBeGreaterThan(0);
      expect(quarterGoals.length).toBeGreaterThan(0);
      expect(yearGoals.length).toBeGreaterThan(0);
    });

    it('should generate realistic number of items per week', () => {
      const result = service.generateHistoricalData(1);

      // Should generate a reasonable number of tasks per week (not too many, not too few)
      expect(result.tasks.length).toBeGreaterThan(0);
      expect(result.tasks.length).toBeLessThan(50); // Sanity check
    });
  });

  describe('generateTasksForDate', () => {
    it('should generate specified number of tasks', () => {
      const tasks = service.generateTasksForDate('2026-02-14', 5);
      expect(tasks.length).toBe(5);
    });

    it('should assign correct date to all tasks', () => {
      const tasks = service.generateTasksForDate('2026-02-14', 3);
      tasks.forEach(task => {
        expect(task.date).toBe('2026-02-14');
      });
    });

    it('should mark most tasks complete for past dates', () => {
      const tasks = service.generateTasksForDate('2020-01-01', 10);
      const completedCount = tasks.filter(t => t.completed).length;

      // Most past tasks should be completed (70% completion rate)
      expect(completedCount).toBeGreaterThan(5);
    });

    it('should not mark tasks complete for future dates', () => {
      const tasks = service.generateTasksForDate('2030-01-01', 10);
      const completedCount = tasks.filter(t => t.completed).length;

      expect(completedCount).toBe(0);
    });

    it('should assign timestamps to all tasks', () => {
      const tasks = service.generateTasksForDate('2026-02-14', 5);
      tasks.forEach(task => {
        expect(task.createdAt).toBeDefined();
        expect(task.updatedAt).toBeDefined();
      });
    });

    it('should generate unique IDs', () => {
      const tasks = service.generateTasksForDate('2026-02-14', 10);
      const ids = tasks.map(t => t.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(tasks.length);
    });

    it('should handle default count parameter', () => {
      const tasks = service.generateTasksForDate('2026-02-14');
      expect(tasks.length).toBe(5); // Default is 5
    });
  });
});
