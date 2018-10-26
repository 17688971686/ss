package cs.model.Statistics.view.newEdition;

import cs.model.Statistics.ProjectStatisticsBean;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class GenerateExcelForMoney {

	@SuppressWarnings("deprecation")
	public HSSFWorkbook getHSSFWorkBook(List<ProjectStatisticsBean> data,String type,String isIncludLibraryParam){
        String typeDesc =
                type.equals("projectName")?"项目名称"
                :"";

        String isIncludLibrary =
                isIncludLibraryParam.equals("true")?"已纳入项目库项目"
                :isIncludLibraryParam.equals("false")?"未纳入项目库项目"
                :isIncludLibraryParam.equals("all")?"项目总库"
                :"";

        // 声明一个工作薄
        HSSFWorkbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("表1");

        CellStyle cellStyleTitle = workbook.createCellStyle();
        CellStyle cellStyleSubTitleLeft = workbook.createCellStyle();
        CellStyle cellStyleO = workbook.createCellStyle();

        //设置字体
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 14); // 字体高度
        font.setFontName(" 黑体 "); // 字体
        cellStyleTitle.setFont(font);
        //设置表格边框
        cellStyleTitle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyleTitle.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyleTitle.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyleTitle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        cellStyleSubTitleLeft.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyleSubTitleLeft.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyleSubTitleLeft.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyleSubTitleLeft.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        cellStyleO.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyleO.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyleO.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyleO.setBorderLeft(HSSFCellStyle.BORDER_THIN);

        //创建行
        Row title=sheet.createRow(0);
        Row subTitle=sheet.createRow(1);
        Row row_head = sheet.createRow(2);

        //设置行高
        title.setHeight((short)800);
        subTitle.setHeight((short)500);
        row_head.setHeight((short)360);

        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,"光明新区政府投资"+isIncludLibrary+"项目资金汇总表",cellStyleTitle);
        //合并标题
        //参数1：开始行、结束行、开始列、结束列
        CellRangeAddress cellRangeTitle = type.equals("projectName")?new CellRangeAddress(0,0,0,5)
                :null;
        setRegionStyle(sheet,cellRangeTitle,cellStyleTitle);
        sheet.addMergedRegion(cellRangeTitle);
        //end#标题

        //begin#子标题
        createCellAlignLeft(workbook,subTitle,0,"打印日期："+new SimpleDateFormat("yyyy年MM月dd日").format(new Date()),cellStyleSubTitleLeft);
        CellRangeAddress cellRangeSubTitleLeft = null;
       if(type.equals("projectName")){
            //设置子标题列宽
            sheet.setColumnWidth(1, 256*35+184);
            sheet.setColumnWidth(2, 256*26+184);
            sheet.setColumnWidth(3, 256*16+184);
            sheet.setColumnWidth(4, 256*16+184);
            sheet.setColumnWidth(5, 256*16+184);

            createCellAlignRight(workbook,subTitle,5,"资金：万   元",workbook.createCellStyle());
            cellRangeSubTitleLeft = new CellRangeAddress(1,1,0,4);
        }
        setRegionStyle(sheet,cellRangeSubTitleLeft,cellStyleSubTitleLeft);
        sheet.addMergedRegion(cellRangeSubTitleLeft);
        //end#子标题

        //begin表格头
        createCellAlignCenter(workbook,row_head,0,"序号",cellStyleO);
        if(type.equals("projectName")){
            createCellAlignCenter(workbook,row_head,1,typeDesc,cellStyleO);
            createCellAlignCenter(workbook,row_head,2,"单位名称",cellStyleO);
            createCellAlignCenter(workbook,row_head,3,"申报阶段",cellStyleO);
            createCellAlignCenter(workbook,row_head,4,"申请金额",cellStyleO);
            createCellAlignCenter(workbook,row_head,5,"批复金额",cellStyleO);
        }
        //end#表格头

        //begin#数据列
        int rowNum=type.equals("projectName")?3
                :3;//数据加载开始行
        int index=1;

        for (ProjectStatisticsBean obj:data) {
            Row row = sheet.createRow(rowNum);
            //创建数据
            createCellAlignCenter(workbook,row,0, index,cellStyleO);//序号
            if(type.equals("projectName")){
                createCellAlignCenter(workbook,row,1, obj.getProjectName(),cellStyleO);//项目名称
                createCellAlignCenter(workbook,row,2, obj.getUnitName(),cellStyleO);//单位名称
                createCellAlignCenter(workbook,row,3, obj.getProjectStageDesc(),cellStyleO);//申报阶段
                createCellAlignCenter(workbook,row,4, obj.getProjectInvestSum(),cellStyleO);//申请金额
                createCellAlignCenter(workbook,row,5, obj.getPfProjectInvestSum(),cellStyleO);//批复金额
            }
            rowNum++;index++;
        }
		return workbook;
	}

    private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
        //设置边框
        cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
    //创建值为double字体居中的单元格
    private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,double value,CellStyle cellStyle){
        //设置边框
        cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
    //创建值为string字体居左的单元格
    private void createCellAlignLeft(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
        //设置边框
        cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_LEFT,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
    //创建值为string字体居右的单元格
    private void createCellAlignRight(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
        //设置边框
        cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_RIGHT,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
    //重写创建列
    private void createCell(Workbook workbook,Row row, int cellNumber,String value, short halign, short valign,CellStyle cellStyle){
        Cell cell=row.createCell(cellNumber);
        cell.setCellValue(value);

        cellStyle.setAlignment(halign);
        cellStyle.setVerticalAlignment(valign);
        cellStyle.setWrapText(true);
        //设置边框
        cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        cell.setCellStyle(cellStyle);
    }
    @SuppressWarnings("deprecation")
    //重写创建列
    private void createCell(Workbook workbook,Row row, int cellNumber,double value, short halign, short valign,CellStyle cellStyle){
        Cell cell=row.createCell(cellNumber);// 创建单元格
        cell.setCellValue(value);// 设置值

        cellStyle.setAlignment(halign);// 设置单元格水平方向对齐方式
        cellStyle.setVerticalAlignment(valign);// 设置单元格垂直方向对齐方式
        cellStyle.setWrapText(true);
        //设置边框
        cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
        cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        cell.setCellStyle(cellStyle);
    }


    /**
     *
     * @Title: setRegionStyle
     * @Description: 设置单元格样式
     * @param sheet 当前表
     * @param region 合并列
     * @param cs  样式
     */
    public static void setRegionStyle(Sheet sheet, CellRangeAddress region, CellStyle cs) {
        for (int i = region.getFirstRow(); i <= region.getLastRow(); i++) {
            HSSFRow row = (HSSFRow) sheet.getRow(i);
            if (row == null)
                row = (HSSFRow) sheet.createRow(i);
            for (int j = region.getFirstColumn(); j <= region.getLastColumn(); j++) {
                HSSFCell cell = row.getCell(j);
                if (cell == null) {
                    cell = row.createCell(j);
                    cell.setCellValue("");
                }
                cell.setCellStyle(cs);
            }
        }
    }
}
