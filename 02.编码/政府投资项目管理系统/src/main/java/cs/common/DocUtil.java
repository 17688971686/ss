package cs.common;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import com.sn.framework.common.IdWorker;

import cs.domain.Attachment;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletResponse;

public class DocUtil {
	
    private static Logger logger = Logger.getLogger(DocUtil.class);


//    private static void copyFileUsingApacheCommonsIO(File source, File dest)
//            throws IOException {
//        FileUtils.copyFile(source, dest);
//
//    }
	@SuppressWarnings("resource")
	public static Attachment createDoc(String projectName, String projectShenbaoStage)throws Exception
	   {
	      //Create Blank workbook
		String projectShenbaoStageName =null;
	      XSSFWorkbook workbook = new XSSFWorkbook();
	      if(projectShenbaoStage.equals(BasicDataConfig.projectShenBaoStage_KXXYJBG)){
	    	  projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_KXXYJBG_name;
	      }else if(projectShenbaoStage.equals(BasicDataConfig.projectShenBaoStage_CBSJGS)){
	    	  projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_CBSJGS_name;
	      }else{
	    	  projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_ZJSQBG_name;
	      }
	      String fileName=projectName+projectShenbaoStageName+"正文";
	      String randomName =  Util.generateFileName(fileName);
	      //Create file system using specific name

           String sourceUrl = "C:\\web_server\\tomcat\\apache-tomcat-9.0.0.M19\\gmOnlineProjectManage9314\\ROOT\\contents\\upload\\templet.docx";
           File sourceFile = new File(sourceUrl);

           String diskUrl = "C:\\web_server\\tomcat\\apache-tomcat-9.0.0.M19\\gmOnlineProjectManage9314\\ROOT\\contents\\upload\\";
           String filename = randomName+".docx";
           String destUrl = diskUrl+filename;

           File destFile = new File(destUrl);

           FileUtils.copyFile(sourceFile, destFile);

           Attachment att = new Attachment();
	      att.setId(IdWorker.get32UUID());
	      att.setName(filename);
	      att.setUrl(filename);
	      att.setItemOrder(0);
	      att.setCreatedDate(new Date());
	      att.setType("zhengwenFile");
	      logger.info(fileName+".docx 正文创建成功！");
	      return att;

	   }
}