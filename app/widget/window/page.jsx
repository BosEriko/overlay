'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import Window from '../../_components/Window';

const Icon = () => {
    return (
        <FontAwesomeIcon
            icon={faTwitch}
            className="text-yellow-700 text-3xl drop-shadow-[1px_1px_2px_white]"
        />
    );
};

export default function WindowWidget() {
  return (
    <div className="h-[1080px] w-[1920px] relative">
        <div className="flex w-full h-full items-center justify-center">
            <Window title="Window" icon={Icon} height="auto">
                <div className="text-4xl bg-yellow-500 items-center justify-center flex h-[100px] [text-shadow:_1px_1px_2px_white] text-yellow-700">
                    Window Content
                </div>
            </Window>
        </div>
    </div>
  );
}
