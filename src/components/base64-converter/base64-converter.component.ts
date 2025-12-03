import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-base64-converter',
  templateUrl: './base64-converter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Base64ConverterComponent {
  plainText = signal<string>('');
  base64Text = signal<string>('');
  errorMessage = signal<string | null>(null);

  onPlainTextInput(event: Event) {
    this.plainText.set((event.target as HTMLTextAreaElement).value);
  }

  onBase64Input(event: Event) {
    this.base64Text.set((event.target as HTMLTextAreaElement).value);
  }

  encode() {
    this.errorMessage.set(null);
    try {
      this.base64Text.set(btoa(this.plainText()));
    } catch (e) {
      this.errorMessage.set('Could not encode text to Base64.');
    }
  }

  decode() {
    this.errorMessage.set(null);
    try {
      this.plainText.set(atob(this.base64Text()));
    } catch (e) {
      this.errorMessage.set('Invalid Base64 string.');
    }
  }
  
  clearAll() {
    this.plainText.set('');
    this.base64Text.set('');
    this.errorMessage.set(null);
  }
}
