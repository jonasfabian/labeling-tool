package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class ChangePassword(userId: Int, password: String, newPassword: String) {
}
object ChangePassword {
  implicit val encoder = deriveEncoder[ChangePassword]
  implicit val decoder = deriveDecoder[ChangePassword]
}
