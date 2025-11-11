import { useState, useEffect, useCallback } from 'react';
import { getWebSocketClient } from '@/lib/websocket/client';

interface WebSocketState {
  connected: boolean;
  error: string | null;
  lastMessage: any;
}

export function useWebSocket(enabled: boolean = true) {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    error: null,
    lastMessage: null
  });

  const [priceUpdates, setPriceUpdates] = useState<{ [symbol: string]: number }>({});

  const handlePriceUpdate = useCallback((data: any) => {
    setPriceUpdates(prev => ({
      ...prev,
      [data.symbol]: data.price
    }));
    setState(prev => ({ ...prev, lastMessage: data }));
  }, []);

  const handleError = useCallback((data: any) => {
    setState(prev => ({ ...prev, error: data.message }));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const wsClient = getWebSocketClient();

    // Subscribe to events
    wsClient.subscribe('price_update', handlePriceUpdate);
    wsClient.subscribe('error', handleError);

    // Connect
    wsClient.connect()
      .then(() => {
        setState(prev => ({ ...prev, connected: true, error: null }));
      })
      .catch((error) => {
        setState(prev => ({ ...prev, error: error.message }));
      });

    // Cleanup on unmount
    return () => {
      wsClient.unsubscribe('price_update');
      wsClient.unsubscribe('error');
      wsClient.disconnect();
      setState({ connected: false, error: null, lastMessage: null });
    };
  }, [enabled, handlePriceUpdate, handleError]);

  return {
    connected: state.connected,
    error: state.error,
    lastMessage: state.lastMessage,
    priceUpdates
  };
}