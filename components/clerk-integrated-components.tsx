"use client"

import { useUser, SignInButton as ClerkSignInButton, UserButton as ClerkUserButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

import { Suspense } from "react"

function ProjectCardWithClerkInner({ project, renderContent }: { project: any; renderContent: (props: { project: any; isSignedIn: boolean; SignInButton: any }) => React.ReactNode }) {
  const { user } = useUser()
  return <>{renderContent({ project, isSignedIn: !!user, SignInButton: ClerkSignInButton })}</>
}

export function ProjectCardWithClerk(props: any) {
  return (
    <Suspense fallback={props.renderContent({ ...props, isSignedIn: false, SignInButton: null })}>
      <ProjectCardWithClerkInner {...props} />
    </Suspense>
  )
}

function AuthButtonsContentInner() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && userId) {
      router.refresh()
    }
  }, [isLoaded, userId, router])

  return (
    <>
      <SignedOut>
        <ClerkSignInButton mode="modal">
          <Button variant="ghost" size="sm" className="hidden sm:flex rounded-full glass border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-500 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
            Se connecter
          </Button>
        </ClerkSignInButton>
      </SignedOut>
      <SignedIn>
        <ClerkUserButton />
      </SignedIn>
    </>
  )
}

export function AuthButtonsContent() {
  return (
    <Suspense fallback={null}>
      <AuthButtonsContentInner />
    </Suspense>
  )
}
