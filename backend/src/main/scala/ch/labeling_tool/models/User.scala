package ch.labeling_tool.models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class User(id: Int, firstName: String, lastName: String, email: String, username: String, avatarVersion: Int, password: String) {
}

object User {
  implicit val encoder = deriveEncoder[User]
  implicit val decoder = deriveDecoder[User]
}
