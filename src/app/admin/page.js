import { Input } from "@/components/ui/input";
import { getAccount, updateAccount, updateTokens } from "../actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function AdminPage() {
  const account = await getAccount();

  return (
    <div className="mt-8 w-96 m-auto space-y-2">
      {account?.key && account?.secret && (
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-md">Token Expiry : </span>
              <span>
                {account?.tokenExp ? account.tokenExp : "Token not found"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-md">Refresh Token Expiry : </span>
              <span>
                {account?.refTokenExp ? account.refTokenExp : "Token not found"}
              </span>
            </div>
            <Separator className="mt-4" />
            <form action={updateTokens}>
              <div className="space-y-2">
                <Label htmlFor="code">Enter code</Label>
                <Input
                  className="mt-2"
                  name="code"
                  id="code"
                  defaultValue=""
                  required
                />
                <Button>Generate Tokens</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Link
              target="_blank"
              href={`https://api-t1.fyers.in/api/v3/generate-authcode?client_id=${account.key}&redirect_uri=${account.rdurl}&response_type=code&state=sample_state`}
            >
              Click to get Code
            </Link>
          </CardFooter>
        </Card>
      )}
      <Card className="">
        <CardHeader>
          <CardTitle>Account Detail</CardTitle>
        </CardHeader>
        <form action={updateAccount}>
          <CardContent className="space-y-2">
            <div>
              <Label htmlFor="key">App Key</Label>
              <Input
                className="mt-2"
                name="key"
                id="key"
                required
                defaultValue={account?.key ? account.key : ""}
              />
            </div>
            <div>
              <Label htmlFor="secret">Secret</Label>
              <Input
                className="mt-2"
                name="secret"
                id="secret"
                required
                defaultValue={account?.secret ? account.secret : ""}
              />
            </div>
            <div>
              <Label htmlFor="pin">Pin</Label>
              <Input
                className="mt-2"
                name="pin"
                id="pin"
                required
                defaultValue={account?.pin ? account.pin : ""}
              />
            </div>
            <div>
              <Label htmlFor="rdurl">Redirect Url</Label>
              <Input
                className="mt-2"
                name="rdurl"
                id="rdurl"
                required
                defaultValue={account?.rdurl ? account.rdurl : ""}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
