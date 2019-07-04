import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.ActorMaterializer
import com.typesafe.config.{ConfigFactory, ConfigValueFactory}
import de.heikoseeberger.akkahttpcirce.ErrorAccumulatingCirceSupport
import io.swagger.annotations.{ApiImplicitParam, ApiImplicitParams, ApiOperation, ApiResponse, ApiResponses}
import javax.ws.rs.Path

import scala.io.StdIn

object WebServer extends App with CorsSupport {
  override def main(args: Array[String]) {

    implicit val system = ActorSystem()
    implicit val materializer = ActorMaterializer()
    // needed for the future flatMap/onComplete in the end
    implicit val executionContext = system.dispatcher

    val config = ConfigFactory.load()
      .withValue("akka.remote.netty.tcp.port", ConfigValueFactory.fromAnyRef(2556))
    val labelingToolService = new LabelingToolService(config)
    val labelingToolRestApi = new LabelingToolRestApi(labelingToolService)
    val routes = corsHandler(labelingToolRestApi.route)

    labelingToolService.extractFromXml()

    val bindingFuture = Http().bindAndHandle(routes, "localhost", 8080)
    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine() // let it run until user presses return
    bindingFuture
      .flatMap(_.unbind()) // trigger unbinding from the port
      .onComplete(_ => system.terminate()) // and shutdown when done
  }
}

class LabelingToolRestApi(service: LabelingToolService) extends Directives with ErrorAccumulatingCirceSupport {
  val route = pathPrefix("api") {
    pathPrefix("match") {
      getTextAudioIndex ~ updateTextAudioIndex
    }
  }

  @ApiOperation(value = "getTextAudioIndex", httpMethod = "GET", notes = "returns an Array of TextAudioIndex")
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[TextAudioIndex], message = "OK")))
  @Path("textAudioIndex")
  def getTextAudioIndex = path("getTextAudioIndex") {
    get {
      complete(service.textAudioIndex)
    }
  }

  @ApiOperation(value = "updateCountry", httpMethod = "POST")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "body", required = true, dataTypeClass = classOf[TextAudioIndex], value = "the updated textAudioIndex", paramType = "body")))
  @ApiResponses(Array(new ApiResponse(code = 200, message = "OK")))
  @Path("textAudioIndex")
  def updateTextAudioIndex: Route = path("updateTextAudioIndex") {
    post {
      entity(as[TextAudioIndex]) { t =>
        service.updateTextAudioIndex(t)
        complete("OK")
      }
    }
  }
}
