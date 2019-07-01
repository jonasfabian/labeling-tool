import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Match(id: Int, audioStart: Double, audioEnd: Double, textStart: Double, textEnd: Double) {
}
object Match {
  implicit val encoder = deriveEncoder[Match]
  implicit val decoder = deriveDecoder[Match]
}
