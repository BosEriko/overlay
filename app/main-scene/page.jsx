'use client';
import Flash from '../_commands/Flash';
import Pomodoro from '../_commands/Pomodoro';
import Brb from '../_commands/Brb';
import Typing from '../_commands/Typing';
import Shoutout from '../_commands/Shoutout';
import Christian from '../_commands/Christian';
import Countdown from '../_commands/Countdown';

export default function MainScene() {
  return (
    <div>
      <div className="w-[1920px] flex justify-center mt-5 left-0"><Countdown /></div>
      <Flash />
      <div className="absolute top-5 right-5"><Pomodoro /></div>
      <Typing />
      <div className="w-[1920px] h-[1080px] flex justify-center items-center top-0 left-0 absolute"><Brb /></div>
      <div className="absolute top-5 left-5"><Shoutout /></div>
      <div className="w-[1920px] h-[1080px] top-0 left-0 absolute"><Christian /></div>
    </div>
  );
}
