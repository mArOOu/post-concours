export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <div className="ui-surface-elevated flex min-h-[calc(100vh-2.5rem)] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5 sm:px-10">
          <div className="space-y-2">
            <div className="ui-skeleton h-3 w-28" />
            <div className="ui-skeleton h-4 w-52" />
          </div>
          <div className="ui-skeleton h-9 w-36 rounded-full" />
        </div>

        <div className="grid flex-1 gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[1.3fr_0.9fr] lg:px-14 lg:py-16">
          <div className="flex flex-col justify-center gap-6">
            <div className="ui-skeleton h-8 w-56 rounded-full" />
            <div className="space-y-4">
              <div className="ui-skeleton h-14 w-full max-w-3xl" />
              <div className="ui-skeleton h-14 w-full max-w-2xl" />
            </div>
            <div className="ui-skeleton h-20 w-full max-w-2xl" />
            <div className="flex gap-3">
              <div className="ui-skeleton h-12 w-40 rounded-full" />
              <div className="ui-skeleton h-12 w-40 rounded-full" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="ui-skeleton h-56 w-full rounded-[28px]" />
            <div className="ui-skeleton h-44 w-full rounded-[28px]" />
          </div>
        </div>
      </div>
    </main>
  );
}
