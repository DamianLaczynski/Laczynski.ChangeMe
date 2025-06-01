import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
  life?: number;
  key?: string;
  sticky?: boolean;
  id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  /**
   * Add a new message to the message queue
   * @param message Message to add
   */
  public add(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    const messageWithId = {
      ...message,
      id: message.id || this.generateId(),
    };

    this.messagesSubject.next([...currentMessages, messageWithId]);

    // Auto-remove message after specified life time
    if (message.life && !message.sticky) {
      setTimeout(() => {
        this.remove(messageWithId);
      }, message.life);
    }
  }

  /**
   * Remove a specific message
   * @param message Message to remove
   */
  public remove(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    const filteredMessages = currentMessages.filter(m => m.id !== message.id);
    this.messagesSubject.next(filteredMessages);
  }

  /**
   * Clear all messages
   * @param key Optional key to clear only messages with specific key
   */
  public clear(key?: string): void {
    if (key) {
      const currentMessages = this.messagesSubject.value;
      const filteredMessages = currentMessages.filter(m => m.key !== key);
      this.messagesSubject.next(filteredMessages);
    } else {
      this.messagesSubject.next([]);
    }
  }

  /**
   * Get current messages
   * @returns Array of current messages
   */
  public getMessages(): Message[] {
    return this.messagesSubject.value;
  }

  /**
   * Generate unique ID for messages
   * @returns Unique string ID
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
