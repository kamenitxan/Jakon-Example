package example.service

import java.sql.Connection

import cz.kamenitxan.jakon.core.database.DBHelper
import cz.kamenitxan.jakon.core.model.Page

object PageService {
	// language=SQL
	private val MAIN_PAGES: String = "SELECT * FROM Page WHERE parent_id IS NULL"

	def getMainPages()(implicit conn: Connection): Seq[Page] = {
		val stmt = conn.createStatement()
		val mainPages = DBHelper.select(stmt, MAIN_PAGES, classOf[Page])
		stmt.close()
		mainPages.map(qr => {
			qr.entity.url = qr.entity.createUrl
			qr.entity
		})
	}
}
