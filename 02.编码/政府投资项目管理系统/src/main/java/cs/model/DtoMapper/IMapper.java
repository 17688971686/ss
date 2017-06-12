package cs.model.DtoMapper;

public interface  IMapper<Dto,Entity> {
	public   Dto toDto(Entity entity);
}
