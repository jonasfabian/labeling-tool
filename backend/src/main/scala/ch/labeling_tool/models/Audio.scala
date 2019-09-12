package ch.labeling_tool.models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Audio(id: Int, path: String, fileId: Int) {
}
object Audio {
  implicit val encoder = deriveEncoder[Audio]
  implicit val decoder = deriveDecoder[Audio]
}
