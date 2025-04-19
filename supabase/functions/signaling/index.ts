
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Store active connections by room
const rooms = new Map<string, Map<string, WebSocket>>();

// CORS headers for preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if it's a WebSocket request
  const upgradeHeader = req.headers.get('upgrade') || '';
  if (upgradeHeader.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket connection', { 
      status: 400,
      headers: corsHeaders
    });
  }

  // Get room ID from URL
  const url = new URL(req.url);
  const roomId = url.searchParams.get('room');
  const clientId = url.searchParams.get('clientId');
  
  if (!roomId || !clientId) {
    return new Response('Missing room ID or client ID', { 
      status: 400,
      headers: corsHeaders 
    });
  }

  console.log(`Client ${clientId} connecting to room ${roomId}`);

  // Upgrade the connection to a WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);

  // Initialize room if it doesn't exist
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }
  
  const room = rooms.get(roomId)!;
  
  // Add this client to the room
  room.set(clientId, socket);
  
  // Handle incoming messages
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log(`Received message from ${clientId} in room ${roomId}:`, message.type);
      
      // Add sender ID to the message
      message.senderId = clientId;
      
      // If the message has a specific target, send only to that client
      if (message.targetId && room.has(message.targetId)) {
        const targetSocket = room.get(message.targetId);
        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          targetSocket.send(JSON.stringify(message));
        }
      } else {
        // Broadcast to all other clients in the room
        for (const [id, clientSocket] of room.entries()) {
          if (id !== clientId && clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify(message));
          }
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  };
  
  // Handle disconnection
  socket.onclose = () => {
    console.log(`Client ${clientId} disconnected from room ${roomId}`);
    room.delete(clientId);
    
    // Notify other clients that this peer has left
    for (const [id, clientSocket] of room.entries()) {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify({
          type: 'peer-disconnected',
          peerId: clientId
        }));
      }
    }
    
    // Clean up empty rooms
    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    }
  };
  
  // Send a joined message to the new client
  socket.send(JSON.stringify({
    type: 'connected',
    peers: Array.from(room.keys()).filter(id => id !== clientId)
  }));
  
  return response;
});
