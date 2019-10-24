package example

import cz.kamenitxan.jakon.JakonInit
import cz.kamenitxan.jakon.core.Director
import cz.kamenitxan.jakon.core.controler.PageControler
import cz.kamenitxan.jakon.core.database.DBHelper
import cz.kamenitxan.jakon.core.model.{Category, Page, Post}

class JakonApp extends JakonInit{

	override def daoSetup(): Unit = {
		super.daoSetup()
		DBHelper.addDao(classOf[Category])
		DBHelper.addDao(classOf[Post])
		DBHelper.addDao(classOf[Page])
	}

	override def adminControllers(): Unit = {
		super.adminControllers()
	}
}
