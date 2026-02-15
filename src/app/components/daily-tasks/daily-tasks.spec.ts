import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DailyTasksComponent } from './daily-tasks';
import { Task } from '../../models/task.interface';

describe('DailyTasksComponent', () => {
  let component: DailyTasksComponent;
  let fixture: ComponentFixture<DailyTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyTasksComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyTasksComponent);
    component = fixture.componentInstance;
    component.availableTags = ['happy house', 'survive', 'strong body', 'sharp mind', 'create'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Task Creation', () => {
    it('should add task with timestamp-based ID', () => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false, tags: [] }
      ];
      component.newTask = 'New Task';

      const beforeTime = Date.now();
      component.addTask();
      const afterTime = Date.now();

      expect(component.tasks.length).toBe(2);
      expect(component.tasks[1].id).toBeGreaterThanOrEqual(beforeTime);
      expect(component.tasks[1].id).toBeLessThanOrEqual(afterTime);
      expect(component.tasks[1].text).toBe('New Task');
    });

    it('should trim whitespace from task text', () => {
      component.newTask = '  Task with spaces  ';

      component.addTask();

      expect(component.tasks[0].text).toBe('Task with spaces');
    });

    it('should ignore empty input', () => {
      component.newTask = '';

      component.addTask();

      expect(component.tasks.length).toBe(0);
    });

    it('should ignore whitespace-only input', () => {
      component.newTask = '   ';

      component.addTask();

      expect(component.tasks.length).toBe(0);
    });

    it('should create task with default properties', () => {
      component.newTask = 'New Task';

      component.addTask();

      expect(component.tasks[0].completed).toBe(false);
      expect(component.tasks[0].tags).toEqual([]);
      expect(component.tasks[0].showTagInput).toBe(false);
    });

    it('should clear input after adding task', () => {
      component.newTask = 'New Task';

      component.addTask();

      expect(component.newTask).toBe('');
    });
  });

  describe('Tag Filtering', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false, tags: ['survive', 'create'] }
      ];
    });

    it('should return all available tags when no search term', () => {
      const filtered = component.getFilteredTags(1);

      expect(filtered).toEqual(['happy house', 'strong body', 'sharp mind']);
    });

    it('should filter tags based on search term', () => {
      component.newTaskTagInput[1] = 'body';

      const filtered = component.getFilteredTags(1);

      expect(filtered).toEqual(['strong body']);
    });

    it('should be case-insensitive', () => {
      component.newTaskTagInput[1] = 'STRONG';

      const filtered = component.getFilteredTags(1);

      expect(filtered).toEqual(['strong body']);
    });

    it('should exclude already-added tags', () => {
      component.newTaskTagInput[1] = '';

      const filtered = component.getFilteredTags(1);

      expect(filtered).not.toContain('survive');
      expect(filtered).not.toContain('create');
    });

    it('should return empty array when no matches', () => {
      component.newTaskTagInput[1] = 'nonexistent';

      const filtered = component.getFilteredTags(1);

      expect(filtered).toEqual([]);
    });

    it('should handle task without tags array', () => {
      component.tasks = [
        { id: 2, text: 'Task 2', completed: false, tags: undefined as any }
      ];

      const filtered = component.getFilteredTags(2);

      expect(filtered.length).toBe(5);
    });
  });

  describe('Tag Selection', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false, tags: [] }
      ];
    });

    it('should add tag to task', () => {
      component.selectTag(1, 'survive');

      expect(component.tasks[0].tags).toContain('survive');
    });

    it('should clear tag input after selection', () => {
      component.newTaskTagInput[1] = 'surv';

      component.selectTag(1, 'survive');

      expect(component.newTaskTagInput[1]).toBe('');
    });

    it('should close dropdown after selection', () => {
      component.showTagDropdown[1] = true;

      component.selectTag(1, 'survive');

      expect(component.showTagDropdown[1]).toBe(false);
    });

    it('should enforce max 5 tags limit', () => {
      component.tasks[0].tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];

      component.selectTag(1, 'survive');

      expect(component.tasks[0].tags.length).toBe(5);
      expect(component.tasks[0].tags).not.toContain('survive');
    });

    it('should prevent duplicate tags', () => {
      component.tasks[0].tags = ['survive'];

      component.selectTag(1, 'survive');

      expect(component.tasks[0].tags.length).toBe(1);
    });

    it('should initialize tags array if undefined', () => {
      component.tasks[0].tags = undefined as any;

      component.selectTag(1, 'survive');

      expect(component.tasks[0].tags).toEqual(['survive']);
    });

    it('should handle selecting tag for non-existent task', () => {
      expect(() => component.selectTag(999, 'survive')).not.toThrow();
    });
  });

  describe('Tag Input Management', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false, tags: [], showTagInput: false },
        { id: 2, text: 'Task 2', completed: false, tags: [], showTagInput: false }
      ];
    });

    it('should show tag input for specific task', () => {
      component.showTaskTagInput(1);

      expect(component.tasks[0].showTagInput).toBe(true);
      expect(component.showTagDropdown[1]).toBe(true);
    });

    it('should close other tag inputs when opening new one', () => {
      component.tasks[0].showTagInput = true;
      component.showTagDropdown[1] = true;

      component.showTaskTagInput(2);

      expect(component.tasks[0].showTagInput).toBe(false);
      expect(component.showTagDropdown[1]).toBe(false);
      expect(component.tasks[1].showTagInput).toBe(true);
      expect(component.showTagDropdown[2]).toBe(true);
    });

    it('should clear tag input when closing', () => {
      component.tasks[0].showTagInput = true;
      component.newTaskTagInput[1] = 'test';

      component.showTaskTagInput(2);

      expect(component.newTaskTagInput[1]).toBe('');
    });

    it('should handle event parameter', () => {
      const mockEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as any;

      component.showTaskTagInput(1, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should work without event parameter', () => {
      expect(() => component.showTaskTagInput(1)).not.toThrow();
    });
  });

  describe('Tag Input Events', () => {
    it('should show dropdown on focus', () => {
      component.showTagDropdown[1] = false;

      component.onTagInputFocus(1);

      expect(component.showTagDropdown[1]).toBe(true);
    });

    it('should show dropdown on input change', () => {
      component.showTagDropdown[1] = false;

      component.onTagInputChange(1);

      expect(component.showTagDropdown[1]).toBe(true);
    });
  });

  describe('Add Tag to Task', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false, tags: [] }
      ];
    });

    it('should add first filtered tag when called', () => {
      component.newTaskTagInput[1] = 'surv';

      component.addTagToTask(1);

      expect(component.tasks[0].tags).toContain('survive');
    });

    it('should not add tag if no filtered tags available', () => {
      component.newTaskTagInput[1] = 'nonexistent';

      component.addTagToTask(1);

      expect(component.tasks[0].tags?.length).toBe(0);
    });
  });

  describe('Tag Removal', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false, tags: ['survive', 'create', 'happy house'] }
      ];
    });

    it('should remove tag by index', () => {
      component.removeTaskTag(1, 1);

      expect(component.tasks[0].tags).toEqual(['survive', 'happy house']);
    });

    it('should remove first tag', () => {
      component.removeTaskTag(1, 0);

      expect(component.tasks[0].tags).toEqual(['create', 'happy house']);
    });

    it('should remove last tag', () => {
      component.removeTaskTag(1, 2);

      expect(component.tasks[0].tags).toEqual(['survive', 'create']);
    });

    it('should handle removing from task without tags', () => {
      component.tasks[0].tags = undefined as any;

      expect(() => component.removeTaskTag(1, 0)).not.toThrow();
    });

    it('should handle non-existent task', () => {
      expect(() => component.removeTaskTag(999, 0)).not.toThrow();
    });
  });

  describe('Event Handling', () => {
    it('should stop event propagation', () => {
      const mockEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as any;

      component.stopPropagation(mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Close All Tag Inputs', () => {
    beforeEach(() => {
      component.tasks = [
        { id: 1, text: 'Task 1', completed: false, tags: [], showTagInput: true },
        { id: 2, text: 'Task 2', completed: false, tags: [], showTagInput: true },
        { id: 3, text: 'Task 3', completed: false, tags: [], showTagInput: false }
      ];
    });

    it('should close all tag inputs', () => {
      component.closeAllTagInputs();

      component.tasks.forEach(task => {
        expect(task.showTagInput).toBe(false);
      });
    });

    it('should handle empty tasks array', () => {
      component.tasks = [];

      expect(() => component.closeAllTagInputs()).not.toThrow();
    });
  });

  describe('Initial State', () => {
    it('should initialize with empty newTask', () => {
      expect(component.newTask).toBe('');
    });

    it('should initialize with empty tasks array', () => {
      const newComponent = new DailyTasksComponent();
      expect(newComponent.tasks).toEqual([]);
    });

    it('should initialize with empty availableTags array', () => {
      const newComponent = new DailyTasksComponent();
      expect(newComponent.availableTags).toEqual([]);
    });

    it('should initialize with empty newTaskTagInput object', () => {
      expect(component.newTaskTagInput).toEqual({});
    });

    it('should initialize with empty showTagDropdown object', () => {
      expect(component.showTagDropdown).toEqual({});
    });
  });
});
