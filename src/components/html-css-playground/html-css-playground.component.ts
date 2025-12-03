import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-html-css-playground',
  templateUrl: './html-css-playground.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlCssPlaygroundComponent {
  private sanitizer = inject(DomSanitizer);

  htmlCode = signal<string>(`<h1>Hello, Playground!</h1>\n<p>Start typing your HTML here.</p>`);
  cssCode = signal<string>(`body {\n  font-family: sans-serif;\n  color: #333;\n  background-color: #fff;\n}\n\nh1 {\n  color: steelblue;\n}`);

  onHtmlInput(event: Event) {
    this.htmlCode.set((event.target as HTMLTextAreaElement).value);
  }

  onCssInput(event: Event) {
    this.cssCode.set((event.target as HTMLTextAreaElement).value);
  }

  previewContent = computed(() => {
    const combinedHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${this.cssCode()}</style>
        </head>
        <body>
          ${this.htmlCode()}
        </body>
      </html>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(combinedHtml);
  });
}