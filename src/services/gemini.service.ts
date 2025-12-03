import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private http = inject(HttpClient);

  // The client doesn't need to know if the key is configured;
  // it just needs to know the proxy endpoint exists. The proxy will handle the key.
  isConfigured(): boolean {
    return true;
  }

  private async callGeminiProxy(action: string, payload: object): Promise<string> {
    try {
      // In production, this will call the Vercel serverless function.
      // Vercel handles the routing of /api/* to the function.
      const response$ = this.http.post<{ text: string }>('/api/gemini', { action, payload });
      const response = await firstValueFrom(response$);
      return response.text;
    } catch (err: any) {
      const serverError = err.error?.error || 'An unknown error occurred while contacting the AI service.';
      console.error(`Error calling Gemini proxy for action "${action}":`, err);
      // Pass the server's error message to the component.
      throw new Error(serverError);
    }
  }

  async generateMongodbQuery(userPrompt: string): Promise<string> {
    return this.callGeminiProxy('generateMongo', { userPrompt });
  }

  async formatSql(sql: string): Promise<string> {
    return this.callGeminiProxy('formatSql', { sql });
  }
}
