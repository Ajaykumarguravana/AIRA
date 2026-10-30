from app.database import engine, Base, SessionLocal
from app.models import User, Product, Alert

def init_database():
    # Create all tables in PostgreSQL / database if they don't exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if default user exists
        user_count = db.query(User).count()
        if user_count == 0:
            default_user = User(
                email="owner@airamart.in",
                password_hash="pbkdf2:sha256:default_hash_value",
                store_name="AIRA Mart & Superstore",
                owner_name="Store Owner",
                role="Store Manager (Admin)"
            )
            db.add(default_user)

        # Check if products exist
        prod_count = db.query(Product).count()
        if prod_count == 0:
            demo_products = [
                Product(
                    name="India Gate Basmati Rice 5kg",
                    category="Grocery",
                    sku="GRO-101",
                    stock=24,
                    min_stock=10,
                    price=495.0,
                    cost_price=380.0,
                    unit_profit=115.0,
                    margin=23.2,
                    roi=30.3,
                    status="Healthy",
                    sales_velocity="High",
                    units_sold=1240,
                    revenue=613800.0,
                    total_profit=142600.0,
                    image="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80",
                    primary_advice_type="restock",
                    advice_title="AIRA Restock Suggestion",
                    advice_text="🔥 Fast Seller: Restock 45 units to meet projected weekend demand surge (+28%).",
                    order_recommendation=45,
                    confidence=94
                ),
                Product(
                    name="Fortune Sunflower Oil 1L",
                    category="Grocery",
                    sku="GRO-102",
                    stock=4,
                    min_stock=15,
                    price=145.0,
                    cost_price=112.0,
                    unit_profit=33.0,
                    margin=22.8,
                    roi=29.5,
                    status="Critical",
                    sales_velocity="High",
                    units_sold=980,
                    revenue=142100.0,
                    total_profit=32340.0,
                    image="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
                    primary_advice_type="restock",
                    advice_title="AIRA Restock Suggestion",
                    advice_text="🚨 Critical Stock (4 left): Restock 40 units immediately to avoid stockout in 2 days.",
                    order_recommendation=40,
                    confidence=96
                ),
                Product(
                    name="Amul Taaza Toned Milk 1L",
                    category="Dairy",
                    sku="DAI-101",
                    stock=12,
                    min_stock=25,
                    price=68.0,
                    cost_price=56.0,
                    unit_profit=12.0,
                    margin=17.6,
                    roi=21.4,
                    status="Low Stock",
                    sales_velocity="High",
                    units_sold=980,
                    revenue=66640.0,
                    total_profit=11760.0,
                    image="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80",
                    primary_advice_type="expiry",
                    advice_title="Near Expiry Clearance Offer %",
                    advice_text="⏳ Near Expiry (2 days left): Apply 25% Evening Clearance Discount (₹51/unit) for break-even profit.",
                    order_recommendation=55,
                    confidence=92
                ),
                Product(
                    name="Parle-G Gold Biscuits 800g",
                    category="Snacks",
                    sku="SNA-101",
                    stock=48,
                    min_stock=20,
                    price=85.0,
                    cost_price=62.0,
                    unit_profit=23.0,
                    margin=27.1,
                    roi=37.1,
                    status="Healthy",
                    sales_velocity="High",
                    units_sold=1240,
                    revenue=105400.0,
                    total_profit=28520.0,
                    image="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80",
                    primary_advice_type="restock",
                    advice_title="AIRA Restock Suggestion",
                    advice_text="📈 Steady High Velocity: Maintain buffer; reorder 50 units next Tuesday.",
                    order_recommendation=50,
                    confidence=90
                ),
                Product(
                    name="Colgate MaxFresh Toothpaste 150g",
                    category="Personal Care",
                    sku="PER-102",
                    stock=38,
                    min_stock=15,
                    price=115.0,
                    cost_price=85.0,
                    unit_profit=30.0,
                    margin=26.1,
                    roi=35.3,
                    status="Healthy",
                    sales_velocity="Medium",
                    units_sold=540,
                    revenue=62100.0,
                    total_profit=16200.0,
                    image="https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=300&q=80",
                    primary_advice_type="combo",
                    advice_title="AIRA Combo Sales Offer",
                    advice_text="🍔 Boost Sales: Pair with Toothbrush 2-pack for 'Complete Oral Care Kit' (12% off).",
                    order_recommendation=20,
                    confidence=89
                )
            ]
            db.add_all(demo_products)

        # Check if alerts exist
        alert_count = db.query(Alert).count()
        if alert_count == 0:
            demo_alerts = [
                Alert(title="Fortune Sunflower Oil Stock Alert", desc="Fortune Sunflower Oil is below minimum threshold (4 units remaining). Expected stockout in 2 days.", type="critical", priority="High Priority", time="10 mins ago"),
                Alert(title="Amul Milk Low Stock Warning", desc="Amul Taaza Milk has 12 units remaining. Reorder recommendation: 55 units.", type="warning", priority="Medium Priority", time="1 hour ago"),
                Alert(title="Cold Drinks Sales Velocity Increase", desc="Thums Up 2L sales increased 18% over the past 24 hours.", type="opportunity", priority="Low Priority", time="3 hours ago"),
            ]
            db.add_all(demo_alerts)

        db.commit()
        print("[Database] PostgreSQL / SQLAlchemy schema initialized and seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"[Database] Notice initializing DB tables: {e}")
    finally:
        db.close()
