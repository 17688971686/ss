package cs.ahelper;

import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

import cs.domain.Project;
import cs.domain.ShenBaoInfo;
import cs.domain.UserUnitInfo;
import cs.domain.framework.Role_;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.UnitInfoDto;
import cs.model.Portal.ArticleDto;
import cs.model.framework.RoleDto;

public class GeneratorProperty {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//System.out.println("roleName:"+Role_.roleName.getName());
	
		
		Class<?> dto=ShenBaoInfo.class;
		
		Method[] methods=dto.getMethods();
		Set<String> methods2=new HashSet<>();
		
		for (Method m : methods) {			
			if(m.getName().contains("get")||m.getName().contains("set")){
				if(m.getName()!="getClass"){
					methods2.add(m.getName().replace("get", "").replace("set", ""));
				}					
			}
					
		}
		for (String string : methods2) {
			System.out.println(String.format("shenBaoInfoDto.set%s(entity.get%s());", string,string));
		}
	}

}
