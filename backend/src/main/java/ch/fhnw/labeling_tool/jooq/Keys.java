/*
 * This file is generated by jOOQ.
 */
package ch.fhnw.labeling_tool.jooq;


import ch.fhnw.labeling_tool.jooq.tables.CheckedUtterance;
import ch.fhnw.labeling_tool.jooq.tables.Excerpt;
import ch.fhnw.labeling_tool.jooq.tables.FlywaySchemaHistory;
import ch.fhnw.labeling_tool.jooq.tables.OriginalText;
import ch.fhnw.labeling_tool.jooq.tables.Recording;
import ch.fhnw.labeling_tool.jooq.tables.Speaker;
import ch.fhnw.labeling_tool.jooq.tables.TextAudio;
import ch.fhnw.labeling_tool.jooq.tables.User;
import ch.fhnw.labeling_tool.jooq.tables.UserAndTextAudio;
import ch.fhnw.labeling_tool.jooq.tables.UserGroup;
import ch.fhnw.labeling_tool.jooq.tables.UserGroupRole;
import ch.fhnw.labeling_tool.jooq.tables.records.CheckedUtteranceRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.ExcerptRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.FlywaySchemaHistoryRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.OriginalTextRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.RecordingRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.SpeakerRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.TextAudioRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.UserAndTextAudioRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.UserGroupRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.UserGroupRoleRecord;
import ch.fhnw.labeling_tool.jooq.tables.records.UserRecord;

import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.UniqueKey;
import org.jooq.impl.Internal;


