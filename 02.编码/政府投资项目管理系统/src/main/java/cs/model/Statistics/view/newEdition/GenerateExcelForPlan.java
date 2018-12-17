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
/**
 * @author Administrator
 * 导出年度计划Excel
 */
public class GenerateExcelForPlan {
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
        Row row_subHead = sheet.createRow(3);
        
        //设置行高
        title.setHeight((short)800);
        subTitle.setHeight((short)500);
        row_head.setHeight((short)360);
        row_subHead.setHeight((short)360);
        
        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,BasicDataConfig.gm_name+"政府投资计划类统计表",cellStyleTitle);
        //合并标题
        //参数1：开始行、结束行、开始列、结束列
        CellRangeAddress cellRangeTitle = new CellRangeAddress(0,0,0,10);;
        setRegionStyle(sheet,cellRangeTitle,cellStyleTitle);
        sheet.addMergedRegion(cellRangeTitle);
        //end#标题
        
        //begin#子标题
        createCellAlignLeft(workbook,subTitle,0,"打印日期："+new SimpleDateFormat("yyyy年MM月dd日").format(new Date()),cellStyleSubTitleLeft);
        CellRangeAddress cellRangeSubTitleLeft = new CellRangeAddress(1,1,0,9);
        setRegionStyle(sheet,cellRangeSubTitleLeft,cellStyleSubTitleLeft);
        sheet.addMergedRegion(cellRangeSubTitleLeft);
        createCellAlignRight(workbook,subTitle,10,"资金：万   元\n面积：平方米",workbook.createCellStyle());
       
    	 //设置列宽
        sheet.setColumnWidth(0, 256*5+184);
        sheet.setColumnWidth(1, 256*26+184);
        sheet.setColumnWidth(2, 256*20+184);
        sheet.setColumnWidth(3, 256*12+184);
        sheet.setColumnWidth(4, 256*10+184);
        sheet.setColumnWidth(5, 256*9+184);
        sheet.setColumnWidth(6, 256*9+184);
        sheet.setColumnWidth(7, 256*9+184);
        sheet.setColumnWidth(8, 256*9+184);
        sheet.setColumnWidth(9, 256*15+184);
        sheet.setColumnWidth(10, 256*13+184);
        //end#子标题

        //begin表格头
        createCellAlignCenter(workbook,row_head,0,"序号",cellStyleO);
    	createCellAlignCenter(workbook,row_head,1,"项目名称及建设单位",cellStyleO);
    	createCellAlignCenter(workbook,row_head,2,"建设规模",cellStyleO);
    	createCellAlignCenter(workbook,row_head,3,"建设性质",cellStyleO);
    	createCellAlignCenter(workbook,row_subHead,3,"建设起止年月",cellStyleO);
    	createCellAlignCenter(workbook,row_head,4,"总投资",cellStyleO);
    	createCellAlignCenter(workbook,row_subHead,4,"累计拨款",cellStyleO);
    	createCellAlignCenter(workbook,row_head,5,"安排投资",cellStyleO);
    	createCellAlignCenter(workbook,row_subHead,5,"公共预算",cellStyleO);
    	createCellAlignCenter(workbook,row_subHead,6,"国土基金",cellStyleO);
    	createCellAlignCenter(workbook,row_head,7,"本年度拨款",cellStyleO);
    	createCellAlignCenter(workbook,row_subHead,7,"公共预算",cellStyleO);
    	createCellAlignCenter(workbook,row_subHead,8,"国土基金",cellStyleO);
    	createCellAlignCenter(workbook,row_head,9,"年度主要建设内容",cellStyleO);
    	createCellAlignCenter(workbook,row_head,10,"备注",cellStyleO);
    	//合并列
    	CellRangeAddress cellRangeHeadColumn0 = new CellRangeAddress(2,3,0,0);
    	CellRangeAddress cellRangeHeadColumn1 = new CellRangeAddress(2,3,1,1);
    	CellRangeAddress cellRangeHeadColumn2 = new CellRangeAddress(2,3,2,2);
    	CellRangeAddress cellRangeHeadColumn5 = new CellRangeAddress(2,2,5,6);
    	CellRangeAddress cellRangeHeadColumn7 = new CellRangeAddress(2,2,7,8);
    	CellRangeAddress cellRangeHeadColumn9 = new CellRangeAddress(2,3,9,9);
    	CellRangeAddress cellRangeHeadColumn10 = new CellRangeAddress(2,3,10,10);
    	setRegionStyle(sheet,cellRangeHeadColumn0,cellStyleO);
        sheet.addMergedRegion(cellRangeHeadColumn0);
        setRegionStyle(sheet,cellRangeHeadColumn1,cellStyleO);
        sheet.addMergedRegion(cellRangeHeadColumn1);
        setRegionStyle(sheet,cellRangeHeadColumn2,cellStyleO);
        sheet.addMergedRegion(cellRangeHeadColumn2);
        setRegionStyle(sheet,cellRangeHeadColumn5,cellStyleO);
        sheet.addMergedRegion(cellRangeHeadColumn5);
        setRegionStyle(sheet,cellRangeHeadColumn7,cellStyleO);
        sheet.addMergedRegion(cellRangeHeadColumn7);
        setRegionStyle(sheet,cellRangeHeadColumn9,cellStyleO);
        sheet.addMergedRegion(cellRangeHeadColumn9);
        setRegionStyle(sheet,cellRangeHeadColumn10,cellStyleO);
        sheet.addMergedRegion(cellRangeHeadColumn10);
        //end#表格头

        //begin#数据列
        int rowNum=4;//数据加载开始行
        int index=1;

        for (ProjectStatisticsBean obj:data) {
        	int rowNum1 = rowNum++;
        	int rowNum2 = rowNum++;
            Row row1 = sheet.createRow(rowNum1);
            Row row2 = sheet.createRow(rowNum2);
            //设置行高
            row1.setHeight((short)500);
            row2.setHeight((short)500);
            //创建数据
            createCellAlignCenter(workbook,row1,0, index,cellStyleO);//序号
            createCellAlignCenter(workbook,row1,1, obj.getProjectName(),cellStyleO);//项目名称
        	createCellAlignCenter(workbook,row2,1, obj.getUnitName(),cellStyleO);//建设单位
        	createCellAlignCenter(workbook,row1,2, obj.getProjectGuiMo(),cellStyleO);//建设规模
        	createCellAlignCenter(workbook,row1,3, obj.getProjectConstrCharDesc(),cellStyleO);//建设性质
        	createCellAlignCenter(workbook,row2,3, obj.getBeginDate()+"~\n"+obj.getEndDate(),cellStyleO);//建设起止年月
        	createCellAlignCenter(workbook,row1,4, obj.getProjectInvestSum(),cellStyleO);//总投资
        	createCellAlignCenter(workbook,row2,4, obj.getApInvestSum(),cellStyleO);//累计拨款(累计安排投资)
        	createCellAlignCenter(workbook,row1,5, "-",cellStyleO);//安排投资-资金来源-公共预算
        	createCellAlignCenter(workbook,row1,6, "-",cellStyleO);//安排投资-资金来源-国土基金
        	createCellAlignCenter(workbook,row1,7, obj.getApPlanReach_ggys(),cellStyleO);//本年度拨款-公共预算
        	createCellAlignCenter(workbook,row1,8, obj.getApPlanReach_gtzj(),cellStyleO);//本年度拨款-国土基金
        	createCellAlignCenter(workbook,row1,9, obj.getYearConstructionContent(),cellStyleO);//本年度建设内容
        	createCellAlignCenter(workbook,row1,10, obj.getYearConstructionContentShenBao(),cellStyleO);//备注
        	
        	//合并列
        	CellRangeAddress cellRangeDataColumn0 = new CellRangeAddress(rowNum1,rowNum2,0,0);
        	CellRangeAddress cellRangeDataColumn2 = new CellRangeAddress(rowNum1,rowNum2,2,2);
        	CellRangeAddress cellRangeDataColumn5 = new CellRangeAddress(rowNum1,rowNum2,5,5);
        	CellRangeAddress cellRangeDataColumn6 = new CellRangeAddress(rowNum1,rowNum2,6,6);
        	CellRangeAddress cellRangeDataColumn7 = new CellRangeAddress(rowNum1,rowNum2,7,7);
        	CellRangeAddress cellRangeDataColumn8 = new CellRangeAddress(rowNum1,rowNum2,8,8);
        	CellRangeAddress cellRangeDataColumn9 = new CellRangeAddress(rowNum1,rowNum2,9,9);
        	CellRangeAddress cellRangeDataColumn10 = new CellRangeAddress(rowNum1,rowNum2,10,10);
        	setRegionStyle(sheet,cellRangeDataColumn0,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn0);
            setRegionStyle(sheet,cellRangeDataColumn2,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn2);
            setRegionStyle(sheet,cellRangeDataColumn5,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn5);
            setRegionStyle(sheet,cellRangeDataColumn6,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn6);
            setRegionStyle(sheet,cellRangeDataColumn7,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn7);
            setRegionStyle(sheet,cellRangeDataColumn8,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn8);
            setRegionStyle(sheet,cellRangeDataColumn9,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn9);
            setRegionStyle(sheet,cellRangeDataColumn10,cellStyleO);
            sheet.addMergedRegion(cellRangeDataColumn10);
            
            index++;
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

