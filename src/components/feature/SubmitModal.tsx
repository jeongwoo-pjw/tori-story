import { useNavigate } from "react-router-dom";

const ENCOURAGEMENTS = [
  "정말 멋진 답변이에요! 다음에도 이렇게 열심히 해보세요.",
  "우와, 잘했어요! 토리가 칭찬해요.",
  "정말 대단해요! 오늘도 훌륭한 하루였어요.",
  "잘했어요! 계속 이렇게 도전하는 모습이 멋져요.",
];

const RANDOM_IMAGE =
  "https://readdy.ai/api/search-image?query=Cute%20cheerful%20cartoon%20bunny%20character%20giving%20thumbs%20up%20with%20sparkles%20and%20stars%20soft%20pastel%20colors%20kawaii%20style%20warm%20friendly%20expression%20children%20illustration%20style%20clean%20simple%20background%20gentle%20lighting&width=400&height=400&seq=submit-modal-01&orientation=squarish";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitModal({ isOpen, onClose }: SubmitModalProps) {
  const navigate = useNavigate();
  const message = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-950/50">
      <div className="relative w-full max-w-sm mx-4 rounded-3xl bg-background-50 border border-background-200/70 p-6 md:p-8 shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-foreground-400 hover:text-foreground-700 transition-colors cursor-pointer"
        >
          <i className="ri-close-line w-6 h-6 flex items-center justify-center text-2xl"></i>
        </button>

        {/* Image */}
        <div className="flex justify-center mb-4">
          <div className="w-40 h-40 rounded-2xl overflow-hidden bg-secondary-100">
            <img
              src={RANDOM_IMAGE}
              alt="격려하는 캐릭터"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-base font-label text-foreground-950 mb-6 leading-relaxed">
          {message}
        </p>

        {/* CTA buttons - side by side */}
        <div className="flex flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/");
            }}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            홈화면 이동하기
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/bookshelf");
            }}
            className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-secondary-100 hover:bg-secondary-200 text-foreground-700 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            책장 이동하기
          </button>
        </div>
      </div>
    </div>
  );
}
