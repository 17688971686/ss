package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.Commission;
/**
 * @Description: 评审委托书表
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
public class CommissionDto extends Commission{

	//begin#关联信息
		//附件信息
		private List<DatumDto> datumDtos=new ArrayList<>();

		public List<DatumDto> getDatumDtos() {
			return datumDtos;
		}

		public void setDatumDtos(List<DatumDto> datumDtos) {
			this.datumDtos = datumDtos;
		}
		
}
