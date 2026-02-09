import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
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
        { provide: Router, useValue: mockRouter }
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

    it('should have 5 mock weekly goals', () => {
      expect(component.weeklyGoals.length).toBe(5);
    });

    it('should have 5 mock quarterly goals', () => {
      expect(component.quarterlyGoals.length).toBe(5);
    });

    it('should have 5 mock yearly goals', () => {
      expect(component.yearlyGoals.length).toBe(5);
    });
  });
});
