var currentuser; // user hiện tại, biến toàn cục
window.onload = function () {
    khoiTao();

	// autocomplete cho khung tim kiem
	autocomplete(document.getElementById('search-box'), list_products);

	// thêm tags (từ khóa) vào khung tìm kiếm
	// var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
	// for (var t of tags) addTags(t, "index.html?search=" + t)

	currentuser = getCurrentUser();
	addProductToTable(currentuser);
}

function addProductToTable(user) {
	var table = document.getElementsByClassName('listSanPham')[0];

	var s = `
		<tbody>
			<tr>
				<th>STT</th>
				<th>Sản phẩm</th>
				<th>Giá</th>
				<th>Số lượng</th>
				<th>Thành tiền</th>
				<th>Thời gian</th>
				<th>Xóa</th>
			</tr>`;

	if (!user) {
		s += `
			<tr>
				<td colspan="7"> 
					<h1 style="color:red; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
						Bạn chưa đăng nhập !!
					</h1> 
				</td>
			</tr>
		`;
		table.innerHTML = s;
		return;
	} else if (user.products.length == 0) {
		s += `
			<tr>
				<td colspan="7"> 
					<h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
						Giỏ hàng trống !!
					</h1> 
				</td>
			</tr>
		`;
		table.innerHTML = s;
		return;
	}

	var totalPrice = 0;
	for (var i = 0; i < user.products.length; i++) {
		var masp = user.products[i].ma;
		var soluongSp = user.products[i].soluong;
		var p = timKiemTheoMa(list_products, masp);
		var price = (p.promo.name == 'giareonline' ? p.promo.value : p.price);
		var thoigian = new Date(user.products[i].date).toLocaleString();
		var thanhtien = stringToNum(price) * soluongSp;

		s += `
			<tr>
				<td>` + (i + 1) + `</td>
				<td class="noPadding imgHide">
					<a target="_blank" href="chitietsanpham.html?` + p.name.split(' ').join('-') + `" title="Xem chi tiết">
						` + p.name + `
						<img src="` + p.img + `">
					</a>
				</td>
				<td class="alignRight">` + price + ` ₫</td>
				<td class="soluong" >
					<button onclick="giamSoLuong('` + masp + `')"><i class="fa fa-minus"></i></button>
					<input size="1" onchange="capNhatSoLuongFromInput(this, '` + masp + `')" value=` + soluongSp + `>
					<button onclick="tangSoLuong('` + masp + `')"><i class="fa fa-plus"></i></button>
				</td>
				<td class="alignRight">` + numToString(thanhtien) + ` ₫</td>
				<td style="text-align: center" >` + thoigian + `</td>
				<td class="noPadding"> <i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang(` + i + `)"></i> </td>
			</tr>
		`;
		// Chú ý nháy cho đúng ở giamsoluong, tangsoluong
		totalPrice += thanhtien;
	}

	s += `
			<tr style="font-weight:bold; text-align:center">
				<td colspan="4">TỔNG TIỀN: </td>
				<td class="alignRight">` + numToString(totalPrice) + ` ₫</td>
				<td class="thanhtoan" onclick="thanhToan()"> Thanh Toán </td>
				<td class="xoaHet" onclick="xoaHet()"> Xóa hết </td>
			</tr>
		</tbody>
	`;

	table.innerHTML = s;
}

function xoaSanPhamTrongGioHang(i) {
	if (window.confirm('Xác nhận hủy mua')) {
		currentuser.products.splice(i, 1);
		capNhatMoiThu();
	}
}

function thanhToan() {
	var c_user = getCurrentUser();
	if(c_user.off) {
        alert('Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!');
        addAlertBox('Tài khoản của bạn đã bị khóa bởi Admin.', '#aa0000', '#fff', 10000);
        return;
	}
	
	if (!currentuser.products.length) {
		addAlertBox('Không có mặt hàng nào cần thanh toán !!', '#ffb400', '#fff', 2000);
		return;
	}

	// Chuyển hướng đến trang thanh toán
	window.location.href = 'thanhtoan.html';
}

function xoaHet() {
	if (currentuser.products.length) {
		if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ !!')) {
			currentuser.products = [];
			capNhatMoiThu();
		}
	}
}

// Cập nhật số lượng lúc nhập số lượng vào input
function capNhatSoLuongFromInput(inp, masp) {
	var soLuongMoi = Number(inp.value);
	if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong = soLuongMoi;
		}
	}

	capNhatMoiThu();
}

function tangSoLuong(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			p.soluong++;
		}
	}

	capNhatMoiThu();
}

