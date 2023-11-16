$(document).ready(function () {
    const api = '/api.aspx';

   /* Tim hoat dong da quet theo thoi gian*/
    function list_search_ngay(mssv) {
        originalConfirm = $.confirm;
        var dialog_list_ngay = $.confirm({
            title: "Nhập  thời gian ",
            content: `Ngày đầu :  <input type="date" name="name"  id="ngay_dau" style=" margin: 0 10px 10px; padding: 0 10px;" /><br>` +
                `Ngày cuối :  <input type="date" name="name"  id="ngay_cuoi" style=" margin: 0 10px 10px; padding: 0 10px;" />`+
                    `<div id="hoten"></div>` +
                `<div id="tongdiem"></div>`,   
            columnClass: 'small',
            buttons: {
                Gửi: {
                    text:'<i class="fa-regular fa-paper-plane"></i> Gửi đi ',
                    btnClass: 'btn-blue',
                    action: function () {
                        var ngay_bat_dau = $('#ngay_dau').val();
                        var ngay_ket_thuc = $('#ngay_cuoi').val();
                        var data_gui = {
                            action: 'list_ngayquet',
                            ngay1: ngay_bat_dau,
                            ngay2: ngay_ket_thuc,
                            mssv: mssv
                        }
                        $.post(api, data_gui, function (data) {
                            console.log(data);
                            var json = JSON.parse(data);
                            if (json.ok) {
                                        var tongDiem = 0;
                                        for (var hd of json.data) {
                                            if (hd.daquet == 1) {
                                                tongDiem = tongDiem + parseInt(hd.diem);
                                            }
                                        }
                                $('#hoten').html(` Tên  : ${ hd.hoten }`);
                                $('#tongdiem').html(` Tổng điểm  : ${tongDiem}`);
                            

                            } else {
                                alert(json.msg);
                             
                            }
                        });
                        return false;
                    }
                },
                Close: {
                    text: '<i class="fa-solid fa-rotate-left"></i> Trở về ',
                    btnClass: 'btn-red',
                    action: function () {
                        list_hoatdong(mssv)
                    }
                }
            },
            
        });
       
    }

  /*  Danh sach cac hoat dong da quet va tong diem */
    function list_hoatdong(mssv) {
        var dialog_list_company = $.confirm({
            title: "Danh sach hoat dong",
            content: `<div id="ds_sinh_vien">loading...</div>` +
                `<div id="tongdiem">Tong diem:</div>`,
            columnClass: 'extra-large',
            buttons: {
                search: {
                    text: '<i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm ',
                    btnClass: 'btn-blue', 
                    action: function () {
                        list_search_ngay(mssv);
                        dialogClosed = true;
                    }
                },

                close: {
                    text: '<i class="fa-solid fa-xmark"></i> Đóng',
                    btnClass: 'btn-danger',
                },
               
            },
           
            onContentReady: function () {
                $.post(api,
                    {
                        action: 'list_ngoaikhoa',
                        mssv: mssv

                    },
                    function (data) {
                        console.log(data);
                        var json = JSON.parse(data);
                        var noidung_ds_cty_html = "";
                        if (json.ok) {
                            dialog_list_company.open();
                            noidung_ds_cty_html += `<table class="table table-striped table-responsive">
              <thead class="table table-dark">
              <tr>
              <th >STT</th>
              <th>ID</th>
                <th >MaHD</th>
                <th style="width: 15%;">HO TEN</th>
                 <th style="width: 24%;">DANG KI HOAT DONG</th>
                <th style="width: 20%;">TEN HD</th>
                <th style="width: 20%;">TINH TRANG QUET</th>
                <th style="width: 15%;">NGAY QUET</th>
                <th >DIEM</th>
           
              </tr>
              </thead><tbody>`;
                            var Stt = 1;
                            var tongDiem = 0;
                            //duyet json -> noidung_ds_cty_html xịn
                            for (var hd of json.data) {
                                var daquet = hd.daquet == 1 ? "Quét điểm thành công" : "Bạn chưa được quét điểm";
                                var dangki = hd.Dangki == 1 ? "Đã đăng kí " : "Chưa đăng kí ";
                                noidung_ds_cty_html += `
                <tr >
                 <td>${Stt++}</td>
                  <td>${hd.id}</td>
                <td>${hd.MaHD}</td>
                <td>${hd.hoten}</td>
                 <td>${dangki}</td>
                <td>${hd.tenhd}</td>
                 <td>${daquet}</td>
                  <td>${hd.ngayquet}</td>
                <td>${hd.diem}</td>
              </tr>`;
                                if (hd.daquet == 1) {
                                    tongDiem = tongDiem + parseInt(hd.diem);
                                }
                            }
                            noidung_ds_cty_html += "</tbody></table>";
                        } else {

                            noidung_ds_cty_html = "không có dữ liệu";
                        }
                        $('#ds_sinh_vien').html(noidung_ds_cty_html);
                        $('#tongdiem').html("Tong diem: " + (tongDiem));
                      
                    }
                )
              
            }
            
        });
    }

    /*  Update du lieu cho thong tin ca nhan cau sinh vien */
    function list_sua(id, json) {

        var sv;
        for (var item of json.data) {
            console.log(item);
            if (item.MSSV == id) {
                sv = item;
                break;
            }
        } 

        var content = `NAME: <input type=text id="edit-name" value="${sv.hoten}" style="margin-bottom:10px; padding:4px; wigth:100%;"> <br>
                        ADDRESS: <input type=text id="edit-address" value="${sv.diachi}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                         DATE : <input type=date id="edit-ngay" value="${sv.ngaysinh}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                         TINH TRANG HOC TAP : <input type=text id="edit-buit" value="${sv.tinhtrang}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                         PASSWORD sv.net : <input type=pass id="edit-pass" value="${sv.matkhau}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br> `
        var dialog_edit = $.confirm({
            title: 'Update sinh vien ',
            content: content,
          
            buttons: {
                save: {
                    text: 'Lưu thông tin',
                    btnClass: 'btn btn-outline-danger',
                    action: function () {
                        var data_gui = {
                            action: 'update_sinhvien',
                            id: id,
                            hoten: $('#edit-name').val(),
                            diachi: $('#edit-address').val(),
                            ngaysinh: $('#edit-ngay').val(),
                            tinhtrang: $('#edit-buit').val(),
                            matkhau: $('#edit-pass').val()
                        }

                        $.post(api, data_gui, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                list_sinhvien();
                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                }


            }
        })

    }

    /*  Xoa sinh vien do*/
    function list_xoa(id, json) {
        var sv;
        for (var item of json.data) {
            console.log(item);
            if (item.MSSV == id) {
                sv = item;
                console.log(sv);
                break;
            }
        } 
        var dialog_xoa = $.confirm({
            title: `Xác nhận xóa sinh vien  ${sv.hoten}`,
            content: `Xác nhận xóa nhé????`,
            buttons: {
                YES: {
                    action: function () {
                        var data_gui_di = {
                            action: 'delete_sinhvien',
                            id: id, //gửi đi id của cty cần xóa: api, sp sẽ làm phần còn lại
                        }
                        $.post(api, data_gui_di, function (data) {
                            //đợi data là json string text gửi về
                            var json = JSON.parse(data); //json string text => obj
                            console.log(json);
                            if (json.ok) { //dùng obj
                                dialog_xoa.close();
                                var rowToDelete = $(this).closest('tr');
                                console.log(rowToDelete); // Kiểm tra giá trị rowToDelete
                                rowToDelete.hide(); 
                                list_sinhvien();
                               
                            } else {
                                alert(json.msg) // lỗi gì ở trên lo, ta cứ show ra thôi
                            }
                        })
                    }
                },
                NO: {

                }
            }
        })
    }  

    /* Them 1 sinh vien moi */
    function add_sinhvien() {
        var content = 
   `
     MSSV: <input id="nhap-MSSV" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
     Name: <input id="nhap-name" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    Address: <input id="nhap-address" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    Date: <input type=date id="nhap-date" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    Hoc tap:  <select id="nhap-hoc" style="margin-bottom:10px; wigth:100%;">
            <option value="0">Đang theo học</option>
            <option value="1">Không học nữa</option>
        </select><br>
    Password: <input id="nhap-pass" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    `

        var dialog_add = $.confirm({
            title: 'Thêm mới 1 sinh viên ',
            content: content,
            columnClass:'small',
            buttons: {
                save: {
                    text: 'Thêm sinh viên vào DB ',
                    btnClass:'btn btn-outline-danger',
                    action: function () {
                        
                        var tinhtrang_bit = $('#nhap-hoc').val();
                        var data_gui_di = {
                            action: 'into_sinhvien',
                            id: $('#nhap-MSSV').val(),
                            hoten: $('#nhap-name').val(),
                            diachi: $('#nhap-address').val(),
                            ngaysinh: $('#nhap-date').val(),
                            tinhtrang: tinhtrang_bit,
                            matkhau: $('#nhap-pass').val(),
                            lop: "56KMT",
                            khoa:"dientu"
                        }
                        //console.log(data_gui_di);
                        $.post(api, data_gui_di, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_add.close();
                                list_sinhvien();
                            } else {
                                alert(json.msg)
                            }
                        });
                    }//het save
                },
                Close: {
                    text: "Trở về ",
                    btnClass:'btn btn-outline-primary'
                }
            }
        });
    }

    /*Sua MSSV*/
    function list_update_mssv(mssv) {
        var dialog_list_mssv = $.confirm({
            title: "MSSV cần sửa là : ",
            content: `MSSV cũ : <input type = text id="mssv_cu" value="${mssv}" /><br>` +
                `MSSV mới: <input type = text id="mssv_moi" />`,
            columnClass: 'small',
            buttons: {
                search: {
                    text: '<i class="fa-solid fa-magnifying-glass"></i> Sửa',
                    btnClass: 'btn-blue',
                    action: function () {
                        var data_mssv = {
                            action: 'update_mssv',
                            mssv: mssv,
                            newMSSV: $('#mssv_moi').val()
                        };

                        $.post(api, data_mssv)
                            .done(function (data) {
                                console.log("Dữ liệu phản hồi:", data);
                                try {
                                    var json = JSON.parse(data);
                                    console.log(json);

                                    if (json.ok) {
                                        list_sinhvien();
                                    } else {
                                        alert(json.msg);
                                    }
                                } catch (error) {
                                    console.error("Lỗi phân tích cú pháp JSON:", error);
                                    alert("Có lỗi xảy ra trong quá trình xử lý phản hồi.");
                                }
                            })
                            .fail(function (xhr, textStatus, errorThrown) {
                                console.error("Lỗi AJAX:", textStatus, errorThrown);
                                alert("Có lỗi xảy ra trong quá trình gửi yêu cầu.");
                            });
                    }
                },

                close: {
                    text: '<i class="fa-solid fa-xmark"></i> Đóng',
                    btnClass: 'btn-danger',
                },
            },
        });
    }

  /*Danh sach sinh vien co trong database*/
    function list_sinhvien() {
        $.post(api,
            {
                action: 'list_sinhvien'
            },
            function (data) {
                //alert(data)
                console.log(data);
                var json = JSON.parse(data);
                var noidung_ds_cty_html = "";
                if (json.ok) {
                    noidung_ds_cty_html += `
                    <button class="btn btn-outline-info add_sinhvien " data-action="list_add_sinhvien" style="margin-bottom:10px;"><i class="fa-solid fa-plus"></i> Thêm sinh viên mới</button>
                     <button class="btn btn-outline-success restart" data-action="list_add_sinhvien" style="margin-bottom:10px;"><i class="fa-solid fa-rotate-right"></i> Reratrt</button>
               <table class="table table-striped table-responsive-lg">
              <thead class="table table-dark">
              <tr>
              <th>STT</th>
                <th>MSSV</th>
                <th>HO TEN</th>
                <th>ĐIA CHI </th>
                <th>NGAY SINH</th>
                <th>TINH TRANG </th>
                <th>MAT KHAU</th>
                 <th>Hoat dong ngoai khoa</th>
                  <th>Sua/xoa</th>
              </tr>
              </thead><tbody>`;
                    var Stt = 1;
                    //duyet json -> noidung_ds_cty_html xịn
                    for (var sv of json.data) {
                        
                        //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action
                        var tinhtrangChuoi = sv.tinhtrang == 1 ? "không học nữa " : "Đang theo học";
                        var list_hoat_dong = `<button class="btn btn-success "  data-mssv="${sv.MSSV}" data-action="list_hoatdong"> <i class="fa-solid fa-file-export"></i> Hoạt động  </button>`;


                        var sua = `<button class="btn btn-sm btn-warning nut_xoa_sua "  data-id="${sv.MSSV}" data-loai="list_sua" style="margin-right:10px;"> <i class="fa-solid fa-pen"></i> Sửa</button>`;
                        sua += `<button class="btn btn-sm btn-danger nut_xoa_sua "  data-id="${sv.MSSV}"  data-loai="list_xoa"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                        sua += `<button class="btn btn-outline-success update_mssv " data-action="list_update_mssv" data-id="${sv.MSSV}" style="margin-left:10px;"><i class="fa-solid fa-square-pen"></i> Sửa MSSV  </button>`
                        noidung_ds_cty_html += `
                <tr>
                 <td>${Stt++}</td>
                <td>${sv.MSSV}</td>
                <td>${sv.hoten}</td>
                <td>${sv.diachi}</td>
                <td>${sv.ngaysinh}</td>
                <td>${tinhtrangChuoi}</td>
                <td>${sv.matkhau}</td>
                <td>${list_hoat_dong}</td>
                <td>${sua}</td>
              </tr>`;
                    }
                    noidung_ds_cty_html += "</tbody></table>";
                } else {
                    noidung_ds_cty_html = "không có dữ liệu";
                }

                $('#ds_sinhvien').html(noidung_ds_cty_html); //gán html vào thân dialog
                $('#ds_sinhvien button[data-action="list_hoatdong"]').click(function () {
                    var mssv = $(this).data('mssv');
                    list_hoatdong(mssv);
                });


                $('.nut_xoa_sua').click(function () {
                    var action = $(this).data('loai');
                    var id = $(this).data('id');
                    if (action == 'list_sua') {
                        list_sua(id, json);
                    }
                    else if (action == 'list_xoa') {
                    $(this).closest('tr').remove();
                        list_xoa(id, json);
                        
                    }
                });

                $('.add_sinhvien ').click(function () {
                    add_sinhvien();
                })
                $('.restart ').click(function () {
                    list_sinhvien();
                })
                $('.update_mssv ').click(function () {
                    var mssv = $(this).data('id');
                    list_update_mssv(mssv);
                })
            });
    }

    /*Login trang web*/
    function list_login() {
        var dialog_list_company = $.confirm({
            title: " ĐĂNG NHẬP TÀI KHOẢN ",
            class:'confirm-login',
            content:
                `Username <i class="fa-solid fa-user" class = "icon-fa" style="color: #27ecab;"></i> ` + `<input type="text" id="name" class="custom-input"/>` + `<br>` +
                `Password <i class="fa-solid fa-lock" class = "icon-fa" style="color: #1ecc92;"></i>` + `<input type="password" id="pass" class="custom-input"/>`,
            columnClass: 'small',
            buttons: {
                search: {
                    text: 'Đăng nhập',
                    btnClass: 'btn-info',
                    action: function () {
                            
                    }

                },
                canel: {
                    text: 'Đăng Kí ',
                    btnClass: 'btn-danger'
                },

            },
            onContentReady: function () {
              
            }

        });

    }

    /* danh sach hoat dong*/
    function list_hoat() {
        $.post(api,
            {
                action: 'list_hoatdong'
            },
            function (data) {
                //alert(data)
                console.log(data);
                var json = JSON.parse(data);
                var noidung_ds_cty_html = "";
                if (json.ok) {
                    noidung_ds_cty_html += `
                    <button class="btn btn-outline-info add_sinhvien " data-action="list_add_sinhvien" style="margin-bottom:10px;"><i class="fa-solid fa-plus"></i> Thêm  hoat dong</button>
               <table class="table table-striped table-responsive-lg">
              <thead class="table table-dark">
              <tr>
              <th>STT</th>
                <th>MAHD</th>
                <th>TEN HOAT DONG</th>
                <th>ĐIA CHI </th>
                <th>NGUOI TAO</th>
                <th>DIEM</th>
                 <th>TO CHUC</th>
                  <th>SO LUONG</th>
                   <th>TRANG THAI</th>
                  <th>Sua/xoa</th>
              </tr>
              </thead><tbody>`;
                    var Stt = 1;
                    //duyet json -> noidung_ds_cty_html xịn
                    for (var sv of json.data) {

                        //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action
                      
                        var sua = `<button class="btn btn-sm btn-warning nut_xoa_sua "  data-id="${sv.MSSV}" data-loai="list_sua" style="margin-right:10px;"> <i class="fa-solid fa-pen"></i> Sửa</button>`;
                        sua += `<button class="btn btn-sm btn-danger nut_xoa_sua "  data-id="${sv.MSSV}"  data-loai="list_xoa"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                        noidung_ds_cty_html += `
                <tr>
                 <td>${Stt++}</td>
                <td>${sv.mahd}</td>
                <td>${sv.ten}</td>
                <td>${sv.diachi}</td>
                <td>${sv.nguoitao}</td>
                <td>${sv.diem}</td>
                <td>${sv.tochuc}</td>
                  <td>${sv.soluong}</td>
                 <td>${sv.trangthai}</td>
                <td>${sua}</td>
              </tr>`;
                    }
                    noidung_ds_cty_html += "</tbody></table>";
                } else {
                    noidung_ds_cty_html = "không có dữ liệu";
                }

                $('#ds_sinhvien').html(noidung_ds_cty_html); //gán html vào thân dialog
                $('#ds_sinhvien button[data-action="list_hoatdong"]').click(function () {
                    var mssv = $(this).data('mssv');
                    list_hoatdong(mssv);
                });


                $('.nut_xoa_sua').click(function () {
                    var action = $(this).data('loai');
                    var id = $(this).data('id');
                    if (action == 'list_sua') {
                        list_sua(id, json);
                    }
                    else if (action == 'list_xoa') {
                        $(this).closest('tr').remove();
                        list_xoa(id, json);

                    }
                });

                $('.add_sinhvien ').click(function () {
                  
                })
            });
    }

    /*    danh sach dang ki*/
    function list_dangki() {
        $.post(api,
            {
                action: 'dangki'
            },
            function (data) {
                //alert(data)
                console.log("Raw JSON data:", data);

                var json = JSON.parse(data);
                var noidung_ds_cty_html = "";
                if (json.ok) {
                    noidung_ds_cty_html += `
                   
               <table class="table table-striped table-responsive-lg">
              <thead class="table table-dark">
              <tr>
              <th>STT</th>
                <th>MAHD</th>
                <th>TEN HOAT DONG</th>
                <th>NGUOI TAO</th>
                <th>DIEM</th>
                 <th>SO LUONG DANG KI</th> 
                 <th>SO LUONG</th>
                 <th>THOI GIAN HOAT DONG</th>

              </tr>
              </thead><tbody>`;
                    var Stt = 1;
                    //duyet json -> noidung_ds_cty_html xịn
                    for (var sv of json.data) {

                        //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action

              
                        noidung_ds_cty_html += `
                <tr>
                 <td>${Stt++}</td>
                <td>${sv.mahd}</td>
                <td>${sv.tenhd}</td>
                <td>${sv.nguoitao}</td>
                <td>${sv.diem}</td>
                 <td>${sv.thanhvien}</td>
                 <td>${sv.soluong}</td>
                  <td>${sv.trangthai}</td>
                
               
              </tr>`;
                    }
                    noidung_ds_cty_html += "</tbody></table>";
                } else {
                    noidung_ds_cty_html = "không có dữ liệu";
                }

                $('#ds_sinhvien').html(noidung_ds_cty_html); //gán html vào thân dialog
               


              
               
            });
    }

/*    danh sach bao luu */
    function list_baoluu() {
        $.post(api,
            {
                action: 'baoluu'
            },
            function (data) {
                //alert(data)
                console.log(data);
                var json = JSON.parse(data);
                var noidung_ds_cty_html = "";
                if (json.ok) {
                    noidung_ds_cty_html += `

               <table class="table table-striped table-responsive-lg">
              <thead class="table table-dark">
              <tr>
              <th>STT</th>
                <th>MSSV</th>
                <th>HỌ TÊN </th>
                <th>MÃ LƯU </th>
                <th>LỚP  </th>
                <th>NGÀY SINH </th>
                <th>DIỂM NGOẠI KHÓA </th>
               
              </tr>
              </thead><tbody>`;
                    var Stt = 1;
                    //duyet json -> noidung_ds_cty_html xịn
                    for (var sv of json.data) {

                        //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action

                        noidung_ds_cty_html += `
                <tr>
                 <td>${Stt++}</td>
                <td>${sv.mssv}</td>
               <td>${sv.hoten}</td>
                <td>${sv.id}</td>
                 <td>${sv.lop}</td>
                  <td>${sv.ngaysinh}</td>
                   <td>${sv.diem}</td>

             
              </tr>`;
                    }
                    noidung_ds_cty_html += "</tbody></table>";
                } else {
                    noidung_ds_cty_html = "không có dữ liệu";
                }

                $('#ds_sinhvien').html(noidung_ds_cty_html); //gán html vào thân dialog

               
            });
    }

    /*  Lua chon danh sach kieu gi*/
    function select_list() {
        var dialog_list_company = $.confirm({
            title: "MOI BAN LUA CHON",
            content:
                `<button class="btn btn-outline-info" id="btn_sinhvien" style="margin-bottom:10px;"><i class="fa-solid fa-user"></i>Danh sách sinh viên </button><br>` +
                `<button class="btn btn-outline-success " id="btn_hoat" style="margin-bottom:10px;"><i class="fa-solid fa-briefcase"></i> Danh sách hoạt động </button><br>` +
                `<button class="btn btn-outline-warning " id="btn_dangki" style="margin-bottom:10px;"><i class="fa-solid fa-address-card"></i> Danh sách hoạt động đăng kí </button><br>` +
                `<button class="btn btn-outline-primary " id="btn_baoluu" style="margin-bottom:10px;"><i class="fa-solid fa-user-nurse"></i> Danh sách sinh viên bảo lưu </button>`,


            onContentReady: function () {
                /*Danh sach sinh vien*/
                $('#btn_sinhvien').click(function () {
                    dialog_list_company.close();
                    $('#sinhvien').html(function () {
                        list_sinhvien();
                    });
                });
                /*Danh sach hoat dong*/
                $('#btn_hoat').click(function () {
                    dialog_list_company.close();
                    $('#sinhvien').html(function () {
                        list_hoat();
                    });
                });

                /*Danh sach dang ki*/
                $('#btn_dangki').click(function () {
                    dialog_list_company.close();
                    $('#sinhvien').html(function () {
                        list_dangki();
                    });
                });
             /*   Danh sach sinh vien bao luu */
                $('#btn_baoluu').click(function () {
                    dialog_list_company.close();
                    $('#sinhvien').html(function () {
                        list_baoluu();
                    });
                });
            }
        });
    }
   

    $('#btn-login').click(function () {
        list_login();
    });
    $('#btn-list').click(function () {
        select_list();
    });

});