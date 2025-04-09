// Khởi tạo danh sách users nếu chưa có
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Đăng ký tài khoản mới
function register(form) {
    const username = form.newUsername.value.trim();
    const password = form.newPassword.value.trim();
    const ho = form.ho.value.trim();
    const ten = form.ten.value.trim();
    const email = form.email.value.trim();

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
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    alert('Đăng ký thành công!');
    location.reload(); // Làm mới trang để cập nhật trạng thái đăng nhập
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
    console.log('Users in storage:', users);

    const user = users.find(u => u.username === username);
    if (!user) {
        alert('Tài khoản không tồn tại!');
        return false;
    }

    if (user.password !== password) {
        alert('Mật khẩu không đúng!');
        return false;
    }

    if (user.off) {
        alert('Tài khoản của bạn đã bị khóa!');
        return false;
    }

    // Lưu toàn bộ thông tin user
    localStorage.setItem('currentUser', JSON.stringify(user));
    
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
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
        try {
            const currentUser = JSON.parse(currentUserStr);
            const users = JSON.parse(localStorage.getItem('users')) || [];
            // Tìm user trong danh sách và cập nhật thông tin mới nhất
            const updatedUser = users.find(u => u.username === currentUser.username);
            if (updatedUser && !updatedUser.off) {
                // Cập nhật lại thông tin user hiện tại
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                return true;
            }
        } catch (e) {
            console.error('Lỗi khi parse thông tin user:', e);
        }
    }
    return false;
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
        try {
            return JSON.parse(currentUserStr);
        } catch (e) {
            console.error('Lỗi khi parse thông tin user:', e);
        }
    }
    return null;
}

// Cập nhật thông tin giỏ hàng
function updateUserCart(products) {
    const currentUser = getCurrentUser();
    if (currentUser) {
        currentUser.products = products;
        // Cập nhật trong localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Cập nhật trong danh sách users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// Debug: Hiển thị thông tin trong localStorage
function showDebugInfo() {
    console.log('Current User:', localStorage.getItem('currentUser'));
    console.log('All Users:', localStorage.getItem('users'));
} 