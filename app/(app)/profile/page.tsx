export default function ProfilePage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="rounded-xl border p-4 bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/palm.png" alt="avatar" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <div className="font-medium">Alex Green</div>
            <div className="text-sm text-muted-foreground">alex@example.com</div>
          </div>
        </div>
      </div>
      <div className="rounded-xl border p-4 bg-card space-y-3 shadow-sm">
        <button className="w-full h-11 rounded-md bg-secondary text-secondary-foreground">Notifications</button>
        <button className="w-full h-11 rounded-md bg-secondary text-secondary-foreground">Dark Mode</button>
        <button className="w-full h-11 rounded-md bg-destructive text-white">Sign out</button>
      </div>
    </main>
  );
}


