package cs.model.exportExcel;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ExcelReportCategoryStatistics {
    
    @SuppressWarnings({ "unchecked", "deprecation" })
    public void buildExcelDocument(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //创建Excel文件，获取request中表单数据(注意编码)
        HSSFWorkbook workbook = new HSSFWorkbook();
        String jsonData = new String(request.getParameter("data").getBytes("iso-8859-1"), "utf-8");
        JSONObject data = JSONObject.parseObject(jsonData);
        
        //Sheet为表单，CellStyle单元格样式
        Sheet sheet = workbook.createSheet("表1");
        CellStyle cellStyleO = workbook.createCellStyle();
        CellStyle cellStyleTitle = workbook.createCellStyle();
        CellStyle cellStyleSubTitleLeft = workbook.createCellStyle();
        //创建行：表名（0）+日期和单位（1）+表头（2）+合计（3）
        Row title = sheet.createRow(0);
        Row subTitle = sheet.createRow(1);
        Row row_head1 = sheet.createRow(2);
        Row row_head2 = sheet.createRow(3);
        //设置文档字体
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short)14);
        font.setFontName("黑体");
        cellStyleTitle.setFont(font);
        //行高
        title.setHeight((short)800);
        subTitle.setHeight((short)500);
        row_head1.setHeight((short)360);
        row_head2.setHeight((short)360);
        //表格边框
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
        
        //创建列
        createCellAlignCenter(workbook, title, 0, "分类统计报表", cellStyleTitle);
        
        //CellRangeAddress(起始行号，终止行号，起始列号，终止列号)：合并单元格
        //表名(第一行)
        CellRangeAddress cellRangeTitle = new CellRangeAddress(0,0,0,5);
        setRegionStyle(sheet, cellRangeTitle, cellStyleTitle);//设置单元格样式
        sheet.addMergedRegion(cellRangeTitle);//合并单元格
        //日期+单位(第二行)
        createCellAlignLeft(workbook, subTitle, 0, "打印日期" + new SimpleDateFormat("yyyy年MM月dd日").format(new Date()), cellStyleSubTitleLeft);
        CellRangeAddress cellRangeSubTitleLeft = new CellRangeAddress(1,1,0,4);
        setRegionStyle(sheet, cellRangeSubTitleLeft, cellStyleSubTitleLeft);
        sheet.addMergedRegion(cellRangeSubTitleLeft);
        createCellAlignRight(workbook, subTitle, 5, "资金：万   元", workbook.createCellStyle());
        //设置列宽
        sheet.setColumnWidth(0, 256*25+184);
        sheet.setColumnWidth(1, 256*15+184);
        sheet.setColumnWidth(2, 256*20+184);
        sheet.setColumnWidth(3, 256*20+184);
        sheet.setColumnWidth(4, 256*20+184);
        sheet.setColumnWidth(5, 256*25+184);
        
        //begin表头(第三行)
        //参数：表格、行、列、单元格值、单元格样式
        createCellAlignCenter(workbook, row_head1, 0, "行业及合并系统", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 1, "项目个数", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 2, "项目总投资", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 3, "已安排投资", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 4, "安排年度投资", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 5, "安排年度投资占比", cellStyleO);
        //end表头
        
        //begin合计(第四行)
        createCellAlignCenter(workbook, row_head2, 0, "合计", cellStyleO);
        createCellAlignCenter(workbook, row_head2, 1, data.getInteger("projectNum"), cellStyleO);
        createCellAlignCenter(workbook, row_head2, 2, data.getDouble("projectInvestSum"), cellStyleO);
        createCellAlignCenter(workbook, row_head2, 3, data.getDouble("projectInvestAccuSum"), cellStyleO);
        createCellAlignCenter(workbook, row_head2, 4, data.getDouble("applyAPYearInvest"), cellStyleO);
        createCellAlignCenter(workbook, row_head2, 5, "", cellStyleO);
        //end合计
        
        //begin数据列(从第五行开始循环遍历数据)
        int rowNum=4;//
        JSONArray industryList = data.getJSONArray("industry");//行业数据集合
        JSONObject industry;
        CellRangeAddress dataColumn;//用于合并单元格
        Row dataRow = null;//创建行
        
        for(int i=0; i<industryList.size(); i++){
            industry = industryList.getJSONObject(i);
            String test = industry.getString("projectIndustry");
            //如果行业的总投资不为0
            if(industry.getDouble("industry_projectInvestSum")!=0.0){
                if(dataRow!=null){//第一个有数据的行业接着合计开始，后面的行业数据要换行再写入Excel文档
                    rowNum = rowNum+1;
                }
                dataRow = sheet.createRow(rowNum);
                createCellAlignCenter(workbook, dataRow, 0, industry.getString("projectIndustry"), cellStyleO);
                createCellAlignCenter(workbook, dataRow, 1, industry.getString("projectNum"), cellStyleO);//项目数
                createCellAlignCenter(workbook, dataRow, 2, industry.getString("industry_projectInvestSum"), cellStyleO);//总投资
                createCellAlignCenter(workbook, dataRow, 3, industry.getString("industry_projectInvestAccuSum"), cellStyleO);//已安排投资
                createCellAlignCenter(workbook, dataRow, 4, industry.getString("industry_applyAPYearInvest"), cellStyleO);//年度安排投资
                createCellAlignCenter(workbook, dataRow, 5, industry.getString("industry_applyAPYearInvest_percentage"), cellStyleO);//年度安排投资占比
                
                //行业四个分类：A、B、C、D
                JSONObject allProjectCategory = industry.getJSONObject("projectCategory");
                JSONObject category;
                
                List categoryName = new ArrayList();
                categoryName.add("projectCategory_1");
                categoryName.add("projectCategory_2");
                categoryName.add("projectCategory_3");
                categoryName.add("projectCategory_4");
                Row row_category;
                
                for(int j=0; j<categoryName.size(); j++){
                    category = allProjectCategory.getJSONObject(categoryName.get(j).toString());
                    //四种类型进行循环判断总投资是否为0
                    if(category.getDouble("projectInvestSum")!=0.0){
                        rowNum = rowNum+1;//当前rowNum已经写了行业数据，所以换行写分类数据
                        row_category = sheet.createRow(rowNum);
                        createCellAlignCenter(workbook, row_category, 0, category.getString("categoryName"), cellStyleO);
                        createCellAlignCenter(workbook, row_category, 1, category.getJSONArray("shenBaoInfoDtos").size(), cellStyleO);
                        createCellAlignCenter(workbook, row_category, 2, category.getDouble("projectInvestSum"), cellStyleO);
                        createCellAlignCenter(workbook, row_category, 3, category.getDouble("projectInvestAccuSum"), cellStyleO);
                        createCellAlignCenter(workbook, row_category, 4, category.getDouble("applyAPYearInvest"), cellStyleO);
                        createCellAlignCenter(workbook, row_category, 5, category.getString(""), cellStyleO);
                    }
                }
            }
        }
        //end数据列
        
        
        try{
            //文件名
            String fileName = "年度计划分类统计报表.xls";
            response.setContentType("APPLICATION/OCTET-STREAM");
            response.setHeader("Content-disposition", "attachment;filename=\"" + new String(fileName.getBytes("utf-8"), "ISO_8859_1") +"\"" );
            workbook.write(response.getOutputStream());// 实现输出
            response.flushBuffer();
        }catch (Exception e){
            e.printStackTrace();
        }
        
    }
    
    @SuppressWarnings("deprecation")
    private void createCellAlignCenter(Workbook workbook, Row row, int cellNumber, String value, CellStyle cellStyle){
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
    /**创建单元格并设置样式
     * @param workbook 文档
     * @param row 行
     * @param cellNumber 单元格
     * @param value 单元格内容
     * @param halign 水平内容样式
     * @param valign 垂直内容样式
     * @param cellStyle 单元格样式
     */
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
