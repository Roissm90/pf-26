"use client";

import { useActionState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { deleteAllEvents } from "./actions";

export function DeleteEventsButton({ className }: { className: string }) {
  const [state, action, pending] = useActionState(deleteAllEvents, { error: "" });

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (pending || !window.confirm(
          "Vas a borrar todos los registros de analitica de Supabase. Esta accion no tiene vuelta atras. ¿Quieres continuar?",
        )) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        title="Borrar todos los registros"
        aria-label="Borrar todos los registros"
        disabled={pending}
        className={`${className} disabled:cursor-wait disabled:opacity-50`}
      >
        {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
      {state.error && <p role="alert" className="mt-2 max-w-48 text-sm text-red-600">{state.error}</p>}
    </form>
  );
}