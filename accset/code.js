$(document).ready(function () {
    const api = '/api.aspx';
   function list_hoatdong() {
        var dialog_list_company = $.confirm({
            title: "Danh sach hoat dong",
            content: `<div id="ds_cong_ty">loading...</div>`,
            columnClass: 'large',
            buttons: {
                add: {
                 
                },
                close: {

                }
            },
            onContentReady: function () {
                $.post(api,
                    {
                        action: 'list_hoatdong'
                    },
                    function (data) {
                    
                        var json = JSON.parse(data); //txt trong data -> obj json
                        console.log(json);
                        var noidung_ds_cty_html = "";
                        if (json.ok) {
                            noidung_ds_cty_html += `<table class="table table-striped">
              <thead class="table table-dark">
              <tr>
              <th>STT</th>
                <th>MaHd</th>
                <th>Ten Hd</th>
                <th>Mo ta</th>
                <th>Dia diem</th>
                <th>diem</th>
              </tr>
              </thead><tbody>`;
                            var Stt = 1;
                            //duyet json -> noidung_ds_cty_html xịn
                            for (var hd of json.data) {

                                //sua_xoa là 2 nút: mỗi nút kèm theo data để sau này phân loại: là data-cid  và data-action


                                noidung_ds_cty_html += `
                <tr >
                 <td>${Stt++}</td>
                <td>${hd.MaHd}</td>
                <td>${hd.tenhd}</td>
                <td>${hd.mota}</td>
                 <td>${hd.diachi}</td>
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
                var json = JSON.parse(data); 
                console.log(data); // In dữ liệu t
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
                        var tinhtrangChuoi = sv.tinhtrang === 1 ? "Khong hoc nua" : "Đang theo học";
                        var list_hoat_dong = `<button class="btn btn-sm btn-warning "  data-cid="${sv.MSSV}"data-action="list_hoatdong">Xuất hoạt động </button>`;
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
                    list_hoatdong();
                });
               

            });
    }

 


    $('#btn-list').click(function () {
        list_company();
    });
});