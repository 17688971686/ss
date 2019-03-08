package cs.model.exportExcel;

import cs.common.BasicDataConfig;
import cs.common.DateUtil;
import cs.model.DomainDto.ExcelReportPlanReachDto;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.web.servlet.view.document.AbstractXlsView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 
 * @ClassName: ExcelReportPlanReachView
 * @Description: 导出计划生成excel工具类
 * @author lx
 * @date 2018年8月22日 下午14:57
 *
 */
public class ExcelShenBaoPlanReachView extends AbstractXlsView {

    @Override
    protected void buildExcelDocument(Map<String, Object> map, Workbook workbook, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        int year = DateUtil.getYear();
        String fileName = BasicDataConfig.gm_name+year+"年政府投资项目计划表.xls";

        httpServletResponse.setHeader("Content-Disposition", "attachment;filename=" +new String(fileName.getBytes("gb2312"), "iso8859-1"));
        //sheet 动态合并的行的集合
        List<Integer> mergeRows = new ArrayList<Integer>();
        //源数据
        List<ExcelReportPlanReachDto> souceList = createListData(mergeRows,map);

        // 建立新的sheet对象（excel的表单）
        Sheet sheet = workbook.createSheet(BasicDataConfig.gm_name+year+"年政府投资项目计划表");

        sheet.setDefaultColumnWidth(20);
        sheet.setDefaultRowHeightInPoints(20);

        // 在sheet里创建第一行
        Row row_0 = sheet.createRow(0);
        // 创建单元格并设置样式
        createCell(workbook,row_0, 0,"附件：",HorizontalAlignment.LEFT,VerticalAlignment.CENTER,(short)14,"",null,false);

        // 在sheet里创建第二行
        Row row_1 = sheet.createRow(1);
        // 创建单元格并设置样式
        createCell(workbook,row_1, 0,BasicDataConfig.gm_name+year+"年政府投资项目计划表",HorizontalAlignment.CENTER,VerticalAlignment.CENTER,(short)30,"",null,false);

        // 在sheet里创建第三行
        Row row_2 = sheet.createRow(2);
        // 创建单元格并设置样式
        createCell(workbook,row_2, 10,"单位：万元",HorizontalAlignment.RIGHT,VerticalAlignment.CENTER,(short)14,"",null,false);

        String[] tData1 = {"序号","项目单位","项目名称","项目类别","建设规模","总投资","累计安排","本计划申请投资","","主要内容","备注"};
        String[] tData2 = {"","","","","","","","国土","公共预算","",""};

        // 在sheet里创建第四行
        Row row_3 = sheet.createRow(3);
        createCell(tData1,row_3,workbook,HorizontalAlignment.CENTER,VerticalAlignment.CENTER,(short)14,"",HSSFFont.BOLDWEIGHT_BOLD,true);

        // 在sheet里创建第五行
        Row row_4 = sheet.createRow(4);
        createCell(tData2,row_4,workbook,HorizontalAlignment.CENTER,VerticalAlignment.CENTER,(short)14,"",HSSFFont.BOLDWEIGHT_BOLD,true);

        // 根据数据动态创建cell
        createCell(souceList,startRowNum,workbook,sheet,HorizontalAlignment.CENTER,VerticalAlignment.CENTER,(short)14,"",null,true);

        //合并列  CellRangeAddress构造参数依次表示起始行，截至行，起始列， 截至列
        mergeCell(sheet,1,1,0,10);
        mergeCell(sheet,3,3,7,8);
        //合并行
        mergeCell(sheet,3,4,0,0);
        mergeCell(sheet,3,4,1,1);
        mergeCell(sheet,3,4,2,2);
        mergeCell(sheet,3,4,3,3);
        mergeCell(sheet,3,4,4,4);
        mergeCell(sheet,3,4,5,5);
        mergeCell(sheet,3,4,6,6);
        mergeCell(sheet,3,4,9,9);
        mergeCell(sheet,3,4,10,10);
        //动态合并单元格
        mergeCell(workbook,sheet,mergeRows);

        //调整行高
        row_0.setHeight((short) (20* 20));
        row_1.setHeight((short) (35* 20));
        row_3.setHeight((short) (30* 20));
        row_4.setHeight((short) (30* 20));

        //调整列宽
        sheet.setColumnWidth(0,256*10);
        sheet.setColumnWidth(1,256*20);
        sheet.setColumnWidth(2,256*25);
        sheet.setColumnWidth(3,256*8);
        sheet.setColumnWidth(4,256*40);
        sheet.setColumnWidth(5,256*15);
        sheet.setColumnWidth(6,256*15);
        sheet.setColumnWidth(7,256*15);
        sheet.setColumnWidth(8,256*15);
        sheet.setColumnWidth(9,256*25);
        sheet.setColumnWidth(10,256*30);
    }

