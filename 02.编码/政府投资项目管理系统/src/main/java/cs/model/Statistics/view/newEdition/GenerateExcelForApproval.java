package cs.model.Statistics.view.newEdition;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;

import cs.common.BasicDataConfig;
import cs.model.Statistics.ProjectStatisticsBean;

public class GenerateExcelForApproval {
	@SuppressWarnings("deprecation")
	public HSSFWorkbook getHSSFWorkBook(List<ProjectStatisticsBean> data){
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
	    createCellAlignCenter(workbook,title,0,BasicDataConfig.gm_name+"政府投资审批类统计表",cellStyleTitle);
	    //合并标题
	    //参数1：开始行、结束行、开始列、结束列
	    CellRangeAddress cellRangeTitle = null;
	    cellRangeTitle = new CellRangeAddress(0,0,0,6);
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
	    sheet.setColumnWidth(1, 256*23+184);
	    sheet.setColumnWidth(2, 256*22+184);
	    sheet.setColumnWidth(3, 256*15+184);
	    sheet.setColumnWidth(4, 256*15+184);
	    sheet.setColumnWidth(5, 256*15+184);
	    sheet.setColumnWidth(6, 256*20+184);
	    //end#子标题
	
	    //begin表格头
	    createCellAlignCenter(workbook,row_head,0,"序号",cellStyleO);
		createCellAlignCenter(workbook,row_head,1,"项目名称",cellStyleO);
		createCellAlignCenter(workbook,row_head,2,"建设单位",cellStyleO);
		createCellAlignCenter(workbook,row_head,3,"项目阶段",cellStyleO);
		createCellAlignCenter(workbook,row_head,4,"行业类型",cellStyleO);
		createCellAlignCenter(workbook,row_head,5,"总投资",cellStyleO);
		createCellAlignCenter(workbook,row_head,6,"项目主要建设内容",cellStyleO);
	    //end#表格头
	
	    //begin#数据列
	    int rowNum=3;//数据加载开始行
	    int index=1;
	
	    for (ProjectStatisticsBean obj:data) {
	        Row row = sheet.createRow(rowNum);
	        //创建数据
	        createCellAlignCenter(workbook,row,0, index,cellStyleO);//序号
	        createCellAlignCenter(workbook,row,1, obj.getProjectName(),cellStyleO);//项目名称
	    	createCellAlignCenter(workbook,row,2, obj.getUnitName(),cellStyleO);//建设单位
	    	createCellAlignCenter(workbook,row,3, obj.getProjectStageDesc(),cellStyleO);//项目阶段
	    	createCellAlignCenter(workbook,row,4, obj.getProjectIndustryDesc(),cellStyleO);//行业类型
	    	createCellAlignCenter(workbook,row,5, obj.getProjectInvestSum(),cellStyleO);//总投资
	    	createCellAlignCenter(workbook,row,6, obj.getProjectGuiMo(),cellStyleO);//项目主要建设内容
	        
	        rowNum++;index++;
	    }
	    //end#数据列
	    return workbook;
	}

	//创建值为string字体居中的单元格	
	@SuppressWarnings("deprecation")
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
