package example.entity

import cz.kamenitxan.jakon.core.model.Page

class DocsPage extends Page {
	override def createUrl: String = "page/" + title.replaceAll(" ", "_").toLowerCase
}
