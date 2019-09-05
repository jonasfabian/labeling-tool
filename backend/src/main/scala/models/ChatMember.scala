package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class ChatMember(id: Int, chatId: Int, userId: Int) {
}
object ChatMember {
  implicit val encoder = deriveEncoder[ChatMember]
  implicit val decoder = deriveDecoder[ChatMember]
}
