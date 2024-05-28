import {createContext, useContext, useMemo} from 'react';
import {io} from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = props => {
  const socket = useMemo(() => io('http://192.168.0.40:3000'), []);
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
