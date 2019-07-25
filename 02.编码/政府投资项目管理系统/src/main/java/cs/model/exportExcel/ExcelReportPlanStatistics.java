package cs.model.exportExcel;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.gson.JsonObject;
import com.sun.org.apache.xpath.internal.operations.Bool;
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

public class ExcelReportPlanStatistics{
    
    @SuppressWarnings({ "unchecked", "deprecation" })
    public void buildExcelDocument(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //创建Excel文件，获取request中表单数据
        HSSFWorkbook workbook = new HSSFWorkbook();
        String jsonData = new String(request.getParameter("data").getBytes("iso-8859-1"), "utf-8");
        JSONObject data = JSONObject.parseObject(jsonData);
        
        //Sheet为表单，CellStyle单元格样式
        Sheet sheet = workbook.createSheet("表1");
        CellStyle cellStyleO = workbook.createCellStyle();
        CellStyle cellStyleTitle = workbook.createCellStyle();
        CellStyle cellStyleSubTitleLeft = workbook.createCellStyle();
        //创建行：表名（0）+日期和单位（1）+表头（2~5）+合计（6~7）
        Row title = sheet.createRow(0);
        Row subTitle = sheet.createRow(1);
        Row row_head1 = sheet.createRow(2);
        Row row_head2 = sheet.createRow(3);
        Row row_head3 = sheet.createRow(4);
        Row row_head4 = sheet.createRow(5);
        Row row_head5 = sheet.createRow(6);
        Row row_head6 = sheet.createRow(7);
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
        row_head3.setHeight((short)360);
        row_head4.setHeight((short)360);
        row_head5.setHeight((short)360);
        row_head6.setHeight((short)360);
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
        
        //begin
        //创建列
        createCellAlignCenter(workbook, title, 0, "项目详细统计报表", cellStyleTitle);
        //CellRangeAddress(起始行号，终止行号，起始列号，终止列号)：合并单元格
        //表名
        CellRangeAddress cellRangeTitle = new CellRangeAddress(0,0,0,5);//表名行
        setRegionStyle(sheet, cellRangeTitle, cellStyleTitle);//设置单元格样式
        sheet.addMergedRegion(cellRangeTitle);//合并单元格
        //日期+单位
        createCellAlignLeft(workbook, subTitle, 0, "打印日期" + new SimpleDateFormat("yyyy年MM月dd日").format(new Date()), cellStyleSubTitleLeft);
        CellRangeAddress cellRangeSubTitleLeft = new CellRangeAddress(1,1,0,4);
        setRegionStyle(sheet, cellRangeSubTitleLeft, cellStyleSubTitleLeft);
        sheet.addMergedRegion(cellRangeSubTitleLeft);
        createCellAlignRight(workbook, subTitle, 5, "资金：万   元", workbook.createCellStyle());
        //标题
        //设置列宽
        sheet.setColumnWidth(0, 256*5+184);
        sheet.setColumnWidth(1, 256*25+184);
        sheet.setColumnWidth(2, 256*25+184);
        sheet.setColumnWidth(3, 256*15+184);
        sheet.setColumnWidth(4, 256*15+184);
        sheet.setColumnWidth(5, 256*15+184);
        
        //begin表头内容
        //参数：表格、行、列、单元格值、单元格样式
        createCellAlignCenter(workbook, row_head1, 0, "序号", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 1, "建设单位、项目名称及\n国家编码", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 2, "建设规模", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 3, "项目类型", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 4, "总投资", cellStyleO);
        createCellAlignCenter(workbook, row_head1, 5, "安排年度投资", cellStyleO);
        createCellAlignCenter(workbook, row_head2, 3, "建设性质", cellStyleO);
        createCellAlignCenter(workbook, row_head3, 3, "建设起止年月", cellStyleO);
        createCellAlignCenter(workbook, row_head3, 4, "已安排投资", cellStyleO);
        createCellAlignCenter(workbook, row_head4, 2, "主要建设内容", cellStyleO);
        //合并表头行、列
        CellRangeAddress cellRangeHeadColumn0 = new CellRangeAddress(2,5,0,0);
        CellRangeAddress cellRangeHeadColumn1 = new CellRangeAddress(2,5,1,1);
        CellRangeAddress cellRangeHeadColumn2 = new CellRangeAddress(2,4,2,2);
        CellRangeAddress cellRangeHeadColumn4 = new CellRangeAddress(2,3,4,4);
        CellRangeAddress cellRangeHeadColumn5 = new CellRangeAddress(2,4,5,5);
        CellRangeAddress cellRangeHeadColumn6 = new CellRangeAddress(5,5,2,5);
        //调整样式
        setRegionStyle(sheet, cellRangeHeadColumn0, cellStyleO);
        setRegionStyle(sheet, cellRangeHeadColumn1, cellStyleO);
        setRegionStyle(sheet, cellRangeHeadColumn2, cellStyleO);
        setRegionStyle(sheet, cellRangeHeadColumn4, cellStyleO);
        setRegionStyle(sheet, cellRangeHeadColumn5, cellStyleO);
        setRegionStyle(sheet, cellRangeHeadColumn6, cellStyleO);
        //调整的样式放入表单sheet
        sheet.addMergedRegion(cellRangeHeadColumn0);//序号
        sheet.addMergedRegion(cellRangeHeadColumn1);//项目名
        sheet.addMergedRegion(cellRangeHeadColumn2);//建设规模
        sheet.addMergedRegion(cellRangeHeadColumn4);//总投资
        sheet.addMergedRegion(cellRangeHeadColumn5);//安排年度投资
        sheet.addMergedRegion(cellRangeHeadColumn6);//主要建设内容
        //end表头
        
        //begin合计
        createCellAlignCenter(workbook, row_head5, 0, "", cellStyleO);
        createCellAlignCenter(workbook, row_head5, 1, "合计", cellStyleO);
        createCellAlignCenter(workbook, row_head5, 2, "项目总数"+data.getString("projectNum")+"个", cellStyleO);
        createCellAlignCenter(workbook, row_head5, 4, data.getDouble("projectInvestSum"), cellStyleO);
        createCellAlignCenter(workbook, row_head6, 4, data.getDouble("projectInvestAccuSum"), cellStyleO);
        createCellAlignCenter(workbook, row_head5, 5, data.getDouble("applyAPYearInvest"), cellStyleO);
        CellRangeAddress cellRangeHeadColumn7 = new CellRangeAddress(6,7,0,0);
        CellRangeAddress cellRangeHeadColumn8 = new CellRangeAddress(6,7,1,1);
        CellRangeAddress cellRangeHeadColumn9 = new CellRangeAddress(6,7,2,3);
        CellRangeAddress cellRangeHeadColumn10 = new CellRangeAddress(6,7,5,5);
        setRegionStyle(sheet, cellRangeHeadColumn7, cellStyleO);
        setRegionStyle(sheet, cellRangeHeadColumn8, cellStyleO);
        setRegionStyle(sheet, cellRangeHeadColumn9, cellStyleO);
        setRegionStyle(sheet, cellRangeHeadColumn10, cellStyleO);
        sheet.addMergedRegion(cellRangeHeadColumn7);//序号
        sheet.addMergedRegion(cellRangeHeadColumn8);//合计
        sheet.addMergedRegion(cellRangeHeadColumn9);//项目数
        sheet.addMergedRegion(cellRangeHeadColumn10);//安排年度投资
        //end合计
        
        //begin数据列
        int rowNum=8;
        JSONArray industryList = data.getJSONArray("industry");
        CellRangeAddress dataColumn1;
        CellRangeAddress dataColumn2;
        CellRangeAddress dataColumn3;
        CellRangeAddress dataColumn4;
        JSONObject industry;
        Row dataRow1=null;
        Row dataRow2=null;
        //17个行业的数据集合循环
        for(int i=0; i<industryList.size(); i++){
            industry = industryList.getJSONObject(i);//当前行业bean
            //如果该行业总投资不为0，则有数据，输出
            if(industry.getDouble("industry_projectInvestSum")!=0.0){
                if(dataRow1!=null || dataRow2!=null){
                    rowNum = rowNum+2;
                }
                dataRow1 = sheet.createRow(rowNum);
                dataRow2 = sheet.createRow(rowNum+1);
                createCellAlignCenter(workbook, dataRow1, 0, "", cellStyleO);
                createCellAlignCenter(workbook, dataRow1, 1, industry.getString("projectIndustry"), cellStyleO);//行业名
                createCellAlignCenter(workbook, dataRow1, 2, "项目总数"+industry.getString("projectNum")+"个", cellStyleO);//
                createCellAlignCenter(workbook, dataRow1, 4, industry.getDouble("industry_projectInvestSum"), cellStyleO);//行业总投资哦
                createCellAlignCenter(workbook, dataRow2, 4, industry.getDouble("industry_projectInvestAccuSum"), cellStyleO);//行业已安排投资
                createCellAlignCenter(workbook, dataRow1, 5, industry.getDouble("industry_applyAPYearInvest"), cellStyleO);//行业年度安排投资
                dataColumn1 = new CellRangeAddress(rowNum, rowNum+1, 0, 0);
                dataColumn2 = new CellRangeAddress(rowNum, rowNum+1, 1, 1);
                dataColumn3 = new CellRangeAddress(rowNum, rowNum+1, 2, 3);
                dataColumn4 = new CellRangeAddress(rowNum, rowNum+1, 5, 5);
                setRegionStyle(sheet, dataColumn1, cellStyleO);
                setRegionStyle(sheet, dataColumn2, cellStyleO);
                setRegionStyle(sheet, dataColumn3, cellStyleO);
                setRegionStyle(sheet, dataColumn4, cellStyleO);
                sheet.addMergedRegion(dataColumn1);//序号
                sheet.addMergedRegion(dataColumn2);//行业名
                sheet.addMergedRegion(dataColumn3);//行业的项目数
                sheet.addMergedRegion(dataColumn4);//年度安排投资
                
                //begin分类：A、B、C、D
                JSONObject allProjectCategory = industry.getJSONObject("projectCategory");
                JSONObject category;
                //四种类型进行循环判断输出
                List categoryName = new ArrayList();
                categoryName.add("projectCategory_1");
                categoryName.add("projectCategory_2");
                categoryName.add("projectCategory_3");
                categoryName.add("projectCategory_4");
                //每一个类型都要两行输出
                Row row_category1;
                Row row_category2;
                for(int j=0; j<categoryName.size(); j++){
                    category = allProjectCategory.getJSONObject(categoryName.get(j).toString());
                    if(category.getDouble("projectInvestSum")!=0.0){
                        if(j==0){
                            rowNum = rowNum+2;
                        }else{
                            rowNum = rowNum+4;
                        }
                        row_category1 = sheet.createRow(rowNum);
                        row_category2 = sheet.createRow(rowNum+1);
                        createCellAlignCenter(workbook, row_category1, 0, "", cellStyleO);
                        createCellAlignCenter(workbook, row_category1, 1, category.getString("categoryName"), cellStyleO);//行业名
                        createCellAlignCenter(workbook, row_category1, 2, "项目总数"+category.getJSONArray("shenBaoInfoDtos").size()+"个", cellStyleO);//
                        createCellAlignCenter(workbook, row_category1, 4, category.getDouble("projectInvestSum"), cellStyleO);//行业总投资
                        createCellAlignCenter(workbook, row_category2, 4, category.getDouble("projectInvestAccuSum"), cellStyleO);//行业已安排投资
                        createCellAlignCenter(workbook, row_category1, 5, category.getDouble("applyAPYearInvest"), cellStyleO);//行业年度安排投资
                        dataColumn1 = new CellRangeAddress(rowNum, rowNum+1, 0, 0);
                        dataColumn2 = new CellRangeAddress(rowNum, rowNum+1, 1, 1);
                        dataColumn3 = new CellRangeAddress(rowNum, rowNum+1, 2, 3);
                        dataColumn4 = new CellRangeAddress(rowNum, rowNum+1, 5, 5);
                        setRegionStyle(sheet, dataColumn1, cellStyleO);
                        setRegionStyle(sheet, dataColumn2, cellStyleO);
                        setRegionStyle(sheet, dataColumn3, cellStyleO);
                        setRegionStyle(sheet, dataColumn4, cellStyleO);
                        sheet.addMergedRegion(dataColumn1);//序号
                        sheet.addMergedRegion(dataColumn2);//分类
                        sheet.addMergedRegion(dataColumn3);//分类的项目总数
                        sheet.addMergedRegion(dataColumn4);//年度安排投资
                        
                        //项目具体数据
                        JSONArray dtos = category.getJSONArray("shenBaoInfoDtos");
                        Row row_shenBaoInfoDto1;
                        Row row_shenBaoInfoDto2;
                        Row row_shenBaoInfoDto3;
                        Row row_shenBaoInfoDto4;
                        for(int z=0; z<dtos.size(); z++){
                            if(z==0){
                                rowNum = rowNum+2;
                            }else{
                                rowNum = rowNum+4;
                            }
                            row_shenBaoInfoDto1 = sheet.createRow(rowNum);
                            row_shenBaoInfoDto2 = sheet.createRow(rowNum+1);
                            row_shenBaoInfoDto3 = sheet.createRow(rowNum+2);
                            row_shenBaoInfoDto4 = sheet.createRow(rowNum+3);
                            JSONObject dto = dtos.getJSONObject(z);
                            //国家编码、建设起止日期（方法里不好合并，在这先取出来）
                            String countryNumber = dto.getString("countryNumber")==null?"-":dto.getString("countryNumber");
                            String beginDate = dto.getString("beginDate")==null?"-  ":dto.getString("beginDate");
                            String endDate = dto.getString("endDate")==null?"-":dto.getString("endDate");
                            
                            createCellAlignCenter(workbook, row_shenBaoInfoDto1, 0, z+1, cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto1, 1, ""+dto.getString("constructionUnit")+"\n"+dto.getString("projectName")+"\n"+countryNumber, cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto1, 2, dto.getString("projectGuiMo")==null?"":dto.getString("projectGuiMo"), cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto1, 3, category.getString("categoryName"), cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto1, 4, dto.getDouble("projectInvestSum"), cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto1, 5, dto.getDouble("applyAPYearInvest"), cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto2, 3, dto.getString("projectConstrChar")==null?"-":dto.getString("projectConstrChar"), cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto3, 3, ""+beginDate+"~\n"+endDate, cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto3, 4, dto.getDouble("projectInvestAccuSum"), cellStyleO);
                            createCellAlignCenter(workbook, row_shenBaoInfoDto4, 2, dto.getString("planReachConstructionContent")==null?"-":dto.getString("planReachConstructionContent"), cellStyleO);
                            cellRangeHeadColumn0 = new CellRangeAddress(rowNum,rowNum+3,0,0);
                            cellRangeHeadColumn1 = new CellRangeAddress(rowNum,rowNum+3,1,1);
                            cellRangeHeadColumn2 = new CellRangeAddress(rowNum,rowNum+2,2,2);
                            cellRangeHeadColumn4 = new CellRangeAddress(rowNum,rowNum+1,4,4);
                            cellRangeHeadColumn5 = new CellRangeAddress(rowNum,rowNum+2,5,5);
                            cellRangeHeadColumn6 = new CellRangeAddress(rowNum+3,rowNum+3,2,5);
                            setRegionStyle(sheet, cellRangeHeadColumn0, cellStyleO);
                            setRegionStyle(sheet, cellRangeHeadColumn1, cellStyleO);
                            setRegionStyle(sheet, cellRangeHeadColumn2, cellStyleO);
                            setRegionStyle(sheet, cellRangeHeadColumn4, cellStyleO);
                            setRegionStyle(sheet, cellRangeHeadColumn5, cellStyleO);
                            setRegionStyle(sheet, cellRangeHeadColumn6, cellStyleO);
                            sheet.addMergedRegion(cellRangeHeadColumn0);//序号
                            sheet.addMergedRegion(cellRangeHeadColumn1);//项目名
                            sheet.addMergedRegion(cellRangeHeadColumn2);//建设规模
                            sheet.addMergedRegion(cellRangeHeadColumn4);//总投资
                            sheet.addMergedRegion(cellRangeHeadColumn5);//安排年度投资
                            sheet.addMergedRegion(cellRangeHeadColumn6);//主要建设内容
                        }
                    }
                }
                //+2为了创建下一个行业
                rowNum = rowNum+2;
            }
        }
        
        //end数据列
        
        
        try{
            //文件名
            String fileName = "年度计划项目详细统计报表.xls";
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
