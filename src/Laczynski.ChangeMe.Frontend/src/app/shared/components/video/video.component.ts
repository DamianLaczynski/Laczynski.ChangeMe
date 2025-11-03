import { Component, input, output, signal, computed, effect, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { SliderComponent } from '../field/slider/slider.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  imports: [CommonModule, ButtonComponent, SliderComponent, IconComponent],
})
export class VideoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef<HTMLDivElement>;

  // Inputs
  src = input<string>('');
  poster = input<string>('');
  autoplay = input<boolean>(false);
  loop = input<boolean>(false);
  muted = input<boolean>(false);
  controls = input<boolean>(true);
  showPlayButton = input<boolean>(true);
  showFullscreenButton = input<boolean>(true);
  showVolumeButton = input<boolean>(true);
  showProgressBar = input<boolean>(true);
  showQualityButton = input<boolean>(true);
  showSpeedButton = input<boolean>(true);
  showSkipButtons = input<boolean>(true);
  showPictureInPictureButton = input<boolean>(true);
  skipSeconds = input<number>(10); // Default 10 seconds skip
  qualityOptions = input<Array<{ value: string; label: string }>>([]);
  size = input<'small' | 'medium' | 'large'>('medium');

  // Outputs
  play = output<void>();
  pause = output<void>();
  ended = output<void>();
  timeUpdate = output<number>(); // currentTime
  volumeChange = output<number>(); // volume
  loadedMetadata = output<void>();

  // Internal state
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volume = signal<number>(1);
  isMuted = signal<boolean>(false);
  isFullscreen = signal<boolean>(false);
  isPictureInPicture = signal<boolean>(false);
  isHovered = signal<boolean>(false);
  showControls = signal<boolean>(true); // Controls visibility
  showQualityMenu = signal<boolean>(false);
  showSpeedMenu = signal<boolean>(false);
  playbackRate = signal<number>(1);
  currentQuality = signal<string>('auto');
  supportsPictureInPicture = signal<boolean>(false);
  
  // Visual feedback for actions
  showSkipForwardIndicator = signal<boolean>(false);
  showSkipBackwardIndicator = signal<boolean>(false);
  showPlayIndicator = signal<boolean>(false);
  showPauseIndicator = signal<boolean>(false);

  // Auto-hide controls timer
  private controlsHideTimer: any = null;
  private readonly CONTROLS_HIDE_DELAY = 3000; // 3 seconds

  // Speed options
  speedOptions = [
    { value: 0.25, label: '0.25x' },
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 1.75, label: '1.75x' },
    { value: 2, label: '2x' },
  ];

  // Computed properties
  progress = computed(() => {
    const dur = this.duration();
    const current = this.currentTime();
    return dur > 0 ? (current / dur) * 100 : 0;
  });

  formattedTime = computed(() => {
    return this.formatTime(this.currentTime());
  });

  formattedDuration = computed(() => {
    return this.formatTime(this.duration());
  });

  videoClasses(): string {
    const classes = ['video'];
    classes.push(`video--${this.size()}`);
    if (this.isPlaying()) {
      classes.push('video--playing');
    }
    if (this.isHovered()) {
      classes.push('video--hovered');
    }
    if (this.isFullscreen()) {
      classes.push('video--fullscreen');
    }
    return classes.join(' ');
  }

  ngAfterViewInit(): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    // Check Picture-in-Picture support
    this.supportsPictureInPicture.set(
      !!(
        'requestPictureInPicture' in video &&
        document.pictureInPictureEnabled
      )
    );

    // Set initial volume
    video.volume = this.volume();
    video.muted = this.muted() || this.isMuted();
    video.playbackRate = this.playbackRate();

    // Event listeners
    video.addEventListener('play', () => {
      this.isPlaying.set(true);
      this.play.emit();
      // Start auto-hide timer when playing starts
      if (!this.isHovered()) {
        this.startControlsHideTimer();
      }
    });

    video.addEventListener('pause', () => {
      this.isPlaying.set(false);
      this.pause.emit();
      // Keep controls visible when paused
      this.clearControlsHideTimer();
      this.showControlsAnimated(true);
    });

    video.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.ended.emit();
      // Keep controls visible when video ends
      this.clearControlsHideTimer();
      this.showControlsAnimated(true);
    });

    video.addEventListener('timeupdate', () => {
      this.currentTime.set(video.currentTime);
      this.timeUpdate.emit(video.currentTime);
    });

    video.addEventListener('loadedmetadata', () => {
      this.duration.set(video.duration);
      this.loadedMetadata.emit();
    });

    video.addEventListener('volumechange', () => {
      this.volume.set(video.volume);
      this.isMuted.set(video.muted);
      this.volumeChange.emit(video.volume);
    });

    // Handle fullscreen changes (cross-browser support)
    const updateFullscreenState = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      this.isFullscreen.set(isFullscreen);
    };

    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    document.addEventListener('mozfullscreenchange', updateFullscreenState);
    document.addEventListener('MSFullscreenChange', updateFullscreenState);

    // Handle Picture-in-Picture changes
    video.addEventListener('enterpictureinpicture', () => {
      this.isPictureInPicture.set(true);
    });

    video.addEventListener('leavepictureinpicture', () => {
      this.isPictureInPicture.set(false);
    });
  }

  ngOnDestroy(): void {
    const video = this.videoElement?.nativeElement;
    if (video) {
      video.pause();
      video.src = '';
      video.load();
    }
    // Clear controls hide timer
    this.clearControlsHideTimer();
  }

  togglePlay(): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    if (video.paused) {
      // Show play indicator
      this.showPlayIndicator.set(true);
      setTimeout(() => {
        this.showPlayIndicator.set(false);
      }, 1000);

      video.play().then(() => {
        // Update state after play promise resolves
        this.isPlaying.set(true);
      }).catch(() => {
        // Play was prevented
        this.isPlaying.set(false);
        this.showPlayIndicator.set(false);
      });
    } else {
      // Show pause indicator
      this.showPauseIndicator.set(true);
      setTimeout(() => {
        this.showPauseIndicator.set(false);
      }, 1000);

      video.pause();
      // Update state immediately for pause
      this.isPlaying.set(false);
    }
  }

  onProgressChange(newTime: number): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    // Validate the value - check if it's a valid finite number
    if (typeof newTime !== 'number' || !isFinite(newTime) || isNaN(newTime)) {
      return;
    }

    const validTime = Math.max(0, Math.min(newTime, video.duration || Infinity));
    if (isFinite(validTime) && !isNaN(validTime)) {
      video.currentTime = validTime;
    }
  }

  toggleMute(): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    video.muted = !video.muted;
    this.isMuted.set(video.muted);
  }

  onControlsClickOutside(): void {
    // Reset controls timer on click
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    this.showQualityMenu.set(false);
    this.showSpeedMenu.set(false);
  }

  toggleQualityMenu(): void {
    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    this.showQualityMenu.set(!this.showQualityMenu());
    this.showSpeedMenu.set(false);
  }

  toggleSpeedMenu(): void {
    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    this.showSpeedMenu.set(!this.showSpeedMenu());
    this.showQualityMenu.set(false);
  }

  setQuality(quality: string): void {
    this.currentQuality.set(quality);
    this.showQualityMenu.set(false);
    // Note: HTML5 video doesn't have native quality switching API
    // This would need to be handled by changing the video source
    // or using libraries like hls.js or video.js for adaptive streaming
  }

  setPlaybackRate(rate: number): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    video.playbackRate = rate;
    this.playbackRate.set(rate);
    this.showSpeedMenu.set(false);
  }

  getCurrentSpeedLabel(): string {
    return this.speedOptions.find(opt => opt.value === this.playbackRate())?.label || '1x';
  }

  getCurrentQualityLabel(): string {
    const quality = this.qualityOptions().find(q => q.value === this.currentQuality());
    return quality?.label || 'Auto';
  }

  onVolumeChange(newVolume: number): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    // Validate the value - check if it's a valid finite number
    if (typeof newVolume !== 'number' || !isFinite(newVolume) || isNaN(newVolume)) {
      return;
    }

    const percentage = Math.max(0, Math.min(1, newVolume));
    if (isFinite(percentage) && !isNaN(percentage)) {
      video.volume = percentage;
      this.volume.set(percentage);
      if (percentage > 0 && video.muted) {
        video.muted = false;
        this.isMuted.set(false);
      }
    }
  }

  skipForward(): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    const skipAmount = this.skipSeconds();
    const newTime = Math.min(video.currentTime + skipAmount, video.duration);
    video.currentTime = newTime;

    // Show visual feedback
    this.showSkipForwardIndicator.set(true);
    setTimeout(() => {
      this.showSkipForwardIndicator.set(false);
    }, 1000);
  }

  skipBackward(): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    const skipAmount = this.skipSeconds();
    const newTime = Math.max(video.currentTime - skipAmount, 0);
    video.currentTime = newTime;

    // Show visual feedback
    this.showSkipBackwardIndicator.set(true);
    setTimeout(() => {
      this.showSkipBackwardIndicator.set(false);
    }, 1000);
  }

  togglePictureInPicture(): void {
    const video = this.videoElement?.nativeElement;
    if (!video || !this.supportsPictureInPicture()) return;

    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    if (document.pictureInPictureElement) {
      // Exit Picture-in-Picture
      document.exitPictureInPicture().catch((error) => {
        console.error('Error exiting Picture-in-Picture:', error);
      });
    } else {
      // Enter Picture-in-Picture
      video.requestPictureInPicture().catch((error) => {
        console.error('Error entering Picture-in-Picture:', error);
      });
    }
  }

  toggleFullscreen(): void {
    const container = this.videoContainer?.nativeElement;
    if (!container) return;

    // Reset controls timer on interaction
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();

    if (!document.fullscreenElement) {
      // Request fullscreen on the container (not just video) to keep our custom controls
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {
          // Fullscreen API may not be available or denied
        });
      } else if ((container as any).webkitRequestFullscreen) {
        // Safari support
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        // Firefox support
        (container as any).mozRequestFullScreen();
      } else if ((container as any).msRequestFullscreen) {
        // IE/Edge support
        (container as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
    // Only auto-hide if video is playing
    if (this.isPlaying()) {
      this.startControlsHideTimer();
    } else {
      // Keep controls visible when paused
      this.showControlsAnimated(true);
    }
  }

  onMouseMove(): void {
    // Reset timer on any mouse movement
    this.showControlsAnimated(true);
    this.resetControlsHideTimer();
  }

  private showControlsAnimated(show: boolean): void {
    this.showControls.set(show);
  }

  private startControlsHideTimer(): void {
    this.clearControlsHideTimer();
    this.controlsHideTimer = setTimeout(() => {
      if (this.isPlaying() && !this.isHovered()) {
        this.showControlsAnimated(false);
      }
    }, this.CONTROLS_HIDE_DELAY);
  }

  private resetControlsHideTimer(): void {
    this.clearControlsHideTimer();
    if (this.isPlaying()) {
      this.startControlsHideTimer();
    }
  }

  private clearControlsHideTimer(): void {
    if (this.controlsHideTimer) {
      clearTimeout(this.controlsHideTimer);
      this.controlsHideTimer = null;
    }
  }

  private formatTime(seconds: number): string {
    if (!isFinite(seconds) || isNaN(seconds)) {
      return '0:00';
    }

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}

