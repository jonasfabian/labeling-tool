package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Avatar(id: Int, userId: Int, avatar: Array[Byte]) {
}
object Avatar {
  implicit val encoder = deriveEncoder[Avatar]
  implicit val decoder = deriveDecoder[Avatar]
}
