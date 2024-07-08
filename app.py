from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

# In-memory data storage for simplicity
cart = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    item_name = request.form.get('item_name')
    item_price = float(request.form.get('item_price'))

    # Check if item is already in cart
    for item in cart:
        if item['name'] == item_name:
            item['quantity'] += 1
            item['total'] += item_price
            break
    else:
        cart.append({'name': item_name, 'price': item_price, 'quantity': 1, 'total': item_price})

    return jsonify({'cart': cart, 'cart_count': len(cart)})

@app.route('/generate_bill', methods=['POST'])
def generate_bill():
    total = sum(item['total'] for item in cart)
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    bill = {
        'items': cart.copy(),
        'total': total,
        'timestamp': timestamp,
    }

    # Clear the cart
    cart.clear()

    return jsonify(bill)

if __name__ == '__main__':
    app.run(debug=True)
