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
  @Input() currentDate: string = '';    // NEW: current viewing date
  @Input() isPast: boolean = false;     // NEW: period state
  @Input() isFuture: boolean = false;   // NEW: period state

  newTask = '';
  newTaskTagInput: { [taskId: number]: string } = {};
  showTagDropdown: { [taskId: number]: boolean } = {};

  addTask(): void {
    if (this.newTask.trim()) {
      const newTask: Task = {
        id: Date.now(), // Better ID generation
        text: this.newTask.trim(),
        completed: false,
        tags: [],
        showTagInput: false,
        date: this.currentDate,                  // NEW: assign to viewing period
        createdAt: new Date().toISOString(),    // NEW
        updatedAt: new Date().toISOString()     // NEW
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

  getDayTitle(): string {
    if (!this.currentDate) {
      return 'Today';
    }
    // Parse the date as local date to avoid timezone issues
    const [year, month, day] = this.currentDate.split('-').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    return `${dayName}, ${monthName} ${day}`;
  }
}
