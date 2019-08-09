import akka.actor.ActorSystem
import akka.http.javadsl.model.MediaType
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.model.{HttpEntity, HttpResponse}
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Source
import akka.util.ByteString
import models.{Audio, Sums, TextAudioIndex, TextAudioIndexWithText, Transcript}
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
      getTextAudioIndex ~ getTextAudioIndexes ~ updateTextAudioIndex ~ getTranscript ~ getTranscripts ~ getAudio ~ getAudioFile ~ getNonLabeledDataIndexes ~ getTenNonLabeledDataIndexes ~ getTextAudioIndexesByLabeledType ~ getLabeledSums ~ getUser ~ createUser
    }
  }

  @ApiOperation(value = "getTranscript", httpMethod = "GET", notes = "returns a Byte Array")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "id", required = true, example = "100", value = "id", paramType = "query")))
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[Array[Transcript]], message = "OK")))
  @Path("getTranscript")
  def getTranscript = path("getTranscript") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getTranscript(id))
      }
    }
  }

  @ApiOperation(value = "getUser", httpMethod = "GET", notes = "returns a user")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "id", required = true, example = "100", value = "id", paramType = "query")))
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[User], message = "OK")))
  @Path("getUser")
  def getUser = path("getUser") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getUserById(id))
      }
    }
  }

  @ApiOperation(value = "getTranscripts", httpMethod = "GET", notes = "returns an Array of Byte Arrays")
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[Transcript], message = "OK")))
  @Path("getTranscripts")
  def getTranscripts = path("getTranscripts") {
    get {
      complete(service.getTranscripts)
    }
  }

  @ApiOperation(value = "updateCountry", httpMethod = "POST", notes = "updates the selected textAudioIndex")
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

  @ApiOperation(value = "getTextAudioIndexes", httpMethod = "GET", notes = "returns an Array of TextAudioIndex")
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[TextAudioIndex], message = "OK")))
  @Path("textAudioIndexes")
  def getTextAudioIndexes = path("getTextAudioIndexes") {
    get {
      complete(service.getTextAudioIndexes)
    }
  }

  @ApiOperation(value = "getLabeledSums", httpMethod = "GET", notes = "returns an Array of TextAudioIndex")
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[Array[Sums]], message = "OK")))
  @Path("getLabeledSums")
  def getLabeledSums = path("getLabeledSums") {
    get {
      complete(service.getLabeledSums)
    }
  }

  @ApiOperation(value = "", httpMethod = "GET", notes = "returns a textAudioIndex")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "id", required = true, example = "100", value = "id", paramType = "query")))
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[Array[TextAudioIndex]], message = "OK")))
  @Path("getTextAudioIndexById")
  def getTextAudioIndex = path("getTextAudioIndexById") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getTextAudioIndexById(id))
      }
    }
  }

  @ApiOperation(value = "", httpMethod = "GET", notes = "returns a textAudioIndex")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "id", required = true, example = "100", value = "id", paramType = "query")))
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[Array[TextAudioIndex]], message = "OK")))
  @Path("getTextAudioIndexesByLabeledType")
  def getTextAudioIndexesByLabeledType = path("getTextAudioIndexesByLabeledType") {
    get {
      parameters("id".as[Int] ? 0) { labeledType =>
        complete(service.getTextAudioIndexesByLabeledType(labeledType))
      }
    }
  }

  @ApiOperation(value = "getTextAudioIndexes", httpMethod = "GET", notes = "returns an Array of TextAudioIndex")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "id", required = true, example = "100", value = "id", paramType = "query")))
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[TextAudioIndexWithText], message = "OK")))
  @Path("getNonLabeledDataIndexes")
  def getNonLabeledDataIndexes = path("getNonLabeledDataIndexes") {
    get {
      parameters("id".as[Int] ? 0) { labeledType =>
        complete(service.getNonLabeledDataIndexes(labeledType))
      }
    }
  }

  @ApiOperation(value = "getTenNonLabeledDataIndexes", httpMethod = "GET", notes = "returns an Array of TextAudioIndex")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "id", required = true, example = "100", value = "id", paramType = "query")))
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[Array[TextAudioIndexWithText]], message = "OK")))
  @Path("getTenNonLabeledDataIndexes")
  def getTenNonLabeledDataIndexes = path("getTenNonLabeledDataIndexes") {
    get {
      parameters("id".as[Int] ? 0) { labeledType =>
        complete(service.getTenNonLabeledDataIndexes(labeledType))
      }
    }
  }

  @ApiOperation(value = "getAudio", httpMethod = "GET", notes = "returns a path")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "id", required = true, example = "100", value = "id", paramType = "query")))
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[Array[Audio]], message = "OK")))
  @Path("getAudio")
  def getAudio = path("getAudio") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getAudio(id))
      }
    }
  }

  @ApiOperation(value = "getAudioFile", httpMethod = "GET", notes = "returns a Blob-file")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "id", required = true, example = "100", value = "id", paramType = "query")))
  @ApiResponses(Array(new ApiResponse(code = 200, response = classOf[ToResponseMarshallable], message = "OK")))
  @Path("getAudio")
  def getAudioFile = path("getAudioFile") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getAudioFile(id))
      }
    }
  }

  @ApiOperation(value = "createUser", httpMethod = "POST")
  @ApiImplicitParams(Array(new ApiImplicitParam(name = "body", required = true, dataTypeClass = classOf[User], value = "", paramType = "body")))
  @ApiResponses(Array(new ApiResponse(code = 200, message = "OK")))
  @Path("createUser")
  def createUser: Route = path("createUser") {
    post {
      entity(as[User]) { user =>
        service.createUser(user)
        complete("OK")
      }
    }
  }
}
