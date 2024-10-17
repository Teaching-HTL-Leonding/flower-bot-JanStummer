import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-system-prompt',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './system-prompt.component.html',
  styleUrls: ['./system-prompt.component.css']
})
export class SystemPromptComponent {
  systemPrompt = signal(localStorage.getItem('systemPrompt') || '');

  saveSystemPrompt() {
    localStorage.setItem('systemPrompt', this.systemPrompt());
  }
}
