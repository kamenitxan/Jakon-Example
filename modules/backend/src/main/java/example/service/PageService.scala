package example.service

import java.sql.Connection
import cz.kamenitxan.jakon.core.database.DBHelper
import example.entity.DocsPage

object PageService {
	// language=SQL
	private val MAIN_PAGES: String = "SELECT * FROM DocsPage WHERE parent_id IS NULL"

	def getMainPages()(implicit conn: Connection): Seq[DocsPage] = {
		val stmt = conn.createStatement()
		val mainPages = DBHelper.select(stmt, MAIN_PAGES, classOf[DocsPage])
		stmt.close()
		mainPages.map(qr => {
			qr.entity.url = qr.entity.createUrl
			qr.entity
		})
	}
}
