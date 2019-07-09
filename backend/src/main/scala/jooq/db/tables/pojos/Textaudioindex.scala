/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables.pojos


import java.io.Serializable
import java.lang.Byte
import java.lang.Double
import java.lang.Integer
import java.lang.StringBuilder


case class Textaudioindex(
    id : Integer
  , samplingrate : Integer
  , textstartpos : Integer
  , textendpos : Integer
  , audiostartpos : Double
  , audioendpos : Double
  , speakerkey : Integer
  , labeled : Byte
  , transcriptFileId : Integer
) extends Serializable {

  def this (value : Textaudioindex) = {
    this(
        value.id
      , value.samplingrate
      , value.textstartpos
      , value.textendpos
      , value.audiostartpos
      , value.audioendpos
      , value.speakerkey
      , value.labeled
      , value.transcriptFileId
    )
  }

  def getId : Integer = {
    this.id
  }

  def getSamplingrate : Integer = {
    this.samplingrate
  }

  def getTextstartpos : Integer = {
    this.textstartpos
  }

  def getTextendpos : Integer = {
    this.textendpos
  }

  def getAudiostartpos : Double = {
    this.audiostartpos
  }

  def getAudioendpos : Double = {
    this.audioendpos
  }

  def getSpeakerkey : Integer = {
    this.speakerkey
  }

  def getLabeled : Byte = {
    this.labeled
  }

  def getTranscriptFileId : Integer = {
    this.transcriptFileId
  }

  override def toString : String = {
    val sb = new StringBuilder("Textaudioindex (")

    sb.append(id)
    sb.append(", ").append(samplingrate)
    sb.append(", ").append(textstartpos)
    sb.append(", ").append(textendpos)
    sb.append(", ").append(audiostartpos)
    sb.append(", ").append(audioendpos)
    sb.append(", ").append(speakerkey)
    sb.append(", ").append(labeled)
    sb.append(", ").append(transcriptFileId)

    sb.append(")")
    return sb.toString
  }
}
