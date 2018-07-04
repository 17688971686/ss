package cs.repository.odata;

import com.sn.framework.odata.impl.criteria.OdataCriteria;

import javax.servlet.http.HttpServletRequest;

/**
 * odata 解析对象
 */
public class ODataObjNew extends OdataCriteria {

	public ODataObjNew() {
	}

	public ODataObjNew(HttpServletRequest request) {
		super(request);
	}

	public ODataObjNew(String filter, String[] orderby) {
		super(filter, orderby);
	}

	public ODataObjNew(String filter, String[] orderby, boolean isCount, int skip, int top) {
		super(filter, orderby, isCount, skip, top);
	}
}
