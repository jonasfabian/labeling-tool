package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class ChatMessageInfo(chatId: Int, username: String, message: String) {
}
object ChatMessageInfo {
  implicit val encoder = deriveEncoder[ChatMessageInfo]
  implicit val decoder = deriveDecoder[ChatMessageInfo]
}
