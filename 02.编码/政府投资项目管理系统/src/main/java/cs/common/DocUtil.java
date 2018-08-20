package cs.common;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import com.sn.framework.common.IdWorker;

import cs.domain.Attachment;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletResponse;

public class DocUtil {

	private static Logger logger = Logger.getLogger(DocUtil.class);

	@Value("${sourceUrl}")
	private static String sourceUrl;//
	@Value("${diskUrl}")
	private static String diskUrl;//
	
	@SuppressWarnings("resource")
	public static Attachment createDoc(String projectName, String projectShenbaoStage) throws Exception {
		// Create Blank workbook
		String projectShenbaoStageName = null;
		XSSFWorkbook workbook = new XSSFWorkbook();
		if (projectShenbaoStage.equals(BasicDataConfig.projectShenBaoStage_KXXYJBG)) {
			projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_KXXYJBG_name;
		} else if (projectShenbaoStage.equals(BasicDataConfig.projectShenBaoStage_CBSJGS)) {
			projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_CBSJGS_name;
		} else {
			projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_ZJSQBG_name;
		}
		String fileName = projectName + projectShenbaoStageName + "正文";
		String randomName = Util.generateFileName(fileName);
		// 本地
		// String sourceUrl="D:\\work\\test\\java1\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\framework-0.0.1-SNAPSHOT\\contents\\upload\\template.docx";
		
		// 6200
//		String sourceUrl = "C:\\web_server\\tomcat\\apache-tomcat-9.0.0.M19\\gmOnlineProjectManage9314\\ROOT\\contents\\upload\\template.docx";
		File sourceFile = new File(sourceUrl);
		// 本地
		// String diskUrl ="D:\\work\\test\\java1\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\framework-0.0.1-SNAPSHOT\\contents\\upload\\";
		
		// 6200
//		String diskUrl = "C:\\web_server\\tomcat\\apache-tomcat-9.0.0.M19\\gmOnlineProjectManage9314\\ROOT\\contents\\upload\\";
		String filename = randomName + ".docx";
		String destUrl = diskUrl + filename;

		File destFile = new File(destUrl);

		FileUtils.copyFile(sourceFile, destFile);

		Attachment att = new Attachment();
		att.setId(IdWorker.get32UUID());
		att.setName(filename);
		att.setUrl(filename);
		att.setItemOrder(0);
		att.setCreatedDate(new Date());
		att.setType("zhengwenFile");
		logger.info(fileName + ".docx 正文创建成功！");
		return att;

	}
}