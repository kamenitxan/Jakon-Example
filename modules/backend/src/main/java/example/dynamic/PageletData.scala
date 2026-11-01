package example.dynamic

import cz.kamenitxan.jakon.validation.validators.{Min, NotEmpty}

import scala.compiletime.uninitialized


class PageletData {
	@NotEmpty
	@Min(value = 10)
	var name: String = uninitialized
}
