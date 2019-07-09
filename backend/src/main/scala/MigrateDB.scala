import com.typesafe.config.{ConfigFactory, ConfigValueFactory}

import scala.io.Source
import scala.xml.XML

object MigrateDB extends App with CorsSupport {

  private var index = 0
  private var labelingToolService = new LabelingToolService(null)

  override def main(args: Array[String]): Unit = {
    val config = ConfigFactory.load().withValue("akka.remote.netty.tcp.port", ConfigValueFactory.fromAnyRef(2556))
    labelingToolService = new LabelingToolService(config)
    extractFromXml()
  }

  def extractFromXml(): Unit = {
    var i = 0
    while (i < 10000) {
      i = i+1
      this.index = i
      var path = "/home/jonas/Documents/DeutschAndreaErzaehlt/" + i
      if (new java.io.File(path + "/transcript_indexes.xml").exists) {
        val file = XML.loadFile(path + "/transcript_indexes.xml")
        val samplingRate = (file \ "SamplingRate").text
        (file \ "TextAudioIndex").foreach(m => {
          val textAudioIndex = new TextAudioIndex(i, samplingRate.toInt, (m \ "TextStartPos").text.toInt, (m \ "TextEndPos").text.toInt, (m \ "AudioStartPos").text.toDouble, (m \ "AudioEndPos").text.toDouble, (m \ "SpeakerKey").text.toInt, 0, i)
          newTextAudioIndex(textAudioIndex)
        })
      }
      if (new java.io.File(path + "/transcript.txt").exists) {
        readTranscript(i, path + "/transcript.txt")
      }
    }
    println("Done Migrating...")
  }

  def readTranscript(id: Int, path: String): Unit = labelingToolService.withDslContext(dslContext => {
    val text = Source.fromFile(path, "utf-8").mkString
    val rec = labelingToolService.transcriptToRecord(new Transcript(id, text, id))
    dslContext.executeInsert(rec)
    ()
  })

  def newTextAudioIndex(t: TextAudioIndex): Unit = labelingToolService.withDslContext(dslContext => {
    val rec = labelingToolService.textAudioIndexToRecord(t)
    dslContext.executeInsert(rec)
    ()
  })
}
