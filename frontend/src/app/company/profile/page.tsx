"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"

// バリデーションスキーマ
const companyRegisterSchema = z.object({
  email: z
    .string()
    //.email({ message: "有効なメールアドレスを入力してください" })
    .min(1, { message: "メールアドレスは必須です" }),
  password: z.string().min(8, { message: "パスワードは8文字以上で入力してください" }),
  name: z.string().min(1, { message: "企業名は必須です" }),
  description: z.string().min(1, { message: "企業説明は必須です" }),
  web: z.string().url({ message: "有効なURLを入力してください" }).optional().or(z.literal("")),
  logo_url: z.string().url({ message: "有効な画像URLを入力してください" }).optional().or(z.literal("")),
})

type CompanyRegisterValues = z.infer<typeof companyRegisterSchema>

export default function CompanyRegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // デフォルト値
  const defaultValues: Partial<CompanyRegisterValues> = {
    email: "",
    password: "",
    name: "",
    description: "",
    web: "",
    logo_url: "",
  }
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isEmailChecking, setIsEmailChecking] = useState(false)

  const checkEmail = async (email: string) => {
    if (!email) return
    setIsEmailChecking(true)
    try {
      const res = await fetch(`http://localhost:3001/companies/check_email?email=${encodeURIComponent(email)}`)
      const json = await res.json()
      if (json.exists) {
        setEmailError("このメールアドレスは既に登録されています")
      } else {
        setEmailError(null)
      }
    } catch (err) {
      setEmailError("確認中にエラーが発生しました")
    } finally {
      setIsEmailChecking(false)
    }
  }

  const Cancel = () => {
    router.push('/')
  }
  const form = useForm<CompanyRegisterValues>({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues,
  })

  async function onSubmit(data: CompanyRegisterValues) {
    setIsSubmitting(true)
  
    try {
      const response = await fetch("http://localhost:3001/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: data }),
      })
      
      const devise_email ='company/'+ data.email
      const devise_password = data.password
      console.log(typeof(devise_email))
      console.log(devise_email)
      const devise = await axios.post(
        "http://localhost:3001/auth",
        {
          email: devise_email,                  // ←キー名が"email"！
          password: devise_password,            // ←キー名が"password"！
          password_confirmation: devise_password
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(devise_email,devise_password)
      console.log(typeof(devise_email))
      console.log(devise)
      if (!response.ok) {
        const res = await response.json()
        throw new Error(res.errors?.join("\n") || "エラーが発生しました")
      }
  
      alert("プロフィールが保存されました")
      router.push("/") // 任意のページへ遷移
    } catch (error: any) {
      alert(`送信エラー: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl py-10 flex justify-center items-center min-h-screen">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">企業アカウント登録</CardTitle>
          <CardDescription>
            企業アカウントの登録情報を入力してください。<span className="text-red-500">*</span>は必須項目です。
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">アカウント情報</h3>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        メールアドレス <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="company@example.com"
                            type="email"
                            {...field}
                            onBlur={async (e) => {
                              field.onBlur?.() // React Hook Form の onBlur 呼び出し
                              await checkEmail(e.target.value)
                            }}
                          />
                          {isEmailChecking && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400">確認中...</span>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>ログインに使用するメールアドレスを入力してください</FormDescription>
                      <FormMessage />
                      {emailError && (
                        <p className="text-sm text-red-500 mt-1">{emailError}</p>
                      )}
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        パスワード <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="8文字以上で入力" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? "パスワードを隠す" : "パスワードを表示"}</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>安全なパスワードを設定してください</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">企業情報</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        企業名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="株式会社〇〇" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        企業説明 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="企業の事業内容や特徴などを記入してください"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>企業の事業内容、ビジョン、特徴などを記入してください</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="web"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ウェブサイトURL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" type="url" {...field} />
                      </FormControl>
                      <FormDescription>企業の公式ウェブサイトのURLを入力してください</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ロゴ画像URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormDescription>企業ロゴの画像URLを入力してください（JPG、PNG、SVG形式推奨）</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={Cancel}>
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "登録中..." : "企業アカウントを登録"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
