package example.dynamic

import java.sql.Connection

import cz.kamenitxan.jakon.core.dynamic.{AbstractPagelet, Get, Pagelet, Post}
import org.slf4j.LoggerFactory
import spark.{Request, Response}

import scala.collection.mutable

@Pagelet(path = "/pagelet")
class ExamplePagelet extends AbstractPagelet {
	private val logger = LoggerFactory.getLogger(this.getClass)

	@Get(path = "/get", template = "pagelet/examplePagelet")
	def get(req: Request, res: Response, conn: Connection): mutable.Map[String, Any] = {
		val context = mutable.Map[String, Any](
			"pushed" -> "someValue"
		)
		context
	}

	@Post(path = "/post", template = "pagelet/examplePagelet")
	def post(req: Request, res: Response, conn: Connection, data: PageletData): mutable.Map[String, Any] = {
		val context = mutable.Map[String, Any](
			"pushed" -> "post done"
		)
		context
	}

}
