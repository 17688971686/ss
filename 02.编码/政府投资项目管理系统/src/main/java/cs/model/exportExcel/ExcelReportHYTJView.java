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
* @ClassName: ExcelReportHYTJView 
* @Description: 年度计划编制导出项目行业统计Excel设计 
* @author cx
* @date 2017年9月6日 下午4:22:06 
*
 */
public class ExcelReportHYTJView extends AbstractXlsView {
	private int year;
	public ExcelReportHYTJView(int year){
		this.year=year;
	}
	
	@SuppressWarnings({ "unchecked", "deprecation" })
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String fileName = BasicDataConfig.gm_name+year+"年区级政府投资项目计划行业汇总表.xls";
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
        row_head2.setHeight((short)360);
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
        createCellAlignCenter(workbook,title,0,BasicDataConfig.gm_name+year+"年区级政府投资项目计划汇总表",cellStyleTitle);
        //合并标题
        //参数1：开始行、结束行、开始列、结束列
        CellRangeAddress cellRangeTitle = new CellRangeAddress(0,0,0,13);
        setRegionStyle(sheet,cellRangeTitle,cellStyleTitle);
        sheet.addMergedRegion(cellRangeTitle);
        //begin#子标题
        createCellAlignLeft(workbook,subTitle,0,"打印日期："+new SimpleDateFormat("yyyy年MM月dd日").format(new Date()),cellStyleSubTitleLeft);
        CellRangeAddress cellRangeSubTitleLeft = new CellRangeAddress(1,1,0,12);
        setRegionStyle(sheet,cellRangeSubTitleLeft,cellStyleSubTitleLeft);
        sheet.addMergedRegion(cellRangeSubTitleLeft);
        createCellAlignRight(workbook,subTitle,13,"资金：万   元\n面积：平方米",workbook.createCellStyle());
        //end#标题
        //设置列宽
        sheet.setColumnWidth(0, 256*5+184);
        sheet.setColumnWidth(1, 256*16+184);
        sheet.setColumnWidth(2, 256*5+184);
        sheet.setColumnWidth(3, 256*5+184);
        sheet.setColumnWidth(4, 256*5+184);
        sheet.setColumnWidth(5, 256*5+184);
        sheet.setColumnWidth(6, 256*10+184);
        sheet.setColumnWidth(7, 256*12+184);
        sheet.setColumnWidth(8, 256*12+184);
        sheet.setColumnWidth(9, 256*8+184);
        sheet.setColumnWidth(10, 256*8+184);
        sheet.setColumnWidth(11, 256*8+184);
        sheet.setColumnWidth(12, 256*8+184);
        sheet.setColumnWidth(13, 256*15+184);

        //begin表格头
        //参数：表格目标，行目标，列位置，值
        createCellAlignCenter(workbook,row_head1,0,"序号",cellStyleO);
        createCellAlignCenter(workbook,row_head1,1,"行业",cellStyleO);
        createCellAlignCenter(workbook,row_head1,2,"申报项目个数",cellStyleO);
        createCellAlignCenter(workbook,row_head2,2,"A类",cellStyleO);
        createCellAlignCenter(workbook,row_head2,3,"B类",cellStyleO);
        createCellAlignCenter(workbook,row_head2,4,"C类",cellStyleO);
        createCellAlignCenter(workbook,row_head2,5,"D类",cellStyleO);
        createCellAlignCenter(workbook,row_head1,6,"总投资金额",cellStyleO);
        createCellAlignCenter(workbook,row_head1,7,"累计拨付资金",cellStyleO);//完成投资
        createCellAlignCenter(workbook,row_head1,8,"累计下达计划",cellStyleO);//安排投资
        createCellAlignCenter(workbook,row_head1,9,"年度预安排资金",cellStyleO);
        createCellAlignCenter(workbook,row_head2,9,"公共预算",cellStyleO);
        createCellAlignCenter(workbook,row_head2,10,"国土",cellStyleO);
        createCellAlignCenter(workbook,row_head2,11,"其他",cellStyleO);
        createCellAlignCenter(workbook,row_head2,12,"合计",cellStyleO);
        createCellAlignCenter(workbook,row_head1,13,"备注",cellStyleO);
        //end#表格头
        
        //合并表头
        CellRangeAddress cellRangeHeadColumn0 = new CellRangeAddress(2,3,0,0);
        CellRangeAddress cellRangeHeadColumn1 = new CellRangeAddress(2,3,1,1);
        CellRangeAddress cellRangeHeadColumn2 = new CellRangeAddress(2,2,2,5);
        CellRangeAddress cellRangeHeadColumn6 = new CellRangeAddress(2,3,6,6);
        CellRangeAddress cellRangeHeadColumn7 = new CellRangeAddress(2,3,7,7);
        CellRangeAddress cellRangeHeadColumn8 = new CellRangeAddress(2,3,8,8);
        CellRangeAddress cellRangeHeadColumn9 = new CellRangeAddress(2,2,9,12);
        CellRangeAddress cellRangeHeadColumn13 = new CellRangeAddress(2,3,13,13);
        
        setRegionStyle(sheet,cellRangeHeadColumn0,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn1,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn2,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn6,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn7,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn8,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn9,cellStyleO);
        setRegionStyle(sheet,cellRangeHeadColumn13,cellStyleO);
       
