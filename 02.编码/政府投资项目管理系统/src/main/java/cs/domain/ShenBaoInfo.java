package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
@Entity
@Table(name="cs_shenBaoInfo")
public class ShenBaoInfo extends BaseProject{
	@Id
	private String id;
	@OneToOne
	private ShenBaoUnitInfo bianZhiUnitInfo=new ShenBaoUnitInfo();
	@OneToOne
	private ShenBaoUnitInfo shenBaoUnitInfo=new ShenBaoUnitInfo();
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
}
