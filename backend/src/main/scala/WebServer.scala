import java.time.LocalDateTime

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.StatusCode
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.ActorMaterializer
import models.{Avatar, ChangePassword, EmailPassword, Recording, TextAudio, User, UserAndTextAudio, UserPublicInfo}
import com.typesafe.config.{ConfigFactory, ConfigValueFactory}
import de.heikoseeberger.akkahttpcirce.ErrorAccumulatingCirceSupport
import javax.ws.rs.Path
import jooq.db.tables.pojos.Textaudio

import scala.io.StdIn

object WebServer extends App with CorsSupport {
  override def main(args: Array[String]) {

    implicit val system = ActorSystem()
    implicit val materializer = ActorMaterializer()
    implicit val executionContext = system.dispatcher

    val config = ConfigFactory.load()
      .withValue("akka.remote.netty.tcp.port", ConfigValueFactory.fromAnyRef(2556))
    val labelingToolService = new LabelingToolService(config)
    val labelingToolRestApi = new LabelingToolRestApi(labelingToolService)
    val routes = corsHandler(labelingToolRestApi.route)

    val bindingFuture = Http().bindAndHandle(routes, "localhost", 8080)
    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine()
    bindingFuture
      .flatMap(_.unbind())
      .onComplete(_ => system.terminate())
  }
}

class LabelingToolRestApi(service: LabelingToolService) extends Directives with ErrorAccumulatingCirceSupport {
  val route = pathPrefix("api") {
    pathPrefix("match") {
      getTextAudioIndex ~ getTextAudioIndexes ~ updateTextAudioIndex ~ getAudioFile ~ getNonLabeledDataIndexes ~ getTenNonLabeledDataIndexes ~ getTextAudioIndexesByLabeledType ~ getLabeledSums ~ getUser ~ createUser ~ checkLogin ~ createUserAndTextAudioIndex ~ getUserByEmail ~ getCheckedTextAudioIndexesByUser ~ createAvatar ~ getAvatar ~ updateUser ~ getUserByUsername ~ getTopFiveUsersLabeledCount ~ createRecording ~ changePassword
    }
  }

  @Path("getTopFiveUsersLabeledCount")
  def getTopFiveUsersLabeledCount = path("getTopFiveUsersLabeledCount") {
    get {
      complete(service.getTopFiveUsersLabeledCount)
    }
  }

  @Path("getUser")
  def getUser = path("getUser") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getUserById(id))
      }
    }
  }

  @Path("getUserByUsername")
  def getUserByUsername = path("getUserByUsername") {
    get {
      parameters("username".as[String] ? "") { username =>
        complete(service.getUserByUsername(username))
      }
    }
  }

  @Path("getUserByEmail")
  def getUserByEmail = path("getUserByEmail") {
    get {
      parameters("email".as[String] ? "") { email =>
        complete(service.getUserByEmail(email))
      }
    }
  }

  @Path("textAudioIndex")
  def updateTextAudioIndex: Route = path("updateTextAudioIndex") {
    post {
      entity(as[TextAudio]) { t =>
        service.updateTextAudioIndex(t)
        complete("OK")
      }
    }
  }

  @Path("updateUser")
  def updateUser: Route = path("updateUser") {
    post {
      entity(as[UserPublicInfo]) { u =>
        service.updateUser(u)
        complete("OK")
      }
    }
  }

  @Path("textAudioIndexes")
  def getTextAudioIndexes = path("getTextAudioIndexes") {
    get {
      complete(service.getTextAudios)
    }
  }

  @Path("getLabeledSums")
  def getLabeledSums = path("getLabeledSums") {
    get {
      complete(service.getLabeledSums)
    }
  }


  @Path("getCheckedTextAudioIndexesByUser")
  def getCheckedTextAudioIndexesByUser = path("getCheckedTextAudioIndexesByUser") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getCheckedTextAudioIndexesByUser(id))
      }
    }
  }

  @Path("getAvatar")
  def getAvatar = path("getAvatar") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getAvatar(id))
      }
    }
  }

  @Path("getTextAudioIndexById")
  def getTextAudioIndex = path("getTextAudioIndexById") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getTextAudioIndexById(id))
      }
    }
  }

  @Path("getTextAudioIndexesByLabeledType")
  def getTextAudioIndexesByLabeledType = path("getTextAudioIndexesByLabeledType") {
    get {
      parameters("id".as[Int] ? 0) { labeledType =>
        complete(service.getTextAudioIndexesByLabeledType(labeledType))
      }
    }
  }

  @Path("getNonLabeledDataIndexes")
  def getNonLabeledDataIndexes = path("getNonLabeledDataIndexes") {
    get {
      parameters("id".as[Int] ? 0) { labeledType =>
        complete(service.getNonLabeledDataIndexes(labeledType))
      }
    }
  }

  @Path("getTenNonLabeledDataIndexes")
  def getTenNonLabeledDataIndexes = path("getTenNonLabeledDataIndexes") {
    get {
      parameters("userId".as[Int] ? 0) { (userId) =>
        val test = service.getTenNonLabeledTextAudiosByUser(userId)
        if (test.length != 0) {
          complete(service.getTenNonLabeledTextAudiosByUser(userId))
        } else {
          complete(service.getTenNonLabeledDataIndexes())
        }
      }
    }
  }

  @Path("getAudio")
  def getAudioFile = path("getAudioFile") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getAudioFile(id))
      }
    }
  }

  @Path("createUser")
  def createUser: Route = path("createUser") {
    post {
      entity(as[User]) { user =>
        service.createUser(user)
        complete("OK")
      }
    }
  }

  @Path("createRecording")
  def createRecording: Route = path("createRecording") {
    post {
      entity(as[Recording]) { recording =>
        service.createRecording(recording)
        complete("OK")
      }
    }
  }

  @Path("createAvatar")
  def createAvatar: Route = path("createAvatar") {
    post {
      entity(as[Avatar]) { avatar =>
        service.createAvatar(avatar)
        complete("OK")
      }
    }
  }

  def createUserAndTextAudioIndex: Route = path("createUserAndTextAudioIndex") {
    post {
      entity(as[UserAndTextAudio]) { userAndTextAudioIndex =>
        println(LocalDateTime.now())
        service.createUserAndTextAudioIndex(userAndTextAudioIndex)
        complete("OK")
      }
    }
  }

  @Path("checkLogin")
  def checkLogin: Route = path("checkLogin") {
    post {
      entity(as[EmailPassword]) { ep =>
        if (service.checkLogin(ep)) {
          complete("StatusCode.int2StatusCode(200)")
        } else {
          complete(StatusCode.int2StatusCode(401))
        }
      }
    }
  }

  @Path("changePassword")
  def changePassword: Route = path("changePassword") {
    post {
      entity(as[ChangePassword]) { changePwd =>
        if (service.changePassword(changePwd)) {
          complete("StatusCode.int2StatusCode(200)")
        } else {
          complete(StatusCode.int2StatusCode(401))
        }
      }
    }
  }
}