        sheet.addMergedRegion(cellRangeHeadColumn0);//序号
        sheet.addMergedRegion(cellRangeHeadColumn1);//行业
        sheet.addMergedRegion(cellRangeHeadColumn2);//申报项目个数
        sheet.addMergedRegion(cellRangeHeadColumn6);//总投资
        sheet.addMergedRegion(cellRangeHeadColumn7);//累计拨付
        sheet.addMergedRegion(cellRangeHeadColumn8);//累计下达
        sheet.addMergedRegion(cellRangeHeadColumn9);//年度预安排资金
        sheet.addMergedRegion(cellRangeHeadColumn13);//备注

        //begin#数据列
        int rowNum=4;//从第三行开始
        int index=1;
        Integer projectSum=0,projectCategory_ASum=0,projectCategory_BSum=0,projectCategory_CSum=0,projectCategory_DSum=0;
        Double investSum=0.0,investAccuSum=0.0,apInvestSum=0.0,yearAp_ggysSum=0.0,yearAp_gtjjSum=0.0,yearAp_qitaSum=0.0,yearAp_SumSum=0.0;
        
        List<ExcelDataHYTJ> excelDataHYTJList = (List<ExcelDataHYTJ>) model.get("excelDataHYTJList");
        for (ExcelDataHYTJ data:excelDataHYTJList) {
            Row row = sheet.createRow(rowNum);
            //创建数据
            createCellAlignCenter(workbook,row,0, index,cellStyleO);//序号
            createCellAlignLeft(workbook,row,1, data.getProjectIndustry()+"(合计："+data.getProjectSum()+")",cellStyleO);//项目行业
            createCellAlignCenter(workbook,row,2, data.getProjectCategory_ASum(),cellStyleO);//A类
            createCellAlignCenter(workbook,row,3, data.getProjectCategory_BSum(),cellStyleO);//B类
            createCellAlignCenter(workbook,row,4, data.getProjectCategory_CSum(),cellStyleO);//C类
            createCellAlignCenter(workbook,row,5, data.getProjectCategory_DSum(),cellStyleO);//D类
            createCellAlignCenter(workbook,row,6, data.getInvestSum(),cellStyleO);//总投资
            createCellAlignCenter(workbook,row,7, data.getInvestAccuSum(),cellStyleO);//累计下达
            createCellAlignCenter(workbook,row,8, data.getApInvestSum(),cellStyleO);//累计拨付
            createCellAlignCenter(workbook,row,9, data.getYearAp_ggysSum(),cellStyleO);//公共预算
            createCellAlignCenter(workbook,row,10, data.getYearAp_gtjjSum(),cellStyleO);//国土基金
            createCellAlignCenter(workbook,row,11, data.getYearAp_qitaSum(),cellStyleO);//其他
            createCellAlignCenter(workbook,row,12, data.getYearApSum(),cellStyleO);//合计
            createCellAlignCenter(workbook,row,13, data.getRemark(),cellStyleO);//备注
            
            projectSum+=data.getProjectSum();
            projectCategory_ASum+=data.getProjectCategory_ASum();
            projectCategory_BSum+=data.getProjectCategory_BSum();
            projectCategory_CSum+=data.getProjectCategory_CSum();
            projectCategory_DSum+=data.getProjectCategory_DSum();
            investSum+=data.getInvestSum();
            investAccuSum+=data.getInvestAccuSum();
            apInvestSum+=data.getApInvestSum();
            yearAp_ggysSum+=data.getYearAp_ggysSum();
            yearAp_gtjjSum+=data.getYearAp_gtjjSum();
            yearAp_qitaSum+=data.getYearAp_qitaSum();
            yearAp_SumSum+=data.getYearApSum();
            rowNum++;index++;
        }
        //end#数据列
        
        //合计行
        Row row = sheet.createRow(rowNum);
        createCellAlignCenter(workbook,row,0, index,cellStyleO);
        createCellAlignCenter(workbook,row,1, "(合计："+projectSum+")",cellStyleO);
        createCellAlignCenter(workbook,row,2, projectCategory_ASum,cellStyleO);
        createCellAlignCenter(workbook,row,3, projectCategory_BSum,cellStyleO);
        createCellAlignCenter(workbook,row,4, projectCategory_CSum,cellStyleO);
        createCellAlignCenter(workbook,row,5, projectCategory_DSum,cellStyleO);
        createCellAlignCenter(workbook,row,6, investSum,cellStyleO);//总投资
        createCellAlignCenter(workbook,row,7, investAccuSum,cellStyleO);//累计下达
        createCellAlignCenter(workbook,row,8, apInvestSum,cellStyleO);//累计拨付
        createCellAlignCenter(workbook,row,9, yearAp_ggysSum,cellStyleO);
        createCellAlignCenter(workbook,row,10, yearAp_gtjjSum,cellStyleO);
        createCellAlignCenter(workbook,row,11, yearAp_qitaSum,cellStyleO);
        createCellAlignCenter(workbook,row,12, yearAp_SumSum,cellStyleO);
        createCellAlignCenter(workbook,row,13, "",cellStyleO);

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
