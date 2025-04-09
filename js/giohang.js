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
	} else if (!user.products || user.products.length == 0) {
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
		const user = getCurrentUser();
		if (!user) return;

		user.products.splice(i, 1);
		setCurrentUser(user);
		updateListUser(user);
		addProductToTable(user);
		capNhat_ThongTin_CurrentUser();
	}
}

function thanhToan() {
	const user = getCurrentUser();
	if (!user) {
		alert('Vui lòng đăng nhập để thanh toán!');
		window.location.href = 'login.html';
		return;
	}

	if (user.off) {
		alert('Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!');
		return;
	}

	if (!user.products || !user.products.length) {
		alert('Giỏ hàng trống!');
		return;
	}

	window.location.href = 'thanhtoan.html';
}

function xoaHet() {
	const user = getCurrentUser();
	if (!user) return;

	if (user.products && user.products.length) {
		if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ?')) {
			user.products = [];
			setCurrentUser(user);
			updateListUser(user);
			addProductToTable(user);
			capNhat_ThongTin_CurrentUser();
		}
	}
}

// Cập nhật số lượng lúc nhập số lượng vào input
function capNhatSoLuongFromInput(inp, masp) {
	const user = getCurrentUser();
	if (!user) return;

	var soLuongMoi = Number(inp.value);
	if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

	for (var p of user.products) {
		if (p.ma == masp) {
			p.soluong = soLuongMoi;
		}
	}

	setCurrentUser(user);
	updateListUser(user);
	addProductToTable(user);
	capNhat_ThongTin_CurrentUser();
}

function tangSoLuong(masp) {
	const user = getCurrentUser();
	if (!user) return;

	for (var p of user.products) {
		if (p.ma == masp) {
			p.soluong++;
		}
	}

	setCurrentUser(user);
	updateListUser(user);
	addProductToTable(user);
	capNhat_ThongTin_CurrentUser();
}

function giamSoLuong(masp) {
	const user = getCurrentUser();
	if (!user) return;

	for (var p of user.products) {
		if (p.ma == masp) {
			if (p.soluong > 1) {
				p.soluong--;
			} else {
				return;
			}
		}
	}

	setCurrentUser(user);
	updateListUser(user);
	addProductToTable(user);
	capNhat_ThongTin_CurrentUser();
}

function capNhatMoiThu() {
    const user = getCurrentUser();
    if (!user) return;

    setCurrentUser(user);
    updateListUser(user);
    addProductToTable(user);
    capNhat_ThongTin_CurrentUser();
}

function getGioHang() {
    const user = getCurrentUser();
    return user ? user.products || [] : [];
}

function luuGioHang(gioHang) {
    const user = getCurrentUser();
    if (!user) return;

    user.products = gioHang;
    capNhatMoiThu();
}

function themVaoGioHang(sanPham) {
    const user = getCurrentUser();
    if (!user) {
        alert('Bạn cần đăng nhập để thêm vào giỏ hàng');
        window.location.href = "login.html";
        return;
    }

    if (!user.products) user.products = [];
    
    // Check if product already exists in cart
    for (let p of user.products) {
        if (p.ma == sanPham.ma) {
            p.soluong++;
            capNhatMoiThu();
            return;
        }
    }

    // If not exists, add new
    user.products.push({
        ma: sanPham.ma,
        soluong: 1,
        date: new Date()
    });
    
    capNhatMoiThu();
}

function capNhatSoLuong(id, quantity) {
    const user = getCurrentUser();
    if (!user || !user.products) return;

    for (let p of user.products) {
        if (p.ma == id) {
            p.soluong = quantity;
            if (p.soluong <= 0) {
                return xoaSanPham(id);
            }
            break;
        }
    }

    capNhatMoiThu();
}

function xoaSanPham(id) {
    const user = getCurrentUser();
    if (!user || !user.products) return;

    user.products = user.products.filter(p => p.ma != id);
    capNhatMoiThu();
}

function tinhTongTien() {
    const user = getCurrentUser();
    if (!user || !user.products) return 0;

    return user.products.reduce((total, p) => {
        const sp = timKiemTheoMa(list_products, p.ma);
        const gia = (sp.promo.name == 'giareonline' ? sp.promo.value : sp.price);
        return total + stringToNum(gia) * p.soluong;
    }, 0);
}

function capNhatHienThiGioHang() {
    const user = getCurrentUser();
    if (!user) return;

    // Cập nhật số lượng sản phẩm
    const cartCount = document.getElementsByClassName('cart-count');
    for (let e of cartCount) {
        e.innerHTML = user.products ? user.products.length : 0;
    }

    // Cập nhật tổng tiền
    const cartTotalPrice = document.getElementsByClassName('cart-price');
    for (let e of cartTotalPrice) {
        e.innerHTML = numToString(tinhTongTien());
    }
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
