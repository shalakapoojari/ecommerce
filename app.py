from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import json
from datetime import datetime
from dotenv import load_dotenv
import os
import razorpay

load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
CORS(app)

# ==================== RAZORPAY CONFIG ====================
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '')

if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    razorpay_client = None

# ==================== MOCK DATA ====================
products = [
    {
        "id": "1",
        "name": "Essential Cashmere Sweater",
        "price": 295,
        "description": "Luxuriously soft cashmere sweater with a relaxed fit.",
        "category": "Knitwear",
        "images": ["minimal-beige-cashmere-sweater-on-model.jpg"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "inStock": True,
        "featured": True,
        "bestseller": True,
    },
    {
        "id": "2",
        "name": "Tailored Wool Trousers",
        "price": 245,
        "description": "Classic tailored trousers crafted from premium wool.",
        "category": "Trousers",
        "images": ["charcoal-grey-wool-trousers-on-model-minimal.jpg"],
        "sizes": ["28", "30", "32", "34", "36"],
        "inStock": True,
        "featured": True,
    },
    {
        "id": "3",
        "name": "Organic Cotton Tee",
        "price": 85,
        "description": "Essential crew neck tee made from premium organic cotton.",
        "category": "Basics",
        "images": ["white-cotton-t-shirt-on-model-minimal-clean.jpg"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "inStock": True,
        "newArrival": True,
    },
    {
        "id": "4",
        "name": "Silk Button-Down Shirt",
        "price": 325,
        "description": "Elegant silk shirt with mother-of-pearl buttons.",
        "category": "Shirts",
        "images": ["ivory-silk-shirt-on-model-minimal-elegant.jpg"],
        "sizes": ["XS", "S", "M", "L"],
        "inStock": True,
        "newArrival": True,
    },
    {
        "id": "5",
        "name": "Merino Wool Cardigan",
        "price": 275,
        "description": "Lightweight merino wool cardigan.",
        "category": "Knitwear",
        "images": ["navy-merino-wool-cardigan-on-model.jpg"],
        "sizes": ["S", "M", "L", "XL"],
        "inStock": True,
        "featured": True,
    },
    {
        "id": "6",
        "name": "Linen Wide-Leg Pants",
        "price": 195,
        "description": "Flowing wide-leg pants in breathable linen.",
        "category": "Trousers",
        "images": ["natural-linen-wide-leg-pants-on-model.jpg"],
        "sizes": ["XS", "S", "M", "L"],
        "inStock": False,
    },
    {
        "id": "7",
        "name": "Leather Minimal Tote",
        "price": 425,
        "description": "Handcrafted leather tote with clean lines.",
        "category": "Accessories",
        "images": ["tan-leather-tote-bag-minimal.jpg"],
        "sizes": ["One Size"],
        "inStock": True,
        "featured": True,
        "bestseller": True,
    },
    {
        "id": "8",
        "name": "Cashmere Scarf",
        "price": 165,
        "description": "Soft cashmere scarf in a versatile neutral tone.",
        "category": "Accessories",
        "images": ["beige-cashmere-scarf-styled.jpg"],
        "sizes": ["One Size"],
        "inStock": True,
        "newArrival": True,
    },
]

collections = [
    {
        "id": "essentials",
        "name": "Essentials",
        "description": "Timeless pieces for everyday elegance",
    },
    {
        "id": "knitwear",
        "name": "Knitwear",
        "description": "Luxurious knits for every season",
    },
    {
        "id": "tailoring",
        "name": "Tailoring",
        "description": "Precision-crafted suiting and trousers",
    },
]

mock_users = {
    "user@example.com": generate_password_hash("password123")
}

orders = []

# ==================== AUTHENTICATION ====================
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if email in mock_users and check_password_hash(mock_users[email], password):
        session['user'] = email
        return jsonify({"success": True, "user": email})
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if email in mock_users:
        return jsonify({"error": "Email already registered"}), 400
    
    mock_users[email] = generate_password_hash(password)
    session['user'] = email
    return jsonify({"success": True, "user": email})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"success": True})

@app.route('/api/auth/user', methods=['GET'])
def get_user():
    if 'user' in session:
        return jsonify({"user": session['user']})
    return jsonify({"user": None})

# ==================== PRODUCTS ====================
@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({"error": "Product not found"}), 404

@app.route('/api/products/category/<category>', methods=['GET'])
def get_products_by_category(category):
    category_products = [p for p in products if p['category'] == category]
    return jsonify(category_products)

# ==================== COLLECTIONS ====================
@app.route('/api/collections', methods=['GET'])
def get_collections():
    return jsonify(collections)

@app.route('/api/collections/<collection_id>', methods=['GET'])
def get_collection(collection_id):
    collection = next((c for c in collections if c['id'] == collection_id), None)
    if collection:
        return jsonify(collection)
    return jsonify({"error": "Collection not found"}), 404

# ==================== CART ====================
@app.route('/api/cart', methods=['GET'])
def get_cart():
    if 'cart' not in session:
        session['cart'] = []
    return jsonify(session['cart'])

@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    if 'cart' not in session:
        session['cart'] = []
    
    item = {
        'id': data.get('id'),
        'name': data.get('name'),
        'price': data.get('price'),
        'size': data.get('size'),
        'quantity': data.get('quantity', 1),
        'image': data.get('image')
    }
    
    # Check if item already in cart
    existing = next((i for i in session['cart'] if i['id'] == item['id'] and i['size'] == item['size']), None)
    if existing:
        existing['quantity'] += item['quantity']
    else:
        session['cart'].append(item)
    
    session.modified = True
    return jsonify({"success": True, "cart": session['cart']})

