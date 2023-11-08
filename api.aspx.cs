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

        void xuly_thamgia(string action)
        {
            SqlServer db = new SqlServer();
            SqlCommand hd = db.GetCmd("Thongtinthamgia", action);

            string json = (string)db.Scalar(hd); //thuc thi SqlCommand cm này để thu về jsonhd
            Response.Write(json);

        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string action = Request["action"];
          
            switch(action)
            { 
               
                case "list_company":
                    xuly_thongtin(action);
                    break;


                case "list_hoatdong":
                    xuly_thamgia(action);
                    break;

            }
        }
    }
}