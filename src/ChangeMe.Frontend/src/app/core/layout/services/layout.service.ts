import { Injectable, signal } from '@angular/core';

/**
 * Light or dark theme mode for the application
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Service responsible for managing layout-related state and behaviors
 * such as sidebar visibility and theme mode.
 */
@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  /**
   * Subject that tracks the sidebar visibility state
   * @private
   */
  private _sidebarVisible = signal<boolean>(true);

  /**
   * Signal that tracks the current theme mode
   * @private
   */
  private _themeMode = signal<ThemeMode>(this.getInitialThemeMode());

  /**
   * Signal accessor for sidebar visibility
   */
  $sidebarVisible = this._sidebarVisible.asReadonly();

  /**
   * Signal accessor for the current theme
   */
  $themeMode = this._themeMode.asReadonly();

  /**
   * Initializes the layout service and applies the initial theme
   */
  constructor() {
    this.applyTheme(this._themeMode());
  }

  /**
   * Toggles the sidebar visibility state
   */
  toggleSidebar(): void {
    this._sidebarVisible.update((visible) => !visible);
  }

  /**
   * Sets the sidebar visibility to a specific state
   * @param isVisible Whether the sidebar should be visible
   */
  setSidebarVisibility(isVisible: boolean): void {
    this._sidebarVisible.set(isVisible);
  }

  /**
   * Toggles between light and dark theme
   */
  toggleTheme(): void {
    const newTheme = this._themeMode() === 'light' ? 'dark' : 'light';
    this._themeMode.set(newTheme);
    this.saveThemePreference(newTheme);
    this.applyTheme(newTheme);
  }

  /**
   * Determines the initial theme mode based on saved preference or system preference
   * @returns The initial theme mode to use
   * @private
   */
  private getInitialThemeMode(): ThemeMode {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme) {
      return savedTheme;
    }

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Saves the theme preference to localStorage
   * @param mode The theme mode to save
   * @private
   */
  private saveThemePreference(mode: ThemeMode): void {
    localStorage.setItem('theme', mode);
  }

  /**
   * Applies the theme to the document by setting CSS classes and attributes
   * @param mode The theme mode to apply
   * @private
   */
  private applyTheme(mode: ThemeMode): void {
    document.documentElement.setAttribute('data-theme', mode);

    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
    }
  }
}
