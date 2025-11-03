export interface CarouselItem {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  content?: any; // For custom content projection
  [key: string]: any; // Allow additional properties
}
