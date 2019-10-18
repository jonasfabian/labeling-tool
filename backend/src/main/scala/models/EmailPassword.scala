package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class EmailPassword(
                          email: String,
                          password: String
                        ) {
}

object EmailPassword {
  implicit val encoder = deriveEncoder[EmailPassword]
  implicit val decoder = deriveDecoder[EmailPassword]
}
