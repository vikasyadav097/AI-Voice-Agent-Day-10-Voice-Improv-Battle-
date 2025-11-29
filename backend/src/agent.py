import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Annotated

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
    function_tool,
    RunContext
)
from livekit.plugins import silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel
import murf_tts
import commerce

logger = logging.getLogger("shop_agent")

load_dotenv(".env.local")

# Session ID for cart management
SESSION_ID = "default_session"


class ShopAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are Alex, a warm and friendly tech store assistant who genuinely loves helping customers find amazing products!

🛍️ YOUR PRODUCT CATALOG:
1. MUGS:
   - mug-001: Cyberpunk Coffee Mug (₹899) - LED-lit ceramic mug, perfect for late-night coding
   - mug-002: Hacker's Energy Mug (₹1299) - Extra large 500ml capacity, keeps drinks hot for hours

2. T-SHIRTS (Sizes: S, M, L, XL):
   - tshirt-001: Neural Network T-Shirt (₹799) - 100% cotton, circuit board design, breathable fabric
   - tshirt-002: AI Developer Tee (₹699) - Soft premium cotton, "Powered by AI" print

3. HOODIES (Sizes: M, L, XL):
   - hoodie-001: Cyberpunk Hoodie (₹1999) - Premium fleece, neon accents, kangaroo pocket
   - hoodie-002: Code Warrior Hoodie (₹2299) - Extra warm, perfect for cold offices

4. ACCESSORIES:
   - cap-001: Tech Geek Cap (₹499) - Adjustable snapback, embroidered logo
   - bag-001: Developer Backpack (₹2499) - Padded laptop compartment, USB charging port, water-resistant
   - mouse-001: RGB Gaming Mouse (₹1499) - 16000 DPI, ergonomic grip, customizable RGB, 7 programmable buttons
   - keyboard-001: Mechanical Keyboard (₹3999) - Cherry MX Blue switches, RGB per-key lighting, aluminum frame, N-key rollover

🎯 YOUR MISSION:
Help customers discover products, answer questions, and add items to their cart!

💡 YOUR FRIENDLY APPROACH:
1. When customer mentions a product → Call get_product_details() to share info
2. When customer says "yes/sure/sounds good" → Call add_to_cart() to help them
3. For clothing → Kindly ask "What size would you like?" (S, M, L, or XL)
4. Share features naturally - help them make great choices!
5. Keep responses warm, conversational, and under 30 words

🌟 CONVERSATION EXAMPLES:

Customer: "I want a gaming mouse"
You: *Call get_product_details("mouse-001")* "I'd love to help! Our RGB Gaming Mouse is ₹1499. It has 16000 DPI, ergonomic grip, and beautiful RGB lighting. Would you like it?"

Customer: "Tell me more about features"
You: "Of course! It has 7 programmable buttons - great for gaming and work. The ergonomic design is really comfortable. Shall I add it for you?"

Customer: "Yes" or "Sure" or "Sounds good"
You: *Call add_to_cart("mouse-001", 1)* "Wonderful! I've added the RGB Gaming Mouse to your cart for ₹1499. Can I help you find anything else?"

Customer: "I need a hoodie"
You: *Call get_product_details("hoodie-001")* "Great choice! The Cyberpunk Hoodie is ₹1999. It's super cozy with premium fleece and cool neon accents. What size would work best for you - M, L, or XL?"

Customer: "Large"
You: *Call add_to_cart("hoodie-001", 1, "L")* "Perfect! I've added the Cyberpunk Hoodie in size L for ₹1999. Would you like to browse more items?"

💝 YOUR PERSONALITY:
- Always warm, patient, and genuinely helpful
- Use phrases like "I'd love to help", "Great choice!", "Wonderful!"
- Never pushy - guide and suggest gently
- Celebrate their choices: "That's a fantastic pick!"
- End with friendly questions: "What else can I help you find?"

