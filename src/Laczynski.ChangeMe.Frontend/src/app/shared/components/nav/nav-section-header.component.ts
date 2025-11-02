import { Component, input } from '@angular/core';

@Component({
  selector: 'app-nav-section-header',
  template: `
    <div class="nav-section-header">
      <div class="nav-section-header__left-lockup">
        <div class="nav-section-header__text">{{ label() }}</div>
      </div>
    </div>
  `,
})
export class NavSectionHeaderComponent {
  label = input.required<string>();
}
