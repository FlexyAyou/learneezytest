import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

const toRenderable = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined) return null
  if (React.isValidElement(value)) return value

  if (typeof value === "string" || typeof value === "number") return value
  if (typeof value === "boolean") return value ? "true" : "false"

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const withSafeToastAction = (action: unknown) => {
  if (!React.isValidElement(action)) return null

  const isToastAction =
    action.type === ToastAction ||
    ((action.type as { displayName?: string } | undefined)?.displayName ===
      ToastAction.displayName)

  if (!isToastAction) return action

  const currentAltText = (action.props as { altText?: unknown })?.altText
  if (typeof currentAltText === "string" && currentAltText.trim().length > 0) {
    return action
  }

  return React.cloneElement(action as React.ReactElement<{ altText?: string }>, {
    altText: "Action de notification",
  })
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const safeTitle = toRenderable(title)
        const safeDescription = toRenderable(description)
        const safeAction = withSafeToastAction(action)

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {safeTitle !== null && safeTitle !== "" && (
                <ToastTitle>{safeTitle}</ToastTitle>
              )}
              {safeDescription !== null && safeDescription !== "" && (
                <ToastDescription>{safeDescription}</ToastDescription>
              )}
            </div>
            {safeAction}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
