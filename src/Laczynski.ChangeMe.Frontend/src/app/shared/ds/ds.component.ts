import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DsSidebarComponent } from './components/ds-sidebar/ds-sidebar.component';
import { SplitterPanel } from '@shared/components/splitter';
import { ButtonComponent } from '@shared/components/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ds',
  imports: [CommonModule, RouterOutlet, DsSidebarComponent, ButtonComponent],
  templateUrl: './ds.component.html',
})
export class DsComponent implements OnInit, OnDestroy {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private breakpointSubscription?: Subscription;

  panels = signal<SplitterPanel[]>([
    {
      id: 'sidebar',
      size: 15,
    },
    {
      id: 'content',
      size: 85,
    },
  ]);

  isSidebarOpen = signal<boolean>(false);
  isMobile = signal<boolean>(false);

  ngOnInit(): void {
    // Monitor breakpoint changes
    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile.set(result.matches);
        // Close sidebar when switching to mobile
        if (result.matches) {
          this.isSidebarOpen.set(false);
        } else {
          // On desktop, sidebar should always be visible
          this.isSidebarOpen.set(true);
        }
      });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
