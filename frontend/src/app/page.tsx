"use client"
import axios from "axios";
import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Mail, Lock, LogIn, UserPlus, User, Building2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
//import Cookies from "js-cookie"
export default function AuthScreen() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<"jobseeker" | "company" | null>(null)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    var mail = 'error'
    var url = ''
    if(userType == 'jobseeker'){
      mail = 'jobseeker/'+email
      url = 'jobseeker/home'
    }
    else if(userType == 'company'){
      mail = 'company/'+email
      url = 'company/home'
    }
    try{
    const response = await axios.post(
      "http://localhost:3001/auth/sign_in",
      {
        email: mail,
        password: password
      },
      {
        //withCredentials: true,  // Cookieを使う場合
      }
    );
    localStorage.setItem("access-token", response.headers["access-token"])
    localStorage.setItem("client", response.headers["client"])
    localStorage.setItem("uid", response.headers["uid"])
    console.log('ログイン成功！', response.headers);
    router.push(url)
   }
  catch(error){
    console.log(error)
   }

  }

  const handleRegister = () => {
    if (!userType) {
      alert("ユーザータイプを選択してください。")
      return
    }
    else if(userType == "jobseeker"){
      router.push('/jobseeker/profile')
    }
    else if(userType == "company"){
      router.push("company/profile")
    }
  }

  const handleGuestLogin = () => {
    console.log("Logging in as guest", "User type:", userType)
    // Add your guest login logic here
  }

  const selectJobSeeker = () => {
    setUserType("jobseeker")
  }

  const selectCompany = () => {
    setUserType("company")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">アカウント</CardTitle>
          <CardDescription>ユーザータイプを選択してください</CardDescription>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button
              variant={userType === "jobseeker" ? "default" : "outline"}
              className="w-full relative"
              onClick={selectJobSeeker}
            >
              <User className="mr-2 h-4 w-4" />
              就活生
              {userType === "jobseeker" && <Check className="h-4 w-4 absolute right-2" />}
            </Button>
            <Button
              variant={userType === "company" ? "default" : "outline"}
              className="w-full relative"
              onClick={selectCompany}
            >
              <Building2 className="mr-2 h-4 w-4" />
              企業
              {userType === "company" && <Check className="h-4 w-4 absolute right-2" />}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              ログイン
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">または</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleRegister}>
            <UserPlus className="mr-2 h-4 w-4" />
            新規登録
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


/*


'use client'
import { useEffect, useState } from 'react';

export default function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/notes') // Railsサーバーのポートに合わせる
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  return (
    <div>
      <h1>メモ一覧</h1>
      <ul>
        {notes.map((note: any) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </div>
  );
}


*/