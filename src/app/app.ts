import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, Goal } from './models/task.interface';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Placeholder Planner Title';

  // Top bar info
  weekInfo = 'Week of Jan 27';
  quarterInfo = 'Quarter 1';
  motivationalText = 'Closers get coffee';

  // Mock tasks for Monday
  tasks: Task[] = [
    { id: 1, text: 'Review Q1 strategy documents and prepare feedback', completed: false },
    { id: 2, text: 'Schedule team standup for Tuesday morning', completed: true },
    { id: 3, text: 'Update project timeline in tracking system', completed: false },
    { id: 4, text: 'Respond to client emails and schedule follow-up calls', completed: false },
    { id: 5, text: 'Complete code review for PR #245', completed: true },
    { id: 6, text: 'Prepare slides for Wednesday presentation', completed: false }
  ];

  // Mock weekly goals
  weeklyGoals: Goal[] = [
    { id: 1, text: 'Ship feature X to production', completed: false },
    { id: 2, text: 'Complete 3 code reviews', completed: true },
    { id: 3, text: 'Finalize Q1 roadmap', completed: false },
    { id: 4, text: 'Reduce technical debt by 20%', completed: false },
    { id: 5, text: 'Improve test coverage to 85%', completed: false }
  ];

  // Bottom bar info
  bottomText = 'Some cool links and stuff here';

  // Toggle task completion
  toggleTask(task: Task): void {
    task.completed = !task.completed;
  }

  // Toggle goal completion
  toggleGoal(goal: Goal): void {
    goal.completed = !goal.completed;
  }
}
