import { createLobby } from '../src/utils/helper'


describe('createLobby', () => {
  it('should send payload when clientId is not null', () => {
    // Mock WebSocket
    const mockWebSocket = {
      send: jest.fn(),
    };

    // Mock clientId
    const clientId = '123';

    // Store ws reference
    const ws = mockWebSocket as any;

    // Call createLobby
    createLobby(clientId);

    // Verify WebSocket send was called with the expected payload
    const expectedPayload = JSON.stringify({ type: 'create', id: clientId });
    expect(ws.send).toHaveBeenCalledWith(expectedPayload);
  });

  it('should not send payload when clientId is null', () => {
    // Mock WebSocket
    const mockWebSocket = {
      send: jest.fn(),
    };

    // Store ws reference
    const ws = mockWebSocket as any;

    // Mock clientId as null
    const clientId = null;

    // Call createLobby
    createLobby(clientId);

    // Verify WebSocket send was not called
    expect(ws.send).not.toHaveBeenCalled();
  });
});
