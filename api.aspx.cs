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
            SqlCommand cm = db.GetCmd("SP_hoatdong", action);
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
            }
        }
    }
}