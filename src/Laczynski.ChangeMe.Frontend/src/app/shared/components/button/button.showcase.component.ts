import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-showcase',
  imports: [ButtonComponent, CommonModule],
  template: `
    <div style="display: flex; flex-direction: row; gap: 10px; margin: 12px">
      <app-button size="sm" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button size="md" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button size="lg" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button size="xl" (click)="onButtonClick($event)"
        >Click me</app-button
      >
    </div>

    <div style="display: flex; flex-direction: row; gap: 10px; margin: 12px">
      <app-button variant="solid" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button variant="outline" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button variant="ghost" (click)="onButtonClick($event)"
        >Click me</app-button
      >
    </div>

    <div style="display: flex; flex-direction: row; gap: 10px; margin: 12px">
      <app-button intent="primary" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="secondary" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="success" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="danger" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="warning" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="info" (click)="onButtonClick($event)"
        >Click me</app-button
      >
    </div>
    <div style="display: flex; flex-direction: row; gap: 10px; margin: 12px">
      <app-button intent="primary" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="secondary" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="success" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="danger" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="warning" (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button intent="info" (click)="onButtonClick($event)"
        >Click me</app-button
      >
    </div>
    <div style="display: flex; flex-direction: row; gap: 10px; margin: 12px">
      <app-button
        intent="primary"
        variant="outline"
        size="sm"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        intent="secondary"
        variant="outline"
        size="md"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        intent="success"
        variant="outline"
        size="lg"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        intent="danger"
        variant="outline"
        size="xl"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        intent="warning"
        variant="outline"
        size="xl"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        intent="info"
        variant="outline"
        size="xl"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
    </div>
    <div style="display: flex; flex-direction: row; gap: 10px; margin: 12px">
      <app-button
        variant="ghost"
        intent="primary"
        size="sm"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        variant="ghost"
        intent="secondary"
        size="md"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        variant="ghost"
        intent="success"
        size="lg"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        variant="ghost"
        intent="danger"
        size="xl"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        variant="ghost"
        intent="warning"
        size="xl"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
      <app-button
        variant="ghost"
        intent="info"
        size="xl"
        (click)="onButtonClick($event)"
        >Click me</app-button
      >
    </div>

    <div style="display: flex; flex-direction: row; gap: 10px; margin: 12px">
      <app-button [disabled]="true" (click)="onButtonClick($event)"
        >Click me</app-button
      >
    </div>
    <app-button [fullWidth]="true" (click)="onButtonClick($event)"
      >Click me</app-button
    >
  `,
})
export class ButtonShowcaseComponent {
  onButtonClick(event: MouseEvent): void {
    console.log('Button clicked:', event);
  }

  constructor() {}
}
