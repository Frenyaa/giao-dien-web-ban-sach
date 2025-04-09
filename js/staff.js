// Khởi tạo các biến và hàm cần thiết
let danhSachSach = [];
let danhSachDonHang = [];

// Hàm đăng xuất
function logOutStaff() {
    localStorage.removeItem('staffLoggedIn');
    localStorage.removeItem('staffName');
    window.location.href = 'index.html';
}

// Hàm chuyển đổi giữa các tab
function showTab(tabName) {
    // Ẩn tất cả các tab
    document.querySelectorAll('.main > div').forEach(tab => {
        tab.style.display = 'none';
    });

    // Hiển thị tab được chọn
    document.querySelector(`.${tabName}`).style.display = 'block';

    // Cập nhật trạng thái active của menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-link[data-tab="${tabName}"]`).classList.add('active');
}

// Hàm tự động tạo mã sách
function autoMaSach() {
    const prefix = "S";
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    document.getElementById('masachThem').value = prefix + randomNum;
}

// Hàm cập nhật ảnh sách
function capNhatAnhSach(files, id) {
    if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(id).src = e.target.result;
        }
        reader.readAsDataURL(files[0]);
    }
}

// Hàm thêm sách mới
function themSach() {
    const inputs = document.querySelectorAll('#khungThemSach input, #khungThemSach select, #khungThemSach textarea');
    const sachMoi = {
        masach: inputs[0].value,
        ten: inputs[1].value,
        tacgia: inputs[2].value,
        theloai: inputs[3].value,
        hinhanh: document.getElementById('anhDaiDienSachThem').src,
        gia: inputs[4].value,
        soluong: inputs[5].value,
        mota: inputs[6].value
    };

    danhSachSach.push(sachMoi);
    hienThiDanhSachSach();
    document.getElementById('khungThemSach').style.transform = 'scale(0)';
    
    // Reset form
    document.getElementById('khungThemSach').querySelectorAll('input, textarea').forEach(input => {
        input.value = '';
    });
    document.getElementById('anhDaiDienSachThem').src = '';
}

// Hàm hiển thị danh sách sách
function hienThiDanhSachSach() {
    const tableContent = document.querySelector('.quanlysach .table-content');
    tableContent.innerHTML = '';

    danhSachSach.forEach((sach, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${sach.masach}</td>
            <td>${sach.ten}</td>
            <td>${sach.tacgia}</td>
            <td>${formatMoney(sach.gia)}</td>
            <td>${sach.soluong}</td>
            <td>
                <button onclick="suaSach(${index})"><i class="fa fa-pencil"></i></button>
                <button onclick="xoaSach(${index})"><i class="fa fa-trash"></i></button>
            </td>
        `;
        tableContent.appendChild(row);
    });
}

// Hàm sửa sách
function suaSach(index) {
    const sach = danhSachSach[index];
    const khungSua = document.getElementById('khungSuaSach');
    
    khungSua.innerHTML = `
        <span class="close" onclick="this.parentElement.style.transform = 'scale(0)';">&times;</span>
        <table class="overlayTable table-outline table-content table-header">
            <tr>
                <th colspan="2">Sửa Sách</th>
            </tr>
            <tr>
                <td>Mã sách:</td>
                <td><input type="text" value="${sach.masach}" readonly></td>
            </tr>
            <tr>
                <td>Tên sách:</td>
                <td><input type="text" value="${sach.ten}"></td>
            </tr>
            <tr>
                <td>Tác giả:</td>
                <td><input type="text" value="${sach.tacgia}"></td>
            </tr>
            <tr>
                <td>Thể loại:</td>
                <td>
                    <select>
                        <option value="vanhoc" ${sach.theloai === 'vanhoc' ? 'selected' : ''}>Văn học</option>
                        <option value="khoahoc" ${sach.theloai === 'khoahoc' ? 'selected' : ''}>Khoa học</option>
                        <option value="tieuthuyet" ${sach.theloai === 'tieuthuyet' ? 'selected' : ''}>Tiểu thuyết</option>
                        <option value="truyentranh" ${sach.theloai === 'truyentranh' ? 'selected' : ''}>Truyện tranh</option>
                        <option value="sachgiaokhoa" ${sach.theloai === 'sachgiaokhoa' ? 'selected' : ''}>Sách giáo khoa</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>Hình ảnh:</td>
                <td>
                    <img class="hinhDaiDien" src="${sach.hinhanh}">
                    <input type="file" accept="image/*" onchange="capNhatAnhSach(this.files, this.previousElementSibling)">
                </td>
            </tr>
            <tr>
                <td>Giá tiền:</td>
                <td><input type="text" value="${sach.gia}"></td>
            </tr>
            <tr>
                <td>Số lượng:</td>
                <td><input type="number" value="${sach.soluong}"></td>
            </tr>
            <tr>
                <td>Mô tả:</td>
                <td><textarea rows="4">${sach.mota}</textarea></td>
            </tr>
            <tr>
                <td colspan="2" class="table-footer">
                    <button onclick="luuSuaSach(${index})">LƯU</button>
                </td>
            </tr>
        </table>
    `;
    khungSua.style.transform = 'scale(1)';
}

// Hàm lưu sách sau khi sửa
function luuSuaSach(index) {
    const inputs = document.querySelectorAll('#khungSuaSach input, #khungSuaSach select, #khungSuaSach textarea');
    const img = document.querySelector('#khungSuaSach img');
    
    danhSachSach[index] = {
        masach: inputs[0].value,
        ten: inputs[1].value,
        tacgia: inputs[2].value,
        theloai: inputs[3].value,
        hinhanh: img.src,
        gia: inputs[4].value,
        soluong: inputs[5].value,
        mota: inputs[6].value
    };

    hienThiDanhSachSach();
    document.getElementById('khungSuaSach').style.transform = 'scale(0)';
}

// Hàm xóa sách
function xoaSach(index) {
    if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
        danhSachSach.splice(index, 1);
        hienThiDanhSachSach();
    }
}

// Hàm tìm kiếm sách
function timKiemSach(input) {
    const searchValue = input.value.toLowerCase();
    const searchType = document.querySelector('select[name="kieuTimSach"]').value;
    
    const filteredBooks = danhSachSach.filter(sach => {
        if (searchType === 'ma') {
            return sach.masach.toLowerCase().includes(searchValue);
        } else if (searchType === 'ten') {
            return sach.ten.toLowerCase().includes(searchValue);
        } else if (searchType === 'tacgia') {
            return sach.tacgia.toLowerCase().includes(searchValue);
        }
    });

    const tableContent = document.querySelector('.quanlysach .table-content');
    tableContent.innerHTML = '';

    filteredBooks.forEach((sach, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${sach.masach}</td>
            <td>${sach.ten}</td>
            <td>${sach.tacgia}</td>
            <td>${formatMoney(sach.gia)}</td>
            <td>${sach.soluong}</td>
            <td>
                <button onclick="suaSach(${danhSachSach.indexOf(sach)})"><i class="fa fa-pencil"></i></button>
                <button onclick="xoaSach(${danhSachSach.indexOf(sach)})"><i class="fa fa-trash"></i></button>
            </td>
        `;
        tableContent.appendChild(row);
    });
}

