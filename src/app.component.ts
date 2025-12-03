import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonFormatterComponent } from './components/json-formatter/json-formatter.component';
import { JwtDebuggerComponent } from './components/jwt-debugger/jwt-debugger.component';
import { PlaceholderToolComponent } from './components/placeholder-tool/placeholder-tool.component';
import { MongodbQueryGeneratorComponent } from './components/mongodb-query-generator/mongodb-query-generator.component';
import { HtmlCssPlaygroundComponent } from './components/html-css-playground/html-css-playground.component';
import { RegexTesterComponent } from './components/regex-tester/regex-tester.component';

export type Tool = {
  id: string;
  name: string;
  icon: string;
  implemented: boolean;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonFormatterComponent,
    JwtDebuggerComponent,
    PlaceholderToolComponent,
    MongodbQueryGeneratorComponent,
    HtmlCssPlaygroundComponent,
    RegexTesterComponent,
  ]
})
export class AppComponent {
  sidebarOpen = signal(false);

  tools: Tool[] = [
    { id: 'json-formatter', name: 'JSON Formatter', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>', implemented: true },
    { id: 'jwt-debugger', name: 'JWT Debugger', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>', implemented: true },
    { id: 'mongodb-query-generator', name: 'MongoDB Query Gen', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7" /></svg>', implemented: true },
    { id: 'html-css-playground', name: 'HTML/CSS Playground', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>', implemented: true },
    { id: 'regex-tester', name: 'Regex Tester', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a1 1 0 011-1h4a1 1 0 011 1v4h2v-2h2v-2l1.257-1.257A6 6 0 0119 7z" /></svg>', implemented: true },
  ];
  
  activeTool = signal<Tool>(this.tools[0]);

  selectTool(tool: Tool) {
    this.activeTool.set(tool);
    this.sidebarOpen.set(false);
  }
}
