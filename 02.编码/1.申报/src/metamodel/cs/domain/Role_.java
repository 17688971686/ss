package cs.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Role.class)
public abstract class Role_ extends cs.domain.DomainBase_ {

	public static volatile SingularAttribute<Role, String> roleName;
	public static volatile ListAttribute<Role, Resource> resources;
	public static volatile SingularAttribute<Role, String> comment;
	public static volatile SingularAttribute<Role, String> id;
	public static volatile ListAttribute<Role, User> users;

}

