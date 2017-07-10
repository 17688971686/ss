package cs.domain.framework;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * @Description: 日志表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_log")
public class Log {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;	
	@Column(columnDefinition = "varchar(255) NOT NULL  COMMENT '用户ID'")
	private String userId;
	@Column(columnDefinition = "datetime NOT NULL COMMENT '创建时间'")
	private Date createdDate;
	@Column(columnDefinition = "varchar(255)  COMMENT '日志对象'")
	private String logger;
	@Column(columnDefinition = "varchar(255)  COMMENT '日志级别'")
	private String level;
	@Column(columnDefinition = "varchar(1000)  COMMENT '日志内容'")
	private String message;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public String getLogger() {
		return logger;
	}

	public void setLogger(String logger) {
		this.logger = logger;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	
}
