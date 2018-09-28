package cs.service.impl;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.shiro.util.CollectionUtils;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sn.framework.common.IdWorker;

import cs.common.BasicDataConfig;
import cs.common.HttpClientUtils;
import cs.domain.CodingProject;
import cs.domain.CodingProject_;
import cs.domain.Project;
import cs.domain.Project_;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.model.DomainDto.CodingProjectDto;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.CodingPlatformService;

@Service
public class CodingPlatformServiceImpl extends AbstractServiceImpl<CodingProjectDto, CodingProject, String> implements CodingPlatformService{
	private static Logger logger = Logger.getLogger(CodingPlatformServiceImpl.class);
	public String access_token;
	public String GET_ACCESS_TOKEN = "http://203.91.46.83:9016/B/BasicApi/GetAccessToken?appid=" + BasicDataConfig.APPID + "&appsecret=" + BasicDataConfig.APPSECRET;
    @Autowired
    private IRepository<ShenBaoInfo, String> shenbaoInfoRepo;
    @Autowired
    private IRepository<Project, String> projectRepo;
    @Autowired
    private IRepository<CodingProject, String> codingProjectRepo;
    
	@SuppressWarnings("rawtypes")
	@Override
	@Transactional
	public String getAccessToken() {
		String str = HttpClientUtils.getHttpReturn(GET_ACCESS_TOKEN);
		Map mapTypes = JSON.parseObject(str);
		if(mapTypes.get("resultCode") != null && (int)mapTypes.get("resultCode") == 1){
			Map map = (Map) mapTypes.get("resultData");
			access_token = (String) map.get("accessToken");
		}
		
		// 更新session
//		HttpSession session = request.getSession(true);
//		session.setAttribute("access_token", access_token);
//		session.setMaxInactiveInterval(7200);

		return access_token;
	}

	@Override
	@Transactional
	public String getShenBaoInfoFromCoding(String  todaytime,String pageIndex) {
		
		if(access_token == null){
			getAccessToken();
		}
		
		String url1 = "http://203.91.46.83:9016/E/GovApi/GetGovernmentProjectData?todaytime="+todaytime+"&pageIndex="+pageIndex+"&Content-Type=application/json";
		String str = "";
        try {
        	// 把字符串转换为URL请求地址
            URL url = new URL(url1);    
            // 打开连接
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/4.0 (compatible; MSIE 5.0; Windows NT; DigExt)");//设置代理
            connection.setRequestMethod("POST");
            connection.setRequestProperty("authorSecret",BasicDataConfig.AUTHORSECRET);
            connection.setRequestProperty("accessToken",access_token);
            // 连接会话
            connection.connect();


            // 获取输入流,并指定字符集,如若不指定会有乱码问题
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream() , "utf-8"));
            String line;
            StringBuilder sb = new StringBuilder();
            // 循环读取流
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            // 关闭流
            br.close();
            // 断开连接
            connection.disconnect();
            str = sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("失败!");
        }
        return str;
      
	}
	
	@Override
	@Transactional
	public void saveAll(String str){
		// 创建JSON解析器
        JsonParser parser = new JsonParser(); 
		try {
			if(str != ""){
			
			JsonObject object = (JsonObject) parser.parse(str);
			
			if(object.get("resultCode").getAsInt() == 1){
				//獲取资源数组
				JsonArray array = object.get("resultData").getAsJsonArray();
				for (int i = 0; i < array.size(); i++) {
					
					JsonObject subObject = array.get(i).getAsJsonObject();
					
					//只保存光明新区和没有区号的项目 440309为光明编号
					if("440309".equals(subObject.get("BUILD_ADDRESS_DISTRICT").getAsString()) || subObject.get("BUILD_ADDRESS_DISTRICT").getAsString()==""){
						//查詢是否有同名項目
						Criterion criterion = Restrictions.eq(Project_.projectName.getName(), subObject.get("P_NAME").getAsString());
						List<Project> projects = projectRepo.findByCriteria(criterion);
						
						//如果有，更新項目編碼
						if(!CollectionUtils.isEmpty(projects)){
							for (Project project : projects) {
								if(subObject.get("COUNTRY_CODE").getAsString() != ""){
									project.setCountryNumber(subObject.get("COUNTRY_CODE").getAsString());
									project.setModifiedDate(new Date());
									projectRepo.save(project);
									
									Criterion criterion1 = Restrictions.eq(ShenBaoInfo_.projectId.getName(),project.getId());
									List<ShenBaoInfo> shenbaoinfos = shenbaoInfoRepo.findByCriteria(criterion1);
									for (ShenBaoInfo shenbaoinfo : shenbaoinfos) {
										shenbaoinfo.setCountryNumber(subObject.get("COUNTRY_CODE").getAsString());
										shenbaoInfoRepo.save(shenbaoinfo);
									}
								}
								
							}
						}
						//保存赋码项目
						Criterion criterion2 = Restrictions.eq(CodingProject_.COUNTRY_CODE.getName(),subObject.get("COUNTRY_CODE").getAsString());
						List<CodingProject> codingProjects = codingProjectRepo.findByCriteria(criterion2);
						if(!CollectionUtils.isEmpty(codingProjects)){
							CodingProjectDto cpDto = JSON.parseObject(subObject.toString(),CodingProjectDto.class);
							super.update(cpDto, codingProjects.get(0).getId());
						}else{
							CodingProject cp = JSON.parseObject(subObject.toString(),CodingProject.class);
							cp.setId(IdWorker.get32UUID());
							codingProjectRepo.save(cp);
						}
					}
				}
				
				
			}
			}
			
		} catch (Exception e){
			 e.printStackTrace();
		}finally {
			logger.info("賦碼對接結束");
		}
		
		
	}

	@Override
	public List<CodingProjectDto> findByDto(ODataObj odataObj) {
		// TODO Auto-generated method stub
		return null;
	}
}

//计划年度
//entity.setPlanYear(subObject.get("APPLY_YEAR").getAsInt());
////总投资
//entity.setProjectInvestSum(subObject.get("TOTAL_INVEST").getAsDouble());
////街道
//entity.setDivisionId(subObject.get("BUILD_ADDRESS_STREET").getAsString());
////详细地址
//entity.setProjectAddress(subObject.get("DETAILED_ADDRESS").getAsString());
////行业
//if(subObject.get("P_BUILD_TYPE").getAsInt() == 1){
//	entity.setProjectClassify(BasicDataConfig.zf_projectClassify_fj);
//}else if(subObject.get("P_BUILD_TYPE").getAsInt() == 2){
//	entity.setProjectClassify(BasicDataConfig.zf_projectClassify_sz);
//}else if(subObject.get("P_BUILD_TYPE").getAsInt() == 9){
//	entity.setProjectClassify(BasicDataConfig.zf_projectClassify_qt);
//}
////TODO 行业归口  无码表
////entity.setProjectIndustry(subObject.get("INDUSTRY").getAsString());
////建设规模及内容
//entity.setProjectGuiMo(subObject.get("CONTENT_SCALE").getAsString());
////项目建设必要性
//entity.setProjectConstrBasis(subObject.get("P_NECESSARY").getAsString());
////项目编码
//entity.setProjectNumber(subObject.get("COUNTRY_CODE").getAsString());
////项目负责人
//entity.setProjectRepName(subObject.get("P_PRINCIPAL").getAsString());
////项目负责人电话
//entity.setProjectRepMobile(subObject.get("P_PRINCIPAL_PHONE").getAsString());
