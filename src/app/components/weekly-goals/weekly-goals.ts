import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Goal } from '../../models/task.interface';

@Component({
  selector: 'app-weekly-goals',
  imports: [CommonModule, FormsModule],
  templateUrl: './weekly-goals.html',
  styleUrl: './weekly-goals.css'
})
export class WeeklyGoalsComponent {
  @Input() goals: Goal[] = [];
  @Input() availableTags: string[] = [];

  newWeeklyGoal = '';
  newWeeklyTagInput: { [goalId: number]: string } = {};
  showTagDropdown: { [goalId: number]: boolean } = {};

  addWeeklyGoal(): void {
    if (this.newWeeklyGoal.trim()) {
      const newGoal: Goal = {
        id: this.goals.length + 1,
        text: this.newWeeklyGoal.trim(),
        completed: false,
        tags: [],
        showTagInput: false
      };
      this.goals.push(newGoal);
      this.newWeeklyGoal = '';
    }
  }

  showWeeklyTagInput(goalId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.goals.forEach(goal => {
      if (goal.id !== goalId && goal.showTagInput) {
        goal.showTagInput = false;
        this.newWeeklyTagInput[goal.id] = '';
        this.showTagDropdown[goal.id] = false;
      }
    });

    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.showTagInput = true;
      this.showTagDropdown[goalId] = true;
    }
  }

  getFilteredTags(goalId: number): string[] {
    const goal = this.goals.find(g => g.id === goalId);
    const searchTerm = this.newWeeklyTagInput[goalId]?.toLowerCase() || '';
    const goalTags = goal?.tags || [];

    return this.availableTags.filter(tag =>
      !goalTags.includes(tag) &&
      tag.toLowerCase().includes(searchTerm)
    );
  }

  selectTag(goalId: number, tag: string): void {
    const goal = this.goals.find(g => g.id === goalId);

    if (goal) {
      if (!goal.tags) {
        goal.tags = [];
      }

      if (goal.tags.length < 5 && !goal.tags.includes(tag)) {
        goal.tags.push(tag);
        this.newWeeklyTagInput[goalId] = '';
        this.showTagDropdown[goalId] = false;
      }
    }
  }

  onTagInputFocus(goalId: number): void {
    this.showTagDropdown[goalId] = true;
  }

  onTagInputChange(goalId: number): void {
    this.showTagDropdown[goalId] = true;
  }

  addTagToWeeklyGoal(goalId: number): void {
    const filteredTags = this.getFilteredTags(goalId);
    if (filteredTags.length > 0) {
      this.selectTag(goalId, filteredTags[0]);
    }
  }

  removeWeeklyTag(goalId: number, tagIndex: number): void {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal && goal.tags) {
      goal.tags.splice(tagIndex, 1);
    }
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  closeAllTagInputs(): void {
    this.goals.forEach(goal => {
      goal.showTagInput = false;
    });
  }
}
