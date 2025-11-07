package example.dynamic

import cz.kamenitxan.jakon.core.dynamic.{AbstractPagelet, Get, Pagelet, Post}
import io.javalin.http.Context
import org.slf4j.LoggerFactory

import scala.collection.mutable

@Pagelet(path = "/pagelet")
class ExamplePagelet extends AbstractPagelet {
	private val logger = LoggerFactory.getLogger(this.getClass)

	@Get(path = "/get", template = "pagelet/examplePagelet")
	def get(ctx: Context): mutable.Map[String, Any] = {
		val context = mutable.Map[String, Any](
			"pushed" -> "someValue"
		)
		context
	}

	@Post(path = "/post", template = "pagelet/examplePagelet")
	def post(ctx: Context, data: PageletData): mutable.Map[String, Any] = {
		val context = mutable.Map[String, Any](
			"pushed" -> "post done"
		)
		context
	}

}
