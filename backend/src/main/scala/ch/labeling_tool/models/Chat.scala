package ch.labeling_tool.models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Chat(id: Int, chatName: String) {
}
object Chat {
  implicit val encoder = deriveEncoder[Chat]
  implicit val decoder = deriveDecoder[Chat]
}
