package cs.common;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;

import org.apache.log4j.Logger;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.sn.framework.common.IdWorker;

import cs.domain.Attachment;

public class DocUtil {
	
	private static Logger logger = Logger.getLogger(DocUtil.class);
	
	@SuppressWarnings("resource")
	public static Attachment createDoc(String projectName,String projectShenbaoStage)throws Exception 
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
	      String fileName=projectName+projectShenbaoStageName+"正文.docx";
	      String randomName =  Util.generateFileName(fileName);
	      //Create file system using specific name
	      FileOutputStream out = new FileOutputStream(
	      new File("D:\\work\\test\\java1\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\framework-0.0.1-SNAPSHOT\\contents\\upload\\"+fileName+".docx"));
	      //write operation workbook using file out object 
	      workbook.write(out);
	      out.close();
	      
	      Attachment att = new Attachment();
	      att.setId(IdWorker.get32UUID());
	      att.setName(fileName);
	      att.setUrl(randomName);
	      att.setItemOrder(0);
	      att.setCreatedDate(new Date());
	      att.setType("zhengwenFile");
	      logger.info(fileName+".docx 正文创建成功！");
	      return att;
	     
	   }
}
//public static void createDoc(String projectName,String projectShenbaoStage)throws Exception 