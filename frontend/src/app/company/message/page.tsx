"use client"

import type React from "react"

import { useState } from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

// Mock user data
var users = [
  {
    id: 'a',
    name: "田中 太郎",
  },
  {
    id: 'b',
    name: "佐藤 花子",
  },
  {
    id: 'c',
    name: "鈴木 一郎",
  },
  {
    id: 'd',
    name: "山田 直樹",
  },
]

// Mock chat messages
type ChatMessage = {
    id: number;
    sender: string;
    content: string;
    isSelf: boolean;
  };
  
  type MockChats = {
    [key: number]: ChatMessage[];
  };
  
  let mockChats: MockChats = {
    1: [
      { id: 1, sender: "田中 太郎", content: "こんにちは！", isSelf: false },
      { id: 2, sender: "自分", content: "こんにちは、田中さん。お元気ですか？", isSelf: true },
      { id: 3, sender: "田中 太郎", content: "はい、元気です。新しいプロジェクトについて相談したいことがあります。", isSelf: false },
      { id: 4, sender: "自分", content: "もちろん、どんなことでしょうか？", isSelf: true },
    ],
    2: [
      { id: 1, sender: "佐藤 花子", content: "明日の会議について", isSelf: false },
      { id: 2, sender: "自分", content: "はい、何時からでしたか？", isSelf: true },
      { id: 3, sender: "佐藤 花子", content: "午後2時からです。会議室Aで行います。", isSelf: false },
    ],
    3: [
      { id: 1, sender: "鈴木 一郎", content: "資料を送りました", isSelf: false },
      { id: 2, sender: "自分", content: "ありがとうございます。確認します。", isSelf: true },
    ],
    4: [
      { id: 1, sender: "山田 直樹", content: "お疲れ様です", isSelf: false },
      { id: 2, sender: "自分", content: "お疲れ様です。先日はありがとうございました。", isSelf: true },
    ],
  };
  
const getNewId = () => {
    const keys = Object.keys(mockChats); // mockChats オブジェクトのキーを取得
    const numericKeys = keys.map(key => parseInt(key, 10)); // キーを数値に変換
    const maxId = numericKeys.length > 0 ? Math.max(...numericKeys) : 0; // 最大値を取得
    return maxId + 1; // 新しいIDは最大値+1
  };
export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState("")
  const [newMessage, setNewMessage] = useState("")


  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const value = localStorage.getItem('uid');
      const userEmail = value ? value.substring(value.indexOf('/') + 1) : '';
  
      const url = `http://localhost:3001/messages/get_data?to=${userEmail}`;
      console.log(url);
  
      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        console.log('con',data.content[0]);
        users.push({
            id: data.from,
            name: data.from
        })
        const newChatId = Object.keys(mockChats).length + 1;
        mockChats[newChatId] = data.map(msg => ({
            id: msg.from,
            sender: msg.from,
            content: msg.content,
            isSelf: 'false'
          }));
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    // In a real app, you would send this message to your backend
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left sidebar - User list */}
      <div className="w-full max-w-xs border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">メッセージ</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-65px)]">
          <div className="p-2">
            {users.map((user) => (
              <button
                key={user.id}
                className={`w-full p-3 rounded-lg text-left ${
                  selectedUser === user.id ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedUser(user.id)}
              >
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center">
                    <span className="font-medium">{user.name}</span>
                  </div>

                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right side - Chat window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b">
              <div>
                <h2 className="font-medium">{users.find((u) => u.id === selectedUser)?.name}</h2>
              </div>
            </div>

            {/* Chat messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockChats[selectedUser as keyof typeof mockChats].map((message) => (
                  <div key={message.id} className={`flex ${message.isSelf ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isSelf ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="メッセージを入力..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>左側のユーザーをクリックして</p>
              <p>チャットを開始してください</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
