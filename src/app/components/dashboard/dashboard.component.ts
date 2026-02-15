import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, Goal } from '../../models/task.interface';
import { AuthService } from '../../services/auth.service';
import { PeriodService, PeriodScope } from '../../services/period.service';
import { MockDataService } from '../../services/mock-data.service';
import { DailyTasksComponent } from '../daily-tasks/daily-tasks';
import { WeeklyGoalsComponent } from '../weekly-goals/weekly-goals';
import { QuarterlyGoalsComponent } from '../quarterly-goals/quarterly-goals';
import { YearlyGoalsComponent } from '../yearly-goals/yearly-goals';
import { TagManagementComponent } from '../tag-management/tag-management';
import { AnalysisComponent } from '../analysis/analysis';
import { ArrowButtonComponent } from '../time-navigation/arrow-button.component';
import { TimeBannerComponent } from '../time-navigation/time-banner.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    DailyTasksComponent,
    WeeklyGoalsComponent,
    QuarterlyGoalsComponent,
    YearlyGoalsComponent,
    TagManagementComponent,
    AnalysisComponent,
    ArrowButtonComponent,
    TimeBannerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  title = 'Placeholder Planner Title';

  // Top bar info
  motivationalText = 'Closers get coffee';

  // Time navigation state
  activeScope: PeriodScope = 'week';
  periodOffsets: Record<PeriodScope, number> = {
    day: 0,
    week: 0,
    quarter: 0,
    year: 0
  };

  // Current period keys (computed from offsets)
  currentPeriodKeys: Record<PeriodScope, string> = {
    day: '',
    week: '',
    quarter: '',
    year: ''
  };

  // View toggle
  showYearlyGoals = false;
  showQuarterlyGoals = false;
  showTagManagement = false;
  showAnalysis = false;

  // Global tag list
  globalTags: string[] = ['happy house', 'survive', 'strong body', 'sharp mind', 'create'];

  // Complete data stores (all periods)
  allTasks: Task[] = [];
  allWeeklyGoals: Goal[] = [];
  allQuarterlyGoals: Goal[] = [];
  allYearlyGoals: Goal[] = [];

  // Mock tasks for Monday
  tasks: Task[] = [
    { id: 1, text: 'Review Q1 strategy documents and prepare feedback', completed: false, tags: [], showTagInput: false },
    { id: 2, text: 'Schedule team standup for Tuesday morning', completed: true, tags: [], showTagInput: false },
    { id: 3, text: 'Update project timeline in tracking system', completed: false, tags: [], showTagInput: false },
    { id: 4, text: 'Respond to client emails and schedule follow-up calls', completed: false, tags: [], showTagInput: false },
    { id: 5, text: 'Complete code review for PR #245', completed: true, tags: [], showTagInput: false },
    { id: 6, text: 'Prepare slides for Wednesday presentation', completed: false, tags: [], showTagInput: false }
  ];

  // Mock weekly goals
  weeklyGoals: Goal[] = [
    { id: 1, text: 'Ship feature X to production', completed: false, tags: [], showTagInput: false },
    { id: 2, text: 'Complete 3 code reviews', completed: true, tags: [], showTagInput: false },
    { id: 3, text: 'Finalize Q1 roadmap', completed: false, tags: [], showTagInput: false },
    { id: 4, text: 'Reduce technical debt by 20%', completed: false, tags: [], showTagInput: false },
    { id: 5, text: 'Improve test coverage to 85%', completed: false, tags: [], showTagInput: false }
  ];

  // Mock yearly goals
  yearlyGoals: Goal[] = [
    { id: 1, text: 'Launch 3 major product features', completed: false, tags: [], showTagInput: false },
    { id: 2, text: 'Grow user base by 50%', completed: false, tags: [], showTagInput: false },
    { id: 3, text: 'Achieve $1M ARR', completed: false, tags: [], showTagInput: false },
    { id: 4, text: 'Build and scale engineering team to 10 people', completed: false, tags: [], showTagInput: false },
    { id: 5, text: 'Establish thought leadership with 12 blog posts', completed: false, tags: [], showTagInput: false }
  ];

  // Mock quarterly goals
  quarterlyGoals: Goal[] = [
    { id: 1, text: 'Complete product roadmap for Q1', completed: false, tags: [], showTagInput: false },
    { id: 2, text: 'Hire 3 engineers', completed: false, tags: [], showTagInput: false },
    { id: 3, text: 'Reach 10k monthly active users', completed: true, tags: [], showTagInput: false },
    { id: 4, text: 'Implement analytics dashboard', completed: false, tags: [], showTagInput: false },
    { id: 5, text: 'Launch beta testing program', completed: false, tags: [], showTagInput: false }
  ];

  // Bottom bar info
  bottomText = 'Some cool links and stuff here';

  constructor(
    private authService: AuthService,
    private router: Router,
    private periodService: PeriodService,
    private mockDataService: MockDataService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializePeriodKeys();
    this.loadAllData();
    this.filterDataForCurrentPeriod();
  }

  // Toggle between daily and yearly view
  toggleYearlyGoals(): void {
    this.showYearlyGoals = !this.showYearlyGoals;
    this.showQuarterlyGoals = false;
    this.showTagManagement = false;
    this.showAnalysis = false;
  }

  // Toggle between daily and quarterly view
  toggleQuarterlyGoals(): void {
    this.showQuarterlyGoals = !this.showQuarterlyGoals;
    this.showYearlyGoals = false;
    this.showTagManagement = false;
    this.showAnalysis = false;
  }

  // Show daily tasks view
  showDailyTasks(): void {
    this.showYearlyGoals = false;
    this.showQuarterlyGoals = false;
    this.showTagManagement = false;
    this.showAnalysis = false;
  }

  // Logout functionality
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Close all tag inputs across all components
  closeAllTagInputs(): void {
    this.tasks.forEach(task => task.showTagInput = false);
    this.weeklyGoals.forEach(goal => goal.showTagInput = false);
    this.yearlyGoals.forEach(goal => goal.showTagInput = false);
    this.quarterlyGoals.forEach(goal => goal.showTagInput = false);
  }

  // Toggle tag management view
  toggleTagManagement(): void {
    this.showTagManagement = !this.showTagManagement;
    if (this.showTagManagement) {
      this.showYearlyGoals = false;
      this.showQuarterlyGoals = false;
      this.showAnalysis = false;
    }
    this.closeAllTagInputs();
  }

  // Toggle analysis view
  toggleAnalysis(): void {
    this.showAnalysis = !this.showAnalysis;
    if (this.showAnalysis) {
      this.showYearlyGoals = false;
      this.showQuarterlyGoals = false;
      this.showTagManagement = false;
    }
    this.closeAllTagInputs();
  }

  // Get all global tags
  getAllTags(): string[] {
    return this.globalTags;
  }

  // Rename a tag across all goals and tasks
  renameTag(oldTag: string, newTag: string): void {
    const renameInArray = (items: (Task | Goal)[]) => {
      items.forEach(item => {
        if (item.tags) {
          const index = item.tags.indexOf(oldTag);
          if (index !== -1) {
            item.tags[index] = newTag;
          }
        }
      });
    };

    renameInArray(this.tasks);
    renameInArray(this.weeklyGoals);
    renameInArray(this.quarterlyGoals);
    renameInArray(this.yearlyGoals);

    // Also update in global tag list
    const globalIndex = this.globalTags.indexOf(oldTag);
    if (globalIndex !== -1) {
      this.globalTags[globalIndex] = newTag;
    }
  }

  // Delete a tag from all goals and tasks
  deleteTag(tag: string): void {
    const removeFromArray = (items: (Task | Goal)[]) => {
      items.forEach(item => {
        if (item.tags) {
          item.tags = item.tags.filter(t => t !== tag);
        }
      });
    };

    removeFromArray(this.tasks);
    removeFromArray(this.weeklyGoals);
    removeFromArray(this.quarterlyGoals);
    removeFromArray(this.yearlyGoals);

    // Also remove from global tag list
    this.globalTags = this.globalTags.filter(t => t !== tag);
  }

  // Event handler for tag renamed
  onTagRenamed(event: {oldTag: string, newTag: string}): void {
    this.renameTag(event.oldTag, event.newTag);
  }

  // Event handler for tag deleted
  onTagDeleted(tag: string): void {
    this.deleteTag(tag);
  }

  // Event handler for tag added
  onTagAdded(tag: string): void {
    if (tag && tag.length <= 15 && !this.globalTags.includes(tag)) {
      this.globalTags.push(tag);
    }
  }

  // ========== TIME NAVIGATION METHODS ==========

  private initializePeriodKeys(): void {
    this.currentPeriodKeys.day = this.periodService.getCurrentPeriodKey('day');
    this.currentPeriodKeys.week = this.periodService.getCurrentPeriodKey('week');
    this.currentPeriodKeys.quarter = this.periodService.getCurrentPeriodKey('quarter');
    this.currentPeriodKeys.year = this.periodService.getCurrentPeriodKey('year');
  }

  private loadAllData(): void {
    // 1. Migrate existing mock data to include period keys
    this.mockDataService.migrateLegacyData(this.tasks, this.currentPeriodKeys);
    this.mockDataService.migrateLegacyData(this.weeklyGoals, this.currentPeriodKeys, 'week');
    this.mockDataService.migrateLegacyData(this.quarterlyGoals, this.currentPeriodKeys, 'quarter');
    this.mockDataService.migrateLegacyData(this.yearlyGoals, this.currentPeriodKeys, 'year');

    // 2. Generate historical data (4 weeks back)
    const historical = this.mockDataService.generateHistoricalData(4);

    // 3. Combine into allTasks/allGoals arrays
    this.allTasks = [...this.tasks, ...historical.tasks];
    this.allWeeklyGoals = [...this.weeklyGoals, ...historical.goals.filter(g => g.scope === 'week')];
    this.allQuarterlyGoals = [...this.quarterlyGoals, ...historical.goals.filter(g => g.scope === 'quarter')];
    this.allYearlyGoals = [...this.yearlyGoals, ...historical.goals.filter(g => g.scope === 'year')];
  }

  setActiveScope(scope: PeriodScope): void {
    this.activeScope = scope;

    // Ensure day and week stay synced when switching between them
    if (scope === 'day') {
      this.syncWeekToDay();
      this.updateCurrentPeriodKey('week');
    } else if (scope === 'week') {
      this.syncDayToWeek();
      this.updateCurrentPeriodKey('day');
    }

    this.filterDataForCurrentPeriod();

    // Update legacy view toggles for compatibility
    if (scope === 'week' || scope === 'day') {
      this.showDailyTasks();
    } else if (scope === 'quarter') {
      this.showQuarterlyGoals = true;
      this.showYearlyGoals = false;
    } else if (scope === 'year') {
      this.showYearlyGoals = true;
      this.showQuarterlyGoals = false;
    }
  }

  navigatePeriod(direction: number): void {
    this.periodOffsets[this.activeScope] += direction;

    // Sync day and week to keep them aligned
    if (this.activeScope === 'day') {
      this.syncWeekToDay();
    } else if (this.activeScope === 'week') {
      this.syncDayToWeek();
    }

    // Update period keys for day and week (they may both have changed)
    this.updateCurrentPeriodKey('day');
    this.updateCurrentPeriodKey('week');
    this.updateCurrentPeriodKey(this.activeScope); // Also update active scope if it's quarter/year

    this.filterDataForCurrentPeriod();
    this.cdr.detectChanges();
  }

  jumpToToday(): void {
    // Reset all period offsets to 0
    this.periodOffsets.day = 0;
    this.periodOffsets.week = 0;
    this.periodOffsets.quarter = 0;
    this.periodOffsets.year = 0;

    // Update all period keys
    this.updateCurrentPeriodKey('day');
    this.updateCurrentPeriodKey('week');
    this.updateCurrentPeriodKey('quarter');
    this.updateCurrentPeriodKey('year');

    this.filterDataForCurrentPeriod();
    this.cdr.detectChanges();
  }

  private updateCurrentPeriodKey(scope: PeriodScope): void {
    const offset = this.periodOffsets[scope];
    this.currentPeriodKeys[scope] = this.periodService.getPeriodKeyFromOffset(offset, scope);
  }

  /**
   * Sync week offset to match the current day's week
   */
  private syncWeekToDay(): void {
    // Get the day key for the new offset
    const dayKey = this.periodService.getPeriodKeyFromOffset(this.periodOffsets.day, 'day');

    // Get the week containing this day
    const weekKeyForDay = this.periodService.getWeekKeyForDate(dayKey);

    // Get the current week at offset 0
    const currentWeekKey = this.periodService.getCurrentPeriodKey('week');

    // If they're different, calculate the new week offset
    if (weekKeyForDay !== currentWeekKey) {
      const currentMonday = this.periodService.getMondayForWeek(currentWeekKey);
      const targetMonday = this.periodService.getMondayForWeek(weekKeyForDay);

      const currentDate = new Date(currentMonday);
      const targetDate = new Date(targetMonday);
      const weeksDiff = Math.round((targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

      this.periodOffsets.week = weeksDiff;
    }
  }

  /**
   * Sync day offset to the Monday of the current week
   */
  private syncDayToWeek(): void {
    // Get the week key for the new offset
    const weekKey = this.periodService.getPeriodKeyFromOffset(this.periodOffsets.week, 'week');

    // Get the Monday of this week
    const mondayKey = this.periodService.getMondayForWeek(weekKey);

    // Get the current day at offset 0
    const currentDayKey = this.periodService.getCurrentPeriodKey('day');

    // Calculate the day offset to reach Monday
    const currentDate = new Date(currentDayKey);
    const targetDate = new Date(mondayKey);
    const daysDiff = Math.round((targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    this.periodOffsets.day = daysDiff;
  }

  private filterDataForCurrentPeriod(): void {
    const dayKey = this.currentPeriodKeys.day;
    const weekKey = this.currentPeriodKeys.week;
    const quarterKey = this.currentPeriodKeys.quarter;
    const yearKey = this.currentPeriodKeys.year;

    // Filter tasks for current day
    this.tasks = this.allTasks.filter(task => task.date === dayKey);

    // Filter goals for current periods
    this.weeklyGoals = this.allWeeklyGoals.filter(goal => goal.periodKey === weekKey);
    this.quarterlyGoals = this.allQuarterlyGoals.filter(goal => goal.periodKey === quarterKey);
    this.yearlyGoals = this.allYearlyGoals.filter(goal => goal.periodKey === yearKey);
  }

  // Period label formatters
  getDayLabel(): string {
    return this.periodService.formatPeriodLabel(this.currentPeriodKeys.day, 'day');
  }

  getWeekLabel(): string {
    return this.periodService.formatPeriodLabel(this.currentPeriodKeys.week, 'week');
  }

  getQuarterLabel(): string {
    return this.periodService.formatPeriodLabel(this.currentPeriodKeys.quarter, 'quarter');
  }

  getYearLabel(): string {
    return this.periodService.formatPeriodLabel(this.currentPeriodKeys.year, 'year');
  }

  getCurrentPeriodLabel(): string {
    return this.periodService.formatPeriodLabel(
      this.currentPeriodKeys[this.activeScope],
      this.activeScope
    );
  }

  // Period state checkers
  isAtCurrentPeriod(scope: PeriodScope): boolean {
    return this.periodOffsets[scope] === 0;
  }

  isPastPeriod(): boolean {
    return this.periodOffsets[this.activeScope] < 0;
  }

  isFuturePeriod(): boolean {
    return this.periodOffsets[this.activeScope] > 0;
  }

  // Tab styling
  getTabClasses(scope: PeriodScope): string {
    const isActive = scope === this.activeScope;
    const baseClasses = 'px-4 py-2 rounded-md transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md relative';

    if (isActive) {
      if (scope === 'day' || scope === 'week') return `${baseClasses} bg-indigo-500 text-white`;
      if (scope === 'quarter') return `${baseClasses} bg-purple-500 text-white`;
      if (scope === 'year') return `${baseClasses} bg-violet-500 text-white`;
    }

    return `${baseClasses} bg-violet-100 text-indigo-900 hover:bg-violet-200`;
  }
}
