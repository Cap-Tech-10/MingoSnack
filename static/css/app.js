function toggleCartPopup() {
    var popup = document.getElementById('cart-popup');
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
}

function closeCart() {
    document.getElementById('cart-popup').style.display = 'none';
}

function addToCart(itemName, itemPrice) {
    fetch('/add_to_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `item_name=${encodeURIComponent(itemName)}&item_price=${encodeURIComponent(itemPrice)}`
    })
    .then(response => response.json())
    .then(data => {
        updateCart(data.cart);
        document.getElementById('cart-count').innerText = data.cart_count;
    });
}

function updateCart(cart) {
    const cartItems = document.querySelector('#cart-items tbody');
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.total.toFixed(2)}</td>
        `;
        cartItems.appendChild(row);
    });

    const total = cart.reduce((acc, item) => acc + item.total, 0);
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function generateBill() {
    fetch('/generate_bill', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        showBillModal(data);
    });
}

function showBillModal(bill) {
    const billModal = document.getElementById('bill-modal');
    const billItems = document.querySelector('#bill-items tbody');
    const billTimestamp = document.getElementById('bill-timestamp');
    const billTotal = document.getElementById('bill-total');

    billItems.innerHTML = '';
    bill.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.total.toFixed(2)}</td>
        `;
        billItems.appendChild(row);
    });

    billTimestamp.innerText = bill.timestamp;
    billTotal.innerText = bill.total.toFixed(2);

    billModal.style.display = 'block';
}

function closeBillModal() {
    document.getElementById('bill-modal').style.display = 'none';
}