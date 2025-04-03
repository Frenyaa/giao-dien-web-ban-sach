window.onload = function() {
    hienThiThongTinDonHang();
    khoiTaoThanhToan();
}

function khoiTaoThanhToan() {
    // Tạo mã đơn hàng cho chuyển khoản
    var maDonHang = new Date().getTime().toString();
    document.getElementById('bank-content').textContent = 'DH' + maDonHang;

    // Xử lý form thẻ tín dụng
    var creditForm = document.querySelector('.credit-card-form');
    if (creditForm) {
        // Format số thẻ
        var cardInput = creditForm.querySelector('input[type="text"]');
        cardInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });

        // Format ngày phát hành
        var dateInput = creditForm.querySelector('input[placeholder="MM/YY"]');
        dateInput.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });

        // Chỉ cho phép nhập số cho CVV
        var cvvInput = creditForm.querySelector('input[placeholder="123"]');
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // Xử lý nút thanh toán
        var payButton = creditForm.querySelector('.btn-pay');
        payButton.addEventListener('click', function() {
            if (creditForm.checkValidity()) {
                // Giả lập xử lý thanh toán
                setTimeout(function() {
                    alert('Thanh toán thành công!');
                    xacNhanThanhToan();
                }, 1500);
            } else {
                creditForm.reportValidity();
            }
        });
    }
}

function hienThiThongTinDonHang() {
    var user = getCurrentUser();
    if (!user || user.products.length === 0) {
        window.location.href = 'giohang.html';
        return;
    }

    var danhSachSanPham = document.querySelector('.danhsach-sanpham');
    var tongTien = 0;
    var html = '';

    user.products.forEach(function(item) {
        var sanPham = timKiemTheoMa(list_products, item.ma);
        var gia = sanPham.promo && sanPham.promo.name === 'giareonline' ? sanPham.promo.value : sanPham.price;
        var thanhTien = stringToNum(gia) * item.soluong;
        tongTien += thanhTien;

        html += `
            <div class="sanpham-item">
                <img src="${sanPham.img}" alt="${sanPham.name}">
                <div class="sanpham-info">
                    <h3>${sanPham.name}</h3>
                    <div class="gia">${numToString(thanhTien)} ₫</div>
                    <div>Số lượng: ${item.soluong}</div>
                </div>
            </div>
        `;
    });

    danhSachSanPham.innerHTML = html;
    document.querySelector('.tongtien .gia').textContent = numToString(tongTien) + ' ₫';

    // Điền thông tin người dùng nếu đã đăng nhập
    if (user) {
        document.querySelector('input[name="hoten"]').value = user.username || '';
        document.querySelector('input[name="email"]').value = user.email || '';
        document.querySelector('input[name="sodienthoai"]').value = user.phone || '';
        document.querySelector('textarea[name="diachi"]').value = user.address || '';
    }
}

function xacNhanThanhToan() {
    var user = getCurrentUser();
    if (!user) {
        alert('Vui lòng đăng nhập để thanh toán!');
        showTaiKhoan(true);
        return;
    }

    // Kiểm tra form
    var form = document.getElementById('form-thanhtoan');
    if (!form.checkValidity()) {
        alert('Vui lòng điền đầy đủ thông tin!');
        form.reportValidity();
        return;
    }

    // Lấy thông tin thanh toán
    var thongTinThanhToan = {
        hoten: form.querySelector('input[name="hoten"]').value,
        sodienthoai: form.querySelector('input[name="sodienthoai"]').value,
        email: form.querySelector('input[name="email"]').value,
        diachi: form.querySelector('textarea[name="diachi"]').value,
        ghichu: form.querySelector('textarea[name="ghichu"]').value,
        phuongThucThanhToan: form.querySelector('input[name="payment"]:checked').value
    };

    // Tạo đơn hàng mới
    var donHang = {
        ma: new Date().getTime().toString(),
        ngaymua: new Date(),
        tinhTrang: 'Đang chờ xử lý',
        thongTinThanhToan: thongTinThanhToan,
        sp: user.products
    };

    // Thêm đơn hàng vào danh sách đơn hàng của user
    user.donhang.push(donHang);
    user.products = []; // Xóa giỏ hàng

    // Cập nhật thông tin user
    setCurrentUser(user);
    updateListUser(user);

    // Hiển thị thông báo thành công
    alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    
    // Chuyển hướng về trang chủ
    window.location.href = 'index.html';
} 