// Hàm sắp xếp bảng sách
function sortBooksTable(column) {
    danhSachSach.sort((a, b) => {
        if (column === 'stt') return 0;
        if (column === 'masach') return a.masach.localeCompare(b.masach);
        if (column === 'ten') return a.ten.localeCompare(b.ten);
        if (column === 'tacgia') return a.tacgia.localeCompare(b.tacgia);
        if (column === 'gia') return a.gia - b.gia;
        if (column === 'soluong') return a.soluong - b.soluong;
    });
    hienThiDanhSachSach();
}

// Hàm định dạng tiền
function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Kiểm tra đăng nhập
window.onload = function() {
    if (!localStorage.getItem('staffLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    loadCustomers();
};

// Load danh sách khách hàng
function loadCustomers() {
    const customers = getListUser();
    displayCustomers(customers);
}

// Hiển thị danh sách khách hàng
function displayCustomers(customers) {
    const tbody = document.getElementById('customerList');
    tbody.innerHTML = '';

    customers.forEach((customer, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${customer.ho} ${customer.ten}</td>
            <td>${customer.email}</td>
            <td>${customer.username}</td>
            <td>
                <span class="customer-status ${customer.off ? 'status-blocked' : 'status-active'}">
                    ${customer.off ? 'Đã khóa' : 'Đang hoạt động'}
                </span>
            </td>
            <td class="action-buttons">
                ${customer.off 
                    ? `<button class="btn-unblock" onclick="toggleBlockCustomer('${customer.username}', false)">
                         <i class="fa fa-unlock"></i> Mở khóa
                       </button>`
                    : `<button class="btn-block" onclick="toggleBlockCustomer('${customer.username}', true)">
                         <i class="fa fa-lock"></i> Khóa
                       </button>`
                }
                <button class="btn-view" onclick="viewCustomerDetails('${customer.username}')">
                    <i class="fa fa-eye"></i> Chi tiết
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Tìm kiếm khách hàng
function searchCustomers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const customers = getListUser();
    
    const filteredCustomers = customers.filter(customer => 
        customer.username.toLowerCase().includes(searchTerm) ||
        customer.ho.toLowerCase().includes(searchTerm) ||
        customer.ten.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
    );
    
    displayCustomers(filteredCustomers);
}

// Khóa/Mở khóa tài khoản khách hàng
function toggleBlockCustomer(username, shouldBlock) {
    const customers = getListUser();
    const customer = customers.find(c => c.username === username);
    
    if (customer) {
        customer.off = shouldBlock;
        setListUser(customers);
        loadCustomers();
        
        alert(`Đã ${shouldBlock ? 'khóa' : 'mở khóa'} tài khoản ${username}`);
    }
}

// Xem chi tiết khách hàng
function viewCustomerDetails(username) {
    const customers = getListUser();
    const customer = customers.find(c => c.username === username);
    
    if (customer) {
        const details = `
            Thông tin khách hàng:
            - Họ và tên: ${customer.ho} ${customer.ten}
            - Email: ${customer.email}
            - Tài khoản: ${customer.username}
            - Trạng thái: ${customer.off ? 'Đã khóa' : 'Đang hoạt động'}
        `;
        alert(details);
    }
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    if (!localStorage.getItem('staffLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }

    // Thêm sự kiện click cho menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            if (tabName) {
                showTab(tabName);
            }
        });
    });

    // Load dữ liệu từ localStorage nếu có
    const savedBooks = localStorage.getItem('danhSachSach');
    if (savedBooks) {
        danhSachSach = JSON.parse(savedBooks);
        hienThiDanhSachSach();
    }

    // Lưu dữ liệu khi đóng trang
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('danhSachSach', JSON.stringify(danhSachSach));
    });

    // Hiển thị tab mặc định
    showTab('home');
});

