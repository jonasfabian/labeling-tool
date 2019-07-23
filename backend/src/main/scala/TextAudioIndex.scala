import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class TextAudioIndex(id: Int, samplingRate: Int, textStartPos: Int, textEndPos: Int, audioStartPos: Double, audioEndPos: Double, speakerKey: Int, labeled: Int, transcriptFileId: Int) {
}

object TextAudioIndex {
  implicit val encoder = deriveEncoder[TextAudioIndex]
  implicit val decoder = deriveDecoder[TextAudioIndex]
}
