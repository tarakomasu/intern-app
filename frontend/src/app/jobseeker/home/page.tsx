import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">ホーム画面</h1>
          <p className="mt-2 text-sm text-slate-600">求人情報の掲載や学生検索のオプションを選択してください</p>
        </div>

        <div className="space-y-4">
          <Link href="/recruitment" className="block w-full">
            <Button
              variant="default"
              size="lg"
              className="w-full justify-between bg-blue-600 text-lg hover:bg-blue-700"
            >
              <span>募集を掲載するページへ</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <Link href="/search" className="block w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-between border-slate-300 text-lg text-slate-800 hover:bg-slate-50"
            >
              <span>学生を探すページへ</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
