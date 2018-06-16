package cs.excelHelper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;  
  
/** 
 * Excel 2007+
 * @author leitao
 * @note    PoiExcel2k7Helper 
 */
public class PoiExcel2k7Helper extends PoiExcelHelper {

    public static final String FILE_NAME_SUFFIX = "xlsx";

    @Override
    protected Workbook getWorkBookInstance(String filePath) throws IOException {
        return new XSSFWorkbook(filePath);
    }

    public PoiExcel2k7Helper(String filePath) throws IOException {
        super(filePath);
    }
}
