import React, { useState, useEffect } from "react";
 import playImage from '../../assets/img/play-button.png';
 import pauseImage from '../../assets/img/pause.png';
 import stopImage from '../../assets/img/reload.png';
const useAudio = (url,isPlayAudio) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(isPlayAudio);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
      playing ? audio.play() : audio.pause();
    },
    [playing]
  );

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const PlayAudioFile = (props) => {
  const [playing, toggle] = useAudio(props.audioUrl,props.isPlayAudio);
  return (
    <div>
      {(function() {
            if (props.questionType=='subquestion') {
                return <button onClick={toggle} className="playQuiz">
                   {playing ? <><img src={pauseImage} />Pause </>: <><img src={playImage} />Play </>}
                </button>;
            } else {
                return <button onClick={toggle} className="playQuiz">
                    {playing ? <><img src={stopImage} />Play Again</> : <><img src={playImage} />Play</> }
                </button>;
            }
        })()}
      {/* <button onClick={toggle}>{playing ? "Pause" : "Play" }</button> 
      <button onClick={toggle} className="playQuiz"><img src={playImage}/>Play</button>
      <button onClick={toggle} className="playQuiz"><img src={pauseImage}/>Pause</button>
      <button onClick={toggle} className="playQuiz"><img src={stopImage}/>Play Again</button> */}
    </div>
  );
};

export default PlayAudioFile;