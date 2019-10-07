package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Recording(id: Int, text: String, userId: Int, audio: Array[Byte]) {
}
object Recording {
  implicit val encoder = deriveEncoder[Recording]
  implicit val decoder = deriveDecoder[Recording]
}
