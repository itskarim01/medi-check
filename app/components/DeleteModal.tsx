type ConfirmDeleteModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function DeleteModal({ open, onConfirm, onCancel, loading }: ConfirmDeleteModalProps) {

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg text-center font-semibold mb-4">Are you sure You want to Delete?</h2>
        <p className="mb-6 text-center">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 font-semibold text-[15px] border-none rounded bg-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 font-semibold text-[15px] border-none rounded bg-red-500 text-white hover:bg-red-600"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
