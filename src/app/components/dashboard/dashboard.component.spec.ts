import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { Task, Goal } from '../../models/task.interface';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('View Toggle Logic', () => {
    it('should initialize with all views hidden except daily tasks', () => {
      expect(component.showYearlyGoals).toBe(false);
      expect(component.showQuarterlyGoals).toBe(false);
      expect(component.showTagManagement).toBe(false);
      expect(component.showAnalysis).toBe(false);
    });

    describe('toggleYearlyGoals', () => {
      it('should show yearly goals and hide other views', () => {
        component.showQuarterlyGoals = true;
        component.showTagManagement = true;
        component.showAnalysis = true;

        component.toggleYearlyGoals();

        expect(component.showYearlyGoals).toBe(true);
        expect(component.showQuarterlyGoals).toBe(false);
        expect(component.showTagManagement).toBe(false);
        expect(component.showAnalysis).toBe(false);
      });

      it('should toggle yearly goals view off when called again', () => {
        component.toggleYearlyGoals();
        expect(component.showYearlyGoals).toBe(true);

        component.toggleYearlyGoals();
        expect(component.showYearlyGoals).toBe(false);
      });
    });

    describe('toggleQuarterlyGoals', () => {
      it('should show quarterly goals and hide other views', () => {
        component.showYearlyGoals = true;
        component.showTagManagement = true;
        component.showAnalysis = true;

        component.toggleQuarterlyGoals();

        expect(component.showQuarterlyGoals).toBe(true);
        expect(component.showYearlyGoals).toBe(false);
        expect(component.showTagManagement).toBe(false);
        expect(component.showAnalysis).toBe(false);
      });

      it('should toggle quarterly goals view off when called again', () => {
        component.toggleQuarterlyGoals();
        expect(component.showQuarterlyGoals).toBe(true);

        component.toggleQuarterlyGoals();
        expect(component.showQuarterlyGoals).toBe(false);
      });
    });

    describe('showDailyTasks', () => {
      it('should hide all other views', () => {
        component.showYearlyGoals = true;
        component.showQuarterlyGoals = true;
        component.showTagManagement = true;
        component.showAnalysis = true;

        component.showDailyTasks();

        expect(component.showYearlyGoals).toBe(false);
        expect(component.showQuarterlyGoals).toBe(false);
        expect(component.showTagManagement).toBe(false);
        expect(component.showAnalysis).toBe(false);
      });
    });

    describe('toggleTagManagement', () => {
      it('should show tag management and hide other views', () => {
        component.showYearlyGoals = true;
        component.showQuarterlyGoals = true;
        component.showAnalysis = true;

        component.toggleTagManagement();

        expect(component.showTagManagement).toBe(true);
        expect(component.showYearlyGoals).toBe(false);
        expect(component.showQuarterlyGoals).toBe(false);
        expect(component.showAnalysis).toBe(false);
      });

      it('should toggle tag management view off when called again', () => {
        component.toggleTagManagement();
        expect(component.showTagManagement).toBe(true);

        component.toggleTagManagement();
        expect(component.showTagManagement).toBe(false);
      });

      it('should call closeAllTagInputs', () => {
        spyOn(component, 'closeAllTagInputs');
        component.toggleTagManagement();
        expect(component.closeAllTagInputs).toHaveBeenCalled();
      });
    });

    describe('toggleAnalysis', () => {
      it('should show analysis and hide other views', () => {
        component.showYearlyGoals = true;
        component.showQuarterlyGoals = true;
        component.showTagManagement = true;

        component.toggleAnalysis();

        expect(component.showAnalysis).toBe(true);
        expect(component.showYearlyGoals).toBe(false);
        expect(component.showQuarterlyGoals).toBe(false);
        expect(component.showTagManagement).toBe(false);
      });

      it('should toggle analysis view off when called again', () => {
        component.toggleAnalysis();
        expect(component.showAnalysis).toBe(true);

        component.toggleAnalysis();
        expect(component.showAnalysis).toBe(false);
      });

      it('should call closeAllTagInputs', () => {
        spyOn(component, 'closeAllTagInputs');
        component.toggleAnalysis();
        expect(component.closeAllTagInputs).toHaveBeenCalled();
      });
    });
  });

  describe('Tag Management', () => {
    beforeEach(() => {
      // Setup test data with tags
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false, tags: ['survive', 'create'] },
        { id: 2, text: 'Task 2', completed: false, tags: ['survive'] }
      ];
      component.weeklyGoals = [
        { id: 1, text: 'Goal 1', completed: false, tags: ['sharp mind'] }
      ];
      component.quarterlyGoals = [
        { id: 1, text: 'Goal 1', completed: false, tags: ['strong body'] }
      ];
      component.yearlyGoals = [
        { id: 1, text: 'Goal 1', completed: false, tags: ['happy house', 'create'] }
      ];
    });

    describe('getAllTags', () => {
      it('should return all tags from globalTags', () => {
        const tags = component.getAllTags();
        expect(tags).toEqual(['happy house', 'survive', 'strong body', 'sharp mind', 'create']);
      });

      it('should return the correct array', () => {
        const result = component.getAllTags();
        expect(result).toBe(component.globalTags);
      });
    });

    describe('renameTag', () => {
      it('should rename tag in all tasks', () => {
        component.renameTag('survive', 'survival');

        const task1 = component.tasks.find(t => t.id === 1);
        const task2 = component.tasks.find(t => t.id === 2);
        expect(task1?.tags).toContain('survival');
        expect(task1?.tags).not.toContain('survive');
        expect(task2?.tags).toContain('survival');
      });

      it('should rename tag in all goals', () => {
        component.renameTag('create', 'creative');

        const yearlyGoal = component.yearlyGoals.find(g => g.id === 1);
        const task = component.tasks.find(t => t.id === 1);
        expect(yearlyGoal?.tags).toContain('creative');
        expect(task?.tags).toContain('creative');
      });

      it('should update tag in globalTags', () => {
        component.renameTag('survive', 'survival');

        expect(component.globalTags).toContain('survival');
        expect(component.globalTags).not.toContain('survive');
      });

      it('should handle renaming tag that does not exist in globalTags', () => {
        component.renameTag('nonexistent', 'new');
        // Should not throw error
        expect(component.globalTags).not.toContain('new');
      });
    });

    describe('deleteTag', () => {
      it('should remove tag from all tasks', () => {
        component.deleteTag('survive');

        component.tasks.forEach(task => {
          expect(task.tags).not.toContain('survive');
        });
      });

      it('should remove tag from all goals', () => {
        component.deleteTag('create');

        component.tasks.forEach(task => {
          expect(task.tags).not.toContain('create');
        });
        component.yearlyGoals.forEach(goal => {
          expect(goal.tags).not.toContain('create');
        });
      });

      it('should remove tag from globalTags', () => {
        component.deleteTag('survive');

        expect(component.globalTags).not.toContain('survive');
      });

      it('should handle deleting tag that does not exist', () => {
        const originalLength = component.globalTags.length;
        component.deleteTag('nonexistent');
        expect(component.globalTags.length).toBe(originalLength);
      });
    });

    describe('onTagAdded', () => {
      it('should add valid tag to globalTags', () => {
        const initialLength = component.globalTags.length;
        component.onTagAdded('newtag');

        expect(component.globalTags).toContain('newtag');
        expect(component.globalTags.length).toBe(initialLength + 1);
      });

      it('should not add tag longer than 15 characters', () => {
        const initialLength = component.globalTags.length;
        component.onTagAdded('thisisaverylongtag');

        expect(component.globalTags.length).toBe(initialLength);
      });

      it('should not add duplicate tags', () => {
        const initialLength = component.globalTags.length;
        component.onTagAdded('survive');

        expect(component.globalTags.length).toBe(initialLength);
      });

      it('should not add empty tag', () => {
        const initialLength = component.globalTags.length;
        component.onTagAdded('');

        expect(component.globalTags.length).toBe(initialLength);
      });
    });

    describe('onTagRenamed', () => {
      it('should call renameTag with correct parameters', () => {
        spyOn(component, 'renameTag');
        const event = { oldTag: 'survive', newTag: 'survival' };

        component.onTagRenamed(event);

        expect(component.renameTag).toHaveBeenCalledWith('survive', 'survival');
      });
    });

    describe('onTagDeleted', () => {
      it('should call deleteTag with correct parameter', () => {
        spyOn(component, 'deleteTag');

        component.onTagDeleted('survive');

        expect(component.deleteTag).toHaveBeenCalledWith('survive');
      });
    });
  });

  describe('Other Functionality', () => {
    describe('logout', () => {
      it('should call authService.logout', () => {
        component.logout();

        expect(mockAuthService.logout).toHaveBeenCalled();
      });

      it('should navigate to /login', () => {
        component.logout();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      });
    });

    describe('closeAllTagInputs', () => {
      beforeEach(() => {
        component.tasks = [
          { id: 1, text: 'Task 1', completed: false, tags: [], showTagInput: true },
          { id: 2, text: 'Task 2', completed: false, tags: [], showTagInput: true }
        ];
        component.weeklyGoals = [
          { id: 1, text: 'Goal 1', completed: false, tags: [], showTagInput: true }
        ];
        component.quarterlyGoals = [
          { id: 1, text: 'Goal 1', completed: false, tags: [], showTagInput: true }
        ];
        component.yearlyGoals = [
          { id: 1, text: 'Goal 1', completed: false, tags: [], showTagInput: true }
        ];
      });

      it('should close tag inputs in all tasks', () => {
        component.closeAllTagInputs();

        component.tasks.forEach(task => {
          expect(task.showTagInput).toBe(false);
        });
      });

      it('should close tag inputs in all goals', () => {
        component.closeAllTagInputs();

        component.weeklyGoals.forEach(goal => {
          expect(goal.showTagInput).toBe(false);
        });
        component.quarterlyGoals.forEach(goal => {
          expect(goal.showTagInput).toBe(false);
        });
        component.yearlyGoals.forEach(goal => {
          expect(goal.showTagInput).toBe(false);
        });
      });
    });
  });

  describe('Initial State', () => {
    it('should have correct title', () => {
      expect(component.title).toBe('Placeholder Planner Title');
    });

    it('should have default global tags', () => {
      expect(component.globalTags).toEqual(['happy house', 'survive', 'strong body', 'sharp mind', 'create']);
    });

    it('should have 6 mock tasks', () => {
      expect(component.tasks.length).toBe(6);
    });

    it('should have mock weekly goals across all periods', () => {
      expect(component.allWeeklyGoals.length).toBeGreaterThanOrEqual(5);
    });

    it('should have mock quarterly goals across all periods', () => {
      expect(component.allQuarterlyGoals.length).toBeGreaterThanOrEqual(1);
    });

    it('should have mock yearly goals across all periods', () => {
      expect(component.allYearlyGoals.length).toBeGreaterThanOrEqual(1);
    });

    it('should initialize all period offsets to 0', () => {
      expect(component.periodOffsets.day).toBe(0);
      expect(component.periodOffsets.week).toBe(0);
      expect(component.periodOffsets.quarter).toBe(0);
      expect(component.periodOffsets.year).toBe(0);
    });

    it('should initialize all period keys', () => {
      expect(component.currentPeriodKeys.day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(component.currentPeriodKeys.week).toMatch(/^\d{4}-W\d{2}$/);
      expect(component.currentPeriodKeys.quarter).toMatch(/^\d{4}-Q[1-4]$/);
      expect(component.currentPeriodKeys.year).toMatch(/^\d{4}$/);
    });

    it('should set active scope to week by default', () => {
      expect(component.activeScope).toBe('week');
    });
  });

  describe('Time Navigation', () => {
    describe('navigatePeriod', () => {
      it('should increment offset for active scope', () => {
        component.activeScope = 'day';
        component.navigatePeriod(1);

        expect(component.periodOffsets.day).toBe(1);
      });

      it('should decrement offset when navigating backward', () => {
        component.activeScope = 'week';
        component.navigatePeriod(-1);

        expect(component.periodOffsets.week).toBe(-1);
      });

      it('should update period keys after navigation', () => {
        const oldDayKey = component.currentPeriodKeys.day;
        component.activeScope = 'day';
        component.navigatePeriod(1);

        expect(component.currentPeriodKeys.day).not.toBe(oldDayKey);
      });

      it('should trigger change detection', () => {
        spyOn(component['cdr'], 'detectChanges');
        component.navigatePeriod(1);

        expect(component['cdr'].detectChanges).toHaveBeenCalled();
      });

      describe('day-week synchronization', () => {
        it('should sync week when navigating days into a different week', () => {
          component.activeScope = 'day';
          const initialWeekOffset = component.periodOffsets.week;

          // Navigate 7 days forward (into next week)
          for (let i = 0; i < 7; i++) {
            component.navigatePeriod(1);
          }

          // Week offset should have changed
          expect(component.periodOffsets.week).not.toBe(initialWeekOffset);
        });

        it('should sync day to Monday when navigating weeks', () => {
          component.activeScope = 'week';
          component.navigatePeriod(1);

          // Day should now be Monday of the new week
          const monday = component['periodService'].getMondayForWeek(component.currentPeriodKeys.week);
          expect(component.currentPeriodKeys.day).toBe(monday);
        });

        it('should keep day and week aligned when navigating days', () => {
          component.activeScope = 'day';
          component.navigatePeriod(1);

          // Get the week for the current day
          const weekForDay = component['periodService'].getWeekKeyForDate(component.currentPeriodKeys.day);
          expect(component.currentPeriodKeys.week).toBe(weekForDay);
        });

        it('should keep day and week aligned when navigating weeks', () => {
          component.activeScope = 'week';
          component.navigatePeriod(1);

          // Day should be Monday of the current week
          const monday = component['periodService'].getMondayForWeek(component.currentPeriodKeys.week);
          expect(component.currentPeriodKeys.day).toBe(monday);
        });
      });
    });

    describe('jumpToToday', () => {
      it('should reset all offsets to 0', () => {
        component.periodOffsets.day = 5;
        component.periodOffsets.week = 2;
        component.periodOffsets.quarter = 1;
        component.periodOffsets.year = 1;

        component.jumpToToday();

        expect(component.periodOffsets.day).toBe(0);
        expect(component.periodOffsets.week).toBe(0);
        expect(component.periodOffsets.quarter).toBe(0);
        expect(component.periodOffsets.year).toBe(0);
      });

      it('should update all period keys', () => {
        component.activeScope = 'week';
        component.navigatePeriod(3);

        const currentDay = component['periodService'].getCurrentPeriodKey('day');
        const currentWeek = component['periodService'].getCurrentPeriodKey('week');

        component.jumpToToday();

        expect(component.currentPeriodKeys.day).toBe(currentDay);
        expect(component.currentPeriodKeys.week).toBe(currentWeek);
      });

      it('should trigger change detection', () => {
        spyOn(component['cdr'], 'detectChanges');
        component.jumpToToday();

        expect(component['cdr'].detectChanges).toHaveBeenCalled();
      });

      it('should resync day and week to current period', () => {
        component.activeScope = 'week';
        component.navigatePeriod(5);

        component.jumpToToday();

        const currentDay = component['periodService'].getCurrentPeriodKey('day');
        const currentWeek = component['periodService'].getCurrentPeriodKey('week');

        expect(component.currentPeriodKeys.day).toBe(currentDay);
        expect(component.currentPeriodKeys.week).toBe(currentWeek);
      });
    });

    describe('setActiveScope', () => {
      it('should change the active scope', () => {
        component.activeScope = 'day';
        component.setActiveScope('week');

        expect(component.activeScope).toBe('week');
      });

      it('should sync week to day when switching to day scope', () => {
        component.activeScope = 'week';
        component.navigatePeriod(1);

        component.setActiveScope('day');

        const weekForDay = component['periodService'].getWeekKeyForDate(component.currentPeriodKeys.day);
        expect(component.currentPeriodKeys.week).toBe(weekForDay);
      });

      it('should sync day to Monday when switching to week scope', () => {
        component.activeScope = 'day';
        component.navigatePeriod(3);

        component.setActiveScope('week');

        const monday = component['periodService'].getMondayForWeek(component.currentPeriodKeys.week);
        expect(component.currentPeriodKeys.day).toBe(monday);
      });

      it('should show daily tasks view when switching to day or week', () => {
        component.showQuarterlyGoals = true;
        component.setActiveScope('day');

        expect(component.showYearlyGoals).toBe(false);
        expect(component.showQuarterlyGoals).toBe(false);
      });

      it('should show quarterly goals when switching to quarter scope', () => {
        component.setActiveScope('quarter');

        expect(component.showQuarterlyGoals).toBe(true);
        expect(component.showYearlyGoals).toBe(false);
      });

      it('should show yearly goals when switching to year scope', () => {
        component.setActiveScope('year');

        expect(component.showYearlyGoals).toBe(true);
        expect(component.showQuarterlyGoals).toBe(false);
      });
    });

    describe('period state checkers', () => {
      it('isAtCurrentPeriod should return true for offset 0', () => {
        expect(component.isAtCurrentPeriod('day')).toBe(true);
        expect(component.isAtCurrentPeriod('week')).toBe(true);
      });

      it('isAtCurrentPeriod should return false for non-zero offset', () => {
        component.periodOffsets.day = 1;
        expect(component.isAtCurrentPeriod('day')).toBe(false);
      });

      it('isPastPeriod should return true for negative offset', () => {
        component.activeScope = 'week';
        component.navigatePeriod(-1);

        expect(component.isPastPeriod()).toBe(true);
      });

      it('isPastPeriod should return false for zero offset', () => {
        expect(component.isPastPeriod()).toBe(false);
      });

      it('isFuturePeriod should return true for positive offset', () => {
        component.activeScope = 'week';
        component.navigatePeriod(1);

        expect(component.isFuturePeriod()).toBe(true);
      });

      it('isFuturePeriod should return false for zero offset', () => {
        expect(component.isFuturePeriod()).toBe(false);
      });
    });

    describe('period label formatters', () => {
      it('getDayLabel should return formatted day label', () => {
        const label = component.getDayLabel();
        expect(label).toMatch(/^[A-Z][a-z]+, [A-Z][a-z]+ \d{1,2}$/);
      });

      it('getWeekLabel should return formatted week label', () => {
        const label = component.getWeekLabel();
        expect(label).toMatch(/^Week of [A-Z][a-z]+ \d{1,2}$/);
      });

      it('getQuarterLabel should return formatted quarter label', () => {
        const label = component.getQuarterLabel();
        expect(label).toMatch(/^Quarter [1-4]$/);
      });

      it('getYearLabel should return formatted year label', () => {
        const label = component.getYearLabel();
        expect(label).toMatch(/^\d{4} Goals$/);
      });

      it('getCurrentPeriodLabel should return label for active scope', () => {
        component.activeScope = 'week';
        const label = component.getCurrentPeriodLabel();
        expect(label).toMatch(/^Week of [A-Z][a-z]+ \d{1,2}$/);
      });
    });

    describe('getTabClasses', () => {
      it('should return active classes for active scope', () => {
        component.activeScope = 'week';
        const classes = component.getTabClasses('week');

        expect(classes).toContain('bg-indigo-500');
        expect(classes).toContain('text-white');
      });

      it('should return inactive classes for non-active scope', () => {
        component.activeScope = 'week';
        const classes = component.getTabClasses('day');

        expect(classes).toContain('bg-violet-100');
        expect(classes).toContain('text-indigo-900');
      });

      it('should use purple for quarter scope when active', () => {
        component.activeScope = 'quarter';
        const classes = component.getTabClasses('quarter');

        expect(classes).toContain('bg-purple-500');
      });

      it('should use violet for year scope when active', () => {
        component.activeScope = 'year';
        const classes = component.getTabClasses('year');

        expect(classes).toContain('bg-violet-500');
      });
    });
  });
});
