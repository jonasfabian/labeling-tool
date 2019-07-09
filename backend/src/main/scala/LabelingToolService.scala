import com.typesafe.config.Config
import org.jooq.DSLContext
import org.jooq.impl.DSL
import jooq.db.Tables._
import jooq.db.tables.records.{TextaudioindexRecord, TranscriptRecord}
import scala.xml.XML

class LabelingToolService(config: Config) {

  private val url = config.getString("labeling-tool.db.url")
  private val user = config.getString("labeling-tool.db.user")
  private val password = config.getString("labeling-tool.db.password")
  private val path = "/home/jonas/Documents/DeutschAndreaErzaehlt/"
  private var index = 0

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
        this.readTranscript(i, path + "/transcript.txt")
      }
    }
  }

  def getTextAudioIndex(id: Int): TextAudioIndex = withDslContext(dslContext => {
    dslContext.select()
      .from(TEXTAUDIOINDEX)
      .where(TEXTAUDIOINDEX.ID.eq(id))
      .fetchOne().map(m => TextAudioIndex(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toByte, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt))
  })

  def getTextAudioIndexes: Array[TextAudioIndex] = withDslContext(dslContext => {
    dslContext.selectFrom(TEXTAUDIOINDEX).fetchArray().map(m => TextAudioIndex(m.getId, m.getSamplingrate, m.getTextstartpos, m.getTextendpos, m.getAudiostartpos, m.getAudioendpos, m.getSpeakerkey, m.getLabeled, m.getTranscriptFileId))
  })

  def getTranscript(id: Int): Transcript = withDslContext(dslContext => {
    dslContext.select()
      .from(TRANSCRIPT)
      .where(TRANSCRIPT.ID.eq(id))
      .fetchOne().map(m => Transcript(m.get(TRANSCRIPT.ID).toInt, m.get(TRANSCRIPT.TEXT).toString, m.get(TRANSCRIPT.FILEID).toInt))
  })

  def getTranscripts: Array[Transcript] = withDslContext(dslContext => {
    dslContext.selectFrom(TRANSCRIPT).fetchArray().map(m => Transcript(m.getId, m.getText, m.getFileid))
  })

  def newTextAudioIndex(t: TextAudioIndex): Unit = withDslContext(dslContext => {
    val rec = textAudioIndexToRecord(t)
    dslContext.executeInsert(rec)
    ()
  })

  def readTranscript(id: Int, path: String): Unit = withDslContext(dslContext => {
    val text = scala.io.Source.fromFile(path, "utf-8").mkString
    val rec = transcriptToRecord(new Transcript(id, text, id))
    dslContext.executeInsert(rec)
    ()
  })

  def transcriptToRecord(t: Transcript): TranscriptRecord = {
    val rec = new TranscriptRecord()
    rec.setText(t.text)
    rec.setFileid(t.fileId)
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
    rec.setLabeled(m.labeled)
    rec.setTranscriptFileId(m.transcriptFileId)
    rec
  }

  def updateTextAudioIndex(textAudioIndex: TextAudioIndex): Unit = withDslContext(dslContext => {
    dslContext.update(TEXTAUDIOINDEX)
      .set(TEXTAUDIOINDEX.SAMPLINGRATE, Integer.valueOf(textAudioIndex.samplingRate))
      .set(TEXTAUDIOINDEX.TEXTSTARTPOS, Integer.valueOf(textAudioIndex.textStartPos))
      .set(TEXTAUDIOINDEX.TEXTENDPOS, Integer.valueOf(textAudioIndex.textEndPos))
      .set(TEXTAUDIOINDEX.AUDIOSTARTPOS, java.lang.Double.valueOf(textAudioIndex.audioStartPos))
      .set(TEXTAUDIOINDEX.AUDIOENDPOS, java.lang.Double.valueOf(textAudioIndex.audioEndPos))
      .set(TEXTAUDIOINDEX.SPEAKERKEY, Integer.valueOf(textAudioIndex.speakerKey))
      .set(TEXTAUDIOINDEX.LABELED, byte2Byte(textAudioIndex.labeled))
      .set(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID, Integer.valueOf(textAudioIndex.transcriptFileId))
      .where(TEXTAUDIOINDEX.ID.eq(textAudioIndex.id))
      .execute()
    ()
  })
}
