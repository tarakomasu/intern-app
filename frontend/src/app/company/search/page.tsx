"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Loader2 } from "lucide-react"
//import Cookies from "js-cookie"
import axios from "axios"
import { useRouter } from 'next/navigation'
// 学生データの型定義
interface Student {
  id: string
  first_name: string
  given_name: string
  first_kana: string
  given_kana: string
  sex: string
  school: string
  faculty: string
  major: string
  grade: string
  graduate_year: string
  pr: string
  schedule: string // JSON文字列として保存されていると仮定
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  // 日本語の曜日表示
  const dayLabels = ["月", "火", "水", "木", "金", "土", "日"]
  function tohome(){
    router.push('/company/home')
  }
  // APIからデータを取得
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        // APIエンドポイントを適切なものに置き換えてください
        const response = await fetch("http://localhost:3001/students/get_data")
        
        if (!response.ok) {
          throw new Error("データの取得に失敗しました")
        }

        const data = await response.json()
        setStudents(data)
        console.log(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "データの取得中にエラーが発生しました")
        console.error("Error fetching students:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])


  // メッセージ送信処理
  const handleSendMessage = () => {
    if (!message.trim() || !selectedStudent) return

    setIsSending(true)

    // 送信完了を模擬（実際の実装では適切なAPIコールに置き換え）
    setTimeout(() => {
      setIsSending(false)
      setMessage("")
      setIsMessageDialogOpen(false)
    }, 1000)
  }

  // メッセージダイアログを開く
  const openMessageDialog = (student: Student) => {
    setSelectedStudent(student)
    setIsMessageDialogOpen(true)
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token")
    const client = localStorage.getItem("client")
    const uid = localStorage.getItem("uid")
    console.log('client',client)
    if (accessToken && client && uid) {
      axios.get("http://localhost:3001/auth/validate_token", {
        headers: {
          'access-token': localStorage.getItem('access-token'),
          'client': localStorage.getItem('client'),
          'uid': localStorage.getItem('uid')
        },
        withCredentials: true,
      })
      .then((res) => {
        setIsLoggedIn(true)
        console.log("ログイン中です", res.data)
      })
      .catch(() => {
        setIsLoggedIn(false)
        console.log("ログインしていません")
      })
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  // ローディング表示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">データを読み込み中...</span>
      </div>
    )
  }

  // エラー表示
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">エラーが発生しました</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    
    <div className="container mx-auto py-8 px-4">
      {/* ページヘッダー */}
      <div className="mb-8">
      <a
        href="#"
        onClick={tohome}
        className="text-3xl font-bold tracking-tight"
      >
        Homeへ
      </a>

        <p className="mt-2 text-muted-foreground">
          登録済みの学生一覧です。各学生の詳細情報や勤務可能時間を確認できます。
        </p>
      </div>
      {/* 学生一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => {
          // スケジュールをパース
          console.log(student.schedule)
          const availableHours = student.schedule
          .split('/')
          .filter(item => item !== '') // 最後に空文字があるから除外
          .map(item => {
            const [available, , hours] = item.split('-');
            return available === 'true' ? Number(hours) : 0;
          });

          // 最大勤務時間を計算（グラフの相対的な長さのため）
          const maxHours = 12

          // 氏名を結合
          const fullName = `${student.first_name}　${student.given_name}`
          const fullKana = `${student.first_kana}　${student.given_kana}`

          return (
            <Card key={student.id} className="h-full flex flex-col">
              <CardContent className="pt-6 flex-grow">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{fullName}</h3>
                    <p className="text-sm text-muted-foreground">{fullKana}</p>
                    <p className="text-sm text-muted-foreground">{student.school}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium">性別：</span>
                      {student.sex}
                    </div>
                    <div>
                      <span className="font-medium">学部：</span>
                      {student.faculty}
                    </div>
                    <div>
                      <span className="font-medium">専攻：</span>
                      {student.major}
                    </div>
                    <div>
                      <span className="font-medium">学年：</span>
                      {student.grade}
                    </div>
                    <div>
                      <span className="font-medium">卒業：</span>
                      {student.graduate_year}
                      年
                    </div>
                  </div>

                  {student.pr && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">自己PR</h4>
                      <p className="text-sm">{student.pr}</p>
                    </div>
                  )}

                  <div className="pt-2">
                    <h4 className="text-sm font-semibold mb-2">勤務可能時間</h4>
                    <div className="space-y-2">
                      {availableHours.map((hours, index) => {
                        const percentage = maxHours > 0 ? (hours / maxHours) * 100 : 0

                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-6 text-sm font-medium">{dayLabels[index]}</div>
                            <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden">
                              {hours > 0 ? (
                                <div
                                  className="h-full bg-primary/80 rounded-sm flex items-center px-2"
                                  style={{ width: `${percentage}%` }}
                                >
                                  <span className="text-xs text-primary-foreground whitespace-nowrap">{hours}時間</span>
                                </div>
                              ) : (
                                <div className="h-full flex items-center px-2">
                                  <span className="text-xs text-muted-foreground">勤務不可</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => openMessageDialog(student)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  メッセージを送る
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* メッセージダイアログ */}
      {selectedStudent && (
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedStudent.first_name} {selectedStudent.given_name}さんにメッセージを送る
              </DialogTitle>
              <DialogDescription>
                {selectedStudent.school} {selectedStudent.faculty} {selectedStudent.major} {selectedStudent.grade}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Textarea
                placeholder="メッセージを入力してください..."
                className="min-h-[150px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSendMessage} disabled={!message.trim() || isSending}>
                {isSending ? "送信中..." : "送信する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
