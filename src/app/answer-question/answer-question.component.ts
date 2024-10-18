import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OpenAIService } from '../open-ai.service';
import { MarkdownModule } from 'ngx-markdown';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-answer-question',
  standalone: true,
  imports: [FormsModule, CommonModule, MarkdownModule, RouterLink],
  templateUrl: './answer-question.component.html',
  styleUrls: ['./answer-question.component.css']
})
export class AnswerQuestionComponent {
  question = signal('');
  conversationHistory = signal<{ role: string, content: string }[]>([]);
  maxTurns = 20;

  private readonly openAiService = inject(OpenAIService);

  get turnCount() {
    return this.conversationHistory().length / 2;
  }

  async answerQuestion(event: Event) {
    event.preventDefault();

    const userMessage = this.question();
    const systemPrompt = localStorage.getItem('systemPrompt') || 'You are a helpful assistant.';

    if (userMessage.trim()) {
      this.conversationHistory.update(history => [...history, { role: 'user', content: userMessage }]);
      this.question.set('');

      const conversation = this.conversationHistory().map(({ role, content }) => ({ role, content }));

      const response = await this.openAiService.answerQuestions(conversation, systemPrompt);
      const botMessage = response.choices[0].message.content;

      this.conversationHistory.update(history => [...history, { role: 'system', content: botMessage }]);
    }
  }


  startOver() {
    this.conversationHistory.set([]);
  }
}
