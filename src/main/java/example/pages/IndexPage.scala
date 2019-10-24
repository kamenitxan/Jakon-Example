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
			val context = Map[String, AnyRef](
				"mainPages" -> PageService.getMainPages().asJava
			)
			engine.render("content", "index", context)
		})
	}
}
