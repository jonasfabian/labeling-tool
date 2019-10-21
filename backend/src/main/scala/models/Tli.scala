package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Tli(
                    id: String,
                    time: String
                  ) {
}

object Tli {
  implicit val encoder = deriveEncoder[Tli]
  implicit val decoder = deriveDecoder[Tli]
}
