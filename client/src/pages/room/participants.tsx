import { ParticipantsAudio, useCallStateHooks } from "@stream-io/video-react-sdk"
import { Participant } from "./participant";

export const Participants = () => {
    const {useParticipants} = useCallStateHooks();
    const participants = useParticipants();
    return (
        <div className="participant-panel">
            <div className="participants">
                <ParticipantsAudio participants={participants}/>
            </div>
            {participants.map((p) => <Participant participant=
            {p} key={p.sessionId}/>)}
        </div>)
}