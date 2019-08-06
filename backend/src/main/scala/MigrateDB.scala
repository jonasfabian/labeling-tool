import java.io.File
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
    extractFromTxt()
    extractFromAudio()
  }


  def getFileTree(f: File): Stream[File] =
    f #:: (if (f.isDirectory) f.listFiles().toStream.flatMap(getFileTree)
    else Stream.empty)

  def extractFromXml(): Unit = {
    val path = "/home/jonas/Documents/DeutschAndreaErzaehlt/"
    getFileTree(new File(path)).filter(_.getName.endsWith(".xml")).zipWithIndex.foreach {
      case (file, count) => {
        val f = XML.loadFile(file.getAbsolutePath)
        val samplingRate = (f \ "SamplingRate").text
        (f \ "TextAudioIndex").foreach(m => {
          val textAudioIndex = new TextAudioIndex(count, samplingRate.toInt, (m \ "TextStartPos").text.toInt, (m \ "TextEndPos").text.toInt, (m \ "AudioStartPos").text.toDouble, (m \ "AudioEndPos").text.toDouble, (m \ "SpeakerKey").text.toInt, 0, 0, 0, file.getParentFile.getName.toInt)
          newTextAudioIndex(textAudioIndex)
        })
      }
    }
    println("Extracted all xml-data from directory ...")
  }

  def extractFromTxt(): Unit = labelingToolService.withDslContext(dslContext => {
    val path = "/home/jonas/Documents/DeutschAndreaErzaehlt/"
    getFileTree(new File(path)).filter(_.getName.endsWith(".txt")).zipWithIndex.foreach {
      case (file, count) => {
        val text = Source.fromFile(file.getAbsolutePath, "utf-8").mkString
        val rec = labelingToolService.transcriptToRecord(new Transcript(count, text, file.getParentFile.getName.toInt))
        dslContext.executeInsert(rec)
      }
    }
    println("Extracted all txt-data from directory ...")
  })

  def extractFromAudio(): Unit = labelingToolService.withDslContext(dslContext => {
    val path = "/home/jonas/Documents/DeutschAndreaErzaehlt/"
    getFileTree(new File(path)).filter(_.getName.endsWith(".mp3")).zipWithIndex.foreach {
      case (file, count) => {
        val rec = labelingToolService.audioToRecord(new Audio(count, file.getAbsolutePath, file.getParentFile.getName.toInt))
        dslContext.executeInsert(rec)
      }
    }
    println("Extracted all audio-data from directory ...")
    ()
  })


  def newTextAudioIndex(t: TextAudioIndex): Unit = labelingToolService.withDslContext(dslContext => {
    val rec = labelingToolService.textAudioIndexToRecord(t)
    dslContext.executeInsert(rec)
    ()
  })
}
