package example.pages

import cz.kamenitxan.jakon.core.customPages.AbstractCustomPage
import cz.kamenitxan.jakon.core.customPages.CustomPage
import cz.kamenitxan.jakon.webui.ObjectSettings

@CustomPage
class PagesController extends AbstractCustomPage {

	// language=SQL
	private val MAIN_PAGES: String = "SELECT * FROM Page WHERE parent_id = null"

	override def generate() = {
	}

	override val objectSettings: ObjectSettings = null
}