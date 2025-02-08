import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen overflow-auto">
      <div>
        <div className="w-full flex justify-center mb-2 spin-element">
          <AiOutlineLoading3Quarters />
        </div>
        <div className="w-full flex justify-center font-bold">Loading...</div>
      </div>
    </div>
  );
}
