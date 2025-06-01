import {
  Injectable,
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Type,
  TemplateRef,
  createComponent,
  ViewContainerRef,
  EmbeddedViewRef,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ModalComponent } from './modal.component';
import {
  ModalSize,
  ModalVariant,
  ModalAnimation,
  ModalAction,
  ModalOpenEvent,
  ModalCloseEvent,
} from './modal.model';

/**
 * Modal configuration for the service
 */
export interface ModalConfig {
  size?: ModalSize;
  variant?: ModalVariant;
  animation?: ModalAnimation;
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  actions?: ModalAction[];
  data?: any;
  panelClass?: string;
  backdropClass?: string;
  disableClose?: boolean;
  autoFocus?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
}

/**
 * Reference to an opened modal
 */
export class ModalRef<T = any> {
  private readonly _afterClosed = new Subject<T | undefined>();
  private readonly _afterOpened = new Subject<void>();
  private readonly _beforeClosed = new Subject<T | undefined>();

  constructor(
    public readonly componentRef: ComponentRef<ModalComponent>,
    public readonly id: string,
    public readonly contentRef?: ComponentRef<any> | EmbeddedViewRef<any>,
    private readonly appRef?: ApplicationRef,
  ) {}

  /**
   * Close the modal with optional result
   */
  close(result?: T): void {
    this._beforeClosed.next(result);
    this._beforeClosed.complete();

    // Set closing state for animation
    this.componentRef.instance.isClosing.set(true);

    // Wait for animation then actually close
    setTimeout(() => {
      this._afterClosed.next(result);
      this._afterClosed.complete();
      this.destroy();
    }, 300); // Match animation duration
  }

  /**
   * Update modal configuration - Limited due to input signals being read-only
   */
  updateConfig(config: Partial<ModalConfig>): void {
    // For now, we'll recreate the modal with new config
    // This is a limitation of using input signals - they're read-only
    console.warn('updateConfig not yet implemented - input signals are read-only');
  }

  /**
   * Observable for when modal is closed
   */
  afterClosed(): Observable<T | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Observable for when modal is opened
   */
  afterOpened(): Observable<void> {
    return this._afterOpened.asObservable();
  }

  /**
   * Observable for before modal is closed (can prevent)
   */
  beforeClosed(): Observable<T | undefined> {
    return this._beforeClosed.asObservable();
  }

  /**
   * Mark modal as opened (for animation)
   */
  markAsOpened(): void {
    this._afterOpened.next();
    this._afterOpened.complete();
  }

  private destroy(): void {
    if (this.contentRef) {
      // If it's an EmbeddedViewRef, detach from ApplicationRef first
      if ('rootNodes' in this.contentRef && this.appRef) {
        this.appRef.detachView(this.contentRef);
      }
      this.contentRef.destroy();
    }
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}

/**
 * Modal Service - Singleton for managing modals
 */
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private openModals = new Map<string, ModalRef>();
  private modalCounter = 0;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector,
  ) {}

  /**
   * Open a modal with a component
   */
  open<T extends object = any>(component: Type<T>, config: ModalConfig = {}): ModalRef<T> {
    const modalId = `modal-${++this.modalCounter}`;

    // Create the content component first
    const contentComponentRef = createComponent(component, {
      environmentInjector: this.injector,
    });

    // Inject the modal reference into the content component if it has modalRef property
    if ('modalRef' in contentComponentRef.instance) {
      // We'll set this after modal creation
    }

    // Inject data if provided
    if (config.data && 'data' in contentComponentRef.instance) {
      (contentComponentRef.instance as any).data = config.data;
    }

    // Get the content nodes for projection
    const contentNodes = [contentComponentRef.location.nativeElement];

    // Create modal with projected content
    const modalRef = this.createModal(modalId, config, [contentNodes], contentComponentRef);

    // Now set the modal reference
    if ('modalRef' in contentComponentRef.instance) {
      (contentComponentRef.instance as any).modalRef = modalRef;
    }

    this.openModals.set(modalId, modalRef);

    // Trigger opening animation
    setTimeout(() => {
      modalRef.componentRef.instance.open();
      modalRef.markAsOpened();
    }, 10);

    return modalRef;
  }

  /**
   * Open modal with template
   */
  openTemplate<T = any>(template: TemplateRef<any>, config: ModalConfig = {}): ModalRef<T> {
    const modalId = `modal-template-${++this.modalCounter}`;

    // Create embedded view from template
    const embeddedViewRef = template.createEmbeddedView({});
    this.appRef.attachView(embeddedViewRef);

    // Get the content nodes for projection
    const contentNodes = embeddedViewRef.rootNodes;

    // Create modal with projected content
    const modalRef = this.createModal(modalId, config, [contentNodes], embeddedViewRef);

    this.openModals.set(modalId, modalRef);

    // Trigger opening animation
    setTimeout(() => {
      modalRef.componentRef.instance.open();
      modalRef.markAsOpened();
    }, 10);

    return modalRef;
  }

  /**
   * Close all open modals
   */
  closeAll(): void {
    this.openModals.forEach(modalRef => modalRef.close());
    this.openModals.clear();
  }

  /**
   * Get modal by ID
   */
  getModal(id: string): ModalRef | undefined {
    return this.openModals.get(id);
  }

  /**
   * Check if any modal is open
   */
  hasOpenModals(): boolean {
    return this.openModals.size > 0;
  }

  private createModal(
    id: string,
    config: ModalConfig,
    projectableNodes?: any[][],
    contentRef?: ComponentRef<any> | EmbeddedViewRef<any>,
  ): ModalRef {
    // Create modal component with projected content
    const modalComponentRef = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: projectableNodes || [],
    });

    // Apply initial configuration via the configure method
    modalComponentRef.instance.configure({
      size: config.size,
      variant: config.variant,
      animation: config.animation,
      title: config.title,
      showCloseButton: config.showCloseButton,
      closeOnOverlay: config.closeOnOverlay,
      closeOnEscape: config.closeOnEscape,
      actions: config.actions,
      autoFocus: config.autoFocus,
      trapFocus: config.trapFocus,
      restoreFocus: config.restoreFocus,
    });

    // Handle modal events
    this.setupModalEventHandlers(modalComponentRef, id);

    // Attach to DOM
    this.appRef.attachView(modalComponentRef.hostView);
    document.body.appendChild(modalComponentRef.location.nativeElement);

    return new ModalRef(modalComponentRef, id, contentRef, this.appRef);
  }

  private setupModalEventHandlers(
    modalComponentRef: ComponentRef<ModalComponent>,
    id: string,
  ): void {
    const modal = modalComponentRef.instance;

    // Handle close events
    modal.closed.subscribe(() => {
      const modalRef = this.openModals.get(id);
      if (modalRef) {
        modalRef.close();
        this.openModals.delete(id);
      }
    });

    // Handle before close events
    modal.beforeClose.subscribe(event => {
      // Can add global before close logic here
    });
  }
}
