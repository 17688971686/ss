package cs.model.exportExcel;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractXlsView;

import cs.common.BasicDataConfig;

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
	
	@SuppressWarnings("deprecation")
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String fileName = BasicDataConfig.gm_name+year+"年区级政府投资项目计划.xls";
        response.setHeader("Content-Disposition", "attachment;filename=" +new String(fileName.getBytes("gb2312"), "iso8859-1"));
        Sheet sheet = workbook.createSheet("表1");
        CellStyle cellStyleO = workbook.createCellStyle();
        CellStyle cellStyleTitle = workbook.createCellStyle();
        CellStyle cellStyleSubTitleLeft = workbook.createCellStyle();
        CellStyle cellStyleSubTitleRight=workbook.createCellStyle();

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

        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,BasicDataConfig.gm_name+year+"年政府投资项目计划",cellStyleTitle);
        //合并
        CellRangeAddress cellRangeTitle=new CellRangeAddress(0,0,0,11);
        setRegionStyle(sheet,cellRangeTitle,cellStyleTitle);
        sheet.addMergedRegion(cellRangeTitle);
        //end#标题

        //begin#子标题
        createCellAlignLeft(workbook,subTitle,0,"打印日期："+new SimpleDateFormat("yyyy年MM月dd日").format(new Date()),cellStyleSubTitleLeft);
        createCellAlignRight(workbook,subTitle,10,"资金：万   元\n面积：平方米",cellStyleSubTitleRight);
        CellRangeAddress cellRangeSubTitleLeft=new CellRangeAddress(1,1,0,9);
        CellRangeAddress cellRangeSubTitleRight=new CellRangeAddress(1,1,10,11);
        setRegionStyle(sheet,cellRangeSubTitleLeft,cellStyleSubTitleLeft);
        setRegionStyle(sheet,cellRangeSubTitleRight,cellStyleSubTitleRight);
        sheet.addMergedRegion(cellRangeSubTitleLeft);
        sheet.addMergedRegion(cellRangeSubTitleRight);
        //end#子标题
      //设置列宽
        sheet.setColumnWidth(0, 256*7+184);
        sheet.setColumnWidth(1, 256*17+184);
        sheet.setColumnWidth(2, 256*8+184);
        sheet.setColumnWidth(3, 256*15+184);
        sheet.setColumnWidth(4, 256*12+184);
        sheet.setColumnWidth(5, 256*8+184);
        sheet.setColumnWidth(6, 256*8+184);
        sheet.setColumnWidth(7, 256*8+184);
        sheet.setColumnWidth(8, 256*8+184);
        sheet.setColumnWidth(9, 256*8+184);
        sheet.setColumnWidth(10, 256*12+184);
        sheet.setColumnWidth(11, 256*12+184);

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

        CellRangeAddress cellRangeHeadColumn0=new CellRangeAddress(2,3,0,0);
        CellRangeAddress cellRangeHeadColumn1=new CellRangeAddress(2,3,1,1);
        CellRangeAddress cellRangeHeadColumn2=new CellRangeAddress(2,3,2,2);
        CellRangeAddress cellRangeHeadColumn3=new CellRangeAddress(2,3,3,3);
        CellRangeAddress cellRangeHeadColumn5=new CellRangeAddress(2,3,5,5);
        CellRangeAddress cellRangeHeadColumn6=new CellRangeAddress(2,3,6,6);
        CellRangeAddress cellRangeHeadColumn7=new CellRangeAddress(2,3,7,7);
        CellRangeAddress cellRangeHeadColumn8=new CellRangeAddress(2,2,8,9);
        CellRangeAddress cellRangeHeadColumn10=new CellRangeAddress(2,3,10,10);
        CellRangeAddress cellRangeHeadColumn11=new CellRangeAddress(2,3,11,11);
        
        setRegionStyle(sheet,cellRangeHeadColumn0,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn1,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn2,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn3,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn5,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn6,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn7,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn8,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn10,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn11,cellStyleO);
        
        sheet.addMergedRegion(cellRangeHeadColumn0);
        sheet.addMergedRegion(cellRangeHeadColumn1);
        sheet.addMergedRegion(cellRangeHeadColumn2);
        sheet.addMergedRegion(cellRangeHeadColumn3);
        sheet.addMergedRegion(cellRangeHeadColumn5);
        sheet.addMergedRegion(cellRangeHeadColumn6);
        sheet.addMergedRegion(cellRangeHeadColumn7);
        sheet.addMergedRegion(cellRangeHeadColumn8);
        sheet.addMergedRegion(cellRangeHeadColumn10);
        sheet.addMergedRegion(cellRangeHeadColumn11);
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

            CellRangeAddress cellRangeDataColumn0=new CellRangeAddress(rowNum1,rowNum2,0,0);
            CellRangeAddress cellRangeDataColumn1=new CellRangeAddress(rowNum1,rowNum2,1,1);
            setRegionStyle(sheet,cellRangeDataColumn0,cellStyleO);
            setRegionStyle(sheet,cellRangeDataColumn1,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn0);
        	sheet.addMergedRegion(cellRangeDataColumn1);
            if(data.isHB()){
            	CellRangeAddress cellRangeDataColumn2=new CellRangeAddress(rowNum1,rowNum2,2,3);
            	setRegionStyle(sheet,cellRangeDataColumn2,cellStyleO);
            	sheet.addMergedRegion(cellRangeDataColumn2);
            }else{
            	CellRangeAddress cellRangeDataColumn2=new CellRangeAddress(rowNum1,rowNum2,2,2);
            	CellRangeAddress cellRangeDataColumn3=new CellRangeAddress(rowNum1,rowNum2,3,3);
            	setRegionStyle(sheet,cellRangeDataColumn2,cellStyleO);
            	setRegionStyle(sheet,cellRangeDataColumn3,cellStyleO);
            	sheet.addMergedRegion(cellRangeDataColumn2);
            	sheet.addMergedRegion(cellRangeDataColumn3);
            }
            CellRangeAddress cellRangeDataColumn5=new CellRangeAddress(rowNum1,rowNum2,5,5);
            CellRangeAddress cellRangeDataColumn6=new CellRangeAddress(rowNum1,rowNum2,6,6);
            CellRangeAddress cellRangeDataColumn7=new CellRangeAddress(rowNum1,rowNum2,7,7);
            CellRangeAddress cellRangeDataColumn8=new CellRangeAddress(rowNum1,rowNum2,8,8);
            CellRangeAddress cellRangeDataColumn9=new CellRangeAddress(rowNum1,rowNum2,9,9);
            CellRangeAddress cellRangeDataColumn10=new CellRangeAddress(rowNum1,rowNum2,10,10);
            CellRangeAddress cellRangeDataColumn11=new CellRangeAddress(rowNum1,rowNum2,11,11);
            
            setRegionStyle(sheet,cellRangeDataColumn5,cellStyleO);
            setRegionStyle(sheet,cellRangeDataColumn6,cellStyleO);
            setRegionStyle(sheet,cellRangeDataColumn7,cellStyleO);
            setRegionStyle(sheet,cellRangeDataColumn8,cellStyleO);
            setRegionStyle(sheet,cellRangeDataColumn9,cellStyleO);
            setRegionStyle(sheet,cellRangeDataColumn10,cellStyleO);
            setRegionStyle(sheet,cellRangeDataColumn11,cellStyleO);
            
            sheet.addMergedRegion(cellRangeDataColumn5);
            sheet.addMergedRegion(cellRangeDataColumn6);
            sheet.addMergedRegion(cellRangeDataColumn7);
            sheet.addMergedRegion(cellRangeDataColumn8);
            sheet.addMergedRegion(cellRangeDataColumn9);
            sheet.addMergedRegion(cellRangeDataColumn10);
            sheet.addMergedRegion(cellRangeDataColumn11);
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

        cellStyle.cloneStyleFrom(cellStyle);
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
    //重写创建列
    @SuppressWarnings("deprecation")
    private void createCell(Workbook workbook,Row row, int cellNumber,double value, short halign, short valign,CellStyle cellStyle){
        Cell cell=row.createCell(cellNumber);
        cell.setCellValue(value);

        cellStyle.cloneStyleFrom(cellStyle);
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
