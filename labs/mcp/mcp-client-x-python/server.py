import asyncio
import httpx

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Demo")

@mcp.tool()
def add(a: int, b: int) -> int:
  return a + b


@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
  return f"Hello, {name}"


@mcp.tool()
def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Calculate BMI given weight in kg and height in meters"""
    return weight_kg / (height_m ** 2)

@mcp.tool()
async def fetch_weather(latitude: float, longitude: float) -> str:
    """Fetch current weather for a location using latitude and longitude"""
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}&current_weather=true&"
        f"hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    )
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.text


if __name__ == "__main__":
  loop = asyncio.get_event_loop()
  asyncio.set_event_loop(loop)
  loop.run_until_complete(asyncio.sleep(0)) # Ensures an event loop is available

  # Now run FastMCP (blocking)
  mcp.run()

  """Since mcp.run() is blocking, but we also have async functions (like fetch_weather),
      the best solution is to run the  async tasks in a background event loop before calling mcp.run().
  """
