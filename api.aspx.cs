using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ThucHanh;

namespace QLNK_NET
{
    public partial class api : System.Web.UI.Page
    {  
        // Lay thong tin sinh vien tu data base co proceduce la thong tin sinh vien co action = list_company
        void xuly_thongtin(string action)
            {
                SqlServer db = new SqlServer();
                SqlCommand cm = db.GetCmd("Thongtinsv", action);

            switch (action)
            {
                //2 loại này truyền 5 tham số chung
                case "update_sinhvien":
                    cm.Parameters.Add("@hoten", SqlDbType.NVarChar, 50).Value = Request["hoten"];
                    cm.Parameters.Add("@diachi", SqlDbType.NVarChar, 50).Value = Request["diachi"];
                    cm.Parameters.Add("@ngaysinh", SqlDbType.NVarChar,20).Value = Request["ngaysinh"];
                    cm.Parameters.Add("@tinhtrang", SqlDbType.NVarChar, 10).Value = Request["tinhtrang"];
                    cm.Parameters.Add("@matkhau", SqlDbType.NVarChar, 50).Value = Request["matkhau"];
                    break;

            }
            switch (action)
            {
                case "update_sinhvien":
                case "delete_sinhvien":
                    cm.Parameters.Add("@MSSV", SqlDbType.NVarChar,30).Value = Request["id"];
                    break;
            }

            string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về jsonhd
                 Response.Write(json);

            }

        //them 1 sinh vien 
        void themsinvien(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("Thongtinsv", action);

            switch (action)
            {
                //2 loại này truyền 5 tham số chung
                case "into_sinhvien":
                    cm.Parameters.Add("@MSSV", SqlDbType.NVarChar, 30).Value = Request["id"];
                    cm.Parameters.Add("@hoten", SqlDbType.NVarChar, 50).Value = Request["hoten"];
                    cm.Parameters.Add("@diachi", SqlDbType.NVarChar, 50).Value = Request["diachi"];
                    cm.Parameters.Add("@ngaysinh", SqlDbType.NVarChar, 20).Value = Request["ngaysinh"];
                    cm.Parameters.Add("@tinhtrang", SqlDbType.NVarChar, 20).Value = Request["tinhtrang"];
                    cm.Parameters.Add("@matkhau", SqlDbType.NVarChar, 50).Value = Request["matkhau"];
                    cm.Parameters.Add("@lop", SqlDbType.NVarChar, 50).Value = Request["lop"];
                    cm.Parameters.Add("@khoa", SqlDbType.NVarChar, 50).Value = Request["khoa"];
                    break;

            }

            string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);

        }

        // Lay thong tin diem ngoai khoa tu data base co proceduce la Laydiemngoaikhoa co action = list_ngoaikhoa
        void xuly_thamgia(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand hd = db.GetCmd("Laydiemngoaikhoa", action);
            hd.Parameters.Add("@MSSV", SqlDbType.NVarChar, 50).Value = Request["mssv"];
            string json = (string)db.Scalar(hd); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);
        }

        //Lay tong diem da quat theo ngay tu data base co proceduce la Laydiemngoaikhoa co action = list_ngayquet
        void xuly_ngay(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand hd = db.GetCmd("Laydiemngoaikhoa", action);
            hd.Parameters.Add("@ngayquet1 ", SqlDbType.NVarChar, 50).Value = Request["ngay1"];
            hd.Parameters.Add("@ngayquet2 ", SqlDbType.NVarChar, 50).Value = Request["ngay2"];
            hd.Parameters.Add("@MSSV", SqlDbType.NVarChar, 50).Value = Request["mssv"];

            string json = (string)db.Scalar(hd); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);
        }

        //Danh sach hoat dong
        void Xulyhoatdong(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("hoatdongngoaikhoa", action);
            switch (action)
            {
                case "search_hd":
                cm.Parameters.Add("@search ", SqlDbType.NVarChar, 50).Value = Request["search"];
                    break;

                case "themhoatdong":
                    cm.Parameters.Add("@mahd", SqlDbType.NVarChar, 30).Value = Request["mahd"];
                    cm.Parameters.Add("@tenhd", SqlDbType.NVarChar, 50).Value = Request["tenhd"];
                    cm.Parameters.Add("@diadiem", SqlDbType.NVarChar, 50).Value = Request["diadiem"];
                    cm.Parameters.Add("@soluong", SqlDbType.Int).Value = Request["soluong"];
                    cm.Parameters.Add("@diem", SqlDbType.Int).Value = Request["diem"];
                    cm.Parameters.Add("@nguoitao", SqlDbType.NVarChar, 50).Value = Request["nguoitao"];
                    cm.Parameters.Add("@tochuc", SqlDbType.NVarChar, 50).Value = Request["tochuc"];
                    cm.Parameters.Add("@ngaybatdau", SqlDbType.NVarChar, 50).Value = Request["ngaybatdau"];
                    cm.Parameters.Add("@ngayketthuc", SqlDbType.NVarChar, 50).Value = Request["ngayketthuc"];
                    break;
                case "update_hd":
                    cm.Parameters.Add("@tenhd", SqlDbType.NVarChar, 50).Value = Request["tenhd"];
                   
                    break;
            }
        
            string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);

        }

     

        void update_ms(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("Thongtinsv", action);
            cm.Parameters.Add("@NewMSSV", SqlDbType.NVarChar, 50).Value = Request["newMSSV"];
            cm.Parameters.Add("@MSSV", SqlDbType.NVarChar, 30).Value = Request["mssv"];
            string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);

        }

        void list_dangki(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("Dangkingoaikhoa", action);
            string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);
        }


        void bao_luu(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand hd = db.GetCmd("Danhsachbaoluu", action);
            string json = (string)db.Scalar(hd); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);
        }

     

        void Dangnhap(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("Login", action);
            cm.Parameters.Add("@user", SqlDbType.NVarChar, 50).Value = Request["name"];
            cm.Parameters.Add("@pass", SqlDbType.NVarChar, 30).Value = Request["pass"];
            string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);
        }


        void search_sv(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand cm = db.GetCmd("Thongtinsv", action);
            cm.Parameters.Add("@search", SqlDbType.NVarChar, 30).Value = Request["search"];
            string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);

        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string action = Request["action"];
            switch (action)
            { 
               // Doc,sua,xoa sinh vien
                case "list_sinhvien":
                case "update_sinhvien":
                case "delete_sinhvien":
                    xuly_thongtin(action);
                    break;
                // Them 1 truong sinh vien
                case "into_sinhvien":
                     themsinvien(action); 
                    break;
                // Xuat hoat dong ngoai khoa da dang ki va da quet
                case "list_ngoaikhoa":
                    xuly_thamgia(action);
                        break;
                // TInh tong diem theo ngay 
                case "list_ngayquet":
                    xuly_ngay(action);
                    break;
                //Danh sach hoat dong
                case "list_hoatdong":
                case "search_hd":
                case "themhoatdong":
                case "update_hd":
                    Xulyhoatdong(action); 
                    break;
                // update Mssv
                case "update_mssv":
                    update_ms(action); 
                    break;

                //Danh sach dang ki ngoai khoa
                case "dangki":
                    list_dangki(action);
                    break;

                case "baoluu":
                    bao_luu(action);
                    break;

           
                case "login":
                    Dangnhap(action);
                    break;

                case "search_sv":
                    search_sv(action);
                        break;
            }
        }
    }
}