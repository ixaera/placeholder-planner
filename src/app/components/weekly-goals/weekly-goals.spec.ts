import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { WeeklyGoalsComponent } from './weekly-goals';
import { Goal } from '../../models/task.interface';

describe('WeeklyGoalsComponent', () => {
  let component: WeeklyGoalsComponent;
  let fixture: ComponentFixture<WeeklyGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyGoalsComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyGoalsComponent);
    component = fixture.componentInstance;
    component.availableTags = ['happy house', 'survive', 'strong body', 'sharp mind', 'create'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Goal Creation', () => {
    it('should add goal with incremental ID', () => {
      component.goals = [
        { id: 1, text: 'Goal 1', completed: false, tags: [] }
      ];
      component.newWeeklyGoal = 'New Goal';

      component.addWeeklyGoal();

      expect(component.goals.length).toBe(2);
      expect(component.goals[1].id).toBe(2);
      expect(component.goals[1].text).toBe('New Goal');
    });

    it('should trim whitespace from goal text', () => {
      component.newWeeklyGoal = '  Goal with spaces  ';

      component.addWeeklyGoal();

      expect(component.goals[0].text).toBe('Goal with spaces');
    });

    it('should ignore empty input', () => {
      component.newWeeklyGoal = '';

      component.addWeeklyGoal();

      expect(component.goals.length).toBe(0);
    });

    it('should ignore whitespace-only input', () => {
      component.newWeeklyGoal = '   ';

      component.addWeeklyGoal();

      expect(component.goals.length).toBe(0);
    });

    it('should create goal with default properties', () => {
      component.newWeeklyGoal = 'New Goal';

      component.addWeeklyGoal();

      expect(component.goals[0].completed).toBe(false);
      expect(component.goals[0].tags).toEqual([]);
      expect(component.goals[0].showTagInput).toBe(false);
    });

    it('should clear input after adding goal', () => {
      component.newWeeklyGoal = 'New Goal';

      component.addWeeklyGoal();

      expect(component.newWeeklyGoal).toBe('');
    });
  });

  describe('Tag Filtering', () => {
    beforeEach(() => {
      component.goals = [
        { id: 1, text: 'Goal 1', completed: false, tags: ['survive', 'create'] }
      ];
    });

    it('should return all available tags when no search term', () => {
      const filtered = component.getFilteredTags(1);

      expect(filtered).toEqual(['happy house', 'strong body', 'sharp mind']);
    });

    it('should filter tags based on search term', () => {
      component.newWeeklyTagInput[1] = 'body';

      const filtered = component.getFilteredTags(1);

      expect(filtered).toEqual(['strong body']);
    });

    it('should be case-insensitive', () => {
      component.newWeeklyTagInput[1] = 'STRONG';

      const filtered = component.getFilteredTags(1);

      expect(filtered).toEqual(['strong body']);
    });

    it('should exclude already-added tags', () => {
      component.newWeeklyTagInput[1] = '';

      const filtered = component.getFilteredTags(1);

      expect(filtered).not.toContain('survive');
      expect(filtered).not.toContain('create');
    });

    it('should return empty array when no matches', () => {
      component.newWeeklyTagInput[1] = 'nonexistent';

      const filtered = component.getFilteredTags(1);

      expect(filtered).toEqual([]);
    });

    it('should handle goal without tags array', () => {
      component.goals = [
        { id: 2, text: 'Goal 2', completed: false, tags: undefined as any }
      ];

      const filtered = component.getFilteredTags(2);

      expect(filtered.length).toBe(5);
    });
  });

  describe('Tag Selection', () => {
    beforeEach(() => {
      component.goals = [
        { id: 1, text: 'Goal 1', completed: false, tags: [] }
      ];
    });

    it('should add tag to goal', () => {
      component.selectTag(1, 'survive');

      expect(component.goals[0].tags).toContain('survive');
    });

    it('should clear tag input after selection', () => {
      component.newWeeklyTagInput[1] = 'surv';

      component.selectTag(1, 'survive');

      expect(component.newWeeklyTagInput[1]).toBe('');
    });

    it('should close dropdown after selection', () => {
      component.showTagDropdown[1] = true;

      component.selectTag(1, 'survive');

      expect(component.showTagDropdown[1]).toBe(false);
    });

    it('should enforce max 5 tags limit', () => {
      component.goals[0].tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];

      component.selectTag(1, 'survive');

      expect(component.goals[0].tags.length).toBe(5);
      expect(component.goals[0].tags).not.toContain('survive');
    });

    it('should prevent duplicate tags', () => {
      component.goals[0].tags = ['survive'];

      component.selectTag(1, 'survive');

      expect(component.goals[0].tags.length).toBe(1);
    });

    it('should initialize tags array if undefined', () => {
      component.goals[0].tags = undefined as any;

      component.selectTag(1, 'survive');

      expect(component.goals[0].tags).toEqual(['survive']);
    });

    it('should handle selecting tag for non-existent goal', () => {
      expect(() => component.selectTag(999, 'survive')).not.toThrow();
    });
  });

  describe('Tag Input Management', () => {
    beforeEach(() => {
      component.goals = [
        { id: 1, text: 'Goal 1', completed: false, tags: [], showTagInput: false },
        { id: 2, text: 'Goal 2', completed: false, tags: [], showTagInput: false }
      ];
    });

    it('should show tag input for specific goal', () => {
      component.showWeeklyTagInput(1);

      expect(component.goals[0].showTagInput).toBe(true);
      expect(component.showTagDropdown[1]).toBe(true);
    });

    it('should close other tag inputs when opening new one', () => {
      component.goals[0].showTagInput = true;
      component.showTagDropdown[1] = true;

      component.showWeeklyTagInput(2);

      expect(component.goals[0].showTagInput).toBe(false);
      expect(component.showTagDropdown[1]).toBe(false);
      expect(component.goals[1].showTagInput).toBe(true);
      expect(component.showTagDropdown[2]).toBe(true);
    });

    it('should clear tag input when closing', () => {
      component.goals[0].showTagInput = true;
      component.newWeeklyTagInput[1] = 'test';

      component.showWeeklyTagInput(2);

      expect(component.newWeeklyTagInput[1]).toBe('');
    });

    it('should handle event parameter', () => {
      const mockEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation')
      } as any;

      component.showWeeklyTagInput(1, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should work without event parameter', () => {
      expect(() => component.showWeeklyTagInput(1)).not.toThrow();
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

  describe('Add Tag to Goal', () => {
    beforeEach(() => {
      component.goals = [
        { id: 1, text: 'Goal 1', completed: false, tags: [] }
      ];
    });

    it('should add first filtered tag when called', () => {
      component.newWeeklyTagInput[1] = 'surv';

      component.addTagToWeeklyGoal(1);

      expect(component.goals[0].tags).toContain('survive');
    });

    it('should not add tag if no filtered tags available', () => {
      component.newWeeklyTagInput[1] = 'nonexistent';

      component.addTagToWeeklyGoal(1);

      expect(component.goals[0].tags?.length).toBe(0);
    });
  });

  describe('Tag Removal', () => {
    beforeEach(() => {
      component.goals = [
        { id: 1, text: 'Goal 1', completed: false, tags: ['survive', 'create', 'happy house'] }
      ];
    });

    it('should remove tag by index', () => {
      component.removeWeeklyTag(1, 1);

      expect(component.goals[0].tags).toEqual(['survive', 'happy house']);
    });

    it('should remove first tag', () => {
      component.removeWeeklyTag(1, 0);

      expect(component.goals[0].tags).toEqual(['create', 'happy house']);
    });

    it('should remove last tag', () => {
      component.removeWeeklyTag(1, 2);

      expect(component.goals[0].tags).toEqual(['survive', 'create']);
    });

    it('should handle removing from goal without tags', () => {
      component.goals[0].tags = undefined as any;

      expect(() => component.removeWeeklyTag(1, 0)).not.toThrow();
    });

    it('should handle non-existent goal', () => {
      expect(() => component.removeWeeklyTag(999, 0)).not.toThrow();
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
      component.goals = [
        { id: 1, text: 'Goal 1', completed: false, tags: [], showTagInput: true },
        { id: 2, text: 'Goal 2', completed: false, tags: [], showTagInput: true },
        { id: 3, text: 'Goal 3', completed: false, tags: [], showTagInput: false }
      ];
    });

    it('should close all tag inputs', () => {
      component.closeAllTagInputs();

      component.goals.forEach(goal => {
        expect(goal.showTagInput).toBe(false);
      });
    });

    it('should handle empty goals array', () => {
      component.goals = [];

      expect(() => component.closeAllTagInputs()).not.toThrow();
    });
  });

  describe('Initial State', () => {
    it('should initialize with empty newWeeklyGoal', () => {
      expect(component.newWeeklyGoal).toBe('');
    });

    it('should initialize with empty goals array', () => {
      const newComponent = new WeeklyGoalsComponent();
      expect(newComponent.goals).toEqual([]);
    });

    it('should initialize with empty availableTags array', () => {
      const newComponent = new WeeklyGoalsComponent();
      expect(newComponent.availableTags).toEqual([]);
    });

    it('should initialize with empty newWeeklyTagInput object', () => {
      expect(component.newWeeklyTagInput).toEqual({});
    });

    it('should initialize with empty showTagDropdown object', () => {
      expect(component.showTagDropdown).toEqual({});
    });
  });
});
