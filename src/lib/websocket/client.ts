import { WebSocketMessage } from '@/types';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  protected messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  protected handleMessage(message: WebSocketMessage): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.data);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect().catch(() => {
          // Reconnection failed, will try again
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(messageType: string, handler: (data: any) => void): void {
    this.messageHandlers.set(messageType, handler);
  }

  unsubscribe(messageType: string): void {
    this.messageHandlers.delete(messageType);
  }

  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Mock WebSocket for demonstration (since we don't have a real WebSocket server)
export class MockWebSocketClient extends WebSocketClient {
  private interval: NodeJS.Timeout | null = null;

  connect(): Promise<void> {
    return new Promise((resolve) => {
      console.log('Mock WebSocket connected');

      // Simulate price updates every 5 seconds
      this.interval = setInterval(() => {
        const mockMessage: WebSocketMessage = {
          type: 'price_update',
          data: {
            symbol: 'BTC',
            price: 45000 + (Math.random() - 0.5) * 2000,
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        };

        this.handleMessage(mockMessage);
      }, 5000);

      resolve();
    });
  }

  protected handleMessage(message: WebSocketMessage): void {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.data);
    }
  }

  disconnect(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    console.log('Mock WebSocket disconnected');
  }
}

// Create a singleton instance
let wsClient: WebSocketClient | null = null;

export function getWebSocketClient(): WebSocketClient {
  if (!wsClient) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    // Use MockWebSocketClient for demonstration
    wsClient = new MockWebSocketClient(wsUrl);
  }
  return wsClient;
}