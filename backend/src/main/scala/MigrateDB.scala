import java.io.File
import models.{TextAudio}
import com.typesafe.config.{ConfigFactory, ConfigValueFactory}
import scala.xml.XML

object MigrateDB extends App with CorsSupport {

  private var index = 0
  private var labelingToolService = new LabelingToolService(null)

  override def main(args: Array[String]): Unit = {
    val config = ConfigFactory.load().withValue("akka.remote.netty.tcp.port", ConfigValueFactory.fromAnyRef(2556))
    labelingToolService = new LabelingToolService(config)
    extractFromXml()
  }


  def getFileTree(f: File): Stream[File] =
    f #:: (if (f.isDirectory) f.listFiles().toStream.flatMap(getFileTree)
    else Stream.empty)

  def extractFromXml(): Unit = {
    val path = "C:\\Users\\Jonas\\Documents\\Data\\"
    getFileTree(new File(path)).filter(_.getName.endsWith(".xml")).zipWithIndex.foreach {
      case (file, count) => {
        val f = XML.loadFile(file.getAbsolutePath)
        print(f)
        /*val samplingRate = (f \ "SamplingRate").text
        (f \ "TextAudioIndex").foreach(m => {
          val textAudioIndex = new TextAudio(count, samplingRate.toInt, (m \ "TextStartPos").text.toInt, (m \ "TextEndPos").text.toInt, (m \ "AudioStartPos").text.toDouble, (m \ "AudioEndPos").text.toDouble, (m \ "SpeakerKey").text.toInt, 0, 0, 0, file.getParentFile.getName.toInt)
          newTextAudioIndex(textAudioIndex)
        })*/
      }
    }
    println("Extracted all xml-data from directory ...")
  }

  def newTextAudioIndex(t: TextAudio): Unit = labelingToolService.withDslContext(dslContext => {
    val rec = labelingToolService.textAudioToRecord(t)
    dslContext.executeInsert(rec)
    ()
  })
}
