package cs.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Org.class)
public abstract class Org_ extends cs.domain.DomainBase_ {

	public static volatile SingularAttribute<Org, String> name;
	public static volatile SingularAttribute<Org, String> comment;
	public static volatile SingularAttribute<Org, String> id;
	public static volatile SingularAttribute<Org, String> orgIdentity;
	public static volatile ListAttribute<Org, User> users;

}

