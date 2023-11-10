﻿$(document).ready(function () {
    const api = '/api.aspx';


    function list_search_ngay(mssv)

        {
        var dialog_list_ngay = $.confirm({
            title: "Nhap thoi gian ",
            content: `Ngay dau :  <input type="date" name="name"  id="ngay_dau" /><br>` +
                `Ngay cuoi :  <input type="date" name="name"  id="ngay_cuoi" />`,
            columnClass: 'large',
            buttons: {
                Gui: {
                    action: function () {
                        var ngay_bat_dau = $('#ngay_dau').val();
                        var ngay_ket_thuc = $('#ngay_cuoi').val();
                        var data_gui = {
                            action : 'list_ngayquet',
                            ngay1: ngay_bat_dau,
                            ngay2: ngay_ket_thuc,
                            mssv : mssv
                        }
                        $.post(api, data_gui, function (data) {
                            console.log(data);
                            var json = JSON.parse(data);
                            if (json.ok) {
                                dialog_list_ngay.close();
                                console.log(json);
                               
                            } else {
                                alert(json.msg);
                            }
                        });

                    }
                },

                Dong: {

                }

            }
       
           
        });
    }

   function list_hoatdong(mssv) {
        var dialog_list_company = $.confirm({
            title: "Danh sach hoat dong",
            content: `<div id="ds_cong_ty">loading...</div>` +
                `<div id="tongdiem">Tong diem:</div>`,
            columnClass: 'large',
            buttons: {
                search: {
                    text: 'Tìm kiếm',
                    action: function () {
                        list_search_ngay(mssv);
                    }
                   
                },
            
               close: {

                }
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
                            noidung_ds_cty_html += `<table class="table table-striped">
              <thead class="table table-dark">
              <tr>
              <th>STT</th>
              <th>ID</th>
                <th>MaHD</th>
                <th>HO TEN</th>
                <th>TEN HD</th>
                <th>TINH TRANG QUET</th>
                <th>NGAY QUET</th>
                <th>DIEM</th>
           
              </tr>
              </thead><tbody>`;
                            var Stt = 1;
                            var tongDiem =0;
                            //duyet json -> noidung_ds_cty_html xịn
                            for (var hd of json.data) {
                                var daquet = hd.daquet ==1 ? "Quét điểm thành công" : "Bạn chưa được quét điểm";                  
                                noidung_ds_cty_html += `
                <tr >
                 <td>${Stt++}</td>
                  <td>${hd.id}</td>
                <td>${hd.MaHD}</td>
                <td>${hd.hoten}</td>
                <td>${hd.tenhd}</td>
                 <td>${daquet}</td>
                  <td>${hd.ngayquet}</td>
                <td>${hd.diem}</td>
               
              
              </tr>`;
                                if (hd.daquet == 1) {
                                    // Nếu đã quét điểm, cộng điểm vào tổng
                                    tongDiem = tongDiem + parseInt(hd.diem);
                                }
                            }

                       noidung_ds_cty_html += "</tbody></table>";
                        } else {

                            noidung_ds_cty_html = "không có dữ liệu";
                        }
                        $('#ds_cong_ty').html(noidung_ds_cty_html); 
                        $('#tongdiem').html("Tong diem: " +(tongDiem)); 
                    }
            )}

        });
    }

    function list_company() {
        $.post(api,
            {
                action: 'list_company'
            },
            function (data) {
                //alert(data)
                console.log(data);
                var json = JSON.parse(data); 
                var noidung_ds_cty_html = "";
                if (json.ok) {
                    noidung_ds_cty_html += `<table class="table table-striped">
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
              </tr>
              </thead><tbody>`;
                    var Stt = 1;
                    //duyet json -> noidung_ds_cty_html xịn
                    for (var sv of json.data) {

                        //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action
                        var tinhtrangChuoi = sv.tinhtrang == 1 ? "Khong hoc nua" : "Đang theo học";
                        var list_hoat_dong = `<button class="btn btn-sm btn-warning "  data-mssv="${sv.MSSV}"data-action="list_hoatdong">Xuất hoạt động </button>`;
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
               

            });
    }

    $('#btn-list').click(function () {
        list_company();    });

});