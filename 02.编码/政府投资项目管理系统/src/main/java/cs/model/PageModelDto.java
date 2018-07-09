package cs.model;

import java.util.List;

public class PageModelDto<T> {
	private List<T> value;
	private int count;
	public List<T> getValue() {
		return value;
	}
	public void setValue(List<T> value) {
		this.value = value;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}

	public PageModelDto() {
	}

	public PageModelDto(List<T> value) {
		this.value = value;
		if (value != null) {
			this.count = value.size();
		}
	}

	public PageModelDto(List<T> value, int count) {
		this.value = value;
		this.count = count;
	}
}
