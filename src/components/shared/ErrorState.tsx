interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-sm underline underline-offset-4 hover:text-foreground"
      >
        Recargar página
      </button>
    </div>
  );
}
