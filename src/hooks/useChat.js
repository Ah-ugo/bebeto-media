/** @format */

import { useState, useEffect, useRef, useCallback } from 'react';
import { createChatWS } from '../utils/api';

export function useChat(
  bookingId,
  senderType = 'client',
  senderName = 'Client',
  token = null,
) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(null);
  const [roomCount, setRoomCount] = useState(0);
  const ws = useRef(null);
  const typingTimer = useRef(null);
  const reconnect = useRef(null);

  const connect = useCallback(() => {
    if (!bookingId) return;
    const sock = createChatWS(bookingId, token);
    ws.current = sock;

    sock.onopen = () => setConnected(true);
    sock.onclose = () => {
      setConnected(false);
      reconnect.current = setTimeout(connect, 3000);
    };
    sock.onerror = () => {};

    sock.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      if (msg.type === 'history') {
        setMessages(msg.messages || []);
        setRoomCount(msg.room_count || 0);
      } else if (msg.type === 'message') {
        setMessages((p) => {
          // Prevent duplicates by checking the unique message ID
          const exists = p.some((m) => m.id === msg.message.id);
          if (exists) return p;
          return [...p, msg.message];
        });
      } else if (msg.type === 'system') {
        setRoomCount(msg.room_count || 0);
      } else if (msg.type === 'typing' && msg.sender_name !== senderName) {
        setIsTyping(msg.is_typing ? msg.sender_name : null);
        clearTimeout(typingTimer.current);
        if (msg.is_typing)
          typingTimer.current = setTimeout(() => setIsTyping(null), 3000);
      }
    };
  }, [bookingId, senderName, token]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnect.current);
      clearTimeout(typingTimer.current);
      if (ws.current) {
        ws.current.onclose = null; // Important: prevent the onclose -> reconnect loop
        ws.current.close();
      }
    };
  }, [connect]);

  const send = useCallback(
    (content) => {
      if (ws.current?.readyState !== WebSocket.OPEN) return false;
      ws.current.send(
        JSON.stringify({
          type: 'message',
          content,
          sender_type: senderType,
          sender_name: senderName,
        }),
      );
      return true;
    },
    [senderType, senderName],
  );

  const sendTyping = useCallback(
    (typing) => {
      if (ws.current?.readyState !== WebSocket.OPEN) return;
      ws.current.send(
        JSON.stringify({
          type: 'typing',
          sender_name: senderName,
          is_typing: typing,
        }),
      );
    },
    [senderName],
  );

  return { messages, connected, isTyping, roomCount, send, sendTyping };
}
