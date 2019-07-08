import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Transcript(id: Int, file: Array[Byte], fileId: Int) {
}

object Transcript {
  implicit val encoder = deriveEncoder[Transcript]
  implicit val decoder = deriveDecoder[Transcript]
}
