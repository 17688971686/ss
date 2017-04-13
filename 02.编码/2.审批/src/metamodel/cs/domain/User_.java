package cs.domain;

import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.ListAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ extends cs.domain.DomainBase_ {

	public static volatile SingularAttribute<User, String> password;
	public static volatile SingularAttribute<User, Integer> loginFailCount;
	public static volatile SingularAttribute<User, String> displayName;
	public static volatile SingularAttribute<User, String> loginName;
	public static volatile ListAttribute<User, Role> roles;
	public static volatile SingularAttribute<User, String> comment;
	public static volatile SingularAttribute<User, String> id;
	public static volatile SingularAttribute<User, Date> lastLoginDate;
	public static volatile ListAttribute<User, Org> orgs;

}