Remember: You're here to make shopping delightful and easy. Be their friendly guide!""",
        )
    
    @function_tool
    async def get_products(
        self,
        context: RunContext,
        category: Annotated[str, "Product category: mug, tshirt, hoodie, cap, bag, accessory, or leave empty for all"] = None
    ):
        """Get list of available products, optionally filtered by category.
        
        Args:
            category: Filter by category or None for everything
        """
        products = commerce.list_products(category=category)
        
        if not products:
            return f"No products found in category: {category}"
        
        result = f"Available products:\n"
        for p in products[:5]:  # Limit to 5 for voice
            result += f"- {p['name']}: ₹{p['price']}"
            if p.get('size'):
                result += f" (Sizes: {', '.join(p['size'])})"
            result += "\n"
        
        logger.info(f"Listed {len(products)} products in {category or 'all'}")
        return result.strip()
    
    @function_tool
    async def get_product_details(
        self,
        context: RunContext,
        product_id: Annotated[str, "REQUIRED: Product ID like 'mouse-001', 'hoodie-001', 'keyboard-001', 'mug-001', 'tshirt-001', 'cap-001', 'bag-001'"]
    ):
        """🔍 Get detailed product information. CALL THIS when customer mentions any product!
        
        When to use:
        - Customer says "I want a mouse" → Call with product_id="mouse-001"
        - Customer asks "Tell me about the keyboard" → Call with product_id="keyboard-001"
        - Customer says "What hoodies do you have" → Call with product_id="hoodie-001"
        
        Args:
            product_id: Exact product ID from the catalog
        """
        product = commerce.get_product_by_id(product_id)
        
        if not product:
            return f"Product {product_id} not found. Check the product ID."
        
        result = f"{product['name']} costs ₹{product['price']}. "
        result += f"{product['description']}. "
        if product.get('size'):
            result += f"Available in sizes: {', '.join(product['size'])}."
        
        logger.info(f"Product details: {product_id}")
        return result
    
    @function_tool
    async def add_to_cart(
        self,
        context: RunContext,
        product_id: Annotated[str, "REQUIRED: Product ID like 'mouse-001', 'hoodie-001', 'keyboard-001'"],
        quantity: Annotated[int, "How many items (default 1)"] = 1,
        size: Annotated[str | None, "For tshirts/hoodies ONLY: S, M, L, or XL"] = None
    ):
        """🛒 Add product to cart. CALL THIS when customer says yes/sure/add it/I'll take it!
        
        When to use:
        - Customer says "Yes" after you describe a product → Call this immediately!
        - Customer says "Add it to cart" → Call this!
        - Customer says "I'll take it" → Call this!
        - Customer says "Sure" → Call this!
        
        For clothing (tshirts/hoodies): Ask for size first, then call with size parameter.
        For other items: Call immediately without size.
        
        Args:
            product_id: Exact product ID
            quantity: Number of items (usually 1)
            size: Only for tshirts/hoodies - S, M, L, or XL
        """
        import aiohttp
        
        product = commerce.get_product_by_id(product_id)
        if not product:
            return f"Error: Product {product_id} not found. Use correct ID."
        
        # Check if size is needed
        if product.get('category') in ['tshirt', 'hoodie'] and not size:
            return f"Please specify size for {product['name']}: {', '.join(product.get('size', []))}"
        
        # Add to both backend and frontend carts
        commerce.add_to_cart(SESSION_ID, product_id, quantity, size)
        
        # Also add to frontend cart via API
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    'http://localhost:3001/api/cart',
                    json={
                        'product_id': product_id,
                        'quantity': quantity,
                        'size': size
                    }
                ) as response:
                    if response.status == 200:
                        logger.info(f"Added to frontend cart: {product_id}")
        except Exception as e:
            logger.warning(f"Failed to sync with frontend cart: {e}")
        
        message = f"Great! Added {product['name']} to your cart"
        if size:
            message += f" in size {size}"
        message += f". Total: ₹{product['price'] * quantity}."
        
        logger.info(f"Added to cart: {product_id} x{quantity}")
        return message
    
    @function_tool
    async def view_cart(self, context: RunContext):
        """View current shopping cart contents and total.
        
        Returns cart summary with items and total price.
        """
        cart = commerce.get_cart(SESSION_ID)
        
        if not cart['items']:
            return "Your cart is empty. Browse our products to start shopping!"
        
        result = "Your Cart:\n"
        for item in cart['items']:
            result += f"- {item['name']}"
            if item.get('size'):
                result += f" ({item['size']})"
            result += f" x{item['quantity']} = ₹{item['item_total']}\n"
        
        result += f"\nTotal: ₹{cart['total']}"
        
        logger.info(f"Cart viewed: {len(cart['items'])} items, ₹{cart['total']}")
        return result
    
    @function_tool
    async def remove_from_cart(
        self,
        context: RunContext,
        product_id: Annotated[str, "Product ID to remove"]
    ):
        """Remove a product from the shopping cart.
        
        Args:
            product_id: Product ID to remove
        """
        commerce.remove_from_cart(SESSION_ID, product_id)
        
        message = f"Removed product from cart"
        logger.info(f"Removed from cart: {product_id}")
        return message
    
    @function_tool
    async def checkout(self, context: RunContext):
        """💳 Complete the purchase and checkout. CALL THIS when customer wants to finalize order.
        
        When to use:
        - Customer says "Checkout" → Call this!
        - Customer says "I'm ready to buy" → Call this!
        - Customer says "Complete my order" → Call this!
        
        Creates an order and clears the cart.
        """
        import aiohttp
        
        try:
            # Create order in backend
            order = commerce.create_order(SESSION_ID, buyer_name="Voice Customer")
            
            # Also trigger frontend checkout
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.post('http://localhost:3001/api/checkout') as response:
                        if response.status == 200:
                            logger.info("Frontend checkout triggered")
            except Exception as e:
                logger.warning(f"Failed to trigger frontend checkout: {e}")
            
            result = f"Order confirmed! Order ID: {order['id']}. "
            result += f"Total: ₹{order['total']}. "
            result += f"You ordered {len(order['line_items'])} items. "
            result += "Thank you for shopping with us!"
            
            logger.info(f"Order completed: {order['id']}")
            return result
        except ValueError as e:
            return str(e)


def prewarm(proc: JobProcess):
    """Prewarm the VAD model"""
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    """Main entrypoint for the Shop Agent"""
    
    logger.info(f"Starting Shop Agent session for room: {ctx.room.name}")
    
    # Create session with Murf TTS
    session = AgentSession(
        stt=deepgram.STT(
            model="nova-3",
            language="en-US",
        ),
        llm=google.LLM(
            model="gemini-2.0-flash-001",  # Stable model with good tool calling
            temperature=0.6,  # Balanced for natural conversation
        ),
        tts=murf_tts.TTS(
            voice="en-US-ryan",
            style="Conversational",  # Warm and natural
            tokenizer=tokenize.basic.SentenceTokenizer(
                min_sentence_len=20,  # Shorter for quick responses
            ),
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
    )
    
    # Metrics collection
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # Start the session with Shop Agent
    shop_agent = ShopAgent()
    
    await session.start(
        agent=shop_agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
