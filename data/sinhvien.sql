USE [Pro_QLNK]
GO
/****** Object:  StoredProcedure [dbo].[Thongtinsv]    Script Date: 14/11/2023 9:43:38 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Nguyen Duy Cao
-- Create date:  14/11/2023
-- Description:	  update sua mssv
-- =============================================
ALTER PROCEDURE [dbo].[Thongtinsv]
	-- Add the parameters for the stored procedure here
	@action    nvarchar(50) = 'list_company',
    @MSSV    nvarchar(30)=null,
    @hoten    nvarchar(50) = null,
    @ngaysinh    date = null,
    @diachi    nvarchar(50) = null,
    @tinhtrang    bit=null,
    @matkhau nvarchar(50) = null,
	@lop nvarchar(50) = null,
	@khoa  nvarchar(50) = null,
	@NewMSSV nvarchar(50) = null
AS
BEGIN

	declare @json nvarchar(max)='';	
	if(@action = 'list_sinhvien')
		begin 
		SELECT @json += N'{
		"MSSV":"' + [MSSV] + N'",
		"hoten":"' + [hoten] + N'",
		"diachi":"' + ISNULL([diachi], N'') + N'",
		"ngaysinh":"' + CONVERT(NVARCHAR(20), [ngaysinh], 120) + N'",
		"tinhtrang":"' + CAST([tinhtrang] AS NVARCHAR(10)) + N'",
		"matkhau":"' + [mat khau] + N'"
		},'
		FROM [Thongtincanhan]
		where del_at is null;
		if((@json is null)or(@json=''))
			select N'{"ok":0,"msg":"không có dữ liệu","data":[]}' as json;
		else
		  begin
			select @json=REPLACE(@json,'(null)','null')
			select N'{"ok":1,"msg":"ok","data":['+left(@json,len(@json)-1)+']}' as json;
		  end
	end

	-----------Sua thong tin sinh vien-------------
	if(@action = 'update_sinhvien')
	begin
		update [Thongtincanhan]
		set [hoten]=@hoten, [diachi]=@diachi,[ngaysinh]=CONVERT(NVARCHAR(20), @ngaysinh, 120),
		[tinhtrang]=CAST(@tinhtrang AS NVARCHAR(10)),
		[mat khau]=@matkhau
		where [MSSV]=@MSSV;		

		set @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã sửa thành công!"}')
		select @json as json;
	end
	----------them thong tin sinh vien-----------
	else if(@action = 'into_sinhvien')
	begin 
	INSERT INTO [Thongtincanhan]([MSSV],[hoten],[diachi],[ngaysinh],[tinhtrang],[mat khau],[lop],[khoa])
		VALUES (@MSSV,@hoten,@diachi,@ngaysinh,@tinhtrang,@matkhau,@lop,@khoa);

		set @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã thêm thành công công ty "}');
		select @json as json;
	end
	-----------Xoa thong tin ca nhan ------------------
	else if(@action='delete_sinhvien')
	begin
	update Thongtincanhan set del_at=getdate() where MSSV = @MSSV
		select @json=FORMATMESSAGE(N'{"ok":1,"msg":"Đã xóa thành công công ty"}')
		select @json as json;
	end 

	IF (@action = 'update_mssv')
BEGIN
    EXEC sp_msforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';

-- Bước 2: Thực hiện thay đổi khóa chính
UPDATE Thongtincanhan SET MSSV = @NewMSSV WHERE MSSV = @MSSV;

-- Bước 3: Cập nhật giá trị trong bảng phụ 1
UPDATE Luutru SET MSSV = @NewMSSV WHERE MSSV = @MSSV;

-- Bước 4: Cập nhật giá trị trong bảng phụ 2
UPDATE Dangki SET MSSV = @NewMSSV WHERE MSSV = @MSSV;

-- Bước 5: Cập nhật giá trị trong bảng phụ 3
UPDATE Quetdiem SET MSSV = @NewMSSV WHERE MSSV = @MSSV;

-- Bước 6: Kích hoạt lại tất cả các ràng buộc khóa ngoại
EXEC sp_msforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';
END

END