    //合并单元格
    private static void mergeCell(Workbook wb,Sheet sheet,List<Integer> mergeRows){
        for (Integer  rowNum :  mergeRows) {
            //获取要合并的单元格的值
           String value = sheet.getRow(rowNum).getCell(1).getStringCellValue();
            CellStyle cs = null;
            if(rowNum == startRowNum){
                mergeCell(sheet,rowNum,rowNum,0,1);
                cs = createCellStyle(wb,HorizontalAlignment.CENTER,VerticalAlignment.CENTER,true);
            }else{
                mergeCell(sheet,rowNum,rowNum,0,4);
                cs = createCellStyle(wb,HorizontalAlignment.LEFT,VerticalAlignment.CENTER,true);
            }
            cs.setFont(createFont(wb,(short)18,"",HSSFFont.BOLDWEIGHT_BOLD));
            //设置合并后的单元格的值
            sheet.getRow(rowNum).getCell(0).setCellValue(value);
            //设置合并后的单元格的样式
            sheet.getRow(rowNum).getCell(0).setCellStyle(cs);
            sheet.getRow(rowNum).setHeight((short) (30* 20));
        }
    }

    //合并单元格
    private static void mergeCell(Sheet sheet,int startRowNum,int endRowNum,int startColum,int endColum){
        sheet.addMergedRegion(new CellRangeAddress(startRowNum, endRowNum, startColum, endColum));
    }


    //共计标识
    private static final Integer all_sum_data = 0;
    //分类合计标识
    private static final Integer parten_sum_data = 1;
    //普通数据标识
    private static final Integer nomarl_data = 2;
    //sheet 数据展示起始行
    private static final Integer startRowNum = 5;

    /**
     * 处理查询数据
     * @param mergeRows  过滤出将要合并的row
     * @param map        源数据
     * @return
     */
    private static  List<ExcelReportPlanReachDto> createListData(List<Integer> mergeRows,Map<String, Object> map){
        List<ExcelReportPlanReachDto> list = (List<ExcelReportPlanReachDto>)map.get("data");
        int rowNum = 1;
        int startRowNum_Temp = startRowNum;
        for (ExcelReportPlanReachDto dto : list) {
            Integer orderNum = dto.getOrderNum();

            if(orderNum !=null && orderNum.equals(all_sum_data)){
                dto.setConstructionUnit("合计");
                dto.setProjectIndustryDesc("");
                mergeRows.add(startRowNum_Temp);
            }

            if(orderNum !=null && orderNum.equals(parten_sum_data)){
                dto.setConstructionUnit(dto.getProjectIndustryDesc());
                dto.setProjectIndustryDesc("");
                mergeRows.add(startRowNum_Temp);
            }

            if(orderNum !=null && orderNum.equals(nomarl_data)){
                dto.setRowNum(rowNum+"");
                rowNum++;
            }
            startRowNum_Temp ++;
        }
        return list;
    }

