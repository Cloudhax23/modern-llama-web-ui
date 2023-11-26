import asyncio
import websockets
import json
import random

async def echo(websocket, path):
    async for message in websocket:
        print("Received message:", message)

        try:
            msg_data = json.loads(message)
            response_content = msg_data['content']

            # Sending each character in the response separately
            for i, char in enumerate(response_content):
                partial_response = {
                    "id": msg_data["id"],
                    "author": "Server",
                    "content": char,
                    "timestamp": msg_data["timestamp"],
                    "isComplete": i == len(response_content) - 1  # Only the last char completes the message
                }

                # Send partial response
                await websocket.send(json.dumps(partial_response))

                # Wait for a random amount of time (milliseconds)
                await asyncio.sleep(random.uniform(0.01, .2))

        except json.JSONDecodeError:
            print("Received non-JSON message")

start_server = websockets.serve(echo, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
