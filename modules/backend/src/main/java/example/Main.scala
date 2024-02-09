package example

import cz.kamenitxan.jakon.logging.Logger

/**
  * Created by Kamenitxan (kamenitxan@me.com) on 05.12.15.
  */
object Main {

	def main(args: Array[String]): Unit = {
		Logger.info("Starting Jakon")
		val app = new JakonApp()
		app.run(args)
	}
}