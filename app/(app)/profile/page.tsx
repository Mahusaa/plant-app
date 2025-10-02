import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <Card className="p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/palm.png" alt="avatar" className="object-cover" />
          </Avatar>
          <div>
            <div className="font-medium">Alex Green</div>
            <div className="text-sm text-muted-foreground">alex@example.com</div>
          </div>
        </div>
      </Card>
      <Card className="p-4 space-y-3 shadow-sm">
        <Button className="w-full">Notifications</Button>
        <Button className="w-full">Dark Mode</Button>
        <Button className="w-full" variant="destructive">Sign out</Button>
      </Card>
    </main>
  );
}


