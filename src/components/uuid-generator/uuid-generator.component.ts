import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-uuid-generator',
  templateUrl: './uuid-generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UuidGeneratorComponent {
  uuids: WritableSignal<string[]> = signal([]);

  generateUuid() {
    const newUuid = crypto.randomUUID();
    this.uuids.update(currentUuids => [newUuid, ...currentUuids]);
  }

  clearUuids() {
    this.uuids.set([]);
  }

  async copyToClipboard(uuid: string) {
    try {
      await navigator.clipboard.writeText(uuid);
      // Optional: Add a visual feedback signal
    } catch (err) {
      console.error('Failed to copy UUID: ', err);
    }
  }
}
