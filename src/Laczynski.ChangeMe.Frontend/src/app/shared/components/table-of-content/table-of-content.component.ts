import {
  Component,
  input,
  signal,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  afterNextRender,
  computed,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TreeNodeComponent, TreeNode } from '../tree-node/tree-node.component';
import { Size, Appearance, Orientation } from '../utils';

export interface TocItem {
  id: string;
  label: string;
  level: number;
  element: HTMLElement;
  children?: TocItem[];
}

@Component({
  selector: 'app-table-of-content',
  imports: [CommonModule, TreeNodeComponent],
  templateUrl: './table-of-content.component.html',
})
export class TableOfContentComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);

  // Configuration inputs
  containerSelector = input<string>('.showcase');
  headingSelector = input<string>('h2, h3, h4, h5, h6');
  minLevel = input<number>(1);
  maxLevel = input<number>(6);
  size = input<Size>('medium');
  variant = input<Appearance | undefined>('subtle');
  showSelectionIndicator = input<boolean>(true);
  indicatorPosition = input<Orientation>('vertical');
  sticky = input<boolean>(false);
  offsetTop = input<number>(0);

  // Internal state
  items = signal<TocItem[]>([]);
  activeItemId = signal<string | null>(null);
  private scrollObserver?: IntersectionObserver;
  private scrollListener?: () => void;
  private userClickTimeout?: number;
  private isUserScrolling = false;
  private scrollUpdateFrame?: number;

  constructor() {
    afterNextRender(() => {
      this.initializeToc();
    });

    effect(() => {
      const container = this.document.querySelector(this.containerSelector());
      if (container) {
        this.initializeToc();
      }
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initializeToc(): void {
    this.cleanup();

    const container = this.document.querySelector(this.containerSelector());
    if (!container) {
      return;
    }

    const headings = this.findHeadings(container);
    if (headings.length === 0) {
      this.items.set([]);
      return;
    }

    this.prepareHeadings(headings);
    const tocItems = this.buildHierarchy(headings);
    this.items.set(tocItems);
    this.setupScrollTracking(headings);

    if (this.sticky()) {
      this.setupStickyPositioning();
    }
  }

  private findHeadings(container: Element): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(this.headingSelector())).filter(
      heading => {
        const level = parseInt(heading.tagName.charAt(1));
        return level >= this.minLevel() && level <= this.maxLevel();
      },
    );
  }

  private prepareHeadings(headings: HTMLElement[]): void {
    const scrollMargin = this.offsetTop() + 100;

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = this.generateId(heading.textContent || `heading-${index}`);
      }
      heading.style.scrollMarginTop = `${scrollMargin}px`;
    });
  }

  private generateId(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  }

  private buildHierarchy(headings: HTMLElement[]): TocItem[] {
    const result: TocItem[] = [];
    const stack: TocItem[] = [];

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      const item: TocItem = {
        id: heading.id,
        label: heading.textContent?.trim() || '',
        level,
        element: heading,
      };

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        result.push(item);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      }

      stack.push(item);
    });

    return result;
  }

  private setupScrollTracking(headings: HTMLElement[]): void {
    const threshold = this.offsetTop() + 100;

    // IntersectionObserver dla lepszej wydajności
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${threshold}px 0px -80% 0px`,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    this.scrollObserver = new IntersectionObserver(() => {
      if (this.isUserScrolling) {
        return;
      }
      this.updateActiveHeading(threshold);
    }, options);

    headings.forEach(heading => {
      this.scrollObserver?.observe(heading);
    });

    // Scroll listener jako backup dla większej precyzji (z requestAnimationFrame)
    this.scrollListener = () => {
      if (this.isUserScrolling) {
        return;
      }

      // Użyj requestAnimationFrame dla lepszej synchronizacji z animacjami
      if (this.scrollUpdateFrame !== undefined) {
        return;
      }

      this.scrollUpdateFrame = requestAnimationFrame(() => {
        this.updateActiveHeading(threshold);
        this.scrollUpdateFrame = undefined;
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private updateActiveHeading(threshold: number): void {
    const allHeadings = this.items()
      .flatMap(item => this.getAllHeadings(item))
      .map(tocItem => tocItem.element);

    if (allHeadings.length === 0) {
      return;
    }

    const activeHeading = this.findActiveHeading(allHeadings, threshold);
    if (activeHeading) {
      this.activeItemId.set(activeHeading.id);
    }
  }

  private findActiveHeading(headings: HTMLElement[], threshold: number): HTMLElement | null {
    if (headings.length === 0) {
      return null;
    }

    // Znajdź wszystkie nagłówki z ich pozycjami
    const headingPositions = headings.map(heading => {
      const rect = heading.getBoundingClientRect();
      const top = rect.top;
      const bottom = rect.bottom;
      const isVisible = top < window.innerHeight && bottom > 0;
      const isAboveThreshold = top <= threshold;
      const distanceFromThreshold = top - threshold; // Może być ujemne (powyżej progu)

      return {
        element: heading,
        top,
        bottom,
        isVisible,
        isAboveThreshold,
        distanceFromThreshold,
      };
    });

    // Filtruj nagłówki, które są powyżej progu lub bardzo blisko niego
    const candidates = headingPositions.filter(
      h => h.isAboveThreshold || (h.isVisible && h.distanceFromThreshold < 200),
    );

    if (candidates.length === 0) {
      // Jeśli nie ma kandydatów, wybierz ostatni nagłówek, który przeszedł przez próg
      const pastHeadings = headingPositions.filter(h => h.top < threshold);
      if (pastHeadings.length > 0) {
        return pastHeadings.sort((a, b) => b.top - a.top)[0].element;
      }
      return null;
    }

    // Wybierz nagłówek, który jest najbliżej progu (ale powyżej lub bardzo blisko)
    candidates.sort((a, b) => {
      // Preferuj nagłówki powyżej progu
      if (a.isAboveThreshold !== b.isAboveThreshold) {
        return a.isAboveThreshold ? -1 : 1;
      }
      // Wśród nagłówków powyżej progu, wybierz ten najbliżej progu
      // Wśród nagłówków poniżej progu, wybierz ten najbliżej progu
      return Math.abs(a.distanceFromThreshold) - Math.abs(b.distanceFromThreshold);
    });

    return candidates[0].element;
  }

  private setupStickyPositioning(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    if (element) {
      element.style.position = 'sticky';
      element.style.top = `${this.offsetTop()}px`;
      element.style.alignSelf = 'flex-start';
    }
  }

  private cleanup(): void {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
      this.scrollObserver = undefined;
    }

    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = undefined;
    }

    if (this.userClickTimeout) {
      clearTimeout(this.userClickTimeout);
      this.userClickTimeout = undefined;
    }

    if (this.scrollUpdateFrame !== undefined) {
      cancelAnimationFrame(this.scrollUpdateFrame);
      this.scrollUpdateFrame = undefined;
    }
  }

  onTreeNodeClick(node: TreeNode): void {
    const tocItem = node.data as TocItem | undefined;
    if (tocItem?.element) {
      this.onItemClick(tocItem);
    }
  }

  onItemClick(item: TocItem): void {
    // Ustaw aktywną sekcję natychmiast
    this.activeItemId.set(item.id);

    // Zablokuj automatyczne wykrywanie na czas scrollowania
    this.isUserScrolling = true;

    if (this.userClickTimeout) {
      clearTimeout(this.userClickTimeout);
    }

    let element = item.element;
    if (!this.document.contains(element)) {
      const foundElement = this.document.getElementById(item.id);
      if (!foundElement) {
        this.isUserScrolling = false;
        return;
      }
      element = foundElement;
      item.element = element;
    }

    // Scroll do elementu
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Odblokuj automatyczne wykrywanie po zakończeniu scrollowania
    // Czekamy dłużej, aby upewnić się, że scroll się zakończył
    this.userClickTimeout = window.setTimeout(() => {
      this.isUserScrolling = false;
      // Po odblokowaniu, zaktualizuj aktywną sekcję na podstawie aktualnej pozycji
      const threshold = this.offsetTop() + 100;
      this.updateActiveHeading(threshold);
    }, 1000);

    // Aktualizuj URL hash
    const url = new URL(this.document.defaultView?.location.href || '');
    url.hash = item.id;
    this.document.defaultView?.history.replaceState(null, '', url.toString());
  }

  private getAllHeadings(item: TocItem): TocItem[] {
    const result: TocItem[] = [item];
    if (item.children) {
      item.children.forEach(child => {
        result.push(...this.getAllHeadings(child));
      });
    }
    return result;
  }

  private isItemOrChildActive(item: TocItem, activeId: string | null): boolean {
    if (!activeId) return false;
    if (item.id === activeId) return true;
    return item.children?.some(child => this.isItemOrChildActive(child, activeId)) || false;
  }

  convertToTreeNode(item: TocItem, parentPath: string = ''): TreeNode {
    const fullPath = parentPath ? `${parentPath}-${item.id}` : item.id;
    const activeId = this.activeItemId();
    const hasChildren = !!(item.children && item.children.length > 0);

    return {
      id: fullPath,
      label: item.label,
      selected: this.isItemOrChildActive(item, activeId),
      onClick: () => this.onItemClick(item),
      hasChildren,
      expanded: hasChildren,
      children: item.children?.map(child => this.convertToTreeNode(child, fullPath)),
      data: item,
    };
  }

  treeNodes = computed<TreeNode[]>(() => {
    return this.items().map(item => this.convertToTreeNode(item));
  });
}
