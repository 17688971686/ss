package cs.common;

import java.io.File;
import java.util.Date;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

import com.sn.framework.common.IdWorker;

import cs.domain.Attachment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class DocUtil {

	private static Logger logger = Logger.getLogger(DocUtil.class);

	 private static String diskPath;
	 
	 @Value("${diskPath}")
	 public void getStaticBean(String a){
		 diskPath = a;
	 }
	 
	public static  Attachment createDoc(String projectName, String projectShenbaoStage) throws Exception {
		// Create Blank workbook
		String projectShenbaoStageName = null;
		if (projectShenbaoStage.equals(BasicDataConfig.projectShenBaoStage_KXXYJBG)) {
			projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_KXXYJBG_name;
		} else if (projectShenbaoStage.equals(BasicDataConfig.projectShenBaoStage_CBSJGS)) {
			projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_CBSJGS_name;
		} else if (projectShenbaoStage.equals(BasicDataConfig.projectShenBaoStage_ZJSQBG)){
			projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_ZJSQBG_name;
		}else {
			projectShenbaoStageName = BasicDataConfig.projectShenBaoStage_oncePlanReach_name;
		}
		String fileName = projectName + projectShenbaoStageName + "正文";
		String randomName = Util.generateFileName(fileName);
		
		String sourceUrl=diskPath+"\\template.doc";
		String diskUrl =diskPath+"\\";
		
		File sourceFile = new File(sourceUrl);
		
		String filename = randomName + ".doc";
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
		logger.info(fileName + ".doc 正文创建成功！");
		return att;

	}
}