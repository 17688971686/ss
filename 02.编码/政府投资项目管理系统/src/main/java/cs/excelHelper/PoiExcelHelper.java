package cs.excelHelper;
/**
 * Excel 2003 2007
 *
 * @author leitao
 * @note PoiExcelHelper
 */

import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.*;

public abstract class PoiExcelHelper {

    private Workbook workbook;

    public PoiExcelHelper(String filePath) throws IOException {
        this.workbook = getWorkBookInstance(filePath);
    }

    protected abstract Workbook getWorkBookInstance(String filePath) throws IOException;

    /**
     * 获得文档包含的所有sheet的名字
     *
     * @return
     */
    public List<String> getSheetNames() {
        List<String> names = new ArrayList();
        for (Sheet sheet : workbook) {
            names.add(sheet.getSheetName());
        }
        return names;
    }

    /**
     * 根据Sheet名获得Sheet实例
     *
     * @param name Sheet名
     * @return org.apache.poi.ss.usermodel.Sheet
     */
    public Sheet getSheet(String name) {
        return workbook.getSheet(name);
    }

    /**
     * 根据sheet所在的index获得Sheet实例
     *
     * @param index Sheet indx
     * @return org.apache.poi.ss.usermodel.Sheet
     */
    public Sheet getSheet(int index) {
        return workbook.getSheetAt(index);
    }

    /**
     * 获得Index为0的Sheet实例
     *
     * @return org.apache.poi.ss.usermodel.Sheet
     */
    public Sheet getSheet() {
        return getSheet(0);
    }

    public Row getRow(int rowNum, Sheet sheet) {
        return sheet.getRow(rowNum);
    }

    public Row getRow(int rowNum) {
        return getRow(rowNum, getSheet());
    }

    public List<Row> getRows(int start, int end, Sheet sheet) {
        List<Row> rows = new ArrayList<>();
        for (int i = start; i < end; i++) {
            rows.add(sheet.getRow(i));
        }
        return rows;
    }

    public List<Row> getRows(int start, int end) {
        return getRows(start, end, getSheet(0));
    }

    public List<Row> getRows(int start, int end, int sheetIndex) {
        return getRows(start, end, getSheet(sheetIndex));
    }

    public List<Row> getRows(int start, int end, String sheetName) {
        return getRows(start, end, getSheet(sheetName));
    }

    public List<Cell> getCells(int start, int end, Row row) {
        List<Cell> cells = new ArrayList<>();
        for (int i = start; i < end; i++) {
            cells.add(row.getCell(i));
        }
        return cells;
    }

    public List<Cell> getCells(int end, Row row) {
        return getCells(0, end, row);
    }

    /**
     * 判断有数据的最后一行
     *
     * 根据一行中500列以内是否有值来判断该行是否为空，当一行为空，则判断该行为最后一行
     *
     * @param sheet
     * @return
     */
    public int getLastRowNum(Sheet sheet) {
        int rowNum = 0;
        while (true) {
            Row row = sheet.getRow(rowNum);

            if (!isRowNotEmpty(row))
                return rowNum;
            rowNum++;
        }
    }

    public int getLastRowNum(){
        return getLastRowNum(getSheet());
    }

    public boolean isRowNotEmpty(Row row) {
        for (int i = 0; i < 500; i++) {
            Cell cell = row.getCell(i);
            if (StringUtils.isNotBlank(getCellValue(cell))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param row
     * @param column
     *            a excel column string like 'A', 'C' or "AA". 
     * @return
     */
    protected String getCellValue(Row row, String column) {
        return getCellValue(row, getColumnNumber(column));
    }

    /**
     *
     * @param row
     * @param col
     *            a excel column index from 0 to 65535 
     * @return
     */
    private String getCellValue(Row row, int col) {
        if (row == null) {
            return "";
        }
        Cell cell = row.getCell(col);
        return getCellValue(cell);
    }

    /**
     *
     * @param cell
     * @return
     */
    public String getCellValue(Cell cell) {
        NumberFormat nf = new DecimalFormat("0.######");

        if (cell == null) {
            return "";
        }
        String value = null;
        try {
            if (cell.getCellType() == Cell.CELL_TYPE_FORMULA) {
                try {
                    value = nf.format(cell.getNumericCellValue());
                    Float.parseFloat(value);
                    value = value.replaceAll("\\.0$", "");
                    value = value.replaceAll("\\.0+$", "");
                } catch (Exception e) {
                    value = String.valueOf(cell.getRichStringCellValue());
                }
            } else if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                Date date = cell.getDateCellValue();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                value = sdf.format(date);
            } else if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
                value = nf.format(cell.getNumericCellValue());
            } else {
                value = cell.getStringCellValue();
            }
            return value;
        } catch (NumberFormatException ex) {
            return value;
        }
    }

    /**
     * Change excel column letter to integer number 
     *
     * @param columns
     *            column letter of excel file, like A,B,AA,AB 
     * @return
     */
    private int[] getColumnNumber(String[] columns) {
        int[] cols = new int[columns.length];
        for (int i = 0; i < columns.length; i++) {
            cols[i] = getColumnNumber(columns[i]);
        }
        return cols;
    }

    /**
     * Change excel column letter to integer number 
     *
     * @param column
     *            column letter of excel file, like A,B,AA,AB 
     * @return
     */
    private int getColumnNumber(String column) {
        int length = column.length();
        short result = 0;
        for (int i = 0; i < length; i++) {
            char letter = column.charAt(i);
            int value = letter - 'A' + 1;
            result += value * Math.pow(26, length - i - 1);
        }
        return result - 1;
    }

    public Workbook getWorkbook() {
        return workbook;
    }
}
