import { Component, Input } from '@angular/core';

@Component({
  selector: 'tag',
  styleUrls: ['tag.component.scss'],
  template: `
    <div class="tag" [ngClass]="classes">
      {{ tag }}
    </div>
  `
})
export class TagComponent {
  classes: string = '';

  @Input()
  tag: string;

  ngOnInit() {
    switch(this.tag) {
      case 'New':
        this.classes += 'new';
        break;
    }
  }
}
