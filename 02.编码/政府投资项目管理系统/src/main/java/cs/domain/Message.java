package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * @Description: 信息表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_message")
public class Message extends BaseEntity {

	@Id
	private String id;
	@Column(columnDefinition="varchar(500) NULL COMMENT '内容'")
	private String content;
	
	@Column(columnDefinition="bit NULL COMMENT '是否已读'")
	private Boolean isRead;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '所属用户名'")
	private String userName;
}
