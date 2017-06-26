package cs.model.DtoMapper;

public interface  IMapper<Dto,Entity> {
	public   Dto toDto(Entity entity);
	public  Entity buildEntity(Dto dto,Entity entity);
}
