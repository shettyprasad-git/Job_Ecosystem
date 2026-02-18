import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PrimaryWorkspace() {
  return (
    <div className="w-full lg:w-[65%] xl:w-[70%] space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Component Configuration</CardTitle>
          <CardDescription>Define the properties for your new component.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="component-name">Component Name</Label>
            <Input id="component-name" placeholder="e.g., PrimaryButton" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="component-type">Component Type</Label>
            <Select>
              <SelectTrigger id="component-type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="input">Input</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline">Reset</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>API Endpoint</CardTitle>
          <CardDescription>Connect your component to a data source.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="api-url">API URL</Label>
          <Input id="api-url" placeholder="https://api.example.com/data" />
        </CardContent>
        <CardFooter>
          <Button variant="outline">Test Connection</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