@app.route('/api/cart/<item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    if 'cart' in session:
        session['cart'] = [i for i in session['cart'] if i['id'] != item_id]
        session.modified = True
    return jsonify({"success": True, "cart": session.get('cart', [])})

@app.route('/api/cart/update', methods=['PUT'])
def update_cart():
    data = request.get_json()
    if 'cart' in session:
        item = next((i for i in session['cart'] if i['id'] == data.get('id') and i['size'] == data.get('size')), None)
        if item:
            item['quantity'] = data.get('quantity', 1)
            if item['quantity'] <= 0:
                session['cart'].remove(item)
        session.modified = True
    return jsonify({"success": True, "cart": session.get('cart', [])})

@app.route('/api/cart/clear', methods=['POST'])
def clear_cart():
    session['cart'] = []
    session.modified = True
    return jsonify({"success": True})

# ==================== PAYMENT ====================
@app.route('/api/payment/razorpay-key', methods=['GET'])
def get_razorpay_key():
    if not RAZORPAY_KEY_ID:
        return jsonify({"error": "Razorpay not configured"}), 400
    return jsonify({"key": RAZORPAY_KEY_ID})

@app.route('/api/payment/create-order', methods=['POST'])
@login_required
def create_payment_order():
    if not razorpay_client:
        return jsonify({"error": "Payment gateway not configured"}), 400
    
    data = request.get_json()
    amount = int(data.get('amount', 0) * 100)  # Convert to paise
    
    try:
        razorpay_order = razorpay_client.order.create({
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1
        })
        return jsonify(razorpay_order)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/payment/verify', methods=['POST'])
@login_required
def verify_payment():
    data = request.get_json()
    
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': data.get('razorpay_order_id'),
            'razorpay_payment_id': data.get('razorpay_payment_id'),
            'razorpay_signature': data.get('razorpay_signature')
        })
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ==================== ORDERS ====================
@app.route('/api/orders', methods=['POST'])
@login_required
def create_order():
    data = request.get_json()
    order = {
        'id': f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        'customerId': session['user'],
        'customerEmail': session['user'],
        'date': datetime.now().isoformat(),
        'status': 'pending',
        'paymentStatus': data.get('paymentStatus', 'pending'),
        'paymentMethod': data.get('paymentMethod', 'razorpay'),
        'razorpayOrderId': data.get('razorpayOrderId'),
        'razorpayPaymentId': data.get('razorpayPaymentId'),
        'items': data.get('items', []),
        'total': data.get('total', 0),
        'shippingAddress': data.get('shippingAddress', {}),
    }
    orders.append(order)
    session['cart'] = []
    session.modified = True
    return jsonify(order), 201

@app.route('/api/orders', methods=['GET'])
@login_required
def get_orders():
    user_orders = [o for o in orders if o['customerId'] == session['user']]
    return jsonify(user_orders)

@app.route('/api/orders/<order_id>', methods=['GET'])
@login_required
def get_order(order_id):
    order = next((o for o in orders if o['id'] == order_id and o['customerId'] == session['user']), None)
    if order:
        return jsonify(order)
    return jsonify({"error": "Order not found"}), 404

# ==================== ADMIN ====================
@app.route('/api/admin/orders', methods=['GET'])
@login_required
def admin_get_orders():
    if session['user'] != 'admin@example.com':
        return jsonify({"error": "Unauthorized"}), 403
    return jsonify(orders)

@app.route('/api/admin/products', methods=['GET', 'POST'])
@login_required
def admin_products():
    if session['user'] != 'admin@example.com':
        return jsonify({"error": "Unauthorized"}), 403
    
    if request.method == 'POST':
        product = request.get_json()
        product['id'] = str(len(products) + 1)
        product['inStock'] = product.get('inStock', True)
        product['featured'] = product.get('featured', False)
        product['bestseller'] = product.get('bestseller', False)
        product['newArrival'] = product.get('newArrival', False)
        product['sizes'] = product.get('sizes', [])
        product['images'] = product.get('images', [])
        products.append(product)
        return jsonify(product), 201
    
    return jsonify(products)

@app.route('/api/admin/products/<product_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def admin_product(product_id):
    if session['user'] != 'admin@example.com':
        return jsonify({"error": "Unauthorized"}), 403
    
    if request.method == 'GET':
        product = next((p for p in products if p['id'] == product_id), None)
        if product:
            return jsonify(product)
        return jsonify({"error": "Product not found"}), 404
    
    elif request.method == 'PUT':
        data = request.get_json()
        product = next((p for p in products if p['id'] == product_id), None)
        if product:
            product.update(data)
            return jsonify(product)
        return jsonify({"error": "Product not found"}), 404
    
    elif request.method == 'DELETE':
        global products
        products = [p for p in products if p['id'] != product_id]
        return jsonify({"success": True})
    
    return jsonify({"error": "Not found"}), 404

# ==================== PAGES ====================
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/product/<product_id>')
def product_detail(product_id):
    return render_template('product.html', product_id=product_id)

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/checkout')
def checkout():
    return render_template('checkout.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

if __name__ == '__main__':
    app.run(debug=True)
