import com.typesafe.config.Config
import org.jooq.DSLContext
import org.jooq.impl.DSL

class LabelingToolService(config: Config) {

  private val url = config.getString("labeling-tool-rest.db.url")
  private val user = config.getString("labeling-tool-rest.db.user")
  private val password = config.getString("labeling-tool-rest.db.password")

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
}
