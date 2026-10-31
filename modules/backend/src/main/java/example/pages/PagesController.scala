package example.pages

import cz.kamenitxan.jakon.core.custom_pages.{AbstractCustomPage, CustomPage}
import cz.kamenitxan.jakon.core.database.DBHelper
import example.pages.PagesController.year
import example.service.PageService

import java.time.LocalDate
import scala.jdk.CollectionConverters.*

@CustomPage
class PagesController extends AbstractCustomPage {

	override def generate(): Unit = {
		DBHelper.withDbConnection(implicit conn => {
			val mainPages = PageService.getMainPages().asJava
			val allPages = mainPages.asScala.flatMap(p => (p, "") +: p.children.asScala.toSeq.map(c => (c, p.url)))
			allPages.foreach((page, parentUrl) => {
				val context = Map[String, AnyRef](
					"mainPages" -> mainPages,
					"currentUrl" -> page.createUrl,
					"currentParentUrl" -> parentUrl,
					"page" -> page,
					"year" -> year
				)
				engine.render("content", s"${page.url}", context)
			})
		})
	}

}

object PagesController {
	private val year = Integer.valueOf(LocalDate.now.getYear)
}