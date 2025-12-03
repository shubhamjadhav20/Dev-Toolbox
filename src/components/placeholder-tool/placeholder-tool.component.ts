import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-placeholder-tool',
  templateUrl: './placeholder-tool.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderToolComponent {
  toolName = input.required<string>();
}
