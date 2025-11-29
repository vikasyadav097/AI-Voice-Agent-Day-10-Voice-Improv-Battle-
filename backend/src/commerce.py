"""
E-commerce backend following ACP-inspired patterns.
Handles product catalog, cart, and order management.
"""

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

# Product catalog
PRODUCTS = [
    {
        "id": "mug-001",
        "name": "Cyberpunk Coffee Mug",
        "description": "Neon-lit ceramic mug with LED base",
        "price": 899,
        "currency": "INR",
        "category": "mug",
        "color": "black",
        "stock": 15,
        "image": "☕"
    },
    {
        "id": "mug-002",
        "name": "Hacker's Energy Mug",
        "description": "Extra large mug for long coding sessions",
        "price": 1299,
        "currency": "INR",
        "category": "mug",
        "color": "white",
        "stock": 8,
        "image": "☕"
    },
    {
        "id": "tshirt-001",
        "name": "Neural Network T-Shirt",
        "description": "100% cotton with circuit board design",
        "price": 799,
        "currency": "INR",
        "category": "tshirt",
        "color": "black",
        "size": ["S", "M", "L", "XL"],
        "stock": 25,
        "image": "👕"
    },
    {
        "id": "tshirt-002",
        "name": "AI Developer Tee",
        "description": "Soft fabric with 'Powered by AI' print",
        "price": 699,
        "currency": "INR",
        "category": "tshirt",
        "color": "navy",
        "size": ["S", "M", "L", "XL"],
        "stock": 30,
        "image": "👕"
    },
    {
        "id": "hoodie-001",
        "name": "Cyberpunk Hoodie",
        "description": "Premium hoodie with neon accents",
        "price": 1999,
        "currency": "INR",
        "category": "hoodie",
        "color": "black",
        "size": ["M", "L", "XL"],
        "stock": 12,
        "image": "🧥"
    },
    {
        "id": "hoodie-002",
        "name": "Code Warrior Hoodie",
        "description": "Warm and comfortable for late-night coding",
        "price": 2299,
        "currency": "INR",
        "category": "hoodie",
        "color": "gray",
        "size": ["M", "L", "XL"],
        "stock": 10,
        "image": "🧥"
    },
    {
        "id": "cap-001",
        "name": "Tech Geek Cap",
        "description": "Adjustable cap with embroidered logo",
        "price": 499,
        "currency": "INR",
        "category": "cap",
        "color": "black",
        "stock": 20,
        "image": "🧢"
    },
    {
        "id": "bag-001",
        "name": "Developer Backpack",
        "description": "Laptop compartment with USB charging port",
        "price": 2499,
        "currency": "INR",
        "category": "bag",
        "color": "black",
        "stock": 8,
        "image": "🎒"
    },
    {
        "id": "mouse-001",
        "name": "RGB Gaming Mouse",
        "description": "Ergonomic design with customizable RGB",
        "price": 1499,
        "currency": "INR",
        "category": "accessory",
        "color": "black",
        "stock": 15,
        "image": "🖱️"
    },
    {
        "id": "keyboard-001",
        "name": "Mechanical Keyboard",
        "description": "Cherry MX switches with RGB backlight",
        "price": 3999,
        "currency": "INR",
        "category": "accessory",
        "color": "black",
        "stock": 6,
        "image": "⌨️"
    }
]

# Order storage
ORDERS_DIR = Path("../shared-data/orders")
ORDERS_DIR.mkdir(parents=True, exist_ok=True)
ORDER_HISTORY_FILE = ORDERS_DIR / "order_history.json"

# Session carts (in-memory)
session_carts = {}


def list_products(
    category: Optional[str] = None,
    max_price: Optional[int] = None,
    color: Optional[str] = None,
    search: Optional[str] = None
) -> list[dict]:
    """
    List products with optional filters.
    ACP-inspired catalog browsing.
    """
    results = PRODUCTS.copy()
    
    if category:
        results = [p for p in results if p.get("category", "").lower() == category.lower()]
    
    if max_price:
        results = [p for p in results if p["price"] <= max_price]
    
    if color:
        results = [p for p in results if p.get("color", "").lower() == color.lower()]
    
    if search:
        search_lower = search.lower()
        results = [
            p for p in results
            if search_lower in p["name"].lower() or search_lower in p.get("description", "").lower()
        ]
    
    return results


