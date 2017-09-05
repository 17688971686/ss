package cs.model;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractXlsView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class ExcelReportView extends AbstractXlsView {
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setHeader("Content-Disposition", "attachment;filename=\"plan.xls\"");
        Sheet sheet = workbook.createSheet("表1");
        //创建行
        Row title=sheet.createRow(0);
        Row subTitle=sheet.createRow(1);
        Row row_head1 = sheet.createRow(2);
        Row row_head2 = sheet.createRow(3);

        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,"光明新区2018年政府投资项目计划");
        //合并
        sheet.addMergedRegion(new CellRangeAddress(0,0,0,11));
        //end#标题

        //begin#子标题
        createCellAlignLeft(workbook,subTitle,0,"打印日期："+new SimpleDateFormat("yyyy年MM月dd日").format(new Date()));
        createCellAlignRight(workbook,subTitle,10,"资金：万   元\n面积：平方米");
        sheet.addMergedRegion(new CellRangeAddress(1,1,0,1));
        sheet.addMergedRegion(new CellRangeAddress(1,1,10,11));
        //end#子标题

        //begin表格头
        createCellAlignCenter(workbook,row_head1,0,"序号");
        createCellAlignCenter(workbook,row_head1,1,"建设单位及项目名称");
        createCellAlignCenter(workbook,row_head1,2,"项目类别");
        createCellAlignCenter(workbook,row_head1,3,"建设规模");
        createCellAlignCenter(workbook,row_head1,4,"建设性质");
        createCellAlignCenter(workbook,row_head2,4,"建设起止年月");
        createCellAlignCenter(workbook,row_head1,5,"总投资");
        createCellAlignCenter(workbook,row_head1,6,"累计投资");
        createCellAlignCenter(workbook,row_head1,7,"安排投资");
        createCellAlignCenter(workbook,row_head1,8,"投资来源");
        createCellAlignCenter(workbook,row_head2,8,"国土");
        createCellAlignCenter(workbook,row_head2,9,"公共预算");
        createCellAlignCenter(workbook,row_head1,10,"2018年主要建设内容");
        createCellAlignCenter(workbook,row_head1,11,"备注");

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
        int index=1;
        List<ExcelData> excelDataList = (List<ExcelData>) model.get("excelDataList");
        for (ExcelData data:excelDataList) {
            int rowNum1=rowNum++;
            int rowNum2=rowNum++;
            Row row1 = sheet.createRow(rowNum1);
            Row row2 = sheet.createRow(rowNum2);
            createCellAlignCenter(workbook,row1,0, Integer.toString(index++));
            createCellAlignLeft(workbook,row1,1, data.getConstructionUnit()+"\n"+data.getProjectName()+"\n"+data.getProjectCode());
            createCellAlignCenter(workbook,row1,2, data.getProjectType());
            createCellAlignCenter(workbook,row1,3, data.getConstructionScale());
            createCellAlignCenter(workbook,row1,4, data.getConstructionType());
            createCellAlignCenter(workbook,row2,4, data.getConstructionDate());
            createCellAlignCenter(workbook,row1,5, data.getTotalInvest());
            createCellAlignCenter(workbook,row1,6, data.getAccumulatedInvest());
            createCellAlignCenter(workbook,row1,7, data.getArrangeInvest());
            createCellAlignCenter(workbook,row1,8, data.getInvest_GuoTu());
            createCellAlignCenter(workbook,row1,9, data.getInvest_GongGongYuSuan());
            createCellAlignLeft(workbook,row1,10, data.getConstructionContent());
            createCellAlignCenter(workbook,row1,11,data.getRemark());

            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,0,0));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,1,1));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,2,2));
            sheet.addMergedRegion(new CellRangeAddress(rowNum1,rowNum2,3,3));
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
