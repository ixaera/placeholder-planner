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

  newWeeklyGoal = '';
  newWeeklyTagInput: { [goalId: number]: string } = {};

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
      }
    });

    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.showTagInput = true;
    }
  }

  addTagToWeeklyGoal(goalId: number): void {
    const goal = this.goals.find(g => g.id === goalId);
    const tagValue = this.newWeeklyTagInput[goalId]?.trim();

    if (goal && tagValue) {
      if (!goal.tags) {
        goal.tags = [];
      }

      if (goal.tags.length < 5 && tagValue.length <= 15) {
        goal.tags.push(tagValue);
        this.newWeeklyTagInput[goalId] = '';
      }
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
