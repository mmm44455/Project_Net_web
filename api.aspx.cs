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
        void xuly_thongtin(string action)
            {
                SqlServer db = new SqlServer();
                SqlCommand cm = db.GetCmd("Thongtinsv", action);

              string json = (string)db.Scalar(cm); //thuc thi SqlCommand cm này để thu về jsonhd
                     Response.Write(json);

            }

        void xuly_thamgia(string action,string mssv)
        {
            SqlServer db = new SqlServer();
            SqlCommand hd = db.GetCmd("Laydiemngoaikhoa", action);
            hd.Parameters.Add("@MSSV", SqlDbType.NVarChar, 50).Value = mssv;
          

            string json = (string)db.Scalar(hd); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);
        }
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
        protected void Page_Load(object sender, EventArgs e)
        {
            string action = Request["action"];
            string mssv = Request["mssv"];
            switch (action)
            { 
               
                case "list_company":
                    xuly_thongtin(action);
                    break;


                case "list_ngoaikhoa":
                    xuly_thamgia(action, mssv);
                        break;

                case "list_ngayquet":
                    xuly_ngay(action);
                    break;

            }
        }
    }
}