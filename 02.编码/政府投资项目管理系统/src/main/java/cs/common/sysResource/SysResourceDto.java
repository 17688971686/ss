package cs.common.sysResource;

import java.util.ArrayList;
import java.util.List;

/**
 * 系统资源表
 * @author Administrator
 * 
	 */
public class SysResourceDto {
	/**
	 * id
	 */
	private String id;
	/**
	 * 锁
	 */
	private boolean checked;
	/**
	 * 子资源
	 */
	private List<SysResourceDto> children=new ArrayList<>();
	/**
	 * 资源名
	 */
	private String name;	
	/**
	 * 资源路径
	 */
	private String path;
	/**
	 * 方法
	 */
	private String method;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public boolean isChecked() {
		return checked;
	}
	public void setChecked(boolean checked) {
		this.checked = checked;
	}
	public List<SysResourceDto> getChildren() {
		return children;
	}
	public void setChildren(List<SysResourceDto> children) {
		this.children = children;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}
	
}
