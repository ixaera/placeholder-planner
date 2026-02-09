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
  @Input() availableTags: string[] = [];

  newTask = '';
  newTaskTagInput: { [taskId: number]: string } = {};
  showTagDropdown: { [taskId: number]: boolean } = {};

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
        this.showTagDropdown[task.id] = false;
      }
    });

    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.showTagInput = true;
      this.showTagDropdown[taskId] = true;
    }
  }

  getFilteredTags(taskId: number): string[] {
    const task = this.tasks.find(t => t.id === taskId);
    const searchTerm = this.newTaskTagInput[taskId]?.toLowerCase() || '';
    const taskTags = task?.tags || [];

    return this.availableTags.filter(tag =>
      !taskTags.includes(tag) &&
      tag.toLowerCase().includes(searchTerm)
    );
  }

  selectTag(taskId: number, tag: string): void {
    const task = this.tasks.find(t => t.id === taskId);

    if (task) {
      if (!task.tags) {
        task.tags = [];
      }

      if (task.tags.length < 5 && !task.tags.includes(tag)) {
        task.tags.push(tag);
        this.newTaskTagInput[taskId] = '';
        this.showTagDropdown[taskId] = false;
      }
    }
  }

  onTagInputFocus(taskId: number): void {
    this.showTagDropdown[taskId] = true;
  }

  onTagInputChange(taskId: number): void {
    this.showTagDropdown[taskId] = true;
  }

  addTagToTask(taskId: number): void {
    const filteredTags = this.getFilteredTags(taskId);
    if (filteredTags.length > 0) {
      this.selectTag(taskId, filteredTags[0]);
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
