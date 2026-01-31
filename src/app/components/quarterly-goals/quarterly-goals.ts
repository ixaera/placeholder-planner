import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Goal } from '../../models/task.interface';

@Component({
  selector: 'app-quarterly-goals',
  imports: [CommonModule, FormsModule],
  templateUrl: './quarterly-goals.html',
  styleUrl: './quarterly-goals.css'
})
export class QuarterlyGoalsComponent {
  @Input() goals: Goal[] = [];

  newQuarterlyGoal = '';
  newQuarterlyTagInput: { [goalId: number]: string } = {};

  addQuarterlyGoal(): void {
    if (this.newQuarterlyGoal.trim()) {
      const newGoal: Goal = {
        id: this.goals.length + 1,
        text: this.newQuarterlyGoal.trim(),
        completed: false,
        tags: [],
        showTagInput: false
      };
      this.goals.push(newGoal);
      this.newQuarterlyGoal = '';
    }
  }

  showQuarterlyTagInput(goalId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.goals.forEach(goal => {
      if (goal.id !== goalId && goal.showTagInput) {
        goal.showTagInput = false;
        this.newQuarterlyTagInput[goal.id] = '';
      }
    });

    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.showTagInput = true;
    }
  }

  addTagToQuarterlyGoal(goalId: number): void {
    const goal = this.goals.find(g => g.id === goalId);
    const tagValue = this.newQuarterlyTagInput[goalId]?.trim();

    if (goal && tagValue) {
      if (!goal.tags) {
        goal.tags = [];
      }

      if (goal.tags.length < 5 && tagValue.length <= 15) {
        goal.tags.push(tagValue);
        this.newQuarterlyTagInput[goalId] = '';
      }
    }
  }

  removeQuarterlyTag(goalId: number, tagIndex: number): void {
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
