package example.dynamic

import java.sql.Connection

import cz.kamenitxan.jakon.core.dynamic.{AbstractPagelet, Get, Pagelet}
import spark.{Request, Response}

import scala.collection.mutable

@Pagelet(path = "/authorized", authRequired = true)
class AuthorizedPagelet extends AbstractPagelet {

	@Get(path = "/get", template = "pagelet/examplePagelet")
	def get(req: Request, res: Response, conn: Connection): mutable.Map[String, Any] = {
		val context = mutable.Map[String, Any](
			"pushed" -> "authorized"
		)
		context
	}


}
