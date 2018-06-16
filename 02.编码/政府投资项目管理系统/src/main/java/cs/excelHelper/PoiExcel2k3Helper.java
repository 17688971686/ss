package cs.excelHelper;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
  
import org.apache.poi.hssf.usermodel.HSSFSheet;  
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Workbook;

/** 
 * Excel 97-2003
 * @author leitao
 * @note    PoiExcel2k3Helper 
 */  
public class PoiExcel2k3Helper extends PoiExcelHelper{

    public static final String FILE_NAME_SUFFIX = "xls";

    @Override
    protected Workbook getWorkBookInstance(String filePath) throws IOException {
        return new HSSFWorkbook(new FileInputStream(new File(filePath)));
    }

    public PoiExcel2k3Helper(String filePath) throws IOException {
        super(filePath);
    }
}
