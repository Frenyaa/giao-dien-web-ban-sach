// Cấu trúc đơn hàng mẫu
const sampleOrder = {
    id: '', // Mã đơn hàng
    customerUsername: '', // Username của khách hàng
    customerName: '', // Tên khách hàng
    products: [], // Danh sách sản phẩm [{id, name, quantity, price}]
    total: 0, // Tổng tiền
    date: '', // Ngày đặt hàng
    status: 'waiting', // Trạng thái: waiting, confirmed, delivering, delivered, cancelled
    address: '', // Địa chỉ giao hàng
    phone: '' // Số điện thoại
};

// Lấy danh sách đơn hàng từ localStorage
function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Lưu danh sách đơn hàng vào localStorage
function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Tạo mã đơn hàng mới
function generateOrderId() {
    const timestamp = new Date().getTime();
    return 'DH' + timestamp;
}

// Tạo đơn hàng mới
function createOrder(customerInfo, cart) {
    const order = {
        id: generateOrderId(),
        customerUsername: customerInfo.username,
        customerName: customerInfo.fullName,
        products: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toISOString(),
        status: 'waiting',
        address: customerInfo.address,
        phone: customerInfo.phone
    };

    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);
    return order;
}

// Cập nhật trạng thái đơn hàng
function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrders(orders);
        return true;
    }
    return false;
}

// Lấy đơn hàng theo ID
function getOrderById(orderId) {
    const orders = getOrders();
    return orders.find(order => order.id === orderId);
}

// Lấy đơn hàng theo username khách hàng
function getOrdersByCustomer(username) {
    const orders = getOrders();
    return orders.filter(order => order.customerUsername === username);
}

// Lấy đơn hàng theo trạng thái
function getOrdersByStatus(status) {
    const orders = getOrders();
    return orders.filter(order => order.status === status);
}

// Lấy đơn hàng trong khoảng thời gian
function getOrdersByDateRange(startDate, endDate) {
    const orders = getOrders();
    return orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate;
    });
}

// Tìm kiếm đơn hàng
function searchOrders(keyword) {
    const orders = getOrders();
    return orders.filter(order => 
        order.id.toLowerCase().includes(keyword.toLowerCase()) ||
        order.customerName.toLowerCase().includes(keyword.toLowerCase()) ||
        order.phone.includes(keyword)
    );
}

// Format trạng thái đơn hàng sang tiếng Việt
function formatOrderStatus(status) {
    const statusMap = {
        'waiting': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'delivering': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
} 