function giamSoLuong(masp) {
	for (var p of currentuser.products) {
		if (p.ma == masp) {
			if (p.soluong > 1) {
				p.soluong--;
			} else {
				return;
			}
		}
	}

	capNhatMoiThu();
}

function capNhatMoiThu() { // Mọi thứ
	animateCartNumber();

	// cập nhật danh sách sản phẩm trong localstorage
	setCurrentUser(currentuser);
	updateListUser(currentuser);

	// cập nhật danh sách sản phẩm ở table
	addProductToTable(currentuser);

	// Cập nhật trên header
	capNhat_ThongTin_CurrentUser();
}

// Lấy giỏ hàng từ localStorage
function getGioHang() {
    return JSON.parse(localStorage.getItem('giohang')) || [];
}

// Lưu giỏ hàng vào localStorage
function luuGioHang(gioHang) {
    localStorage.setItem('giohang', JSON.stringify(gioHang));
}

// Thêm sản phẩm vào giỏ hàng
function themVaoGioHang(sanPham) {
    const gioHang = getGioHang();
    const index = gioHang.findIndex(item => item.id === sanPham.id);
    
    if (index !== -1) {
        gioHang[index].quantity += 1;
    } else {
        gioHang.push({
            id: sanPham.id,
            name: sanPham.ten,
            price: sanPham.gia,
            quantity: 1
        });
    }
    
    luuGioHang(gioHang);
    capNhatHienThiGioHang();
}

// Cập nhật số lượng sản phẩm
function capNhatSoLuong(id, quantity) {
    const gioHang = getGioHang();
    const index = gioHang.findIndex(item => item.id === id);
    
    if (index !== -1) {
        if (quantity <= 0) {
            gioHang.splice(index, 1);
        } else {
            gioHang[index].quantity = quantity;
        }
        luuGioHang(gioHang);
        capNhatHienThiGioHang();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function xoaSanPham(id) {
    const gioHang = getGioHang();
    const index = gioHang.findIndex(item => item.id === id);
    
    if (index !== -1) {
        gioHang.splice(index, 1);
        luuGioHang(gioHang);
        capNhatHienThiGioHang();
    }
}

// Tính tổng tiền giỏ hàng
function tinhTongTien() {
    const gioHang = getGioHang();
    return gioHang.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Hiển thị giỏ hàng
function capNhatHienThiGioHang() {
    const gioHang = getGioHang();
    const gioHangElement = document.getElementById('gioHangContent');
    
    if (!gioHangElement) return;
    
    if (gioHang.length === 0) {
        gioHangElement.innerHTML = '<p>Giỏ hàng trống</p>';
        return;
    }
    
    let html = '<table><thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th><th></th></tr></thead><tbody>';
    
    gioHang.forEach(item => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <button onclick="capNhatSoLuong('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="capNhatSoLuong('${item.id}', ${item.quantity + 1})">+</button>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(item.price * item.quantity)}</td>
                <td><button onclick="xoaSanPham('${item.id}')">Xóa</button></td>
            </tr>
        `;
    });
    
    html += `</tbody><tfoot><tr><td colspan="3">Tổng cộng:</td><td colspan="2">${formatCurrency(tinhTongTien())}</td></tr></tfoot></table>`;
    html += '<button onclick="datHang()" class="btn-dathang">Đặt hàng</button>';
    
    gioHangElement.innerHTML = html;
}

// Lấy thông tin người dùng hiện tại
function getCurrentUser() {
    const username = localStorage.getItem('currentUser');
    if (!username) return null;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.username === username);
}

// Cập nhật thông tin người dùng
function updateCurrentUser(user) {
    if (!user) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.username === user.username);
    
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// Đặt hàng
function datHang() {
    const gioHang = getGioHang();
    if (gioHang.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    // Kiểm tra đăng nhập
    const userInfo = getCurrentUser();
    if (!userInfo) {
        alert('Vui lòng đăng nhập để đặt hàng!');
        window.location.href = 'login.html';
        return;
    }

    // Lấy thông tin giao hàng
    const diaChi = prompt('Nhập địa chỉ giao hàng:');
    const soDienThoai = prompt('Nhập số điện thoại:');

    if (!diaChi || !soDienThoai) {
        alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
        return;
    }

    // Tạo đơn hàng
    const donHang = {
        username: userInfo.username,
        fullName: userInfo.ho + ' ' + userInfo.ten,
        address: diaChi,
        phone: soDienThoai
    };

    // Gọi hàm tạo đơn hàng từ orders.js
    const order = createOrder(donHang, gioHang);

    if (order) {
        alert('Đặt hàng thành công! Mã đơn hàng của bạn là: ' + order.id);
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem('giohang');
        capNhatHienThiGioHang();
    } else {
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    }
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    capNhatHienThiGioHang();
});
