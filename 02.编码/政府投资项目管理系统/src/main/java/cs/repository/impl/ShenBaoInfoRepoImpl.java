package cs.repository.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Repository;

import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.repository.odata.ODataObjNew;
import cs.repository.odata.OdataFilter;
import cs.repository.odata.OdataFilter.Operate;
/**
 * @Description: 申报信息持久层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Repository
public class ShenBaoInfoRepoImpl extends AbstractRepository<ShenBaoInfo	, String> {

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<ShenBaoInfo> findByOdata2(ODataObjNew odataObj, List<String> processIds) {
	logger.debug("findByOdata2");	
		
		List<OdataFilter> idsFilter = new ArrayList<OdataFilter>(processIds.size());
		processIds.forEach(x -> {
			idsFilter.add(new OdataFilter(ShenBaoInfo_.zong_processId.getName(), Operate.EQ, x));
		});
		OdataFilter orFilter = new OdataFilter(null, Operate.OR, idsFilter);
		odataObj.addFilter(orFilter);
		
		return odataObj.createQuery(getSession(), ShenBaoInfo.class).list();
	}

}
