import com.typesafe.config.Config
import org.jooq.DSLContext
import org.jooq.impl.DSL
import jooq.db.Tables._
import jooq.db.tables.records.{TextaudioindexRecord, TranscriptRecord}
import java.nio.file.{Files, Paths}
import java.sql.Blob

import javax.sql.rowset.serial.SerialBlob

import scala.xml.XML

class LabelingToolService(config: Config) {

  private val url = config.getString("labeling-tool.db.url")
  private val user = config.getString("labeling-tool.db.user")
  private val password = config.getString("labeling-tool.db.password")

  def withDslContext[A](f: DSLContext => A): A = {
    val ctx = DSL.using(url, user, password)
    try {
      f(ctx)
    }
    catch {
      case e: Exception =>
        println(e)
        throw new RuntimeException(e)
    }
    finally ctx.close()
  }

  def extractFromXml(): Unit = {
    val file = XML.loadFile("/home/jonas/Documents/DeutschAndreaErzaehlt/36/transcript_indexes.xml")
    val samplingRate = (file \ "SamplingRate").text
    (file \ "TextAudioIndex").foreach(m => {
      val textAudioIndex = new TextAudioIndex(0, samplingRate.toInt, (m \ "TextStartPos").text.toInt, (m \ "TextEndPos").text.toInt, (m \ "AudioStartPos").text.toInt, (m \ "AudioEndPos").text.toInt, (m \ "SpeakerKey").text.toInt, 0)
      newTextAudioIndex(textAudioIndex)
    })
  }

  def getTextAudioIndex(id: Int): Array[TextAudioIndex] = withDslContext(dslContext => {
    dslContext.select()
      .from(TEXTAUDIOINDEX)
      .where(TEXTAUDIOINDEX.ID.eq(id))
      .fetchArray().map(m => TextAudioIndex(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toInt, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toByte))
  })

  def getTextAudioIndexes: Array[TextAudioIndex] = withDslContext(dslContext => {
    dslContext.selectFrom(TEXTAUDIOINDEX).fetchArray().map(m => TextAudioIndex(m.getId, m.getSamplingrate, m.getTextstartpos, m.getTextendpos, m.getAudiostartpos, m.getAudioendpos, m.getSpeakerkey, m.getLabeled))
  })

  def getTranscript(id: Int): Array[Transcript] = withDslContext(dslContext => {
    dslContext.selectFrom(TRANSCRIPT)
      .where(TRANSCRIPT.ID.eq(id))
      .fetchArray().map(m => Transcript(m.getId, m.getFile, m.getFileId))
  })

  def getTranscripts: Array[Transcript] = withDslContext(dslContext => {
    dslContext.selectFrom(TRANSCRIPT).fetchArray().map(m => Transcript(m.getId, m.getFile, m.getFileId))
  })

  def newTextAudioIndex(t: TextAudioIndex): Unit = withDslContext(dslContext => {
    val rec = textAudioIndexToRecord(t)
    dslContext.executeInsert(rec)
    ()
  })

  def readTranscript(): Unit = withDslContext(dslContext => {
    val byteArray = Files.readAllBytes(Paths.get("/home/jonas/Documents/DeutschAndreaErzaehlt/37/transcript.txt"))
    val rec = transcriptToRecord(new Transcript(0, byteArray, 1))
    dslContext.executeInsert(rec)
    ()
  })

  def transcriptToRecord(t: Transcript): TranscriptRecord = {
    val rec = new TranscriptRecord()
    rec.setFile(t.file)
    rec
  }

  def textAudioIndexToRecord(m: TextAudioIndex): TextaudioindexRecord = {
    val rec = new TextaudioindexRecord()
    rec.setSamplingrate(m.samplingRate)
    rec.setTextstartpos(m.textStartPos)
    rec.setTextendpos(m.textEndPos)
    rec.setAudiostartpos(m.audioStartPos)
    rec.setAudioendpos(m.audioEndPos)
    rec.setSpeakerkey(m.speakerKey)
    rec
  }

  def updateTextAudioIndex(textAudioIndex: TextAudioIndex): Unit = withDslContext(dslContext => {
    dslContext.update(TEXTAUDIOINDEX)
      .set(TEXTAUDIOINDEX.SAMPLINGRATE, Integer.valueOf(textAudioIndex.samplingRate))
      .set(TEXTAUDIOINDEX.TEXTSTARTPOS, Integer.valueOf(textAudioIndex.textStartPos))
      .set(TEXTAUDIOINDEX.TEXTENDPOS, Integer.valueOf(textAudioIndex.textEndPos))
      .set(TEXTAUDIOINDEX.AUDIOSTARTPOS, Integer.valueOf(textAudioIndex.audioStartPos))
      .set(TEXTAUDIOINDEX.AUDIOENDPOS, Integer.valueOf(textAudioIndex.audioEndPos))
      .set(TEXTAUDIOINDEX.SPEAKERKEY, Integer.valueOf(textAudioIndex.speakerKey))
      .set(TEXTAUDIOINDEX.LABELED, byte2Byte(textAudioIndex.labeled))
      .where(TEXTAUDIOINDEX.ID.eq(textAudioIndex.id))
      .execute()
    ()
  })
}
