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

    // Tự động đăng nhập sau khi đăng ký
    localStorage.setItem('currentUser', username);
    
    alert('Đăng ký thành công!');
    window.location.href = 'index.html'; // Chuyển thẳng về trang chủ
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
    console.log('Users in storage:', users); // Debug: kiểm tra danh sách users

    const user = users.find(u => u.username === username);
    if (!user) {
        alert('Tài khoản không tồn tại!');
        return false;
    }

    console.log('Found user:', user); // Debug: kiểm tra user tìm thấy
    console.log('Input password:', password); // Debug: kiểm tra password nhập vào
    console.log('Stored password:', user.password); // Debug: kiểm tra password trong storage

    if (user.password !== password) {
        alert('Mật khẩu không đúng!');
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

// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === currentUser);
        if (user) {
            return true;
        }
    }
    return false;
}

// Debug: Hiển thị thông tin trong localStorage
function showDebugInfo() {
    console.log('Current User:', localStorage.getItem('currentUser'));
    console.log('All Users:', localStorage.getItem('users'));
} 