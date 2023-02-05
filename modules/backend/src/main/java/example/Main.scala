package example

import com.sun.org.slf4j.internal.LoggerFactory
import cz.kamenitxan.jakon.logging.Logger
import org.slf4j.LoggerFactory

/**
  * Created by Kamenitxan (kamenitxan@me.com) on 05.12.15.
  */
object Main {

	def main(args: Array[String]) = {
		Logger.info("Starting Jakon")
		val app = new JakonApp()
		app.run(args)
	}
}