import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class User(id: Int, firstName: String, lastName: String, email: String, password: String) {
}

object User {
  implicit val encoder = deriveEncoder[User]
  implicit val decoder = deriveDecoder[User]
}
