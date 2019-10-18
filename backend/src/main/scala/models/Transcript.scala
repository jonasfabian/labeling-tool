package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Transcript(
                       id: Int,
                       text: String,
                       fileId: Int
                     ) {
}

object Transcript {
  implicit val encoder = deriveEncoder[Transcript]
  implicit val decoder = deriveDecoder[Transcript]
}
