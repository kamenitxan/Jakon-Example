package example.pages

import cz.kamenitxan.jakon.core.customPages.{AbstractCustomPage, AbstractStaticPage, CustomPage, StaticPage}
import cz.kamenitxan.jakon.webui.ObjectSettings

@CustomPage
class IndexPage extends AbstractCustomPage {
	override val objectSettings: ObjectSettings = null

	override protected def generate(): Unit = {
		val context = Map[String, AnyRef]()
		engine.render("content", "index", context)
	}
}
