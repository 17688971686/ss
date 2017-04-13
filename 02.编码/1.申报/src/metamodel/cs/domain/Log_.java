package cs.domain;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Log.class)
public abstract class Log_ {

	public static volatile SingularAttribute<Log, Date> createdDate;
	public static volatile SingularAttribute<Log, String> level;
	public static volatile SingularAttribute<Log, String> logger;
	public static volatile SingularAttribute<Log, Long> id;
	public static volatile SingularAttribute<Log, String> message;
	public static volatile SingularAttribute<Log, String> userId;

}

