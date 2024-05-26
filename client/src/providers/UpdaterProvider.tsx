import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { ENDPOINTS } from '@/api/endpoints';
import {
  ProviderProps,
  UpdaterMessageProps,
  UpdaterProps
} from '@/types/props';

const UpdaterContext = createContext<UpdaterProps>({
  toUpdate: new Set()
});

export const useUpdater = () => {
  return useContext(UpdaterContext);
};

const UpdaterProvider = ({ children }: ProviderProps) => {
  const socket = useRef<WebSocket | null>(null);

  const [updating, setUpdating] = useState<boolean>(false);
  const [toUpdate, setToUpdate] = useState<Set<string>>(new Set());

  const openSocket = () => {
    if (socket.current && socket.current.readyState === socket.current.OPEN) {
      return;
    }
    socket.current = new WebSocket(
      `${process.env.SERVER_SOCKET_URL}${ENDPOINTS.updater}`
    );
    socket.current.onmessage = async (event: MessageEvent) => {
      const message: UpdaterMessageProps = JSON.parse(event.data);
      if (message.type !== 'update') {
        return;
      }
      setToUpdate((prev) => {
        const newToUpdate = new Set(prev);
        newToUpdate.add(message.toUpdate);
        return newToUpdate;
      });
    };
  };

  const closeSocket = () => {
    if (
      !socket.current ||
      socket.current.readyState === socket.current.CLOSED
    ) {
      return;
    }
    socket.current.close();
  };

  const update = async (component: string, refetch: () => Promise<void>) => {
    try {
      setUpdating(true);
      toUpdate.delete(component);
      await refetch();
    } finally {
      setUpdating(false);
    }
  };

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        openSocket();
      }
      appState.current = nextAppState;
    });
    return () => {
      closeSocket();
      subscription.remove();
    };
  }, []);

  const value = {
    updating,
    toUpdate,
    update
  };

  return (
    <UpdaterContext.Provider value={value}>{children}</UpdaterContext.Provider>
  );
};

export default UpdaterProvider;
