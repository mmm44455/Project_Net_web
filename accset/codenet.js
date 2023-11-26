$(document).ready(function () {
    const api = '/api.aspx';

    var isAddHdVisible = false;
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
                        action: 'list_hoatdong',
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

                <th >MaHD</th>
                 <th >MSSV</th>
                 <th style="width: 24%;">DANG KI HOAT DONG</th>
                <th style="width: 20%;">TEN HD</th>
       
                <th >DIEM</th>
           
              </tr>
              </thead><tbody>`;
                            var Stt = 1;
                            var tongDiem = 0;
                            //duyet json -> noidung_ds_cty_html xịn
                            for (var hd of json.data) {

                                noidung_ds_cty_html += `
                <tr >
                 <td>${Stt++}</td>
                <td>${hd.mahd}</td>
                 <td>${hd.ngaybatdau}</td>
                <td>${hd.ten}</td>
                  <td>${hd.mssv}</td>
                <td>${hd.diem}</td>
              </tr>`;
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
           
            if (item.MSSV == id) {
                sv = item; console.log(sv);
                break;
            }
        } 

        var content = `NAME: <input type=text id="edit-name" value="${sv.hoten}" style="margin-bottom:10px; padding:4px; wigth:100%;"> <br>
                        ADDRESS: <input type=text id="edit-address" value="${sv.diachi}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                         DATE : <input type=date id="edit-ngay" value="${sv.ngaysinh}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                         TINH TRANG HOC TAP : <input type=text id="edit-buit" value="${sv.tinhtrang}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                             LOP : <input id="nhap-lop"  value="${sv.lop}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                         KHOA : <input id="nhap-khoa"  value="${sv.khoa}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                        PASSWORD sv.net :  <input type=pass id="edit-pass" class="phânquyentt"  value="${sv.matkhau}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br> `
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
                            matkhau: $('#edit-pass').val(),
                            lop: $('#nhap-lop').val(),
                            khoa: $('#nhap-khoa').val(),
                        }

                        $.post(api, data_gui, function (data) {
                            var json = JSON.parse(data);
                            console.log(json);
                            if (json.ok) {
                              
                                    list_sinhvien();
                                    $('#edit-pass').show();

                               
                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                },

                close: {

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
    LOP : <input id="nhap-lop" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    KHOA : <input id="nhap-khoa" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>

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
                            lop: $('#nhap-lop').val(),
                            khoa: $('#nhap-khoa').val(),
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


    /*    cap nhat sinh vien*/
    function capnhat_sv(json) {
        var noidung_ds_cty_html = "";
        if (json.ok) {
            noidung_ds_cty_html += `
                    <button class="btn btn-outline-info add_sinhvien " data-action="list_add_sinhvien" style="margin-bottom:10px;"><i class="fa-solid fa-plus"></i> Thêm sinh viên mới</button>
                     <button class="btn btn-outline-success restart" data-action="list_add_sinhvien" style="margin-bottom:10px;"><i class="fa-solid fa-rotate-right"></i> Reratrt</button><br>


<select id="filter1"  style="padding: 5px ; width: 45%;border-radius:15px;margin-bottom:10px;">
    <option value="ten">Tên</option>
    <option value="khoa">Khoa</option>
    <option value="nam">Ngày sinh</option>
    <option value="lop">Lớp</option>
</select>

  <div id="filter2-container" style="padding: 5px; width: 45%; border-radius: 15px; margin-bottom: 10px;"></div>

  <div id="student-select" class="student-list">
      
    </div>

    `;
           
            //duyet json -> noidung_ds_cty_html xịn
            for (var sv of json.data) {

                //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action
                var tinhtrangChuoi = sv.tinhtrang == 1 ? "không học nữa " : "Đang theo học";
                var list_hoat_dong = `<button class="btn btn-success "  data-mssv="${sv.MSSV}" data-action="list_hoatdong"> <i class="fa-solid fa-file-export"></i> Hoạt động  </button>`;
                var sua = `<button class="btn btn-sm btn-warning nut_xoa_sua "  data-id="${sv.MSSV}" data-loai="list_sua" style="margin-right:10px;"> <i class="fa-solid fa-pen"></i> Sửa</button>`;
                sua += `<button class="btn btn-sm btn-danger nut_xoa_sua "  data-id="${sv.MSSV}"  data-loai="list_xoa"><i class="fa-solid fa-trash"></i> Xóa</button>`;
                sua += `<button class="btn btn-outline-success update_mssv " data-action="list_update_mssv" data-id="${sv.MSSV}" style="margin-left:10px;"><i class="fa-solid fa-square-pen"></i> Sửa MSSV  </button>`

                console.log(sv.hoten, sv.khoa, sv.ngaysinh);
                noidung_ds_cty_html += `
                     <div class="student-block" data-ten="${sv.hoten}" data-khoa="${sv.khoa}" data-nam="${sv.ngaysinh}" data-lop="${sv.lop}">
                    <img src="icon/img/anh3.png" alt="Student Image" class="student-image">
                    <div class="student-details">
                       <p class="student-info"><span>MSSV:</span> ${sv.MSSV}<span style="margin-left :10px;"> Họ Tên:</span> ${sv.hoten}</p>
                        <p class="student-info"><span>Địa chỉ:</span> ${sv.diachi} <span style="margin-left:10px;"> Ngày sinh:</span> ${sv.ngaysinh}</p>
                        <p class="student-info"><span >Lớp:</span> ${sv.lop }<span style="margin-left:10px;"> Khoa:</span> ${sv.khoa}</p>
                         <p class="student-info"><span>Tình trạng:</span> ${tinhtrangChuoi} <span  style="margin-left:10px;"> Mật khẩu::</span> ${sv.matkhau}</p>
                        <p>${list_hoat_dong}</p>
                        <p>${sua}</p>
                    </div>
                </div>`;
                console.log(noidung_ds_cty_html);
            }
         
        } else {
            noidung_ds_cty_html = "không có dữ liệu";
        }

       
            $('#ds_sinhvien').html(noidung_ds_cty_html);
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
            });

            $('.restart ').click(function () {
                list_sinhvien();
            })
            $('.update_mssv ').click(function () {
                var mssv = $(this).data('id');
                list_update_mssv(mssv);
            })

            $('.search ').click(function () {
                search_SV();
            })

        $('.student-block').css({
            'display': 'flex',
            'border': '1px solid #ddd',
            'margin': '10px',
            'padding': '10px',
            'border-radius': '8px',
            'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)'
        });

        $('.student-image').css({
            'width': '20%',
            'height': 'auto',
            'border-radius': '60%',
            'margin-right': '20px'
        });
        $('.student-info').css({
            'margin': '0',
            'padding': '5px'
        });

        $('.student-details').css({
            'width': '80%'
        });

        $('.student-details button').css({
            'margin-top': '10px'
        });

        // Sự kiện khi trang web được tải
        $(document).ready(function () {
            // Gọi hàm updateFilter2 khi trang web được tải
            var selectedValue = $("#filter1").val();
            updateFilter2(selectedValue);

            // Sự kiện khi thay đổi filter1
            $("#filter1").on("change", function () {
                var selectedValue = $(this).val();
                updateFilter2(selectedValue);
            });

            // Sự kiện khi thay đổi filter2 (xử lý việc lọc bảng)
            $("#filter2-container").on("input", "input,select", function () {
                var filterValue = $(this).val().toLowerCase();
                var selectedValue = $("#filter1").val();

                $(".student-block").each(function () {
                    var rowData = $(this).data(selectedValue).toString().toLowerCase();
                    if (rowData.includes(filterValue)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        });

        function updateFilter2(selectedValue) {
            var filter2 = $("#filter2-container");

            // Xóa tất cả các option/input trong filter2
            filter2.empty(); 
            if (selectedValue === "lop") {
                var input = $("<input>").attr({
                    type: "text",
                    placeholder: "Nhập lớp...",
                }).css({
                    width: "100%",
                    padding: "5px 10px",
                    border: "2px solid",
                });
                filter2.append(input);
            } else if (selectedValue === "ten") {
                var input = $("<input>").attr({
                    type: "text",
                    placeholder: "Nhập tên sinh viên ....",
                }).css({
                    width: "100%",
                    padding: "5px 10px",
                    border: "2px solid",
                });
                filter2.append(input);
            } else if (selectedValue === "nam") {
                var input = $("<input>").attr({
                    type: "date",
                    placeholder: "Nhập tên sinh viên ....",
                }).css({
                    width: "100%",
                    padding: "5px 10px",
                    border: "2px solid",
                });
                filter2.append(input);
            } else {
                var select = $("<select>").css({
                    width: "100%",
                    padding: "5px 10px",
                });
                switch (selectedValue) {
                    case "khoa":
                        var dataForFilter2 = ["điện tử", "điện", "Xây dựng và môi trường", "Quốc tế", "Cơ khí", "Công nghệ cơ điện và điện tử", "Kỹ thuật ô tô và máy động lực"];
                        break;
                }

                for (var i = 0; i < dataForFilter2.length; i++) {
                    var option = $("<option>").attr({
                        value: dataForFilter2[i],
                    }).text(dataForFilter2[i]);
                    select.append(option);
                }

                filter2.append(select);
            }
        }

    }

   


 /*   tim kiem trong danh sach sinh vien*/
    function search_SV() {
        var data_gui = {
            action: 'search_sv',
            search: $('#searchSV').val()
        }
        $.post(api, data_gui, function (data) {
            var json = JSON.parse(data);
            console.log(json);
            if (json.ok) {
                var json = JSON.parse(data);
                capnhat_sv(json);
            } else {
                alert(json.msg)
            }
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
                capnhat_sv(json);
            });
    }

    var role = " ";
    function check_login() {
        var name = $('#name').val();
        var pass = $('#pass').val();

        if (!name || !pass) {
            $.alert('Bạn chưa điền gì cả!');
            return false;
        } else {
            var data_gui_di = {
                action: 'login',
                name: name, 
                pass: pass
            };

            $.post(api, data_gui_di, function (data) {
              
                    var json = JSON.parse(data);

                if (json.ok) {
                    console.log(data);

                 role = json.role === 2 ? "admin" : "sinh viên ";
                    $.alert(`Đăng nhập thành công với quyền ${role}`);
                   
                    if (json.role === 2) {
                        list_hoat();
                        $('#btn-hd').show();
                        $('#btn-hd').click(function () {
                            isAddHdVisible = true;
                            list_hoat(name,pass);
                        })
                        $('#btn-list').show();
                        $('#btn-list').click(function () {
                            isAddHdVisible = false;
                           list_sinhvien();
                        })
                        
                    } else if (json.role === 1) {
                        list_hoat();
                        $('#btn-sv').show();
                        $('#btn-hd').show();
                        $('#btn-hd').click(function () {
                            list_hoat(name, pass);
                        })
                        $('#btn-sv').click(function () {
                            userSV(name,pass);
                        })
                    }
                    $('#btn-login').hide();
                    $('#nameid').show();
                    $('#btn-logout').show();
                    $('#username').html(name);
                    $('#role').html(role);
                        } else {
                            alert("Đăng nhập không thành công");
                        }

            });
        }
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
                        check_login();
                        userSV();
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
    function list_hoat(name,pass) {
        $.post(api,
            {
                action: 'list_hoatdong'
            },
            function (data) {
                //alert(data)
                console.log("Raw JSON data:", data);

                var json = JSON.parse(data);
                capnhat_hd(json,name,pass);
            });
    }

    /*    tim kiem hoat dong*/
    function search_hd() {
        var data_gui = {
            action: 'search_hd',
            search: $('#searchHD').val()
        }
        $.post(api, data_gui, function (data) {
            var json = JSON.parse(data);
            console.log(json);
            if (json.ok) {
                var json = JSON.parse(data);
                capnhat_hd(json);
            } else {
                alert(json.msg)
            }
        })
    }

    function themhoatdong() { 
        var content =
            `
     MAHD: <input id="nhap-MSSV" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
     Name: <input id="nhap-name" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    Address: <input id="nhap-address" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    NGAYBATDAU: <input type=date id="nhap-date1" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
      NGAYKETTHUC: <input type=date id="nhap-date2" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    NGUOITAO: <input id="nhap-nguoitao" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    SOLUONG: <input id="nhap-soluong" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    DIEM: <input id="nhap-diem" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    TOCHUC: <input id="nhap-tochuc" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
    `

        var dialog_add = $.confirm({
            title: 'Tạo 1 hoạt động mới  ',
            content: content,
            columnClass: 'small',
            buttons: {
                save: {
                    text: 'Tạo ',
                    btnClass: 'btn btn-outline-danger',
                    action: function () {
                        var data_gui_di = {
                            action: 'themhoatdong',
                            mahd: $('#nhap-MSSV').val(),
                            tenhd: $('#nhap-name').val(),
                            diachi: $('#nhap-address').val(),
                            ngaybatdau: $('#nhap-date1').val(),
                            ngayketthuc: $('#nhap-date2').val(),
                            soluong: $('#nhap-soluong').val(),
                            diem: $('#nhap-diem').val(),
                            tochuc: $('#nhap-tochuc').val(),
                            nguoitao: $('#nhap-nguoitao').val()
                          
                        }
                        //console.log(data_gui_di);
                        $.post(api, data_gui_di, function (data) {
                            console.log(data);
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_add.close();
                                list_hoat();
                            } else {
                                alert(json.msg)
                            }
                        });
                    }//het save
                },
                Close: {
                    text: "Trở về ",
                    btnClass: 'btn btn-outline-primary'
                }
            }
        });
    }

    function suahoatdong(mahd, json) {

        var hd;
        for (var item of json.data) {
            if (item.mahd == mahd) {
                hd = item;
             console.log(hd);
                break;
            }   
        }

        var content = `TENHD: <input type=text id="edit-name" value="${hd.ten}" style="margin-bottom:10px; padding:4px; wigth:100%;"> <br>
                       `
        var dialog_edit = $.confirm({
            title: 'Update sinh vien ',
            content: content,

            buttons: {
                save: {
                    text: 'Lưu thông tin',
                    btnClass: 'btn btn-outline-danger',
                    action: function () {
                        var data_gui = {
                            action: 'update_hd',
                            id: mahd,
                            tenhd: $('#edit-name').val()
                            
                        }

                        $.post(api, data_gui, function (data) {
                            var json = JSON.parse(data);
                            if (json.ok) {
                                console.log(json);
                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                }


            }
        })

    }

    /* cap nhat hoat dong*/
    function capnhat_hd(json,name,pass) {
        var noidung_ds_cty_html = "";
        if (json.ok) {
            noidung_ds_cty_html += `
             <button class="btn btn-outline-info add_hd " data-action="them_hd" style="margin-bottom:10px;display:none;"><i class="fa-solid fa-plus"></i> Tạo hoạt động </button>
             <select id="filter1"  style="padding: 5px ; width: 45%;border-radius:15px;margin-bottom:10px;">
    <option value="ten">Tên</option>
    <option value="khoa">Tổ chức </option>
    <option value="diem">Điểm </option>
     <option value="thang">Tháng</option>
    <option value="lop">Mã hoạt động </option>
</select>

  <div id="filter2-container" style="padding: 5px; width: 45%; border-radius: 15px; margin-bottom: 10px;"></div>

  <div id="student-select" class="student-list">
      
    </div>`;
            var Stt = 1;
            var name1 = name;
            var pass1 = pass;
            console.log(name1, pass1)
            //duyet json -> noidung_ds_cty_html xịn
            for (var sv of json.data) {

                var uniqueId = `nut_xoa_sua_${sv.mahd}_${name1}_${pass1}`;
                var sua = `<button class="btn btn-outline-danger nut_xoa_sua dkhd"  
                data-id="${sv.mahd}" data-name="${name1}" data-pass="${pass1}" data-loai="dkhoatdong" style="margin-right:10px;"> <i class="fa-solid fa-pen"></i>Đăng kí hoạt động</button>`;
                sua += `<button class="btn btn-outline-danger  duyethd"  
                data-id="${sv.mahd}" data-name="${name1}" data-pass="${pass1}" data-loai="dkhoatdong" style="margin-right:10px;"> <i class="fa-solid fa-pen"></i>Duyệt hoạt động</button>`;
                noidung_ds_cty_html += ` 
                    <div class="student-block" data-ten="${sv.ten}" data - khoa="${sv.trangthai}" data-diem="${sv.diem}" data-lop="${sv.mahd}",data-thang=" ${sv.ngayketthuc}">
                        <img src="icon/img/anh3.png" alt="Student Image" class="student-image">
                            <div class="student-details">
                                <p class="student-info"><span>MAHD:</span> ${sv.mahd}<span style="margin-left :10px;"> TENHD:</span> ${sv.ten}</p>
                                <p class="student-info"><span>TRANG THAI:</span> ${sv.trangthai} <span style="margin-left:10px;"> NGAY KET THUC:</span> ${sv.ngayketthuc}</p>
                                <p class="student-info"><span> NGUOI TAO:</span> ${sv.nguoitao}<span style="margin-left:10px;"> SOLUONG:</span> ${sv.diem1}</p>
                                <p class="student-info"><span>DIA CHI:</span> ${sv.diachi} <span style="margin-left:10px;"> DIEM:</span> ${sv.diem}</p>
                                <p >${sua}</p>
                            </div>
                        </div>`;
            }
     
        } else {
            noidung_ds_cty_html = "không có dữ liệu";
        }
        $('#ds_sinhvien').html(noidung_ds_cty_html);

        if (isAddHdVisible) {
            $('.add_hd').show();
            $('.dkhd').hide();
            $('.duyethd').show();
            
        } else {
            $('.add_hd').hide();
            $('.dkhd').show();
            $('#them_id').show();
            $('.them_id2').show();
            $('.duyethd').hide();
        }


        $('.search ').click(function () {
            search_hd();
        })
        $('.add_hd ').click(function () {
            themhoatdong();
        })
        $(document).ready(function () {

        })
        $('.nut_xoa_sua  ').click(function () {
            var action = $(this).data('loai');
            var mahd = $(this).data('id');
            var user = $(this).data('name');
            var password = $(this).data('pass');
            var button = $(this);
            if (action == 'dkhoatdong') {
                dkhoatdong(mahd, user, password);
                localStorage.setItem('dangky_' + mahd, 'true');
                button.text('Hủy đăng ký').data('loai', 'huyhoatdong');
            } else if (action == 'huyhoatdong') {
                huyhoatdong(mahd, user, password);
                button.html('<i class="fa-solid fa-pen"></i> Đăng ký hoạt động').data('loai', 'dkhoatdong');
            }
          
        })
        $('.student-block').css({
            'display': 'flex',
            'border': '1px solid #ddd',
            'margin': '10px',
            'padding': '10px',
            'border-radius': '8px',
            'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.1)'
        });

        $('.student-image').css({
            'width': '20%',
            'height': 'auto',
            'border-radius': '60%',
            'margin-right': '20px'
        });
        $('.student-info').css({
            'margin': '0',
            'padding': '5px'
        });

        $('.student-details').css({
            'width': '80%'
        });

        $('.student-details button').css({
            'margin-top': '10px'
        });

        $(document).ready(function () {
            // Gọi hàm updateFilter2 khi trang web được tải
            var selectedValue = $("#filter1").val();
            updateFilter2(selectedValue);

            // Sự kiện khi thay đổi filter1
            $("#filter1").on("change", function () {
                var selectedValue = $(this).val();
                updateFilter2(selectedValue);
            });

            // Sự kiện khi thay đổi filter2 (xử lý việc lọc bảng)
            $("#filter2-container").on("input", "input,select", function () {
                var filterValue = $(this).val().toLowerCase();
                var selectedValue = $("#filter1").val();

                if (selectedValue === "thang") {
                    // Xử lý bộ lọc theo tháng
                    var selectedMonth = filterValue; // Giả sử giá trị là "YYYY-MM"
                    $(".student-block ").each(function () {
                        var rowData;

                        if (selectedValue === "thang") {
                            rowData = $(this).data("thang");
                        } else {
                            rowData = $(this).data(selectedValue);
                        }
                        if (rowData !== undefined) {
                            rowData = rowData.toString().toLowerCase();
                            if (selectedValue === "thang") {
                                // Xử lý bộ lọc theo tháng
                                var rowThang = rowData.substr(0, 7); // Lấy "YYYY-MM" từ giá trị ngày
                                if (rowThang.includes(filterValue)) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            } else {
                                // Xử lý bộ lọc cho trường hợp khác
                                if (rowData.includes(filterValue)) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            }
                        } else {
                            console.error("Không tìm thấy giá trị cho thuộc tính được chọn.");
                        }
                    });
                } else {
                     $(".student-block").each(function () {
                    var rowData = $(this).data(selectedValue);
                    if (rowData !== undefined) {
                        rowData = rowData.toString().toLowerCase();
                        if (rowData.includes(filterValue)) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    } else {
                        // Xử lý trường hợp rowData là undefined
                        console.error("Không tìm thấy giá trị cho thuộc tính được chọn.");
                    }
                });
                }

               
            });
        });

        function updateFilter2(selectedValue) {
            var filter2 = $("#filter2-container");

            // Xóa tất cả các option/input trong filter2
            filter2.empty();
            if (selectedValue === "lop") {
                var input = $("<input>").attr({
                    type: "text",
                    placeholder: "Nhập lớp...",
                }).css({
                    width: "100%",
                    padding: "5px 10px",
                    border: "2px solid",
                });
                filter2.append(input);
            } else if (selectedValue === "ten") {
                var input = $("<input>").attr({
                    type: "text",
                    placeholder: "Nhập tên sinh viên ....",
                }).css({
                    width: "100%",
                    padding: "5px 10px",
                    border: "2px solid",
                });
                filter2.append(input);
            } else if (selectedValue === "thang") {
                // Nếu là bộ lọc theo tháng, thêm input type month
                var input = $("<input>").attr({
                    type: "month",
                    placeholder: "Chọn tháng...",
                }).css({
                    width: "100%",
                    padding: "5px 10px",
                    border: "2px solid",
                });
                filter2.append(input);
            } 
               
            else {
                var select = $("<select>").css({
                    width: "100%",
                    padding: "5px 10px",
                });
                switch (selectedValue) {
                    case "khoa":
                        var dataForFilter2 = ["Đang diễn ra", "Sắp diễn ra"];
                        break;
                    case "diem":
                        var dataForFilter2 = ["5", "10","15","20"];
                        break;
                    
                }

                for (var i = 0; i < dataForFilter2.length; i++) {
                    var option = $("<option>").attr({
                        value: dataForFilter2[i],
                    }).text(dataForFilter2[i]);
                    select.append(option);
                }

                filter2.append(select);
            }
        }

      
    }

    function hoat_user(name,pass) {
        $.post(api,
            {
                action: 'hoatdong_user',
                name: name,
                pass: pass
            },
            function (data) {
                //alert(data)
                console.log("Raw JSON data:", data);

                var json = JSON.parse(data);
                capnhat_hd(json, name, pass);
            });
    }
 
    function dkhoatdong(mahd, user, password ){
        var dialog_edit = $.confirm({
            title: 'Dang ki hoat dong ',
          

            buttons: {
                save: {
                    text: 'Lưu thông tin',
                    btnClass: 'btn btn-outline-danger',
                    action: function () {
                        var data_gui = {
                            action: 'dangkihd',
                            mahd1: mahd,
                            name: user,
                            pass: password
                          
                        }
                        console.log(data_gui);
                        $.post(api, data_gui, function (data) {
                            if (!data) {
                                console.log("Dữ liệu rỗng hoặc không tồn tại.");
                                return;
                            }

                            var json = JSON.parse(data);
                            console.log(data);
                            if (json.ok) {
                              
                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                }


            }
        })
    }

    function huyhoatdong(mahd, user, password) {
        var dialog_edit = $.confirm({

            content : 'Bạn có muốn hủy đăng kí hoạt động này không ?',
            buttons: {
                save: {
                    text: 'Hủy ',
                    btnClass: 'btn btn-outline-danger',
                    action: function () {
                        var data_gui = {
                            action: 'delete_user',
                            mahd1: mahd,
                            name: user,
                            pass: password

                        }
                        console.log(data_gui);
                        $.post(api, data_gui, function (data) {
                            if (!data) {
                                console.log("Dữ liệu rỗng hoặc không tồn tại.");
                                return;
                            }

                            var json = JSON.parse(data);
                            console.log(data);
                            if (json.ok) {

                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                }


            }
        })
    }

   /* Sua thong tin phan quyen sinh vien*/
    function userSV(name,pass) {
        console.log('Name:', name);
        console.log('Pass:', pass);
        var data_gui={
            action: 'user_sv',
            name: name,
            pass: pass
        }
        
        $.post(api, data_gui, function (data) { 
            var json = JSON.parse(data);
            console.log(json);
            capnhat_user(json);
        })
            .fail(function (error) {
                console.error('Error:', error);
            });
    }

    function capnhat_user(json) {
                var noi_dung = " ";
        if (json.ok) {
            for (var sv of json.data) {
                var tinhtrangChuoi = sv.tinhtrang == 1 ? "không học nữa " : "Đang theo học";
                noi_dung += `
                 <p>Họ tên: ${sv.hoten}</p>
                <p>Địa chỉ: ${sv.diachi}</p>
                <p>Ngày sinh: ${sv.ngaysinh}</p>
                <p>Tình trạng: ${tinhtrangChuoi}</p>
                <p>Lớp: ${sv.lop}</p>
                <p>Khoa: ${sv.khoa}</p>
                <button id = "btn_sua" class="btn btn-warning">Sua</button>
                <br>
            ` ;
            }
        }
        else { noi_dung = "khong co du lieu" }

        $('#ds_sinhvien').html(noi_dung);
           
        $('#btn_sua').click(function () {
            var id = `${sv.MSSV}`;
            user_sua(id, json);
          
        });
        
    }

    function user_sua(id, json) {
        var sv;
        for (var item of json.data) {

            if (item.MSSV == id) {
                sv = item;
                console.log(sv);
                break;
            }
        }

        var content = `NAME: <input type=text id="edit-name" value="${sv.hoten}" style="margin-bottom:10px; padding:4px; wigth:100%;"> <br>
                        ADDRESS: <input type=text id="edit-address" value="${sv.diachi}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>
                         DATE : <input type=date id="edit-ngay" value="${sv.ngaysinh}" style="margin-bottom:10px; padding:4px; wigth:100%;"><br>`
                         
        var dialog_edit = $.confirm({
            title: 'Sửa thông tin  sinh vien ',
            content: content,

            buttons: {
                save: {
                    text: 'Lưu thông tin',
                    btnClass: 'btn btn-outline-danger',
                    action: function () {
                        var data_gui = {
                            action: 'userupdate_sv',
                            id: id,
                            hoten: $('#edit-name').val(),
                            diachi: $('#edit-address').val(),
                            ngaysinh: $('#edit-ngay').val()
                        }

                        $.post(api, data_gui, function (data) {
                            var json = JSON.parse(data);
                            console.log(json);
                            if (json.ok) {
                                alert("ban da sua thanh cong");
                            } else {
                                alert(json.msg)
                            }
                        })
                    }
                },

                close: {

                }
            }
        })
    }
   
     list_hoat();
    $('#btn-login').click(function () {
        list_login();
    });
  

    $('#btn-logout').click(function () {
     
        // Ẩn hoặc hiển thị các phần tử tùy thuộc vào trạng thái đăng nhập
        $('#btn-login').show();
        $('#nameid1').hide();
        $('#username').html(''); // Xóa tên người dùng
        $('#btn-logout').hide();

        // Chuyển về trang không đăng nhập (ví dụ: trang chính)
        window.location.href = 'https://localhost:44307/';
    });
});