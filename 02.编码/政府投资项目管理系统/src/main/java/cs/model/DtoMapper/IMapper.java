package cs.model.DtoMapper;

public interface  IMapper<Dto,Entity> {
	public   Dto toDto(Entity entity);
	public  void buildEntity(Dto dto,Entity entity);
}