// Hàm hiển thị danh sách đơn hàng
function hienThiDanhSachDonHang() {
    const orders = getOrdersFromLocalStorage();
    const tbody = document.getElementById('danhSachDonHang');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${formatDate(order.date)}</td>
            <td>${order.customerName}</td>
            <td>${formatCurrency(order.total)}</td>
            <td><span class="status ${order.status.toLowerCase()}">${getStatusText(order.status)}</span></td>
            <td class="actions">
                ${getActionButtons(order.status, order.id)}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Lấy danh sách đơn hàng từ localStorage
function getOrdersFromLocalStorage() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

// Định dạng ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Định dạng tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Lấy text hiển thị trạng thái
function getStatusText(status) {
    const statusMap = {
        'waiting': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'delivering': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status.toLowerCase()] || status;
}

// Lấy các nút hành động tương ứng với trạng thái
function getActionButtons(status, orderId) {
    let buttons = '';
    
    switch(status.toLowerCase()) {
        case 'waiting':
            buttons = `
                <button class="btn-confirm" onclick="xacNhanDonHang('${orderId}')">Xác nhận</button>
                <button class="btn-cancel" onclick="huyDonHang('${orderId}')">Hủy</button>
            `;
            break;
        case 'confirmed':
            buttons = `
                <button class="btn-deliver" onclick="chuyenSangDangGiao('${orderId}')">Giao hàng</button>
                <button class="btn-cancel" onclick="huyDonHang('${orderId}')">Hủy</button>
            `;
            break;
        case 'delivering':
            buttons = `
                <button class="btn-complete" onclick="hoanThanhDonHang('${orderId}')">Hoàn thành</button>
            `;
            break;
    }
    
    return buttons;
}

// Xử lý tìm kiếm đơn hàng
function timKiemDonHang(keyword) {
    const orders = getOrdersFromLocalStorage();
    const filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(keyword.toLowerCase()) ||
        order.customerName.toLowerCase().includes(keyword.toLowerCase())
    );
    
    hienThiKetQuaTimKiem(filteredOrders);
}

// Hiển thị kết quả tìm kiếm
function hienThiKetQuaTimKiem(orders) {
    const tbody = document.getElementById('danhSachDonHang');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${formatDate(order.date)}</td>
            <td>${order.customerName}</td>
            <td>${formatCurrency(order.total)}</td>
            <td><span class="status ${order.status.toLowerCase()}">${getStatusText(order.status)}</span></td>
            <td class="actions">
                ${getActionButtons(order.status, order.id)}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Lọc đơn hàng theo khoảng ngày
function locDonHangTheoKhoangNgay() {
    const fromDate = new Date(document.getElementById('fromDate').value);
    const toDate = new Date(document.getElementById('toDate').value);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        alert('Vui lòng chọn khoảng thời gian hợp lệ');
        return;
    }

    const orders = getOrdersFromLocalStorage();
    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= fromDate && orderDate <= toDate;
    });
    
    hienThiKetQuaTimKiem(filteredOrders);
}

// Cập nhật trạng thái đơn hàng
function capNhatTrangThaiDonHang(orderId, newStatus) {
    const orders = getOrdersFromLocalStorage();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        hienThiDanhSachDonHang();
    }
}

// Các hàm xử lý hành động
function xacNhanDonHang(orderId) {
    if (confirm('Xác nhận đơn hàng này?')) {
        capNhatTrangThaiDonHang(orderId, 'confirmed');
    }
}

function huyDonHang(orderId) {
    if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
        capNhatTrangThaiDonHang(orderId, 'cancelled');
    }
}

function chuyenSangDangGiao(orderId) {
    if (confirm('Chuyển đơn hàng sang trạng thái đang giao?')) {
        capNhatTrangThaiDonHang(orderId, 'delivering');
    }
}

function hoanThanhDonHang(orderId) {
    if (confirm('Xác nhận đơn hàng đã giao thành công?')) {
        capNhatTrangThaiDonHang(orderId, 'delivered');
    }
} 