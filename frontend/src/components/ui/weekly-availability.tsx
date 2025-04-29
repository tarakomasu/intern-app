"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// 曜日の配列（月曜日スタート）
const DAYS_OF_WEEK = [
  { id: 1, name: "月", fullName: "月曜日" },
  { id: 2, name: "火", fullName: "火曜日" },
  { id: 3, name: "水", fullName: "水曜日" },
  { id: 4, name: "木", fullName: "木曜日" },
  { id: 5, name: "金", fullName: "金曜日" },
  { id: 6, name: "土", fullName: "土曜日" },
  { id: 0, name: "日", fullName: "日曜日" },
]

export type AvailabilityDay = {
  day: number
  available: boolean
  hours: number
}

interface WeeklyAvailabilityProps {
  value?: AvailabilityDay[]
  onChange?: (value: AvailabilityDay[]) => void
}

export default function WeeklyAvailability({ value, onChange }: WeeklyAvailabilityProps) {
  // 各曜日の勤務可能時間の状態
  const [availability, setAvailability] = useState<AvailabilityDay[]>(
    value ||
      DAYS_OF_WEEK.map((day) => ({
        day: day.id,
        available: false,
        hours: 8,
      })),
  )

  // 外部から値が変更された場合に状態を更新
  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(availability)) {
      setAvailability(value)
    }
  }, [value])
  

  // 内部状態が変更されたときに親コンポーネントに通知
  useEffect(() => {
    if (onChange) {
      onChange(availability)
    }
  }, [availability, onChange])

  // 曜日の利用可否を切り替える
  const toggleDayAvailability = (dayIndex: number) => {
    const newAvailability = [...availability]
    newAvailability[dayIndex].available = !newAvailability[dayIndex].available
    setAvailability(newAvailability)
  }

  // 勤務可能時間を更新
  const updateHours = (dayIndex: number, hours: number) => {
    // 0〜12の範囲に制限
    const validHours = Math.min(Math.max(0, hours), 12)

    const newAvailability = [...availability]
    newAvailability[dayIndex].hours = validHours
    setAvailability(newAvailability)
  }

  // 合計勤務時間を計算
  const totalHours = availability.reduce((total, day) => {
    return total + (day.available ? day.hours : 0)
  }, 0)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={day.id} className="flex flex-col border rounded-md">
            <div className="p-3 border-b bg-muted/20 flex items-center justify-between">
              <div className="font-medium">{day.fullName}</div>
              <Switch
                checked={availability[index].available}
                onCheckedChange={() => toggleDayAvailability(index)}
                aria-label={`${day.fullName}の勤務可否`}
              />
            </div>

            <div className={cn("p-3 space-y-3", !availability[index].available && "opacity-50")}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`hours-${day.id}`} className="text-xs">
                    勤務可能:
                  </Label>
                  <span className="text-sm font-medium">{availability[index].hours}時間</span>
                </div>
                <Input
                  id={`hours-${day.id}`}
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={availability[index].hours}
                  onChange={(e) => updateHours(index, Number.parseFloat(e.target.value))}
                  disabled={!availability[index].available}
                  className="h-6"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0h</span>
                  <span>6h</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "mt-auto p-3 text-center border-t",
                availability[index].available
                  ? "bg-primary/10 text-primary font-medium"
                  : "bg-muted/20 text-muted-foreground",
              )}
            >
              {availability[index].available ? `${availability[index].hours}時間` : "勤務不可"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-muted/10 rounded-md text-center">
        <span className="font-medium">週間合計: </span>
        <span className="text-primary font-bold">{totalHours}時間</span>
      </div>
    </div>
  )
}
