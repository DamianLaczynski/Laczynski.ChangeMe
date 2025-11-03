import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './video.component';

@Component({
  selector: 'app-video-showcase',
  imports: [CommonModule, VideoComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Video Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Video component built with Fluent 2 Design System. The Video
        component provides a full-featured video player with custom controls, playback controls, and
        fullscreen support.
      </p>

      <!-- Basic Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Video Player</h2>
        <p class="showcase__section__description">
          Simple video player with default browser controls.
        </p>
        <div class="showcase__preview">
          <app-video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            [controls]="true"
          />
        </div>
      </div>

      <!-- Custom Controls -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Video Player with Custom Controls</h2>
        <p class="showcase__section__description">
          Video player with custom Fluent 2 styled controls, including play/pause, progress bar,
          volume, and fullscreen buttons.
        </p>
        <div class="showcase__preview">
          <app-video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            [controls]="false"
            [showPlayButton]="true"
            [showFullscreenButton]="true"
            [showVolumeButton]="true"
            [showProgressBar]="true"
            [showSpeedButton]="true"
            [showQualityButton]="true"
            [qualityOptions]="qualityOptions()"
            (play)="onPlay()"
            (pause)="onPause()"
            (ended)="onEnded()"
            (timeUpdate)="onTimeUpdate($event)"
          />
        </div>
      </div>

      <!-- With Poster -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Video Player with Poster Image</h2>
        <p class="showcase__section__description">
          Video player with a poster image displayed before playback starts.
        </p>
        <div class="showcase__preview">
          <app-video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster="https://peach.blender.org/wp-content/uploads/title_anouncement.jpg"
            [controls]="false"
            [showPlayButton]="true"
            [showFullscreenButton]="true"
            [showVolumeButton]="true"
            [showProgressBar]="true"
          />
        </div>
      </div>

      <!-- Different Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Video Player Sizes</h2>
        <p class="showcase__section__description">
          Video player in different sizes: small, medium, and large.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Small</h3>
            <app-video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              size="small"
              [controls]="false"
              [showPlayButton]="true"
              [showFullscreenButton]="true"
              [showVolumeButton]="true"
              [showProgressBar]="true"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Medium</h3>
            <app-video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              size="medium"
              [controls]="false"
              [showPlayButton]="true"
              [showFullscreenButton]="true"
              [showVolumeButton]="true"
              [showProgressBar]="true"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Large</h3>
            <app-video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              size="large"
              [controls]="false"
              [showPlayButton]="true"
              [showFullscreenButton]="true"
              [showVolumeButton]="true"
              [showProgressBar]="true"
            />
          </div>
        </div>
      </div>

      <!-- Autoplay -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Autoplay Video</h2>
        <p class="showcase__section__description">
          Video player that automatically starts playing when loaded (may require muted attribute in
          some browsers).
        </p>
        <div class="showcase__preview">
          <app-video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            [autoplay]="true"
            [muted]="true"
            [loop]="true"
            [controls]="false"
            [showPlayButton]="true"
            [showFullscreenButton]="true"
            [showVolumeButton]="true"
            [showProgressBar]="true"
          />
        </div>
      </div>

      <!-- Without Volume Control -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Video Player without Volume Control</h2>
        <p class="showcase__section__description">
          Video player with volume control hidden.
        </p>
        <div class="showcase__preview">
          <app-video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            [controls]="false"
            [showPlayButton]="true"
            [showFullscreenButton]="true"
            [showVolumeButton]="false"
            [showProgressBar]="true"
          />
        </div>
      </div>

      <!-- Without Fullscreen -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Video Player without Fullscreen Button</h2>
        <p class="showcase__section__description">
          Video player with fullscreen button hidden.
        </p>
        <div class="showcase__preview">
          <app-video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            [controls]="false"
            [showPlayButton]="true"
            [showFullscreenButton]="false"
            [showVolumeButton]="true"
            [showProgressBar]="true"
          />
        </div>
      </div>

      <!-- With Speed and Quality Controls -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Video Player with Speed and Quality Controls</h2>
        <p class="showcase__section__description">
          Video player with playback speed control (0.25x to 2x) and quality selection menu.
        </p>
        <div class="showcase__preview">
          <app-video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            [controls]="false"
            [showPlayButton]="true"
            [showFullscreenButton]="true"
            [showVolumeButton]="true"
            [showProgressBar]="true"
            [showSpeedButton]="true"
            [showQualityButton]="true"
            [qualityOptions]="qualityOptions()"
          />
        </div>
      </div>

      <!-- Event Logging -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Logging</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p><strong>Last Event:</strong> {{ lastEvent() }}</p>
            <p><strong>Current Time:</strong> {{ currentTime() }}s</p>
            <p><strong>Duration:</strong> {{ duration() }}s</p>
            <p><strong>Volume:</strong> {{ Math.round(volume() * 100) }}%</p>
          </div>
        </div>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Video component in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
    </div>
  `,
})
export class VideoShowcaseComponent {
  lastEvent = signal<string>('None');
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(1);

  // Expose Math to template
  Math = Math;

  qualityOptions = signal<Array<{ value: string; label: string }>>([
    { value: 'auto', label: 'Auto' },
    { value: '2160p', label: '2160p (4K)' },
    { value: '1440p', label: '1440p' },
    { value: '1080p', label: '1080p (HD)' },
    { value: '720p', label: '720p' },
    { value: '480p', label: '480p' },
    { value: '360p', label: '360p' },
  ]);

  usageExample = `<app-video
  src="https://example.com/video.mp4"
  poster="https://example.com/poster.jpg"
  [controls]="false"
  [showPlayButton]="true"
  [showFullscreenButton]="true"
  [showVolumeButton]="true"
  [showProgressBar]="true"
  [showSpeedButton]="true"
  [showQualityButton]="true"
  [qualityOptions]="qualityOptions"
  [autoplay]="false"
  [loop]="false"
  [muted]="false"
  size="medium"
  (play)="onPlay()"
  (pause)="onPause()"
  (ended)="onEnded()"
  (timeUpdate)="onTimeUpdate($event)"
  (volumeChange)="onVolumeChange($event)"
/>`;

  onPlay(): void {
    this.lastEvent.set('Play');
  }

  onPause(): void {
    this.lastEvent.set('Pause');
  }

  onEnded(): void {
    this.lastEvent.set('Ended');
    this.currentTime.set(0);
  }

  onTimeUpdate(time: number): void {
    this.currentTime.set(time);
  }

  onVolumeChange(vol: number): void {
    this.volume.set(vol);
  }
}

