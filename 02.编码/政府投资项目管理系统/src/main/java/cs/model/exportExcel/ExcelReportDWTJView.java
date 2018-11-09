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
/**
* @ClassName: ExcelReportDWTJView 
* @Description: 年度计划编制导出建设单位统计Excel设计 
* @author cx
* @date 2017年9月6日 下午4:22:06 
*
 */
public class ExcelReportDWTJView extends AbstractXlsView {
	private int year;
	public ExcelReportDWTJView(int year){
		this.year=year;
	}
	
	@SuppressWarnings({ "unchecked", "deprecation" })
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String fileName = BasicDataConfig.gm_name+year+"年区级政府投资项目计划各建设单位资金安排汇总表.xls";
        response.setHeader("Content-Disposition", "attachment;filename=" +new String(fileName.getBytes("gb2312"), "iso8859-1"));
        Sheet sheet = workbook.createSheet("表1");
        CellStyle cellStyleO = workbook.createCellStyle();
        CellStyle cellStyleTitle = workbook.createCellStyle();
        CellStyle cellStyleSubTitleLeft = workbook.createCellStyle();
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
        //设置行高
        title.setHeight((short)800);
        subTitle.setHeight((short)500);
        row_head1.setHeight((short)360);
        row_head2.setHeight((short)500);
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
        createCellAlignCenter(workbook,title,0,BasicDataConfig.gm_name+year+"年区级政府投资项目计划各建设单位资金安排汇总表",cellStyleTitle);
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
        //end#子标题
      //设置列宽
        sheet.setColumnWidth(1, 256*18+184);
        sheet.setColumnWidth(2, 256*12+184);
        sheet.setColumnWidth(3, 256*11+184);
        sheet.setColumnWidth(4, 256*11+184);
        sheet.setColumnWidth(5, 256*11+184);
        sheet.setColumnWidth(6, 256*12+184);

        //begin表格头
        createCellAlignCenter(workbook,row_head1,0,"序号",cellStyleO);
        createCellAlignCenter(workbook,row_head1,1,"建设单位",cellStyleO);
        createCellAlignCenter(workbook,row_head1,2,"安排资金",cellStyleO);
        createCellAlignCenter(workbook,row_head2,2,"合计",cellStyleO);
        createCellAlignCenter(workbook,row_head2,3,"单列项目",cellStyleO);
        createCellAlignCenter(workbook,row_head2,4,"结算款",cellStyleO);
        createCellAlignCenter(workbook,row_head2,5,"小额",cellStyleO);
        createCellAlignCenter(workbook,row_head2,6,"未立项\n项目预留",cellStyleO);
        //end#表格头
        
        //合并表头
        CellRangeAddress cellRangeHeadColumn0=new CellRangeAddress(2,3,0,0);
        CellRangeAddress cellRangeHeadColumn1=new CellRangeAddress(2,3,1,1);
        CellRangeAddress cellRangeHeadColumn2=new CellRangeAddress(2,2,2,6);
        setRegionStyle(sheet,cellRangeHeadColumn0,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn1,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn2,cellStyleO);
        
        sheet.addMergedRegion(cellRangeHeadColumn0);//序号
        sheet.addMergedRegion(cellRangeHeadColumn1);//建设单位
        sheet.addMergedRegion(cellRangeHeadColumn2);//安排资金
        //begin#数据列
        int rowNum=4;//从第五行开始
        int index=1;
        Double yearApSum=0.0,yearAp_danLieSum=0.0,yearAp_jieSunKuan=0.0,yearAp_xiaohe=0.0,yearAp_weiLiXYuLiu=0.0;
        List<ExcelDataDWTJ> excelDataDWTJList = (List<ExcelDataDWTJ>) model.get("excelDataDWTJList");
        for (ExcelDataDWTJ data:excelDataDWTJList) {
            Row row = sheet.createRow(rowNum);
            //创建数据
            createCellAlignCenter(workbook,row,0, index,cellStyleO);//序号
            createCellAlignCenter(workbook,row,1, data.getConstrctionUnit(),cellStyleO);//建设单位
            createCellAlignCenter(workbook,row,2, data.getYearApSum(),cellStyleO);//合计
            createCellAlignCenter(workbook,row,3, data.getYearAp_danLie(),cellStyleO);//单列项目
            createCellAlignCenter(workbook,row,4, data.getYearAp_jieSunKuan(),cellStyleO);//结算款
            createCellAlignCenter(workbook,row,5, data.getYearAp_xiaohe(),cellStyleO);//小额
            createCellAlignCenter(workbook,row,6, data.getYearAp_weiLiXYuLiu(),cellStyleO);//未立项项目预留
            
            yearApSum+=data.getYearApSum();
            yearAp_danLieSum+=data.getYearAp_danLie();
            yearAp_jieSunKuan+=data.getYearAp_jieSunKuan();
            yearAp_xiaohe+=data.getYearAp_xiaohe();
            yearAp_weiLiXYuLiu+=data.getYearAp_weiLiXYuLiu();
            
            rowNum++;
            index++;
        }
        //end#数据列
        
        //合计
        Row row = sheet.createRow(rowNum);
        createCellAlignCenter(workbook,row,0,"合计",cellStyleO);
        createCellAlignCenter(workbook,row,2,yearApSum,cellStyleO);
        createCellAlignCenter(workbook,row,3,yearAp_danLieSum,cellStyleO);
        createCellAlignCenter(workbook,row,4,yearAp_jieSunKuan,cellStyleO);
        createCellAlignCenter(workbook,row,5,yearAp_xiaohe,cellStyleO);
        createCellAlignCenter(workbook,row,6,yearAp_weiLiXYuLiu,cellStyleO);
        //合并合计行
        CellRangeAddress cellRangeHJ = new CellRangeAddress(rowNum,rowNum,0,1);
        setRegionStyle(sheet,cellRangeHJ,cellStyleO);
        sheet.addMergedRegion(cellRangeHJ);//合计

    }
    @SuppressWarnings("deprecation")
	private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
    private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,double value,CellStyle cellStyle){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
    private void createCellAlignLeft(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_LEFT,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
    private void createCellAlignRight(Workbook workbook,Row row, int cellNumber,String value,CellStyle cellStyle){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_RIGHT,CellStyle.VERTICAL_CENTER,cellStyle);
    }
    @SuppressWarnings("deprecation")
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
  //重写创建列
    @SuppressWarnings("deprecation")
    private void createCell(Workbook workbook,Row row, int cellNumber,double value, short halign, short valign,CellStyle cellStyle){
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
