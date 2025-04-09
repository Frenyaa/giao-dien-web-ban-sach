// Khởi tạo các biến và hàm cần thiết
let danhSachSach = [];
let danhSachDonHang = [];

// Hàm đăng xuất
function logOutStaff() {
    localStorage.removeItem('staffLoggedIn');
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

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    if (!localStorage.getItem('staffLoggedIn')) {
        window.location.href = 'index.html';
    }

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
}); 