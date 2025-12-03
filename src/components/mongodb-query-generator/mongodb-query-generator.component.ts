import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-mongodb-query-generator',
  templateUrl: './mongodb-query-generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MongodbQueryGeneratorComponent {
  private geminiService = inject(GeminiService);
  
  isServiceConfigured = this.geminiService.isConfigured();
  prompt = signal<string>('');
  generatedQuery = signal<string>('');
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.prompt.set(textarea.value);
  }

  async generateQuery() {
    this.errorMessage.set(null);
    this.generatedQuery.set('');
    
    if (!this.prompt().trim()) {
      return;
    }

    if (!this.isServiceConfigured) {
      this.errorMessage.set('Gemini Service is not configured. Please ensure your API key is set up.');
      return;
    }

    this.isLoading.set(true);
    try {
      const result = await this.geminiService.generateMongodbQuery(this.prompt());
      this.generatedQuery.set(result);
    } catch (error) {
      this.errorMessage.set((error as Error).message);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  clearAll() {
    this.prompt.set('');
    this.generatedQuery.set('');
    this.errorMessage.set(null);
  }

  async copyToClipboard() {
    if (this.generatedQuery()) {
      try {
        await navigator.clipboard.writeText(this.generatedQuery());
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }
}