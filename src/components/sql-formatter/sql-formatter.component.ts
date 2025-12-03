import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-sql-formatter',
  templateUrl: './sql-formatter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlFormatterComponent {
  private geminiService = inject(GeminiService);
  
  isServiceConfigured = this.geminiService.isConfigured();
  inputSql = signal<string>('');
  formattedSql = signal<string>('');
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.inputSql.set(textarea.value);
  }

  async formatSql() {
    this.errorMessage.set(null);
    this.formattedSql.set('');
    
    if (!this.inputSql().trim()) {
      return;
    }

    if (!this.isServiceConfigured) {
      this.errorMessage.set('Gemini Service is not configured. Please ensure your API key is set up.');
      return;
    }

    this.isLoading.set(true);
    try {
      const result = await this.geminiService.formatSql(this.inputSql());
      this.formattedSql.set(result);
    } catch (error) {
      this.errorMessage.set((error as Error).message);
    } finally {
      this.isLoading.set(false);
    }
  }
  
  clearAll() {
    this.inputSql.set('');
    this.formattedSql.set('');
    this.errorMessage.set(null);
  }

  async copyToClipboard() {
    if (this.formattedSql()) {
      try {
        await navigator.clipboard.writeText(this.formattedSql());
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }
}
