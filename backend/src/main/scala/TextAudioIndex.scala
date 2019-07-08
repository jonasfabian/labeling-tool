import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class TextAudioIndex(id: Int, samplingRate: Int, textStartPos: Int, textEndPos: Int, audioStartPos: Int, audioEndPos: Int, speakerKey: Int, labeled: Byte, transcriptFileId: Int) {
}

object TextAudioIndex {
  implicit val encoder = deriveEncoder[TextAudioIndex]
  implicit val decoder = deriveDecoder[TextAudioIndex]
}
