import socketio
import asyncio
import random
import json
import uuid

# create a Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')  
app = socketio.ASGIApp(sio)

@sio.event
async def connect(sid, environ):
    print("connect ", sid)

@sio.event
async def disconnect(sid):
    print('disconnect ', sid)

@sio.event
async def sendMessage(sid, data):
    print("Message received:", data)
    response_content = data['content']
    uuId = str(uuid.uuid4())
    # Sending each character in the response separately
    for i, char in enumerate(response_content):
        partial_response = {
            "id": uuId,
            "chatId": data["chatId"],
            "author": "Server",
            "content": char,
            "timestamp": data["timestamp"],
            "isComplete": i == len(response_content) - 1
        }

        # Emit partial response
        await sio.emit('receiveMessage', partial_response, room=sid)

        # Wait for a random amount of time (milliseconds)
        await asyncio.sleep(random.uniform(0.01, 0.2))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='localhost', port=8765)
