package cs.model.exportExcel;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractXlsView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
/**
* @ClassName: ExcelReportLBTJView 
* @Description: 年度计划编制导出项目类别统计Excel设计 
* @author cx
* @date 2017年9月6日 下午4:22:06 
*
 */
public class ExcelReportLBTJView extends AbstractXlsView {
	private int year;
	public ExcelReportLBTJView(int year){
		this.year=year;
	}
	
	@SuppressWarnings("deprecation")
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        String fileName = "光明新区"+year+"年区级政府投资项目计划类别汇总表.xls";
        response.setHeader("Content-Disposition", "attachment;filename=" +new String(fileName.getBytes("gb2312"), "iso8859-1"));
        Sheet sheet = workbook.createSheet("表1");
        CellStyle cellStyleO = workbook.createCellStyle();
        CellStyle cellStyleTitle = workbook.createCellStyle();
        CellStyle cellStyleSubTitleLeft = workbook.createCellStyle();
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
        row_head.setHeight((short)600);
        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,"光明新区"+year+"年区级政府投资项目计划汇总表",cellStyleTitle);
        //合并标题
        //参数1：开始行、结束行、开始列、结束列
        CellRangeAddress cellRangeTitle = new CellRangeAddress(0,0,0,6);
        setRegionStyle(sheet,cellRangeTitle,cellStyleTitle);
        sheet.addMergedRegion(cellRangeTitle);
        //end#标题
        //begin#子标题
        createCellAlignLeft(workbook,subTitle,0,"打印日期："+new SimpleDateFormat("yyyy年MM月dd日").format(new Date()),cellStyleSubTitleLeft);
        CellRangeAddress cellRangeSubTitleLeft = new CellRangeAddress(1,1,0,5);
        setRegionStyle(sheet,cellRangeSubTitleLeft,cellStyleSubTitleLeft);
        sheet.addMergedRegion(cellRangeSubTitleLeft);
        createCellAlignRight(workbook,subTitle,6,"资金：万   元\n面积：平方米",workbook.createCellStyle());
        //设置列宽
        sheet.setColumnWidth(0, 256*6+184);
        sheet.setColumnWidth(1, 256*15+184);
        sheet.setColumnWidth(2, 256*12+184);
        sheet.setColumnWidth(3, 256*13+184);
        sheet.setColumnWidth(4, 256*13+184);
        sheet.setColumnWidth(5, 256*13+184);
        sheet.setColumnWidth(6, 256*13+184);

        //begin表格头
        createCellAlignCenter(workbook,row_head,0,"序号",cellStyleO);
        createCellAlignCenter(workbook,row_head,1,"类别",cellStyleO);
        createCellAlignCenter(workbook,row_head,2,"建设项目数量",cellStyleO);
        createCellAlignCenter(workbook,row_head,3,"总投资金额",cellStyleO);
        createCellAlignCenter(workbook,row_head,4,"累计拨付资金",cellStyleO);
        createCellAlignCenter(workbook,row_head,5,"累计下达计划",cellStyleO);
        createCellAlignCenter(workbook,row_head,6,"年度预算\n安排资金",cellStyleO);
        //end#表格头

        //begin#数据列
        int rowNum=3;//从第三行开始
        int index=1;
        Integer projectSum=0;
        Double investSum=0.0;
        Double investAccuSum=0.0;
        Double apInvestSum=0.0;
        Double yearInvestApprovalSum=0.0;
        
        @SuppressWarnings("unchecked")
		List<ExcelDataLBTJ> excelDataLBTJList = (List<ExcelDataLBTJ>) model.get("excelDataLBTJList");
        for (ExcelDataLBTJ data:excelDataLBTJList) {
            Row row = sheet.createRow(rowNum);
            //创建数据
            createCellAlignCenter(workbook,row,0, index,cellStyleO);//序号
            createCellAlignCenter(workbook,row,1, data.getProjectCategory(),cellStyleO);//项目类别
            createCellAlignCenter(workbook,row,2, data.getProjectSum(),cellStyleO);//项目总数
            createCellAlignCenter(workbook,row,3, data.getInvestSum(),cellStyleO);//总投资
            createCellAlignCenter(workbook,row,4, data.getInvestAccuSum(),cellStyleO);//累计拨付
            createCellAlignCenter(workbook,row,5, data.getApInvestSum(),cellStyleO);//累计下达
            createCellAlignCenter(workbook,row,6, data.getYearInvestApprovalSum(),cellStyleO);//年度预安排
            
            projectSum +=data.getProjectSum();
            investSum += data.getInvestSum();
            investAccuSum += data.getInvestAccuSum();
            apInvestSum += data.getApInvestSum();
            yearInvestApprovalSum += data.getYearInvestApprovalSum();
            
            rowNum++;index++;
        }
        //end#数据列
        
        //数据合计列
        Row row = sheet.createRow(rowNum);
        createCellAlignCenter(workbook,row,0, "合计",cellStyleO);
        createCellAlignCenter(workbook,row,2, projectSum,cellStyleO);//项目总数
        createCellAlignCenter(workbook,row,3, investSum,cellStyleO);//总投资
        createCellAlignCenter(workbook,row,4, investAccuSum,cellStyleO);//累计下达
        createCellAlignCenter(workbook,row,5, apInvestSum,cellStyleO);//累计拨付
        createCellAlignCenter(workbook,row,6, yearInvestApprovalSum,cellStyleO);//年度预安排
        
        CellRangeAddress cellRangeHJ = new CellRangeAddress(rowNum,rowNum,0,1);
        setRegionStyle(sheet,cellRangeHJ,cellStyleTitle);
        sheet.addMergedRegion(cellRangeHJ);
    }
//创建值为string字体居中的单元格	
    @SuppressWarnings("deprecation")
	private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
//创建值为double字体居中的单元格	
    private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,double value,CellStyle cellStyle){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
//创建值为string字体居左的单元格
    private void createCellAlignLeft(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_LEFT,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
//创建值为string字体居右的单元格    
    private void createCellAlignRight(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
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
