package cs.model.exportExcel;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractXlsView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class ExcelReportYSView extends AbstractXlsView {
	
	private int year;
	public ExcelReportYSView(int year){
		this.year=year;
	}
	
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String fileName = "光明新区"+year+"年区级政府投资项目计划.xls";
        response.setHeader("Content-Disposition", "attachment;filename=" +new String(fileName.getBytes("gb2312"), "iso8859-1"));
        Sheet sheet = workbook.createSheet("表1");
        CellStyle cellStyleO = workbook.createCellStyle();
        CellStyle cellStyleTitle = workbook.createCellStyle();
        CellStyle cellStyleSubTitleLeft = workbook.createCellStyle();
        CellStyle cellStyleSubTitleRight = workbook.createCellStyle();

        //创建行
        Row title=sheet.createRow(0);
        Row subTitle=sheet.createRow(1);
        Row row_head1 = sheet.createRow(2);
        Row row_head2 = sheet.createRow(3);
        //设置字体
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 14); // 字体高度
        font.setFontName(" 黑体 "); // 字体
        cellStyleTitle.setFont(font);
        
        title.setHeight((short)800);
        subTitle.setHeight((short)500);

        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,"光明新区"+year+"年政府投资项目计划",cellStyleTitle);
        //合并
        sheet.addMergedRegion(new CellRangeAddress(0,0,0,11));
        //end#标题

        //begin#子标题
        createCellAlignLeft(workbook,subTitle,0,"打印日期："+new SimpleDateFormat("yyyy年MM月dd日").format(new Date()),cellStyleSubTitleLeft);
        createCellAlignRight(workbook,subTitle,10,"资金：万   元\n面积：平方米",cellStyleSubTitleRight);
        sheet.addMergedRegion(new CellRangeAddress(1,1,0,9));
        sheet.addMergedRegion(new CellRangeAddress(1,1,10,11));
        //end#子标题

        //begin表格头
        createCellAlignCenter(workbook,row_head1,0,"序号",cellStyleO);
        createCellAlignCenter(workbook,row_head1,1,"建设单位及项目名称",cellStyleO);
        createCellAlignCenter(workbook,row_head1,2,"项目类别",cellStyleO);
        createCellAlignCenter(workbook,row_head1,3,"建设规模",cellStyleO);
        createCellAlignCenter(workbook,row_head1,4,"建设性质",cellStyleO);
        createCellAlignCenter(workbook,row_head2,4,"建设起止年月",cellStyleO);
        createCellAlignCenter(workbook,row_head1,5,"总投资",cellStyleO);
        createCellAlignCenter(workbook,row_head1,6,"累计安排",cellStyleO);
        createCellAlignCenter(workbook,row_head1,7,"安排投资",cellStyleO);
        createCellAlignCenter(workbook,row_head1,8,"其中",cellStyleO);
        createCellAlignCenter(workbook,row_head2,8,"国土",cellStyleO);
        createCellAlignCenter(workbook,row_head2,9,"公共预算",cellStyleO);
        createCellAlignCenter(workbook,row_head1,10,"2018年主要建设内容",cellStyleO);
        createCellAlignCenter(workbook,row_head1,11,"备注",cellStyleO);

        sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));
        sheet.addMergedRegion(new CellRangeAddress(2,3,1,1));
        sheet.addMergedRegion(new CellRangeAddress(2,3,2,2));
        sheet.addMergedRegion(new CellRangeAddress(2,3,3,3));
        sheet.addMergedRegion(new CellRangeAddress(2,3,5,5));
        sheet.addMergedRegion(new CellRangeAddress(2,3,6,6));
        sheet.addMergedRegion(new CellRangeAddress(2,3,7,7));
        sheet.addMergedRegion(new CellRangeAddress(2,2,8,9));
        sheet.addMergedRegion(new CellRangeAddress(2,3,10,10));
        sheet.addMergedRegion(new CellRangeAddress(2,3,11,11));
        //end#表格头

        //begin#数据列
        int rowNum=4;
        @SuppressWarnings("unchecked")
		List<ExcelDataYS> excelDataList = (List<ExcelDataYS>) model.get("excelDataList");
        for (ExcelDataYS data:excelDataList) {
            int rowNum1=rowNum++;
            int rowNum2=rowNum++;
            Row row1 = sheet.createRow(rowNum1);
            Row row2 = sheet.createRow(rowNum2);
            
            row1.setHeight((short)600);
            row2.setHeight((short)600);
            createCellAlignCenter(workbook,row1,0, data.getNo(),cellStyleO);
            if(data.isHB()){
            	createCellAlignCenter(workbook,row1,1, data.getConstructionUnit(),cellStyleO);
            	createCellAlignCenter(workbook,row1,2, data.getConstructionScale(),cellStyleO);
            }else{
            	createCellAlignLeft(workbook,row1,1, data.getConstructionUnit()+"\n"+data.getProjectName()+"\n"+data.getProjectCode(),cellStyleO);
            	createCellAlignCenter(workbook,row1,2, data.getProjectType(),cellStyleO);
            	createCellAlignCenter(workbook,row1,3, data.getConstructionScale(),cellStyleO);
            }
            createCellAlignCenter(workbook,row1,4, data.getConstructionType(),cellStyleO);
            createCellAlignCenter(workbook,row2,4, data.getConstructionDate(),cellStyleO);
            createCellAlignCenter(workbook,row1,5, data.getTotalInvest(),cellStyleO);//总投资
            createCellAlignCenter(workbook,row1,6, data.getApInvestSum(),cellStyleO);//累计安排
            createCellAlignCenter(workbook,row1,7, data.getYearApSum(),cellStyleO);//安排投资
            createCellAlignCenter(workbook,row1,8, data.getCapitalAP_gtzj_TheYear(),cellStyleO);//安排投资--国土
            createCellAlignCenter(workbook,row1,9, data.getCapitalAP_ggys_TheYear(),cellStyleO);//安排投资--公共预算
            createCellAlignLeft(workbook,row1,10, data.getConstructionContent(),cellStyleO);//建设内容
            createCellAlignCenter(workbook,row1,11,data.getRemark(),cellStyleO);

            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,0,0));
        	sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,1,1));
            if(data.isHB()){
            	sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,2,3));
            }else{
            	sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,2,2));
            	sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,3,3));
            }
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,5,5));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,6,6));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,7,7));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,8,8));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,9,9));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,10,10));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,11,11));
        }
        //end#数据列

    }
	 
    @SuppressWarnings("deprecation")
	private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyleO){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER,cellStyleO);
    }
    @SuppressWarnings("deprecation")
    private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,double value,CellStyle cellStyleO){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER,cellStyleO);
    }
    @SuppressWarnings("deprecation")
    private void createCellAlignLeft(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyleO){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_LEFT,CellStyle.VERTICAL_CENTER,cellStyleO);
    }
    @SuppressWarnings("deprecation")
    private void createCellAlignRight(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyleO){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_RIGHT,CellStyle.VERTICAL_CENTER,cellStyleO);
    }
   
    @SuppressWarnings("deprecation")
    private void createCell(Workbook workbook,Row row, int cellNumber,String value, short halign, short valign,CellStyle cellStyle){
        Cell cell=row.createCell(cellNumber);
        cell.setCellValue(value);

//        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.cloneStyleFrom(cellStyle);
        cellStyle.setAlignment(halign);
        cellStyle.setVerticalAlignment(valign);
        cellStyle.setWrapText(true);
        cell.setCellStyle(cellStyle);
    }
    //重写创建列
    @SuppressWarnings("deprecation")
    private void createCell(Workbook workbook,Row row, int cellNumber,double value, short halign, short valign,CellStyle cellStyle){
        Cell cell=row.createCell(cellNumber);
        cell.setCellValue(value);

        
//        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.cloneStyleFrom(cellStyle);
        cellStyle.setAlignment(halign);
        cellStyle.setVerticalAlignment(valign);
        cellStyle.setWrapText(true);
        cell.setCellStyle(cellStyle);
        
    }
}
