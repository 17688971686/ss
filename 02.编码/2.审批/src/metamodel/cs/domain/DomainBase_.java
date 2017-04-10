package cs.domain;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(DomainBase.class)
public abstract class DomainBase_ {

	public static volatile SingularAttribute<DomainBase, Date> createdDate;
	public static volatile SingularAttribute<DomainBase, String> createdBy;
	public static volatile SingularAttribute<DomainBase, Integer> itemOrder;
	public static volatile SingularAttribute<DomainBase, Date> modifiedDate;
	public static volatile SingularAttribute<DomainBase, String> modifiedBy;

}

