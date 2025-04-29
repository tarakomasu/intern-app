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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import WeeklyAvailability from "@/components/ui/weekly-availability"

import axios from "axios"

// バリデーションスキーマを更新して勤務可能時間を追加
const profileFormSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" })
    .min(1, { message: "メールアドレスは必須です" }),
  password: z.string().min(8, { message: "パスワードは8文字以上で入力してください" }),
  first_name: z.string().min(1, { message: "姓は必須です" }),
  given_name: z.string().min(1, { message: "名は必須です" }),
  first_kana: z.string().min(1, { message: "姓（カナ）は必須です" }),
  given_kana: z.string().min(1, { message: "名（カナ）は必須です" }),
  sex: z.string().optional(),
  school: z.string().optional(),
  faculty: z.string().optional(),
  major: z.string().optional(),
  grade: z.string().optional(),
  graduate_year: z.string().optional(),
  address: z.string().optional(),
  pr: z.string().optional(),
  schedule: z.any()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // デフォルト値
  const defaultValues: Partial<ProfileFormValues> = {
    email: "",
    password: "",
    first_name: "",
    given_name: "",
    first_kana: "",
    given_kana: "",
    sex: "",
    school: "",
    faculty: "",
    major: "",
    grade: "",
    graduate_year: "",
    address: "",
    pr: "",
    schedule: [
      { day: 1, available: false, hours: 8 }, // 月
      { day: 2, available: false, hours: 8 }, // 火
      { day: 3, available: false, hours: 8 }, // 水
      { day: 4, available: false, hours: 8 }, // 木
      { day: 5, available: false, hours: 8 }, // 金
      { day: 6, available: false, hours: 8 }, // 土
      { day: 0, available: false, hours: 8 }, // 日
    ],
  }

  // 追加
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isEmailChecking, setIsEmailChecking] = useState(false)

  const checkEmail = async (email: string) => {
    if (!email) return
    setIsEmailChecking(true)
    try {
      const res = await fetch(`http://localhost:3001/students/check_email?email=${encodeURIComponent(email)}`)
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
    router.push("/")
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  // onSubmit関数を更新して、コンソールに勤務可能時間も表示
  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    if(data.schedule){
      var allschedule = ""
      data.schedule.forEach(con =>
        allschedule += (con.available as unknown as string +'-'+ con.day as string +'-'+ con.hours as string +'/')
      )
    try {
      data.schedule = allschedule
      const response = await fetch("http://localhost:3001/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student: data }),
      })

      const devise_email ='jobseeker/'+ data.email
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
     // router.push("/") // 任意のページへ遷移
    } catch (error: any) {
      alert(`送信エラー: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  }
  // 卒業年度の選択肢を生成
  const currentYear = new Date().getFullYear()
  const graduateYears = Array.from({ length: 6 }, (_, i) => (currentYear + i).toString())

  return (
    <div className="container  py-10 flex justify-center items-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">プロフィール登録</CardTitle>
          <CardDescription>
            就活に必要な基本情報を入力してください。<span className="text-red-500">*</span>は必須項目です。
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">基本情報</h3>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        メールアドレス <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@mail.com"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur()
                            checkEmail(e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      {emailError && <p className="text-sm text-red-500">{emailError}</p>}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          姓 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="山田" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="given_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          名 <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="太郎" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_kana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          姓（カナ） <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="ヤマダ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="given_kana"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          名（カナ） <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="タロウ" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>性別</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">男性</SelectItem>
                          <SelectItem value="female">女性</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                          <SelectItem value="no_answer">回答しない</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">学歴情報</h3>

                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>学校名</FormLabel>
                      <FormControl>
                        <Input placeholder="○○大学" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="faculty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>学部</FormLabel>
                        <FormControl>
                          <Input placeholder="○○学部" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>学科・専攻</FormLabel>
                        <FormControl>
                          <Input placeholder="○○学科" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>学年</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">学部1年</SelectItem>
                            <SelectItem value="2">学部2年</SelectItem>
                            <SelectItem value="3">学部3年</SelectItem>
                            <SelectItem value="4">学部4年</SelectItem>
                            <SelectItem value="m1">修士1年</SelectItem>
                            <SelectItem value="m2">修士2年</SelectItem>
                            <SelectItem value="d">博士</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="graduate_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>卒業予定年度</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="選択してください" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {graduateYears.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}年
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">その他の情報</h3>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>住所</FormLabel>
                      <FormControl>
                        <Input placeholder="○○県○○市○○町1-2-3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>自己PR</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="あなたの強みや特徴、就活への意気込みなどを自由に記入してください。"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        企業へのアピールポイントとなります。具体的なエピソードを交えて記入すると効果的です。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">勤務可能時間</h3>
                <FormDescription className="mb-4">
                  各曜日の勤務可能な時間数を設定してください。この情報は企業とのマッチングに活用されます。
                </FormDescription>
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <WeeklyAvailability value={field.value} onChange={field.onChange} />
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
                {isSubmitting ? "送信中..." : "プロフィールを保存"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
