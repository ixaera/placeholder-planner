import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-daily-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-tasks.html',
  styleUrl: './daily-tasks.css'
})
export class DailyTasksComponent {
  @Input() tasks: Task[] = [];

  newTask = '';
  newTaskTagInput: { [taskId: number]: string } = {};

  addTask(): void {
    if (this.newTask.trim()) {
      const newTask: Task = {
        id: this.tasks.length + 1,
        text: this.newTask.trim(),
        completed: false,
        tags: [],
        showTagInput: false
      };
      this.tasks.push(newTask);
      this.newTask = '';
    }
  }

  showTaskTagInput(taskId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.tasks.forEach(task => {
      if (task.id !== taskId && task.showTagInput) {
        task.showTagInput = false;
        this.newTaskTagInput[task.id] = '';
      }
    });

    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.showTagInput = true;
    }
  }

  addTagToTask(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    const tagValue = this.newTaskTagInput[taskId]?.trim();

    if (task && tagValue) {
      if (!task.tags) {
        task.tags = [];
      }

      if (task.tags.length < 5 && tagValue.length <= 15) {
        task.tags.push(tagValue);
        this.newTaskTagInput[taskId] = '';
      }
    }
  }

  removeTaskTag(taskId: number, tagIndex: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && task.tags) {
      task.tags.splice(tagIndex, 1);
    }
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  closeAllTagInputs(): void {
    this.tasks.forEach(task => {
      task.showTagInput = false;
    });
  }
}
