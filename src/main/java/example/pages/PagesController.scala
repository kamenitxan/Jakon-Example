package example.pages

import cz.kamenitxan.jakon.core.customPages.AbstractCustomPage
import cz.kamenitxan.jakon.core.customPages.CustomPage
import cz.kamenitxan.jakon.core.database.DBHelper
import cz.kamenitxan.jakon.core.model.Page
import cz.kamenitxan.jakon.webui.ObjectSettings
import example.service.PageService

import scala.collection.JavaConverters._

@CustomPage
class PagesController extends AbstractCustomPage {



	override def generate() = {
		DBHelper.withDbConnection(implicit conn => {
			val mainPages = PageService.getMainPages().asJava
			mainPages.forEach(page => {
				val context = Map[String, AnyRef](
					"mainPages" -> mainPages,
					"page" -> page
				)
				engine.render("content", s"${page.url}", context)
			})
		})
	}

	override val objectSettings: ObjectSettings = null
}