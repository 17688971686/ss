package cs.model.exportExcel;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractXlsView;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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
	@Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook, HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setHeader("Content-Disposition", "attachment;filename=\"yearPlanByIndustry.xls\"");
        Sheet sheet = workbook.createSheet("表1");
        //创建行
        Row title=sheet.createRow(0);
        Row row_head1 = sheet.createRow(1);
        Row row_head2 = sheet.createRow(2);
      
        //begin#标题
        //创建列
        createCellAlignCenter(workbook,title,0,"光明新区2018年区级政府投资项目计划汇总表");
        //合并标题
        //参数1：开始行、结束行、开始列、结束列
        sheet.addMergedRegion(new CellRangeAddress(0,0,0,13));
        //end#标题

        //begin表格头
        //参数：表格目标，行目标，列位置，值
        createCellAlignCenter(workbook,row_head1,0,"序号");
        createCellAlignCenter(workbook,row_head1,1,"行业");
        createCellAlignCenter(workbook,row_head1,2,"申报项目个数");
        createCellAlignCenter(workbook,row_head2,2,"A类");
        createCellAlignCenter(workbook,row_head2,3,"B类");
        createCellAlignCenter(workbook,row_head2,4,"C类");
        createCellAlignCenter(workbook,row_head2,5,"D类");
        createCellAlignCenter(workbook,row_head1,6,"总投资金额");
        createCellAlignCenter(workbook,row_head1,7,"累计下达计划");//完成投资
        createCellAlignCenter(workbook,row_head1,8,"累计拨付资金");//安排投资
        createCellAlignCenter(workbook,row_head1,9,"年度预安排资金");
        createCellAlignCenter(workbook,row_head2,9,"公共预算");
        createCellAlignCenter(workbook,row_head2,10,"国土");
        createCellAlignCenter(workbook,row_head2,11,"其他");
        createCellAlignCenter(workbook,row_head2,12,"合计");
        createCellAlignCenter(workbook,row_head1,13,"备注");
        //end#表格头
        
        //合并表头
        sheet.addMergedRegion(new CellRangeAddress(1,2,0,0));//序号
        sheet.addMergedRegion(new CellRangeAddress(1,2,1,1));//行业
        sheet.addMergedRegion(new CellRangeAddress(1,1,2,5));//申报项目个数
        sheet.addMergedRegion(new CellRangeAddress(1,2,6,6));//总投资
        sheet.addMergedRegion(new CellRangeAddress(1,2,7,7));//累计下达
        sheet.addMergedRegion(new CellRangeAddress(1,2,8,8));//累计拨付
        sheet.addMergedRegion(new CellRangeAddress(1,1,9,12));//年度预安排资金
        sheet.addMergedRegion(new CellRangeAddress(1,2,13,13));//备注

        //begin#数据列
        int rowNum=3;//从第三行开始
        int index=1;
        Integer projectSum=0,projectCategory_ASum=0,projectCategory_BSum=0,projectCategory_CSum=0,projectCategory_DSum=0;
        Double investSum=0.0,investAccuSum=0.0,apInvestSum=0.0,yearAp_ggysSum=0.0,yearAp_gtjjSum=0.0,yearAp_qitaSum=0.0,yearAp_SumSum=0.0;
        
        List<ExcelDataHYTJ> excelDataHYTJList = (List<ExcelDataHYTJ>) model.get("excelDataHYTJList");
        for (ExcelDataHYTJ data:excelDataHYTJList) {
            Row row = sheet.createRow(rowNum);
            //创建数据
            createCellAlignCenter(workbook,row,0, index);//序号
            createCellAlignLeft(workbook,row,1, data.getProjectIndustry()+"(合计："+data.getProjectSum()+")");//项目行业
            createCellAlignCenter(workbook,row,2, data.getProjectCategory_ASum());//A类
            createCellAlignCenter(workbook,row,3, data.getProjectCategory_BSum());//B类
            createCellAlignCenter(workbook,row,4, data.getProjectCategory_CSum());//C类
            createCellAlignCenter(workbook,row,5, data.getProjectCategory_DSum());//D类
            createCellAlignCenter(workbook,row,6, data.getInvestSum());//总投资
            createCellAlignCenter(workbook,row,7, data.getInvestAccuSum());//累计下达
            createCellAlignCenter(workbook,row,8, data.getApInvestSum());//累计拨付
            createCellAlignCenter(workbook,row,9, data.getYearAp_ggysSum());//公共预算
            createCellAlignCenter(workbook,row,10, data.getYearAp_gtjjSum());//国土基金
            createCellAlignCenter(workbook,row,11, data.getYearAp_qitaSum());//其他
            createCellAlignCenter(workbook,row,12, data.getYearApSum());//合计
            createCellAlignCenter(workbook,row,13, data.getRemark());//备注
            
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
        createCellAlignCenter(workbook,row,0, index);
        createCellAlignCenter(workbook,row,1, "(合计："+projectSum+")");
        createCellAlignCenter(workbook,row,2, projectCategory_ASum);
        createCellAlignCenter(workbook,row,3, projectCategory_BSum);
        createCellAlignCenter(workbook,row,4, projectCategory_CSum);
        createCellAlignCenter(workbook,row,5, projectCategory_DSum);
        createCellAlignCenter(workbook,row,6, investSum);//总投资
        createCellAlignCenter(workbook,row,7, investAccuSum);//累计下达
        createCellAlignCenter(workbook,row,8, apInvestSum);//累计拨付
        createCellAlignCenter(workbook,row,9, yearAp_ggysSum);
        createCellAlignCenter(workbook,row,10, yearAp_gtjjSum);
        createCellAlignCenter(workbook,row,11, yearAp_qitaSum);
        createCellAlignCenter(workbook,row,12, yearAp_SumSum);
        createCellAlignCenter(workbook,row,13, "");

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
