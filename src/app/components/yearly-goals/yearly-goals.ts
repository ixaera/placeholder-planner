import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Goal } from '../../models/task.interface';

@Component({
  selector: 'app-yearly-goals',
  imports: [CommonModule, FormsModule],
  templateUrl: './yearly-goals.html',
  styleUrl: './yearly-goals.css'
})
export class YearlyGoalsComponent {
  @Input() goals: Goal[] = [];
  @Input() availableTags: string[] = [];
  @Input() currentPeriodKey: string = '';   // NEW
  @Input() isPast: boolean = false;         // NEW
  @Input() isFuture: boolean = false;       // NEW

  newYearlyGoal = '';
  newTagInput: { [goalId: number]: string } = {};
  showTagDropdown: { [goalId: number]: boolean } = {};

  addYearlyGoal(): void {
    if (this.newYearlyGoal.trim()) {
      const newGoal: Goal = {
        id: Date.now(), // Better ID generation
        text: this.newYearlyGoal.trim(),
        completed: false,
        tags: [],
        showTagInput: false,
        scope: 'year',                       // NEW
        periodKey: this.currentPeriodKey,    // NEW
        createdAt: new Date().toISOString(), // NEW
        updatedAt: new Date().toISOString()  // NEW
      };
      this.goals.push(newGoal);
      this.newYearlyGoal = '';
    }
  }

  showTagInput(goalId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.goals.forEach(goal => {
      if (goal.id !== goalId && goal.showTagInput) {
        goal.showTagInput = false;
        this.newTagInput[goal.id] = '';
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
    const searchTerm = this.newTagInput[goalId]?.toLowerCase() || '';
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
        this.newTagInput[goalId] = '';
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

  addTagToGoal(goalId: number): void {
    const filteredTags = this.getFilteredTags(goalId);
    if (filteredTags.length > 0) {
      this.selectTag(goalId, filteredTags[0]);
    }
  }

  removeTag(goalId: number, tagIndex: number): void {
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
