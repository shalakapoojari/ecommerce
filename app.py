from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import BadRequest
from functools import wraps
import json
import re
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import razorpay
from html import escape

load_dotenv()

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# ==================== SECURITY CONFIG ====================
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)

CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5000", "http://127.0.0.1:5000"]}})

# ==================== SECURITY HEADERS ====================
@app.after_request
def set_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

# ==================== SECURITY HELPERS ====================
def sanitize_input(value):
    """Sanitize user input to prevent XSS"""
    if isinstance(value, str):
        return escape(value.strip())
    return value

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_product_data(data):
    """Validate product data"""
    required_fields = ['name', 'price', 'category', 'description']
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return False, f"Missing required field: {field}"
    
    try:
        price = float(data['price'])
        if price < 0 or price > 999999:
            return False, "Price must be between 0 and 999999"
    except (ValueError, TypeError):
        return False, "Invalid price format"
    
    return True, "Valid"

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
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        if email in mock_users and check_password_hash(mock_users[email], password):
            session['user'] = email
            session.permanent = True
            return jsonify({"success": True, "user": email}), 200
        
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "Login failed"}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        
        if email in mock_users:
            return jsonify({"error": "Email already registered"}), 400
        
        mock_users[email] = generate_password_hash(password)
        session['user'] = email
        session.permanent = True
        return jsonify({"success": True, "user": email}), 201
    except Exception as e:
        app.logger.error(f"Signup error: {str(e)}")
        return jsonify({"error": "Signup failed"}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"success": True}), 200

@app.route('/api/auth/user', methods=['GET'])
def get_user():
    if 'user' in session:
        return jsonify({"user": session['user']}), 200
    return jsonify({"user": None}), 200

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
    """Get Razorpay key status - only return key if configured"""
    return jsonify({
        "configured": bool(RAZORPAY_KEY_ID),
        "key": RAZORPAY_KEY_ID if RAZORPAY_KEY_ID else None
    })

@app.route('/api/payment/create-order', methods=['POST'])
@login_required
def create_payment_order():
    """Create Razorpay payment order"""
    if not razorpay_client:
        return jsonify({"error": "Payment gateway not configured"}), 503
    
    try:
        data = request.get_json()
        if not data or 'amount' not in data:
            return jsonify({"error": "Missing amount"}), 400
        
        try:
            amount = float(data['amount'])
            if amount < 1 or amount > 999999:
                return jsonify({"error": "Invalid amount"}), 400
            amount_paise = int(amount * 100)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid amount format"}), 400
        
        razorpay_order = razorpay_client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'payment_capture': 1
        })
        return jsonify(razorpay_order), 201
    except Exception as e:
        app.logger.error(f"Razorpay order creation error: {str(e)}")
        return jsonify({"error": "Payment processing error"}), 500

@app.route('/api/payment/verify', methods=['POST'])
@login_required
def verify_payment():
    """Verify Razorpay payment signature"""
    if not razorpay_client:
        return jsonify({"error": "Payment gateway not configured"}), 503
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing payment data"}), 400
        
        required_fields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing payment fields"}), 400
        
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': data['razorpay_order_id'],
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_signature': data['razorpay_signature']
        })
        return jsonify({"success": True}), 200
    except razorpay.errors.SignatureVerificationError:
        return jsonify({"error": "Invalid payment signature"}), 403
    except Exception as e:
        app.logger.error(f"Payment verification error: {str(e)}")
        return jsonify({"error": "Verification failed"}), 500

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
    if session.get('user') != 'admin@example.com':
        return jsonify({"error": "Unauthorized"}), 403
    
    if request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            is_valid, error_msg = validate_product_data(data)
            if not is_valid:
                return jsonify({"error": error_msg}), 400
            
            product = {
                'id': str(len(products) + 1),
                'name': sanitize_input(data['name']),
                'description': sanitize_input(data['description']),
                'category': sanitize_input(data['category']),
                'price': float(data['price']),
                'inStock': bool(data.get('inStock', True)),
                'featured': bool(data.get('featured', False)),
                'bestseller': bool(data.get('bestseller', False)),
                'newArrival': bool(data.get('newArrival', False)),
                'sizes': [sanitize_input(s) for s in data.get('sizes', [])],
                'images': [sanitize_input(i) for i in data.get('images', [])],
                'createdAt': datetime.now().isoformat()
            }
            products.append(product)
            return jsonify(product), 201
        except Exception as e:
            app.logger.error(f"Product creation error: {str(e)}")
            return jsonify({"error": "Failed to create product"}), 500
    
    return jsonify(products), 200

@app.route('/api/admin/products/<product_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def admin_product(product_id):
    if session.get('user') != 'admin@example.com':
        return jsonify({"error": "Unauthorized"}), 403
    
    product_id = sanitize_input(product_id)
    
    if request.method == 'GET':
        product = next((p for p in products if p['id'] == product_id), None)
        if product:
            return jsonify(product), 200
        return jsonify({"error": "Product not found"}), 404
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            product = next((p for p in products if p['id'] == product_id), None)
            if not product:
                return jsonify({"error": "Product not found"}), 404
            
            if 'name' in data:
                product['name'] = sanitize_input(data['name'])
            if 'description' in data:
                product['description'] = sanitize_input(data['description'])
            if 'category' in data:
                product['category'] = sanitize_input(data['category'])
            if 'price' in data:
                try:
                    price = float(data['price'])
                    if price < 0 or price > 999999:
                        return jsonify({"error": "Invalid price"}), 400
                    product['price'] = price
                except (ValueError, TypeError):
                    return jsonify({"error": "Invalid price format"}), 400
            if 'inStock' in data:
                product['inStock'] = bool(data['inStock'])
            if 'featured' in data:
                product['featured'] = bool(data['featured'])
            if 'bestseller' in data:
                product['bestseller'] = bool(data['bestseller'])
            if 'newArrival' in data:
                product['newArrival'] = bool(data['newArrival'])
            if 'sizes' in data:
                product['sizes'] = [sanitize_input(s) for s in data.get('sizes', [])]
            if 'images' in data:
                product['images'] = [sanitize_input(i) for i in data.get('images', [])]
            
            product['updatedAt'] = datetime.now().isoformat()
            return jsonify(product), 200
        except Exception as e:
            app.logger.error(f"Product update error: {str(e)}")
            return jsonify({"error": "Failed to update product"}), 500
    
    elif request.method == 'DELETE':
        global products
        if not any(p['id'] == product_id for p in products):
            return jsonify({"error": "Product not found"}), 404
        products = [p for p in products if p['id'] != product_id]
        return jsonify({"success": True}), 200
    
    return jsonify({"error": "Method not allowed"}), 405

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

# ==================== ERROR HANDLERS ====================
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f"Internal server error: {str(error)}")
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(403)
def forbidden(error):
    return jsonify({"error": "Access forbidden"}), 403

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad request"}), 400

# ==================== HEALTH CHECK ====================
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "payment_configured": bool(RAZORPAY_KEY_ID)
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
