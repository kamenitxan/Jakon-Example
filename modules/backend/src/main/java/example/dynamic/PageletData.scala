package example.dynamic

import cz.kamenitxan.jakon.validation.validators.{Min, NotEmpty}


class PageletData {
	@NotEmpty
	@Min(value = 10)
	var name: String = _
}
