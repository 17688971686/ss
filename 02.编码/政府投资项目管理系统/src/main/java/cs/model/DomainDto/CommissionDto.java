package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.Commission;

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
