import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect to auth/signin - middleware will handle authentication
  redirect('/auth/signin')
}
