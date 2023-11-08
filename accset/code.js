$(document).ready(function () {
    const api = '/api.aspx';



   function list_hoatdong(mssv) {
        var dialog_list_company = $.confirm({
            title: "Danh sach hoat dong",
            content: `<div id="ds_cong_ty">loading...</div>`,
            columnClass: 'large',
            buttons: {
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
                <th>MaHD</th>
                <th>HO TEN</th>
                <th>TEN HD</th>
                <th>TINH TRANG QUET</th>
                <th>NGAY QUET</th>
                <th>DIEM</th>
              </tr>
              </thead><tbody>`;
                            var Stt = 1;
                            //duyet json -> noidung_ds_cty_html xịn
                            for (var hd of json.data) {
                                var daquet = hd.daquet ==1 ? "Quét điểm thành công" : "Bạn chưa được quét điểm";                  
                                noidung_ds_cty_html += `
                <tr >
                 <td>${Stt++}</td>
                <td>${hd.MaHD}</td>
                <td>${hd.hoten}</td>
                <td>${hd.tenhd}</td>
                 <td>${daquet}</td>
                  <td>${hd.ngayquet}</td>
                <td>${hd.diem}</td>
              
              </tr>`;
                            }

                       noidung_ds_cty_html += "</tbody></table>";
                        } else {

                            noidung_ds_cty_html = "không có dữ liệu";
                        }
                        $('#ds_cong_ty').html(noidung_ds_cty_html); 
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