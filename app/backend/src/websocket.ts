import WebSocket from "ws";
import http from "http";

// Map to store clients and their subscriptions
const clients = new Map<
  WebSocket,
  { tokenName?: string; notifications?: boolean }
>();

// Initialize WebSocket server
function initWebSocketServer(server: http.Server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
    const pathname = req.url;
    console.log(`WebSocket connection established: ${pathname}`);

    // Extract token name from URL path
    // Expected format: /events/token/TokenName or /events/notifications
    const pathParts = pathname?.split("/");
    if (!pathParts) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          message: "Invalid subscription path",
        })
      );
    } else if (
      pathParts?.length >= 4 &&
      pathParts[1] === "events" &&
      pathParts[2] === "token"
    ) {
      const tokenName = pathParts[3];

      // Store client with token subscription
      clients.set(ws, { tokenName });

      // Send confirmation message
      ws.send(
        JSON.stringify({
          type: "CONNECTION_ESTABLISHED",
          message: `Subscribed to ${tokenName} events`,
          timestamp: new Date().toISOString(),
        })
      );

      console.log(`Client subscribed to token: ${tokenName}`);
    } else if (pathname === "/events/notifications") {
      // Store client with notifications subscription
      clients.set(ws, { notifications: true });

      // Send confirmation message
      ws.send(
        JSON.stringify({
          type: "CONNECTION_ESTABLISHED",
          message: "Subscribed to notifications",
          timestamp: new Date().toISOString(),
        })
      );

      console.log("Client subscribed to notifications");
    } else {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          message: "Invalid subscription path",
          timestamp: new Date().toISOString(),
        })
      );
    }

    // Handle client messages
    ws.on("message", (message: WebSocket.RawData) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received message:", data);

        // Handle ping/pong for keeping connection alive
        if (data.type === "PING") {
          ws.send(
            JSON.stringify({
              type: "PONG",
              timestamp: new Date().toISOString(),
            })
          );
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    // Handle client disconnect
    ws.on("close", () => {
      console.log("Client disconnected");
      clients.delete(ws);
    });

    // Handle errors
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });
  });

  // Heartbeat to detect dead connections
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if ((ws as any).isAlive === false) {
        clients.delete(ws);
        return ws.terminate();
      }

      (ws as any).isAlive = false;
      ws.ping();
    });
  }, 30000);

  return wss;
}

// Function to broadcast event to subscribed clients
function broadcastEvent(tokenName: string, event: any) {
  console.log(`Broadcasting event for ${tokenName}:`, event);

  let recipientCount = 0;

  clients.forEach((client, ws) => {
    if (ws.readyState === WebSocket.OPEN && client.tokenName === tokenName) {
      ws.send(
        JSON.stringify({
          type: "NEW_EVENT",
          data: event,
          timestamp: new Date().toISOString(),
        })
      );
      recipientCount++;
    }
  });

  console.log(`Event broadcast to ${recipientCount} clients`);
}

// Function to broadcast notifications to subscribed clients
function broadcastNotification(notification: any) {
  console.log("Broadcasting notification:", notification);

  let recipientCount = 0;

  clients.forEach((client, ws) => {
    if (ws.readyState === WebSocket.OPEN && client.notifications) {
      ws.send(
        JSON.stringify({
          type: "NOTIFICATION",
          data: notification,
          timestamp: new Date().toISOString(),
        })
      );
      recipientCount++;
    }
  });

  console.log(`Notification broadcast to ${recipientCount} clients`);
}

export { initWebSocketServer, broadcastEvent, broadcastNotification };
