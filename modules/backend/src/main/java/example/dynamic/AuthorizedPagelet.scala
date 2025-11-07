package example.dynamic

import cz.kamenitxan.jakon.core.dynamic.{AbstractPagelet, Get, Pagelet}
import io.javalin.http.Context

import scala.collection.mutable

@Pagelet(path = "/authorized", authRequired = true)
class AuthorizedPagelet extends AbstractPagelet {

	@Get(path = "/get", template = "pagelet/examplePagelet")
	def get(ctx: Context): mutable.Map[String, Any] = {
		val context = mutable.Map[String, Any](
			"pushed" -> "authorized"
		)
		context
	}


}
