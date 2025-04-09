// Khởi tạo danh sách users nếu chưa có
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Đăng ký tài khoản mới
function dangKy() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const ho = document.getElementById('ho').value;
    const ten = document.getElementById('ten').value;
    const email = document.getElementById('email').value;

    if (!username || !password || !ho || !ten || !email) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kiểm tra username đã tồn tại chưa
    if (users.some(user => user.username === username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return false;
    }

    // Tạo user mới
    const newUser = {
        username: username,
        password: password,
        ho: ho,
        ten: ten,
        email: email,
        products: [], // Khởi tạo giỏ hàng rỗng
        off: false
    };

    // Thêm user mới vào danh sách
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công!');
    window.location.href = 'login.html';
    return false;
}

// Đăng nhập
function dangNhap() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
        return false;
    }

    if (user.off) {
        alert('Tài khoản của bạn đã bị khóa!');
        return false;
    }

    // Lưu thông tin đăng nhập
    localStorage.setItem('currentUser', username);
    
    // Chuyển về trang chủ
    window.location.href = 'index.html';
    return false;
}

// Đăng xuất
function dangXuat() {
    localStorage.removeItem('currentUser');
    location.reload();
} 