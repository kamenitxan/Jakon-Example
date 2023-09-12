package example.pages

import cz.kamenitxan.jakon.core.custom_pages.{AbstractCustomPage, CustomPage}
import cz.kamenitxan.jakon.core.database.DBHelper
import cz.kamenitxan.jakon.webui.ObjectSettings
import example.service.PageService

import scala.collection.JavaConverters.*


@CustomPage
class IndexPage extends AbstractCustomPage {

	override protected def generate(): Unit = {
		DBHelper.withDbConnection(implicit conn => {
			val mainPages = PageService.getMainPages()
			val context = Map[String, AnyRef](
				"mainPages" -> mainPages.asJava,
				"currentUrl" -> "index.html",
				"page" -> mainPages.find(p => p.title == "Jakon").orNull
			)
			engine.render("content", "index", context)
		})
	}
}
