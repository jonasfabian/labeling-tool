import com.typesafe.config.Config
import org.jooq.DSLContext
import org.jooq.impl.DSL
import jooq.db.Tables.MATCH

class LabelingToolService(config: Config) {

  private val url = config.getString("labeling-tool.db.url")
  private val user = config.getString("labeling-tool.db.user")
  private val password = config.getString("labeling-tool.db.password")

  def withDslContext[A](f: DSLContext => A): A = {
    val ctx = DSL.using(url, user, password)
    try {
      f(ctx)
    }
    catch {
      case e: Exception =>
        println(e)
        throw new RuntimeException(e)
    }
    finally ctx.close()
  }

  def matches: Array[Match] = withDslContext(dslContext => {
    dslContext.selectFrom(MATCH).fetchArray().map(m => Match(m.getMatchid, m.getAudiostart, m.getAudioend, m.getTextstart, m.getTextend))
  })
}
