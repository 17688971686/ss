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
/**
* @ClassName: ExcelReportLBTJView 
* @Description: 年度计划编制导出项目类别统计Excel设计 
* @author cx
* @date 2017年9月6日 下午4:22:06 
*
 */
public class ExcelReportLBTJView extends AbstractXlsView {
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setHeader("Content-Disposition", "attachment;filename=\"yearPlanByCategory.xls\"");
        Sheet sheet = workbook.createSheet("表1");
        //创建行
        Row title=sheet.createRow(0);
        Row row_head = sheet.createRow(1);
      
        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,"光明新区2018年区级政府投资项目计划汇总表");
        //合并标题
        sheet.addMergedRegion(new CellRangeAddress(0,0,0,6));
        //end#标题

        //begin表格头
        createCellAlignCenter(workbook,row_head,0,"序号");
        createCellAlignCenter(workbook,row_head,1,"类别");
        createCellAlignCenter(workbook,row_head,2,"建设项目数量");
        createCellAlignCenter(workbook,row_head,3,"总投资金额");
        createCellAlignCenter(workbook,row_head,4,"累计下达计划");
        createCellAlignCenter(workbook,row_head,5,"累计拨付资金");
        createCellAlignCenter(workbook,row_head,6,"年度预算安排资金（单位：万元）");
        //合并表格头
        sheet.addMergedRegion(new CellRangeAddress(1,0,1,0));
        sheet.addMergedRegion(new CellRangeAddress(1,1,1,1));
        sheet.addMergedRegion(new CellRangeAddress(1,2,1,2));
        sheet.addMergedRegion(new CellRangeAddress(1,3,1,3));
        sheet.addMergedRegion(new CellRangeAddress(1,4,1,4));
        sheet.addMergedRegion(new CellRangeAddress(1,5,1,5));
        sheet.addMergedRegion(new CellRangeAddress(1,6,1,6));
        //end#表格头

        //begin#数据列
        int rowNum=2;//从第三行开始
        int index=1;
        List<ExcelDataLBTJ> excelDataLBTJList = (List<ExcelDataLBTJ>) model.get("excelDataLBTJList");
        for (ExcelDataLBTJ data:excelDataLBTJList) {
            Row row = sheet.createRow(rowNum);
            //创建数据
            createCellAlignCenter(workbook,row,0, Integer.toString(index++));//序号
            createCellAlignLeft(workbook,row,1, data.getProjectCategory());//项目类别
            createCellAlignCenter(workbook,row,2, data.getProjectSum());//项目总数
            createCellAlignCenter(workbook,row,3, data.getInvestSum());//总投资
            createCellAlignCenter(workbook,row,4, data.getInvestAccuSum());//累计下达
            createCellAlignCenter(workbook,row,5, data.getApInvestSum());//累计拨付
            createCellAlignCenter(workbook,row,6, data.getYearInvestApprovalSum());//年度预安排
            //合并数据
            sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,0,0));
            sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,1,1));
            sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,2,2));
            sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,3,3));
            sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,4,4));
            sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,5,5));
            sheet.addMergedRegion(new CellRangeAddress(rowNum,rowNum,6,6));
            
            rowNum ++;
            
        }
        //end#数据列

    }
    private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,String value){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER);
    }
    private void createCellAlignLeft(Workbook workbook,Row row, int cellNumber,String value){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_LEFT,CellStyle.VERTICAL_CENTER);
    }
    private void createCellAlignRight(Workbook workbook,Row row, int cellNumber,String value){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_RIGHT,CellStyle.VERTICAL_CENTER);
    }
    private void createCell(Workbook workbook,Row row, int cellNumber,String value, short halign, short valign){
        Cell cell=row.createCell(cellNumber);
        cell.setCellValue(value);

        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setAlignment(halign);
        cellStyle.setVerticalAlignment(valign);
        cellStyle.setWrapText(true);
        cell.setCellStyle(cellStyle);
    }
}
