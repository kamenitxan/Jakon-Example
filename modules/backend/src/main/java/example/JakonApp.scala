package example

import cz.kamenitxan.jakon.JakonInit
import cz.kamenitxan.jakon.core.database.DBHelper
import cz.kamenitxan.jakon.core.model.{Category, Post}
import example.entity.DocsPage

class JakonApp extends JakonInit{

	override def daoSetup(): Unit = {
		super.daoSetup()
		DBHelper.addDao(classOf[Category])
		DBHelper.addDao(classOf[Post])
		DBHelper.addDao(classOf[DocsPage])
	}

}
