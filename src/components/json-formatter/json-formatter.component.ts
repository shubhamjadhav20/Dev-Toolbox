import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-json-formatter',
  templateUrl: './json-formatter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonFormatterComponent {
  inputJson = signal<string>('');
  formattedJson = signal<string>('');
  errorMessage = signal<string | null>(null);

  onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.inputJson.set(textarea.value);
  }

  formatJson() {
    this.errorMessage.set(null);
    this.formattedJson.set('');
    if (!this.inputJson().trim()) {
      return;
    }

    try {
      const parsed = JSON.parse(this.inputJson());
      this.formattedJson.set(JSON.stringify(parsed, null, 2));
    } catch (error) {
      this.errorMessage.set(`Invalid JSON: ${(error as Error).message}`);
    }
  }
  
  clearAll() {
    this.inputJson.set('');
    this.formattedJson.set('');
    this.errorMessage.set(null);
  }

  async copyToClipboard() {
    if (this.formattedJson()) {
      try {
        await navigator.clipboard.writeText(this.formattedJson());
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }
}