    /**
     * 设置单元格样式
     * @param wb HSSFWorkbook
     * @param ha 水平位置
     * @param va 垂直位置
     * @return
     */
    private static CellStyle createCellStyle(
            Workbook wb,HorizontalAlignment ha,VerticalAlignment va,boolean isBorder){
        CellStyle cs = wb.createCellStyle();
        //水平居中
        if(ha!=null)cs.setAlignment(ha);
        //垂直居中
        if(va!=null)cs.setVerticalAlignment(va);
        //设置边框
        if(isBorder){
            cs.setBorderBottom(CellStyle.BORDER_THIN);
            cs.setBorderTop(CellStyle.BORDER_THIN);
            cs.setBorderRight(CellStyle.BORDER_THIN);
            cs.setBorderLeft(CellStyle.BORDER_THIN);
        }
        //设置单元格内容自动换行
        cs.setWrapText(true);
        return cs;
    }

    /**
     * 设置字体样式
     * @param wb  HSSFWorkbook
     * @param fontHeight 字体高度
     * @param fontName 字体颜色
     * @param fontCs 字体加粗
     * @return
     */
    private static Font createFont(Workbook wb,Short fontHeight,String fontName,Short fontCs){
        Font font = wb.createFont();
        //设置字体高度
        if(fontHeight!=null)font.setFontHeightInPoints(fontHeight);
        //设置字体颜色
        if(fontName!=null)font.setFontName(fontName);
        //设置字体加粗
        if(fontCs!=null)font.setBoldweight(fontCs);
        return font;
    }


    /**
     * 创建单元格
     * @param wb    HSSFWorkbook
     * @param row   excel 行
     * @param cellNumber  单元格下标
     * @param value   单元格值
     * @param ha	     单元格样式  HorizontalAlignment
     * @param va      单元格样式  VerticalAlignment
     * @param fontHeight 字体高度
     * @param fontName   字体颜色
     * @param isBorder   单元格是否设置边框
     */
    private static void createCell(Workbook wb,
                                   Row row,
                                   int cellNumber,
                                   Object value,
                                   HorizontalAlignment ha,
                                   VerticalAlignment va,
                                   Short fontHeight,
                                   String fontName,
                                   Short fontCs,
                                   boolean isBorder){
        //创建单元格
        Cell cell=row.createCell(cellNumber);
        //根据参数类型设置cell值
        if(value !=null && value.getClass().getTypeName().equals("java.lang.String")){
            String endValue = (String)value;
            cell.setCellValue(endValue);
        }else if(value !=null && value.getClass().getTypeName().equals("java.lang.Integer")){
            Integer endValue = (Integer)value;
            cell.setCellValue(endValue);
        }else if(value !=null && value.getClass().getTypeName().equals("java.lang.Double")){
            Double endValue = (Double)value;
            cell.setCellValue(endValue);
        }
        //创建单元格样式
        CellStyle cs = createCellStyle(wb,ha,va,isBorder);
        //创建字体样式
        Font font = createFont(wb,fontHeight,fontName,fontCs);
        cs.setFont(font);
        //设置列样式
        cell.setCellStyle(cs);
    }


    /**
     * 根据 String[]类型 数据 创建单元格
     * @param data  数据 String[] 类型
     * @param row   excel 行
     * @param wb    workbook
     * @param ha    HorizontalAlignment 水平样式
     * @param va    VerticalAlignment  上下样式
     * @param fontHeight 字体高度
     * @param fontName   字样格式
     * @param fontCs     字体样式
     * @param isBorder   是否带边框
     */
    private static void createCell(String[] data,
                                   Row row,
                                   Workbook wb,
                                   HorizontalAlignment ha,
                                   VerticalAlignment va,
                                   Short fontHeight,
                                   String fontName,
                                   Short fontCs,
                                   boolean isBorder){
        for (int i = 0; i < data.length; i++) {
            String value = data[i];
            createCell(wb,row,i,value,ha,va,fontHeight,fontName,fontCs,isBorder);
        }
    }

