import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface JwtParts {
  header: object | null;
  payload: object | null;
}

@Component({
  selector: 'app-jwt-debugger',
  templateUrl: './jwt-debugger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JwtDebuggerComponent {
  token = signal<string>('');
  decoded = signal<JwtParts>({ header: null, payload: null });
  errorMessage = signal<string | null>(null);

  onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.token.set(textarea.value);
    this.decodeToken();
  }
  
  decodeToken() {
    this.errorMessage.set(null);
    this.decoded.set({ header: null, payload: null });
    
    const tokenValue = this.token().trim();
    if (!tokenValue) return;

    const parts = tokenValue.split('.');
    if (parts.length !== 3) {
      this.errorMessage.set('Invalid JWT: Token must have 3 parts separated by dots.');
      return;
    }

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      this.decoded.set({ header, payload });
    } catch (error) {
      this.errorMessage.set(`Invalid JWT: Could not decode token. Error: ${(error as Error).message}`);
    }
  }

  getFormattedJson(obj: object | null): string {
    return obj ? JSON.stringify(obj, null, 2) : '';
  }
}
