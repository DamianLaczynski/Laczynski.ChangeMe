import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating.component';

@Component({
  selector: 'app-rating-showcase',
  imports: [CommonModule, RatingComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Rating Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Rating component built with Fluent 2 Design System. The
        Rating component allows users to provide feedback by selecting a rating value using stars.
        It supports full and half-star ratings, read-only mode, different sizes, and customizable
        maximum values.
      </p>

      <!-- Basic Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Rating</h2>
        <p class="showcase__section__description">
          Simple rating component with default settings (5 stars).
        </p>
        <div class="showcase__preview">
          <app-rating
            [value]="basicRating()"
            (valueChange)="onRatingChange($event, 'basic')"
          />
        </div>
        <p class="showcase__section__info">Current rating: {{ basicRating() }}</p>
      </div>

      <!-- With Value Display -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Rating with Value Display</h2>
        <p class="showcase__section__description">
          Rating component showing the current value next to the stars.
        </p>
        <div class="showcase__preview">
          <app-rating
            [value]="valueDisplayRating()"
            [showValue]="true"
            (valueChange)="onRatingChange($event, 'valueDisplay')"
          />
        </div>
      </div>

      <!-- Half Star Rating -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Half Star Rating</h2>
        <p class="showcase__section__description">
          Rating component that allows selecting half stars for more granular ratings.
        </p>
        <div class="showcase__preview">
          <app-rating
            [value]="halfStarRating()"
            [allowHalf]="true"
            [showValue]="true"
            (valueChange)="onRatingChange($event, 'halfStar')"
          />
        </div>
        <p class="showcase__section__info">Current rating: {{ halfStarRating() }}</p>
      </div>

      <!-- Read Only -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Read-Only Rating</h2>
        <p class="showcase__section__description">
          Rating component in read-only mode, typically used for displaying existing ratings.
        </p>
        <div class="showcase__preview">
          <app-rating
            [value]="4.5"
            [readOnly]="true"
            [allowHalf]="true"
            [showValue]="true"
          />
        </div>
      </div>

      <!-- Disabled -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Disabled Rating</h2>
        <p class="showcase__section__description">
          Rating component in disabled state, preventing user interaction.
        </p>
        <div class="showcase__preview">
          <app-rating
            [value]="3"
            [disabled]="true"
            [showValue]="true"
          />
        </div>
      </div>

      <!-- Custom Max -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Maximum Rating</h2>
        <p class="showcase__section__description">
          Rating component with custom maximum value (10 stars).
        </p>
        <div class="showcase__preview">
          <app-rating
            [value]="customMaxRating()"
            [max]="10"
            [showValue]="true"
            (valueChange)="onRatingChange($event, 'customMax')"
          />
        </div>
        <p class="showcase__section__info">Current rating: {{ customMaxRating() }} / 10</p>
      </div>

      <!-- Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Rating Sizes</h2>
        <p class="showcase__section__description">
          Rating component in different sizes: small, medium, and large.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Small</h3>
            <app-rating
              [value]="smallRating()"
              size="small"
              (valueChange)="onRatingChange($event, 'small')"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Medium</h3>
            <app-rating
              [value]="mediumRating()"
              size="medium"
              (valueChange)="onRatingChange($event, 'medium')"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Large</h3>
            <app-rating
              [value]="largeRating()"
              size="large"
              (valueChange)="onRatingChange($event, 'large')"
            />
          </div>
        </div>
      </div>

      <!-- Different Values -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Various Rating Values</h2>
        <p class="showcase__section__description">
          Examples of rating components with different values (read-only).
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>1 Star</h3>
            <app-rating [value]="1" [readOnly]="true" />
          </div>
          <div class="showcase__preview-item">
            <h3>2.5 Stars</h3>
            <app-rating [value]="2.5" [readOnly]="true" [allowHalf]="true" />
          </div>
          <div class="showcase__preview-item">
            <h3>3 Stars</h3>
            <app-rating [value]="3" [readOnly]="true" />
          </div>
          <div class="showcase__preview-item">
            <h3>4.5 Stars</h3>
            <app-rating [value]="4.5" [readOnly]="true" [allowHalf]="true" />
          </div>
          <div class="showcase__preview-item">
            <h3>5 Stars</h3>
            <app-rating [value]="5" [readOnly]="true" />
          </div>
        </div>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Rating component in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
    </div>
  `,
})
export class RatingShowcaseComponent {
  // State for each example
  basicRating = signal<number>(0);
  valueDisplayRating = signal<number>(3);
  halfStarRating = signal<number>(3.5);
  customMaxRating = signal<number>(7);
  smallRating = signal<number>(2);
  mediumRating = signal<number>(3);
  largeRating = signal<number>(4);

  usageExample = `// In your component
import { RatingComponent } from '@shared/components/rating';

@Component({
  template: \`
    <app-rating
      [value]="rating()"
      [max]="5"
      [allowHalf]="true"
      [showValue]="true"
      [readOnly]="false"
      [disabled]="false"
      size="medium"
      (valueChange)="onRatingChange($event)"
    />
  \`
})
export class MyComponent {
  rating = signal(0);

  onRatingChange(value: number): void {
    this.rating.set(value);
    console.log('New rating:', value);
  }
}`;

  onRatingChange(value: number, example: string): void {
    console.log(`${example} rating changed to:`, value);

    switch (example) {
      case 'basic':
        this.basicRating.set(value);
        break;
      case 'valueDisplay':
        this.valueDisplayRating.set(value);
        break;
      case 'halfStar':
        this.halfStarRating.set(value);
        break;
      case 'customMax':
        this.customMaxRating.set(value);
        break;
      case 'small':
        this.smallRating.set(value);
        break;
      case 'medium':
        this.mediumRating.set(value);
        break;
      case 'large':
        this.largeRating.set(value);
        break;
    }
  }
}
