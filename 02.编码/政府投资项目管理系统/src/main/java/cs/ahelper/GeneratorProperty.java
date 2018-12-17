package cs.ahelper;

import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

import cs.common.Util;
import cs.domain.CodingProject;
import cs.domain.ShenBaoInfo;
import cs.domain.TaskHead;
import cs.model.DomainDto.SysConfigDto;

/**
 * @author Administrator
 * 手动生产mapper代码
 *
 */
public class GeneratorProperty {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		//System.out.println("roleName:"+Role_.roleName.getName());
	
		
//		Class<?> dto=CodingProject.class;
//		
//		Method[] methods=dto.getMethods();
//		Set<String> methods2=new HashSet<>();
//		
//		for (Method m : methods) {			
//			if(m.getName().contains("get")||m.getName().contains("set")){
//				if(m.getName()!="getClass"){
//					methods2.add(m.getName().replace("get", "").replace("set", ""));
//				}					
//			}
//					
//		}
//		for (String string : methods2) {
//			System.out.println(String.format("entity.set%s(dto.get%s());", string,string));
//			System.out.print(String.format(",t1.%s", string));
//		}

	}

}