    /**
     * 根据 索引、数据 创建单元格
     * @param data  数据 String 类型
     * @param index 单元格索引
     * @param row   excel 行
     * @param wb    workbook
     * @param ha    HorizontalAlignment 水平样式
     * @param va    VerticalAlignment  上下样式
     * @param fontHeight 字体高度
     * @param fontName   字样格式
     * @param fontCs     字体样式
     * @param isBorder   是否带边框
     */
    private static void createCell(String data,
                                   int index,
                                   Row row,
                                   Workbook wb,
                                   HorizontalAlignment ha,
                                   VerticalAlignment va,
                                   Short fontHeight,
                                   String fontName,
                                   Short fontCs,
                                   boolean isBorder){
            if(data == null) data = new String("");
            createCell(wb,row,index,data,ha,va,fontHeight,fontName,fontCs,isBorder);
    }

    /**
     * 根据 索引、数据 创建单元格
     * @param data  数据 Double 类型
     * @param index 单元格索引
     * @param row   excel 行
     * @param wb    workbook
     * @param ha    HorizontalAlignment 水平样式
     * @param va    VerticalAlignment  上下样式
     * @param fontHeight 字体高度
     * @param fontName   字样格式
     * @param fontCs     字体样式
     * @param isBorder   是否带边框
     */
    private static void createCell(Double data,
                                   int index,
                                   Row row,
                                   Workbook wb,
                                   HorizontalAlignment ha,
                                   VerticalAlignment va,
                                   Short fontHeight,
                                   String fontName,
                                   Short fontCs,
                                   boolean isBorder){
        if(data == null) data = new Double(0);
        createCell(wb,row,index,data,ha,va,fontHeight,fontName,fontCs,isBorder);
    }

    /**
     * 根据 索引、数据 创建单元格
     * @param data  数据 Integer类型
     * @param index 单元格索引
     * @param row   excel 行
     * @param wb    workbook
     * @param ha    HorizontalAlignment 水平样式
     * @param va    VerticalAlignment  上下样式
     * @param fontHeight 字体高度
     * @param fontName   字样格式
     * @param fontCs     字体样式
     * @param isBorder   是否带边框
     */
    private static void createCell(Integer data,
                                   int index,
                                   Row row,
                                   Workbook wb,
                                   HorizontalAlignment ha,
                                   VerticalAlignment va,
                                   Short fontHeight,
                                   String fontName,
                                   Short fontCs,
                                   boolean isBorder){
        if(data == null) data = new Integer(0);
        createCell(wb,row,index,data,ha,va,fontHeight,fontName,fontCs,isBorder);
    }

    /**
     * 根据数据动态生成cell
     * @param data  数据
     * @param startRowNum  开始行
     * @param wb    wookbook
     * @param sheet sheet
     * @param ha    HorizontalAlignment 水平样式
     * @param va    VerticalAlignment  上下样式
     * @param fontHeight 字体高度
     * @param fontName   字样格式
     * @param fontCs     字体样式
     * @param isBorder   是否带边框
     */
    private static void createCell(List<ExcelReportPlanReachDto> data,
                                   int startRowNum,
                                   Workbook wb,
                                   Sheet sheet,
                                   HorizontalAlignment ha,
                                   VerticalAlignment va,
                                   Short fontHeight,
                                   String fontName,
                                   Short fontCs,
                                   boolean isBorder){
        for (ExcelReportPlanReachDto dto : data) {
            Row row = sheet.createRow(startRowNum);
            createCell(dto.getRowNum(),0,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getConstructionUnit(),1,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getProjectName(),2,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getProjectCategoryDesc(),3,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getProjectGuiMo(),4,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getProjectInvestSum(),5,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getApInvestSum(),6,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getSqPlanReach_ggys(),7,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getSqPlanReach_gtzj(),8,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getPlanReachConstructionContent(),9,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            createCell(dto.getYearPlanRemark(),10,row,wb,ha,va,fontHeight,fontName,fontCs,isBorder);
            startRowNum++;
        }
    }

}