@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Keys {

    // -------------------------------------------------------------------------
    // IDENTITY definitions
    // -------------------------------------------------------------------------

    public static final Identity<CheckedUtteranceRecord, Long> IDENTITY_CHECKED_UTTERANCE = Identities0.IDENTITY_CHECKED_UTTERANCE;
    public static final Identity<ExcerptRecord, Long> IDENTITY_EXCERPT = Identities0.IDENTITY_EXCERPT;
    public static final Identity<OriginalTextRecord, Long> IDENTITY_ORIGINAL_TEXT = Identities0.IDENTITY_ORIGINAL_TEXT;
    public static final Identity<RecordingRecord, Long> IDENTITY_RECORDING = Identities0.IDENTITY_RECORDING;
    public static final Identity<SpeakerRecord, Long> IDENTITY_SPEAKER = Identities0.IDENTITY_SPEAKER;
    public static final Identity<TextAudioRecord, Long> IDENTITY_TEXT_AUDIO = Identities0.IDENTITY_TEXT_AUDIO;
    public static final Identity<UserRecord, Long> IDENTITY_USER = Identities0.IDENTITY_USER;
    public static final Identity<UserAndTextAudioRecord, Long> IDENTITY_USER_AND_TEXT_AUDIO = Identities0.IDENTITY_USER_AND_TEXT_AUDIO;
    public static final Identity<UserGroupRecord, Long> IDENTITY_USER_GROUP = Identities0.IDENTITY_USER_GROUP;
    public static final Identity<UserGroupRoleRecord, Long> IDENTITY_USER_GROUP_ROLE = Identities0.IDENTITY_USER_GROUP_ROLE;

    // -------------------------------------------------------------------------
    // UNIQUE and PRIMARY KEY definitions
    // -------------------------------------------------------------------------

    public static final UniqueKey<CheckedUtteranceRecord> KEY_CHECKED_UTTERANCE_PRIMARY = UniqueKeys0.KEY_CHECKED_UTTERANCE_PRIMARY;
    public static final UniqueKey<ExcerptRecord> KEY_EXCERPT_PRIMARY = UniqueKeys0.KEY_EXCERPT_PRIMARY;
    public static final UniqueKey<FlywaySchemaHistoryRecord> KEY_FLYWAY_SCHEMA_HISTORY_PRIMARY = UniqueKeys0.KEY_FLYWAY_SCHEMA_HISTORY_PRIMARY;
    public static final UniqueKey<OriginalTextRecord> KEY_ORIGINAL_TEXT_PRIMARY = UniqueKeys0.KEY_ORIGINAL_TEXT_PRIMARY;
    public static final UniqueKey<RecordingRecord> KEY_RECORDING_PRIMARY = UniqueKeys0.KEY_RECORDING_PRIMARY;
    public static final UniqueKey<SpeakerRecord> KEY_SPEAKER_PRIMARY = UniqueKeys0.KEY_SPEAKER_PRIMARY;
    public static final UniqueKey<TextAudioRecord> KEY_TEXT_AUDIO_PRIMARY = UniqueKeys0.KEY_TEXT_AUDIO_PRIMARY;
    public static final UniqueKey<UserRecord> KEY_USER_PRIMARY = UniqueKeys0.KEY_USER_PRIMARY;
    public static final UniqueKey<UserRecord> KEY_USER_EMAIL = UniqueKeys0.KEY_USER_EMAIL;
    public static final UniqueKey<UserRecord> KEY_USER_USERNAME = UniqueKeys0.KEY_USER_USERNAME;
    public static final UniqueKey<UserAndTextAudioRecord> KEY_USER_AND_TEXT_AUDIO_PRIMARY = UniqueKeys0.KEY_USER_AND_TEXT_AUDIO_PRIMARY;
    public static final UniqueKey<UserAndTextAudioRecord> KEY_USER_AND_TEXT_AUDIO_UNI = UniqueKeys0.KEY_USER_AND_TEXT_AUDIO_UNI;
    public static final UniqueKey<UserGroupRecord> KEY_USER_GROUP_PRIMARY = UniqueKeys0.KEY_USER_GROUP_PRIMARY;
    public static final UniqueKey<UserGroupRoleRecord> KEY_USER_GROUP_ROLE_PRIMARY = UniqueKeys0.KEY_USER_GROUP_ROLE_PRIMARY;

    // -------------------------------------------------------------------------
    // FOREIGN KEY definitions
    // -------------------------------------------------------------------------

    public static final ForeignKey<CheckedUtteranceRecord, UserRecord> CHECKED_UTTERANCE_IBFK_1 = ForeignKeys0.CHECKED_UTTERANCE_IBFK_1;
    public static final ForeignKey<ExcerptRecord, OriginalTextRecord> EXCERPT_IBFK_1 = ForeignKeys0.EXCERPT_IBFK_1;
    public static final ForeignKey<OriginalTextRecord, UserGroupRecord> ORIGINAL_TEXT_IBFK_1 = ForeignKeys0.ORIGINAL_TEXT_IBFK_1;
    public static final ForeignKey<RecordingRecord, ExcerptRecord> RECORDING_IBFK_2 = ForeignKeys0.RECORDING_IBFK_2;
    public static final ForeignKey<RecordingRecord, UserRecord> RECORDING_IBFK_1 = ForeignKeys0.RECORDING_IBFK_1;
    public static final ForeignKey<UserGroupRoleRecord, UserRecord> USER_GROUP_ROLE_IBFK_2 = ForeignKeys0.USER_GROUP_ROLE_IBFK_2;
    public static final ForeignKey<UserGroupRoleRecord, UserGroupRecord> USER_GROUP_ROLE_IBFK_1 = ForeignKeys0.USER_GROUP_ROLE_IBFK_1;

    // -------------------------------------------------------------------------
    // [#1459] distribute members to avoid static initialisers > 64kb
    // -------------------------------------------------------------------------

    private static class Identities0 {
        public static Identity<CheckedUtteranceRecord, Long> IDENTITY_CHECKED_UTTERANCE = Internal.createIdentity(CheckedUtterance.CHECKED_UTTERANCE, CheckedUtterance.CHECKED_UTTERANCE.ID);
        public static Identity<ExcerptRecord, Long> IDENTITY_EXCERPT = Internal.createIdentity(Excerpt.EXCERPT, Excerpt.EXCERPT.ID);
        public static Identity<OriginalTextRecord, Long> IDENTITY_ORIGINAL_TEXT = Internal.createIdentity(OriginalText.ORIGINAL_TEXT, OriginalText.ORIGINAL_TEXT.ID);
        public static Identity<RecordingRecord, Long> IDENTITY_RECORDING = Internal.createIdentity(Recording.RECORDING, Recording.RECORDING.ID);
        public static Identity<SpeakerRecord, Long> IDENTITY_SPEAKER = Internal.createIdentity(Speaker.SPEAKER, Speaker.SPEAKER.ID);
        public static Identity<TextAudioRecord, Long> IDENTITY_TEXT_AUDIO = Internal.createIdentity(TextAudio.TEXT_AUDIO, TextAudio.TEXT_AUDIO.ID);
        public static Identity<UserRecord, Long> IDENTITY_USER = Internal.createIdentity(User.USER, User.USER.ID);
        public static Identity<UserAndTextAudioRecord, Long> IDENTITY_USER_AND_TEXT_AUDIO = Internal.createIdentity(UserAndTextAudio.USER_AND_TEXT_AUDIO, UserAndTextAudio.USER_AND_TEXT_AUDIO.ID);
        public static Identity<UserGroupRecord, Long> IDENTITY_USER_GROUP = Internal.createIdentity(UserGroup.USER_GROUP, UserGroup.USER_GROUP.ID);
        public static Identity<UserGroupRoleRecord, Long> IDENTITY_USER_GROUP_ROLE = Internal.createIdentity(UserGroupRole.USER_GROUP_ROLE, UserGroupRole.USER_GROUP_ROLE.ID);
    }

    private static class UniqueKeys0 {
        public static final UniqueKey<CheckedUtteranceRecord> KEY_CHECKED_UTTERANCE_PRIMARY = Internal.createUniqueKey(CheckedUtterance.CHECKED_UTTERANCE, "KEY_checked_utterance_PRIMARY", CheckedUtterance.CHECKED_UTTERANCE.ID);
        public static final UniqueKey<ExcerptRecord> KEY_EXCERPT_PRIMARY = Internal.createUniqueKey(Excerpt.EXCERPT, "KEY_excerpt_PRIMARY", Excerpt.EXCERPT.ID);
        public static final UniqueKey<FlywaySchemaHistoryRecord> KEY_FLYWAY_SCHEMA_HISTORY_PRIMARY = Internal.createUniqueKey(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY, "KEY_flyway_schema_history_PRIMARY", FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.INSTALLED_RANK);
        public static final UniqueKey<OriginalTextRecord> KEY_ORIGINAL_TEXT_PRIMARY = Internal.createUniqueKey(OriginalText.ORIGINAL_TEXT, "KEY_original_text_PRIMARY", OriginalText.ORIGINAL_TEXT.ID);
        public static final UniqueKey<RecordingRecord> KEY_RECORDING_PRIMARY = Internal.createUniqueKey(Recording.RECORDING, "KEY_recording_PRIMARY", Recording.RECORDING.ID);
        public static final UniqueKey<SpeakerRecord> KEY_SPEAKER_PRIMARY = Internal.createUniqueKey(Speaker.SPEAKER, "KEY_speaker_PRIMARY", Speaker.SPEAKER.ID);
        public static final UniqueKey<TextAudioRecord> KEY_TEXT_AUDIO_PRIMARY = Internal.createUniqueKey(TextAudio.TEXT_AUDIO, "KEY_text_audio_PRIMARY", TextAudio.TEXT_AUDIO.ID);
        public static final UniqueKey<UserRecord> KEY_USER_PRIMARY = Internal.createUniqueKey(User.USER, "KEY_user_PRIMARY", User.USER.ID);
        public static final UniqueKey<UserRecord> KEY_USER_EMAIL = Internal.createUniqueKey(User.USER, "KEY_user_email", User.USER.EMAIL);
        public static final UniqueKey<UserRecord> KEY_USER_USERNAME = Internal.createUniqueKey(User.USER, "KEY_user_username", User.USER.USERNAME);
        public static final UniqueKey<UserAndTextAudioRecord> KEY_USER_AND_TEXT_AUDIO_PRIMARY = Internal.createUniqueKey(UserAndTextAudio.USER_AND_TEXT_AUDIO, "KEY_user_and_text_audio_PRIMARY", UserAndTextAudio.USER_AND_TEXT_AUDIO.ID);
        public static final UniqueKey<UserAndTextAudioRecord> KEY_USER_AND_TEXT_AUDIO_UNI = Internal.createUniqueKey(UserAndTextAudio.USER_AND_TEXT_AUDIO, "KEY_user_and_text_audio_uni", UserAndTextAudio.USER_AND_TEXT_AUDIO.USER_ID, UserAndTextAudio.USER_AND_TEXT_AUDIO.TEXT_AUDIO_ID);
        public static final UniqueKey<UserGroupRecord> KEY_USER_GROUP_PRIMARY = Internal.createUniqueKey(UserGroup.USER_GROUP, "KEY_user_group_PRIMARY", UserGroup.USER_GROUP.ID);
        public static final UniqueKey<UserGroupRoleRecord> KEY_USER_GROUP_ROLE_PRIMARY = Internal.createUniqueKey(UserGroupRole.USER_GROUP_ROLE, "KEY_user_group_role_PRIMARY", UserGroupRole.USER_GROUP_ROLE.ID);
    }

    private static class ForeignKeys0 {
        public static final ForeignKey<CheckedUtteranceRecord, UserRecord> CHECKED_UTTERANCE_IBFK_1 = Internal.createForeignKey(ch.fhnw.labeling_tool.jooq.Keys.KEY_USER_PRIMARY, CheckedUtterance.CHECKED_UTTERANCE, "checked_utterance_ibfk_1", CheckedUtterance.CHECKED_UTTERANCE.USER_ID);
        public static final ForeignKey<ExcerptRecord, OriginalTextRecord> EXCERPT_IBFK_1 = Internal.createForeignKey(ch.fhnw.labeling_tool.jooq.Keys.KEY_ORIGINAL_TEXT_PRIMARY, Excerpt.EXCERPT, "excerpt_ibfk_1", Excerpt.EXCERPT.ORIGINAL_TEXT_ID);
        public static final ForeignKey<OriginalTextRecord, UserGroupRecord> ORIGINAL_TEXT_IBFK_1 = Internal.createForeignKey(ch.fhnw.labeling_tool.jooq.Keys.KEY_USER_GROUP_PRIMARY, OriginalText.ORIGINAL_TEXT, "original_text_ibfk_1", OriginalText.ORIGINAL_TEXT.USER_GROUP_ID);
        public static final ForeignKey<RecordingRecord, ExcerptRecord> RECORDING_IBFK_2 = Internal.createForeignKey(ch.fhnw.labeling_tool.jooq.Keys.KEY_EXCERPT_PRIMARY, Recording.RECORDING, "recording_ibfk_2", Recording.RECORDING.EXCERPT_ID);
        public static final ForeignKey<RecordingRecord, UserRecord> RECORDING_IBFK_1 = Internal.createForeignKey(ch.fhnw.labeling_tool.jooq.Keys.KEY_USER_PRIMARY, Recording.RECORDING, "recording_ibfk_1", Recording.RECORDING.USER_ID);
        public static final ForeignKey<UserGroupRoleRecord, UserRecord> USER_GROUP_ROLE_IBFK_2 = Internal.createForeignKey(ch.fhnw.labeling_tool.jooq.Keys.KEY_USER_PRIMARY, UserGroupRole.USER_GROUP_ROLE, "user_group_role_ibfk_2", UserGroupRole.USER_GROUP_ROLE.USER_ID);
        public static final ForeignKey<UserGroupRoleRecord, UserGroupRecord> USER_GROUP_ROLE_IBFK_1 = Internal.createForeignKey(ch.fhnw.labeling_tool.jooq.Keys.KEY_USER_GROUP_PRIMARY, UserGroupRole.USER_GROUP_ROLE, "user_group_role_ibfk_1", UserGroupRole.USER_GROUP_ROLE.USER_GROUP_ID);
    }
}
