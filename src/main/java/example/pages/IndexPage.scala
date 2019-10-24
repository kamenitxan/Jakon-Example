package example.pages

import cz.kamenitxan.jakon.core.customPages.{AbstractCustomPage, AbstractStaticPage, CustomPage, StaticPage}
import cz.kamenitxan.jakon.core.database.DBHelper
import cz.kamenitxan.jakon.webui.ObjectSettings
import example.service.PageService

import scala.collection.JavaConverters._


@CustomPage
class IndexPage extends AbstractCustomPage {
	override val objectSettings: ObjectSettings = null

	override protected def generate(): Unit = {
		DBHelper.withDbConnection(implicit conn => {
			val mainPages = PageService.getMainPages()
			val context = Map[String, AnyRef](
				"mainPages" -> mainPages.asJava,
				"page" -> mainPages.find(p => p.title == "Jakon").orNull
			)
			engine.render("content", "index", context)
		})
	}
}
