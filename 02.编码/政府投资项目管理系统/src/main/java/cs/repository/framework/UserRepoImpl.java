package cs.repository.framework;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import cs.domain.framework.User;
import cs.domain.framework.User_;
import cs.repository.impl.AbstractRepository;
import cs.repository.odata.ODataObj;

@Repository
public class UserRepoImpl extends AbstractRepository<User, String> implements UserRepo {

	@SuppressWarnings({ "deprecation", "unchecked" })
	@Override
	public User findUserByName(String userName) {
		Criteria criteria = this.getSession().createCriteria(User.class);
		criteria.add(Restrictions.eq(User_.loginName.getName(), userName));
		List<User> users = criteria.list();
		if (users.size() > 0) {
			return users.get(0);
		} else {
			return null;
		}
	}

	@SuppressWarnings({ "deprecation", "unchecked" })
	@Override
	public List<User> getUsersNotIn(List<String> userIds, ODataObj oDataObj) {
		Criteria crit = this.getSession().createCriteria(User.class);
		userIds.forEach(x -> {
			crit.add(Restrictions.ne(User_.id.getName(), x));
		});

		List<User> list = oDataObj.buildQuery(crit).list();
		return list;
	}

	@SuppressWarnings({ "deprecation", "unchecked" })
	@Override
	public Set<String> getUserPermission(String userName) {
		Criteria crit = this.getSession().createCriteria(User.class);
		crit.add(Restrictions.eq(User_.loginName.getName(), userName));
		List<User> list = crit.list();		
		Set<String> permissions = new HashSet<>();
		if (list.size()>0) {
			User user = list.get(0);
			user.getRoles().forEach(x -> {
				x.getResources().forEach(y -> {
					permissions.add(y.getPath());
				});

			});
		}
		return permissions;
	}
}
