package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class ChatMessage(id: Int, chatMemberId: Int, message: String) {
}
object ChatMessage {
  implicit val encoder = deriveEncoder[ChatMessage]
  implicit val decoder = deriveDecoder[ChatMessage]
}