def get_product_by_id(product_id: str) -> Optional[dict]:
    """Get a specific product by ID."""
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product
    return None


def add_to_cart(session_id: str, product_id: str, quantity: int = 1, size: Optional[str] = None) -> dict:
    """
    Add item to session cart.
    Returns updated cart.
    """
    if session_id not in session_carts:
        session_carts[session_id] = {"items": []}
    
    cart = session_carts[session_id]
    
    # Check if item already in cart
    for item in cart["items"]:
        if item["product_id"] == product_id and item.get("size") == size:
            item["quantity"] += quantity
            return cart
    
    # Add new item
    cart["items"].append({
        "product_id": product_id,
        "quantity": quantity,
        "size": size
    })
    
    return cart


def remove_from_cart(session_id: str, product_id: str) -> dict:
    """Remove item from cart."""
    if session_id not in session_carts:
        return {"items": []}
    
    cart = session_carts[session_id]
    cart["items"] = [item for item in cart["items"] if item["product_id"] != product_id]
    
    return cart


def get_cart(session_id: str) -> dict:
    """Get current cart for session."""
    if session_id not in session_carts:
        return {"items": []}
    
    cart = session_carts[session_id]
    
    # Enrich with product details
    enriched_items = []
    total = 0
    
    for item in cart["items"]:
        product = get_product_by_id(item["product_id"])
        if product:
            item_total = product["price"] * item["quantity"]
            enriched_items.append({
                **item,
                "name": product["name"],
                "price": product["price"],
                "currency": product["currency"],
                "item_total": item_total
            })
            total += item_total
    
    return {
        "items": enriched_items,
        "total": total,
        "currency": "INR"
    }


def clear_cart(session_id: str):
    """Clear the cart for a session."""
    if session_id in session_carts:
        session_carts[session_id] = {"items": []}


def create_order(session_id: str, buyer_name: Optional[str] = None) -> dict:
    """
    Create an order from cart contents.
    ACP-inspired order creation.
    """
    cart = get_cart(session_id)
    
    if not cart["items"]:
        raise ValueError("Cart is empty")
    
    # Generate order
    order_id = str(uuid.uuid4())[:8]
    order = {
        "id": order_id,
        "status": "CONFIRMED",
        "buyer": {
            "name": buyer_name or "Guest"
        },
        "line_items": [
            {
                "product_id": item["product_id"],
                "product_name": item["name"],
                "quantity": item["quantity"],
                "unit_amount": item["price"],
                "currency": item["currency"],
                "size": item.get("size"),
                "total": item["item_total"]
            }
            for item in cart["items"]
        ],
        "total": cart["total"],
        "currency": cart["currency"],
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    # Save order to file
    order_file = ORDERS_DIR / f"order_{order_id}.json"
    with open(order_file, "w") as f:
        json.dump(order, f, indent=2)
    
    # Update order history
    history = []
    if ORDER_HISTORY_FILE.exists():
        with open(ORDER_HISTORY_FILE, "r") as f:
            history = json.load(f)
    
    history.append({
        "order_id": order_id,
        "total": order["total"],
        "currency": order["currency"],
        "created_at": order["created_at"]
    })
    
    with open(ORDER_HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)
    
    # Clear cart
    clear_cart(session_id)
    
    return order


def get_order(order_id: str) -> Optional[dict]:
    """Retrieve an order by ID."""
    order_file = ORDERS_DIR / f"order_{order_id}.json"
    if order_file.exists():
        with open(order_file, "r") as f:
            return json.load(f)
    return None


def get_order_history(limit: int = 10) -> list[dict]:
    """Get recent order history."""
    if not ORDER_HISTORY_FILE.exists():
        return []
    
    with open(ORDER_HISTORY_FILE, "r") as f:
        history = json.load(f)
    
    return history[-limit:][::-1]  # Most recent first
