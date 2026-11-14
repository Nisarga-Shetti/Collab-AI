
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/react'

import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key in .env')
}

function Root() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Show when="signed-out">
        <div className="min-h-screen bg-[#0b0814] text-white flex items-center justify-center p-6">
          <div className="text-center max-w-md w-full">
            <h1 className="text-4xl font-bold mb-3">
              CollabAI
            </h1>

            <p className="text-gray-400 mb-8">
              Your team's workspace for smarter collaboration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignInButton mode="modal">
                <button className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 font-semibold">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-6 py-3 rounded-xl border border-violet-500 text-white hover:bg-violet-600/20 font-semibold">
                  Create Account
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </Show>

      <Show when="signed-in">
        <div className="relative">
          <div className="fixed top-4 right-5 z-[100]">
            <UserButton />
          </div>
          <App />
        </div>
      </Show>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
