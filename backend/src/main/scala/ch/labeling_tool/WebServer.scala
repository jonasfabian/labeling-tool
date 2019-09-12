package ch.labeling_tool

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.StatusCode
import akka.http.scaladsl.model.StatusCodes.Found
import akka.http.scaladsl.server.{Directives, Route}
import akka.stream.ActorMaterializer
import ch.labeling_tool.models._
import com.softwaremill.session.CsrfDirectives.{randomTokenCsrfProtection, setNewCsrfToken}
import com.softwaremill.session.CsrfOptions.checkHeader
import com.softwaremill.session.SessionDirectives.{invalidateSession, requiredSession, setSession}
import com.softwaremill.session.SessionOptions.{refreshable, usingCookies}
import com.softwaremill.session._
import com.typesafe.config.{ConfigFactory, ConfigValueFactory}
import de.heikoseeberger.akkahttpcirce.ErrorAccumulatingCirceSupport
import org.slf4j.LoggerFactory

import scala.concurrent.ExecutionContext
import scala.io.StdIn
import scala.util.Try

object WebServer extends App with CorsSupport {
  override def main(args: Array[String]) {

    implicit val system = ActorSystem()
    implicit val materializer = ActorMaterializer()
    // needed for the future flatMap/onComplete in the end
    implicit val executionContext = system.dispatcher

    val config = ConfigFactory.load()
      .withValue("akka.remote.netty.tcp.port", ConfigValueFactory.fromAnyRef(2556))
    val labelingToolService = new LabelingToolService(config)
    val labelingToolRestApi = new LabelingToolRestApi(labelingToolService, config.getString("labeling-tool.profile"))
    val routes = corsHandler(labelingToolRestApi.route)

    val bindingFuture = Http().bindAndHandle(routes, "localhost", 8080)
    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine() // let it run until user presses return
    bindingFuture
      .flatMap(_.unbind()) // trigger unbinding from the port
      .onComplete(_ => system.terminate()) // and shutdown when done
  }
}

case class MyScalaSession(username: String)

object MyScalaSession {
  implicit def serializer: SessionSerializer[MyScalaSession, String] =
    new SingleValueSessionSerializer(_.username,
      (un: String) =>
        Try {
          MyScalaSession(un)
        })
}

class LabelingToolRestApi(service: LabelingToolService, profile: String)(implicit executionContext: ExecutionContext) extends Directives with ErrorAccumulatingCirceSupport {
  val logger = LoggerFactory.getLogger(getClass)

  val sessionConfig = SessionConfig.default(
    "c05ll3lesrinf39t7mc5h6un6r0c69lgfno69dsak3vabeqamouq4328cuaekros401ajdpkh60rrtpd8ro24rbuqmgtnd1ebag6ljnb65i8a55d482ok7o0nch0bfbe"
  )
  implicit val sessionManager = new SessionManager[MyScalaSession](sessionConfig)
  implicit val refreshTokenStorage = new InMemoryRefreshTokenStorage[MyScalaSession] {
    def log(msg: String) = logger.info(msg)
  }

  def mySetSession(v: MyScalaSession) = setSession(refreshable, usingCookies, v)

  val myRequiredSession = requiredSession(refreshable, usingCookies)
  val myInvalidateSession = invalidateSession(refreshable, usingCookies)
  val route3 = pathPrefix("api") {
    pathPrefix("match") {
      path("checkLogin") {
        println("yeet")
        post {
          entity(as[EmailPassword]) { body =>
            if (service.checkLogin(body)) {
              logger.info(s"Logging in ${body.email}")
              mySetSession(MyScalaSession(body.email)) {
                setNewCsrfToken(checkHeader) { ctx =>
                  ctx.complete("ok")
                }
              }
            } else {
              complete(StatusCode.int2StatusCode(401))
            }
          }
        }
      } ~
        // This should be protected and accessible only when logged in
        path("do_logout") {
          post {
            myRequiredSession { session =>
              myInvalidateSession { ctx =>
                logger.info(s"Logging out $session")
                ctx.complete("ok")
              }
            }
          }
        }
    } ~ pathPrefix("match") {
      println("text")
      /*myRequiredSession { session =>
        logger.info("Current session: " + session)*/
      getTextAudioIndex ~ getTextAudioIndexes ~ updateTextAudioIndex ~ getTranscript ~ getTranscripts ~ getAudio ~ getAudioFile ~ getNonLabeledDataIndexes ~ getTenNonLabeledDataIndexes ~ getTextAudioIndexesByLabeledType ~ getLabeledSums ~ getUser ~ createUser ~ checkLogin ~ createUserAndTextAudioIndex ~ getUserByEmail ~ getCheckedTextAudioIndexesByUser ~ createAvatar ~ getAvatar ~ updateUser ~ createChat ~ createChatMember ~ createChatMessage ~ getChats ~ getChatsPerUser ~ removeChatMember ~ getAllMessagesFromChat ~ getAllChatMemberFromChat ~ getUserByUsername
      /*}*/
    }
  }
  val route2 = if (profile == "dev") {
    println("yote")
    route3
  } else randomTokenCsrfProtection(checkHeader) {
    route3
  }
  val route =
    path("") {
      redirect("/site/index.html", Found)
    } ~ route2 ~
      pathPrefix("site") {
        getFromResourceDirectory("site")
      }

