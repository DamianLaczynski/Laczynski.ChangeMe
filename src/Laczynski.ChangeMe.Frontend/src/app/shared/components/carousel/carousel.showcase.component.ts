import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { CarouselItem } from './models/carousel-item.model';

@Component({
  selector: 'app-carousel-showcase',
  imports: [CommonModule, CarouselComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Carousel Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Carousel component built with Fluent 2 Design System. The
        Carousel provides a slide-based content display with navigation controls and indicators.
      </p>

      <!-- Basic Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Carousel</h2>
        <p class="showcase__section__description">
          Simple carousel with image slides and navigation controls.
        </p>
        <div class="showcase__preview">
          <app-carousel
            [items]="basicItems()"
            [showControls]="true"
            [showIndicators]="true"
            (itemChange)="onItemChange($event)"
          />
        </div>
      </div>

      <!-- With Titles and Descriptions -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Carousel with Overlay Text</h2>
        <p class="showcase__section__description">
          Carousel slides with titles and descriptions displayed as overlay.
        </p>
        <div class="showcase__preview">
          <app-carousel
            [items]="overlayItems()"
            [showControls]="true"
            [showIndicators]="true"
            (itemChange)="onItemChange($event)"
          />
        </div>
      </div>

      <!-- Auto-play -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Auto-play Carousel</h2>
        <p class="showcase__section__description">
          Carousel with automatic slide transitions every 3 seconds. Auto-play pauses on hover.
        </p>
        <div class="showcase__preview">
          <app-carousel
            [items]="basicItems()"
            [autoPlay]="true"
            [autoPlayInterval]="3000"
            [showControls]="true"
            [showIndicators]="true"
            (itemChange)="onItemChange($event)"
          />
        </div>
      </div>

      <!-- Different Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Carousel Sizes</h2>
        <p class="showcase__section__description">
          Carousel in different sizes: small, medium, and large.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Small</h3>
            <app-carousel
              [items]="basicItems()"
              size="small"
              [showControls]="true"
              [showIndicators]="true"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Medium</h3>
            <app-carousel
              [items]="basicItems()"
              size="medium"
              [showControls]="true"
              [showIndicators]="true"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Large</h3>
            <app-carousel
              [items]="basicItems()"
              size="large"
              [showControls]="true"
              [showIndicators]="true"
            />
          </div>
        </div>
      </div>

      <!-- Without Controls -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Carousel without Controls</h2>
        <p class="showcase__section__description">
          Carousel with only indicators, no navigation buttons.
        </p>
        <div class="showcase__preview">
          <app-carousel
            [items]="basicItems()"
            [showControls]="false"
            [showIndicators]="true"
            (itemChange)="onItemChange($event)"
          />
        </div>
      </div>

      <!-- Without Indicators -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Carousel without Indicators</h2>
        <p class="showcase__section__description">
          Carousel with only navigation buttons, no indicators.
        </p>
        <div class="showcase__preview">
          <app-carousel
            [items]="basicItems()"
            [showControls]="true"
            [showIndicators]="false"
            (itemChange)="onItemChange($event)"
          />
        </div>
      </div>

      <!-- Loop Mode -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Carousel with Loop</h2>
        <p class="showcase__section__description">
          Carousel that loops continuously through slides.
        </p>
        <div class="showcase__preview">
          <app-carousel
            [items]="basicItems()"
            [loop]="true"
            [showControls]="true"
            [showIndicators]="true"
            (itemChange)="onItemChange($event)"
          />
        </div>
      </div>

      <!-- Non-looping Carousel -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Non-looping Carousel</h2>
        <p class="showcase__section__description">
          Carousel that stops at first and last slide.
        </p>
        <div class="showcase__preview">
          <app-carousel
            [items]="basicItems()"
            [loop]="false"
            [showControls]="true"
            [showIndicators]="true"
            (itemChange)="onItemChange($event)"
          />
        </div>
      </div>

      <!-- Custom Content -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Carousel with Custom Content</h2>
        <p class="showcase__section__description">
          Carousel with custom content instead of images using title and description.
        </p>
        <div class="showcase__preview">
          <app-carousel
            [items]="customItems()"
            [showControls]="true"
            [showIndicators]="true"
            (itemChange)="onItemChange($event)"
          />
        </div>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Carousel in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
    </div>
  `,
})
export class CarouselShowcaseComponent {
  basicItems = signal<CarouselItem[]>([
    {
      id: 'slide1',
      image: 'https://picsum.photos/800/400?random=1',
      title: 'First Slide',
      description: 'This is the first slide in the carousel',
    },
    {
      id: 'slide2',
      image: 'https://picsum.photos/800/400?random=2',
      title: 'Second Slide',
      description: 'This is the second slide in the carousel',
    },
    {
      id: 'slide3',
      image: 'https://picsum.photos/800/400?random=3',
      title: 'Third Slide',
      description: 'This is the third slide in the carousel',
    },
    {
      id: 'slide4',
      image: 'https://picsum.photos/800/400?random=4',
      title: 'Fourth Slide',
      description: 'This is the fourth slide in the carousel',
    },
  ]);

  overlayItems = signal<CarouselItem[]>([
    {
      id: 'overlay1',
      image: 'https://picsum.photos/800/400?random=5',
      title: 'Beautiful Landscape',
      description: 'Experience the beauty of nature with our curated collection',
    },
    {
      id: 'overlay2',
      image: 'https://picsum.photos/800/400?random=6',
      title: 'Urban Architecture',
      description: 'Discover modern cityscapes and architectural marvels',
    },
    {
      id: 'overlay3',
      image: 'https://picsum.photos/800/400?random=7',
      title: 'Abstract Art',
      description: 'Explore creative expressions and artistic visions',
    },
  ]);

  customItems = signal<CarouselItem[]>([
    {
      id: 'card1',
      title: 'Welcome Card',
      description: 'This is a custom content card in the carousel with title and description.',
    },
    {
      id: 'card2',
      title: 'Feature Card',
      description: 'Another custom content example showing different styling possibilities.',
    },
    {
      id: 'card3',
      title: 'Info Card',
      description: 'Custom content can display any information you need.',
    },
  ]);

  usageExample = `// In your component
import { CarouselComponent } from '@shared/components/carousel';
import { CarouselItem } from '@shared/components/carousel/models/carousel-item.model';

@Component({
  template: \`
    <app-carousel
      [items]="carouselItems()"
      [showControls]="true"
      [showIndicators]="true"
      [autoPlay]="false"
      [loop]="true"
      size="medium"
      (itemChange)="onItemChange($event)"
      (itemClick)="onItemClick($event)"
    />
  \`
})
export class MyComponent {
  carouselItems = signal<CarouselItem[]>([
    {
      id: 'slide1',
      image: '/assets/image1.jpg',
      title: 'Slide Title',
      description: 'Slide description'
    },
    {
      id: 'slide2',
      image: '/assets/image2.jpg',
      title: 'Another Slide',
      description: 'Another description'
    }
  ]);
  
  onItemChange(event: { item: CarouselItem; index: number }) {
    console.log('Current slide:', event.item.id, 'at index', event.index);
  }
  
  onItemClick(event: { item: CarouselItem; index: number }) {
    console.log('Clicked slide:', event.item.id);
  }
}`;

  onItemChange(event: { item: CarouselItem; index: number }): void {
    console.log('Carousel item changed:', event.item.id, 'at index', event.index);
  }
}
