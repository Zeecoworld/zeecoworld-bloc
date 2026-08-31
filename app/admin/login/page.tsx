import { login } from "@/lib/actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return <LoginForm searchParamsPromise={searchParams} />;
}

async function LoginForm({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ error?: string }>;
}) {
  const { error } = await searchParamsPromise;

  return (
    <div className="max-w-sm mx-auto px-6 py-24">
      <h1 className="text-2xl font-semibold text-[var(--dark)] mb-2">
        Admin sign in
      </h1>
      <p className="text-sm text-[var(--gray)] mb-8">
        Sign in to write and manage blog posts.
      </p>
      <form action={login} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--dark)] mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--dark)] mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-[var(--primary)] text-white rounded-lg py-2 font-medium hover:bg-[var(--primary-dark)] transition-colors"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