  def getTranscript = path("getTranscript") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getTranscript(id))
      }
    }
  }

  def getChats = path("getChats") {
    get {
      complete(service.getChats)
    }
  }

  def getChatsPerUser = path("getChatsPerUser") {
    get {
      parameters("id".as[Int] ? 0) { userId =>
        complete(service.getChatsPerUser(userId))
      }
    }
  }

  def getUser = path("getUser") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getUserById(id))
      }
    }
  }

  def getUserByUsername = path("getUserByUsername") {
    get {
      parameters("username".as[String] ? "") { username =>
        complete(service.getUserByUsername(username))
      }
    }
  }

  def getAllMessagesFromChat = path("getAllMessagesFromChat") {
    get {
      parameters("id".as[Int] ? 0) { chatId =>
        complete(service.getAllMessagesFromChat(chatId))
      }
    }
  }

  def getAllChatMemberFromChat = path("getAllChatMemberFromChat") {
    get {
      parameters("id".as[Int] ? 0) { chatId =>
        complete(service.getAllChatMemberFromChat(chatId))
      }
    }
  }

  def getUserByEmail = path("getUserByEmail") {
    get {
      myRequiredSession { session =>
        logger.info("Current session: " + session)
        parameters("email".as[String] ? "") { email =>
          complete(service.getUserByEmail(email))
        }
      }
    }
  }

  def removeChatMember = path("removeChatMember") {
    post {
      entity(as[ChatMember]) { t =>
        service.removeChatMember(t)
        complete("OK")
      }
    }
  }

  def getTranscripts = path("getTranscripts") {
    get {
      complete(service.getTranscripts)
    }
  }

  def updateTextAudioIndex: Route = path("updateTextAudioIndex") {
    post {
      entity(as[TextAudioIndex]) { t =>
        service.updateTextAudioIndex(t)
        complete("OK")
      }
    }
  }

  def updateUser: Route = path("updateUser") {
    post {
      entity(as[UserPublicInfo]) { u =>
        service.updateUser(u)
        complete("OK")
      }
    }
  }

  def getTextAudioIndexes = path("getTextAudioIndexes") {
    get {
      complete(service.getTextAudioIndexes)
    }
  }

  def getLabeledSums = path("getLabeledSums") {
    get {
      complete(service.getLabeledSums)
    }
  }


  def getCheckedTextAudioIndexesByUser = path("getCheckedTextAudioIndexesByUser") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getCheckedTextAudioIndexesByUser(id))
      }
    }
  }

  def getAvatar = path("getAvatar") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getAvatar(id))
      }
    }
  }

  def getTextAudioIndex = path("getTextAudioIndexById") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getTextAudioIndexById(id))
      }
    }
  }

  def getTextAudioIndexesByLabeledType = path("getTextAudioIndexesByLabeledType") {
    get {
      parameters("id".as[Int] ? 0) { labeledType =>
        complete(service.getTextAudioIndexesByLabeledType(labeledType))
      }
    }
  }

  def getNonLabeledDataIndexes = path("getNonLabeledDataIndexes") {
    get {
      parameters("id".as[Int] ? 0) { labeledType =>
        complete(service.getNonLabeledDataIndexes(labeledType))
      }
    }
  }

  def getTenNonLabeledDataIndexes = path("getTenNonLabeledDataIndexes") {
    get {
      parameters("userId".as[Int] ? 0) { (userId) =>
        val test = service.getTenNonLabeledDataIndexesByUser(userId)
        if (test.length != 0) {
          complete(service.getTenNonLabeledDataIndexesByUser(userId))
        } else {
          complete(service.getTenNonLabeledDataIndexes())
        }
      }
    }
  }

  def getAudio = path("getAudio") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getAudio(id))
      }
    }
  }

  def getAudioFile = path("getAudioFile") {
    get {
      parameters("id".as[Int] ? 0) { id =>
        complete(service.getAudioFile(id))
      }
    }
  }

  def createUser: Route = path("createUser") {
    post {
      entity(as[User]) { user =>
        service.createUser(user)
        complete("OK")
      }
    }
  }

  def createChat: Route = path("createChat") {
    post {
      entity(as[Chat]) { chat =>
        service.createChat(chat)
        complete("OK")
      }
    }
  }

  def createChatMember: Route = path("createChatMember") {
    post {
      entity(as[ChatMember]) { chatMember =>
        service.createChatMember(chatMember)
        complete("OK")
      }
    }
  }

  def createChatMessage: Route = path("createChatMessage") {
    post {
      entity(as[ChatMessage]) { chatMessage =>
        service.createChatMessage(chatMessage)
        complete("OK")
      }
    }
  }

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
      entity(as[UserAndTextAudioIndex]) { userAndTextAudioIndex =>
        service.createUserAndTextAudioIndex(userAndTextAudioIndex)
        complete("OK")
      }
    }
  }

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
}
