import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-regex-tester',
  templateUrl: './regex-tester.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegexTesterComponent {
  private sanitizer = inject(DomSanitizer);

  regexPattern = signal<string>('\\b\\w{4}\\b'); // Default example
  regexFlags = signal<string>('g');
  testString = signal<string>('This is a sample sentence with several four-letter words.');

  errorMessage = computed<string | null>(() => {
    const pattern = this.regexPattern();
    if (!pattern) {
      return null;
    }
    try {
      new RegExp(pattern, this.regexFlags());
      return null; // No error
    } catch (e) {
      return (e as Error).message; // Return error message
    }
  });

  highlightedResult = computed<SafeHtml>(() => {
    const pattern = this.regexPattern();
    const flags = this.regexFlags();
    const text = this.testString();

    // If the pattern is empty or the regex is invalid, return the plain escaped text.
    if (!pattern || this.errorMessage() !== null) {
      return this.escapeHtml(text);
    }

    // At this point, we know the regex is valid.
    const regex = new RegExp(pattern, flags);
    const highlighted = text.replace(regex, (match) => {
      return `<span class="bg-blue-500 bg-opacity-50 rounded">${this.escapeHtml(
        match
      )}</span>`;
    });
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  });

  onPatternInput(event: Event) {
    this.regexPattern.set((event.target as HTMLInputElement).value);
  }

  onFlagsInput(event: Event) {
    this.regexFlags.set((event.target as HTMLInputElement).value);
  }

  onTestStringInput(event: Event) {
    this.testString.set((event.target as HTMLTextAreaElement).value);
  }

  // Helper to prevent XSS from the input string itself
  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
