import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, Goal } from '../../models/task.interface';
import { AuthService } from '../../services/auth.service';
import { DailyTasksComponent } from '../daily-tasks/daily-tasks';
import { WeeklyGoalsComponent } from '../weekly-goals/weekly-goals';
import { QuarterlyGoalsComponent } from '../quarterly-goals/quarterly-goals';
import { YearlyGoalsComponent } from '../yearly-goals/yearly-goals';
import { TagManagementComponent } from '../tag-management/tag-management';
import { AnalysisComponent } from '../analysis/analysis';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    DailyTasksComponent,
    WeeklyGoalsComponent,
    QuarterlyGoalsComponent,
    YearlyGoalsComponent,
    TagManagementComponent,
    AnalysisComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  title = 'Placeholder Planner Title';

  // Top bar info
  weekInfo = 'Week of Jan 27';
  quarterInfo = 'Quarter 1';
  yearInfo = '2026 Goals';
  motivationalText = 'Closers get coffee';

  // View toggle
  showYearlyGoals = false;
  showQuarterlyGoals = false;
  showTagManagement = false;
  showAnalysis = false;

  // Global tag list
  globalTags: string[] = ['happy house', 'survive', 'strong body', 'sharp mind', 'create'];

  // Mock tasks for Monday
  tasks: Task[] = [
    { id: 1, text: 'Review Q1 strategy documents and prepare feedback', completed: false, tags: [], showTagInput: false },
    { id: 2, text: 'Schedule team standup for Tuesday morning', completed: true, tags: [], showTagInput: false },
    { id: 3, text: 'Update project timeline in tracking system', completed: false, tags: [], showTagInput: false },
    { id: 4, text: 'Respond to client emails and schedule follow-up calls', completed: false, tags: [], showTagInput: false },
    { id: 5, text: 'Complete code review for PR #245', completed: true, tags: [], showTagInput: false },
    { id: 6, text: 'Prepare slides for Wednesday presentation', completed: false, tags: [], showTagInput: false }
  ];

  // Mock weekly goals
  weeklyGoals: Goal[] = [
    { id: 1, text: 'Ship feature X to production', completed: false, tags: [], showTagInput: false },
    { id: 2, text: 'Complete 3 code reviews', completed: true, tags: [], showTagInput: false },
    { id: 3, text: 'Finalize Q1 roadmap', completed: false, tags: [], showTagInput: false },
    { id: 4, text: 'Reduce technical debt by 20%', completed: false, tags: [], showTagInput: false },
    { id: 5, text: 'Improve test coverage to 85%', completed: false, tags: [], showTagInput: false }
  ];

  // Mock yearly goals
  yearlyGoals: Goal[] = [
    { id: 1, text: 'Launch 3 major product features', completed: false, tags: [], showTagInput: false },
    { id: 2, text: 'Grow user base by 50%', completed: false, tags: [], showTagInput: false },
    { id: 3, text: 'Achieve $1M ARR', completed: false, tags: [], showTagInput: false },
    { id: 4, text: 'Build and scale engineering team to 10 people', completed: false, tags: [], showTagInput: false },
    { id: 5, text: 'Establish thought leadership with 12 blog posts', completed: false, tags: [], showTagInput: false }
  ];

  // Mock quarterly goals
  quarterlyGoals: Goal[] = [
    { id: 1, text: 'Complete product roadmap for Q1', completed: false, tags: [], showTagInput: false },
    { id: 2, text: 'Hire 3 engineers', completed: false, tags: [], showTagInput: false },
    { id: 3, text: 'Reach 10k monthly active users', completed: true, tags: [], showTagInput: false },
    { id: 4, text: 'Implement analytics dashboard', completed: false, tags: [], showTagInput: false },
    { id: 5, text: 'Launch beta testing program', completed: false, tags: [], showTagInput: false }
  ];

  // Bottom bar info
  bottomText = 'Some cool links and stuff here';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Toggle between daily and yearly view
  toggleYearlyGoals(): void {
    this.showYearlyGoals = !this.showYearlyGoals;
    this.showQuarterlyGoals = false;
    this.showTagManagement = false;
    this.showAnalysis = false;
  }

  // Toggle between daily and quarterly view
  toggleQuarterlyGoals(): void {
    this.showQuarterlyGoals = !this.showQuarterlyGoals;
    this.showYearlyGoals = false;
    this.showTagManagement = false;
    this.showAnalysis = false;
  }

  // Show daily tasks view
  showDailyTasks(): void {
    this.showYearlyGoals = false;
    this.showQuarterlyGoals = false;
    this.showTagManagement = false;
    this.showAnalysis = false;
  }

  // Logout functionality
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Close all tag inputs across all components
  closeAllTagInputs(): void {
    this.tasks.forEach(task => task.showTagInput = false);
    this.weeklyGoals.forEach(goal => goal.showTagInput = false);
    this.yearlyGoals.forEach(goal => goal.showTagInput = false);
    this.quarterlyGoals.forEach(goal => goal.showTagInput = false);
  }

  // Toggle tag management view
  toggleTagManagement(): void {
    this.showTagManagement = !this.showTagManagement;
    if (this.showTagManagement) {
      this.showYearlyGoals = false;
      this.showQuarterlyGoals = false;
      this.showAnalysis = false;
    }
    this.closeAllTagInputs();
  }

  // Toggle analysis view
  toggleAnalysis(): void {
    this.showAnalysis = !this.showAnalysis;
    if (this.showAnalysis) {
      this.showYearlyGoals = false;
      this.showQuarterlyGoals = false;
      this.showTagManagement = false;
    }
    this.closeAllTagInputs();
  }

  // Get all global tags
  getAllTags(): string[] {
    return this.globalTags;
  }

  // Rename a tag across all goals and tasks
  renameTag(oldTag: string, newTag: string): void {
    const renameInArray = (items: (Task | Goal)[]) => {
      items.forEach(item => {
        if (item.tags) {
          const index = item.tags.indexOf(oldTag);
          if (index !== -1) {
            item.tags[index] = newTag;
          }
        }
      });
    };

    renameInArray(this.tasks);
    renameInArray(this.weeklyGoals);
    renameInArray(this.quarterlyGoals);
    renameInArray(this.yearlyGoals);

    // Also update in global tag list
    const globalIndex = this.globalTags.indexOf(oldTag);
    if (globalIndex !== -1) {
      this.globalTags[globalIndex] = newTag;
    }
  }

  // Delete a tag from all goals and tasks
  deleteTag(tag: string): void {
    const removeFromArray = (items: (Task | Goal)[]) => {
      items.forEach(item => {
        if (item.tags) {
          item.tags = item.tags.filter(t => t !== tag);
        }
      });
    };

    removeFromArray(this.tasks);
    removeFromArray(this.weeklyGoals);
    removeFromArray(this.quarterlyGoals);
    removeFromArray(this.yearlyGoals);

    // Also remove from global tag list
    this.globalTags = this.globalTags.filter(t => t !== tag);
  }

  // Event handler for tag renamed
  onTagRenamed(event: {oldTag: string, newTag: string}): void {
    this.renameTag(event.oldTag, event.newTag);
  }

  // Event handler for tag deleted
  onTagDeleted(tag: string): void {
    this.deleteTag(tag);
  }

  // Event handler for tag added
  onTagAdded(tag: string): void {
    if (tag && tag.length <= 15 && !this.globalTags.includes(tag)) {
      this.globalTags.push(tag);
    }
  }
}
