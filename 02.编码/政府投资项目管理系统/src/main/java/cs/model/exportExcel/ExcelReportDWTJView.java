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
* @ClassName: ExcelReportDWTJView 
* @Description: 年度计划编制导出建设单位统计Excel设计 
* @author cx
* @date 2017年9月6日 下午4:22:06 
*
 */
public class ExcelReportDWTJView extends AbstractXlsView {
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setHeader("Content-Disposition", "attachment;filename=\"yearPlanByConsUnit.xls\"");
        Sheet sheet = workbook.createSheet("表1");
        //创建行
        Row title=sheet.createRow(0);
        Row subTitle=sheet.createRow(1);
        Row row_head1 = sheet.createRow(2);
        Row row_head2 = sheet.createRow(3);
      
        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,"光明新区2018年区级政府投资项目计划各建设单位资金安排汇总表");
        //合并标题
        //参数1：开始行、结束行、开始列、结束列
        sheet.addMergedRegion(new CellRangeAddress(0,0,0,5));
        //end#标题
        
        //begin#子标题
        createCellAlignRight(workbook,subTitle,0,"单位：万元");
        sheet.addMergedRegion(new CellRangeAddress(1,1,0,5));
        //end#子标题

        //begin表格头
        createCellAlignCenter(workbook,row_head1,0,"序号");
        createCellAlignCenter(workbook,row_head1,1,"建设单位");
        createCellAlignCenter(workbook,row_head1,2,"安排资金");
        createCellAlignCenter(workbook,row_head2,2,"合计");
        createCellAlignCenter(workbook,row_head2,3,"单列项目");
        createCellAlignCenter(workbook,row_head2,4,"结算款");
        createCellAlignCenter(workbook,row_head2,5,"未立项\n项目预留");
        //end#表格头
        
        //合并表头
        sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));//序号
        sheet.addMergedRegion(new CellRangeAddress(2,3,1,1));//建设单位
        sheet.addMergedRegion(new CellRangeAddress(2,2,2,5));//安排资金

//        //begin#数据列
//        int rowNum=2;//从第三行开始
//        int index=1;
//        List<ExcelDataLBTJ> excelDataLBTJList = (List<ExcelDataLBTJ>) model.get("excelDataLBTJList");
//        for (ExcelDataLBTJ data:excelDataLBTJList) {
//            Row row = sheet.createRow(rowNum);
//            //创建数据
//            createCellAlignCenter(workbook,row,0, index);//序号
//            createCellAlignCenter(workbook,row,1, data.getProjectCategory());//项目类别
//            createCellAlignCenter(workbook,row,2, data.getProjectSum());//项目总数
//            createCellAlignCenter(workbook,row,3, data.getInvestSum());//总投资
//            createCellAlignCenter(workbook,row,4, data.getInvestAccuSum());//累计下达
//            createCellAlignCenter(workbook,row,5, data.getApInvestSum());//累计拨付
//            createCellAlignCenter(workbook,row,6, data.getYearInvestApprovalSum());//年度预安排
//            rowNum++;
//            index++;
//        }
//        //end#数据列

    }
    private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,String value){
        createCell(workbook,row,cellNumber,value,CellStyle.ALIGN_CENTER,CellStyle.VERTICAL_CENTER);
    }
    private void createCellAlignCenter(Workbook workbook,Row row, int cellNumber,double value){
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
  //重写创建列
    private void createCell(Workbook workbook,Row row, int cellNumber,double value, short halign, short valign){
        Cell cell=row.createCell(cellNumber);
        cell.setCellValue(value);

        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setAlignment(halign);
        cellStyle.setVerticalAlignment(valign);
        cellStyle.setWrapText(true);
        cell.setCellStyle(cellStyle);
    }
}
