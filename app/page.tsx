"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { GamepadIcon, ShoppingCart, Calculator, Clock } from "lucide-react"

interface MenuItem {
  name: string
  price: number
  quantity: number
}

interface GameSession {
  selectedConsole: "ps3" | "ps4" | ""
  hasController: boolean
  startTime: string
  endTime: string
}

export default function AtlantClubApp() {
  const [gameSession, setGameSession] = useState<GameSession>({
    selectedConsole: "",
    hasController: false,
    startTime: "",
    endTime: "",
  })

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: "Cola", price: 2.5, quantity: 0 },
    { name: "Cips", price: 3, quantity: 0 },
    { name: "Çay", price: 2, quantity: 0 },
    { name: "Tum", price: 2, quantity: 0 },
    { name: "Qəlyan", price: 8, quantity: 0 },
  ])

  const calculateTimeDifference = () => {
    if (!gameSession.startTime || !gameSession.endTime) return 0

    const [startHour, startMin] = gameSession.startTime.split(":").map(Number)
    const [endHour, endMin] = gameSession.endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMin
    let endMinutes = endHour * 60 + endMin

    // Əgər bitmə vaxtı başlama vaxtından kiçikdirsə, növbəti günə keçir
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60
    }

    return Math.max(0, endMinutes - startMinutes)
  }

  const calculateGamePrice = () => {
    const totalMinutes = calculateTimeDifference()
    const hours = totalMinutes / 60

    let basePrice = 0
    if (gameSession.selectedConsole === "ps3") basePrice = hours * 1
    if (gameSession.selectedConsole === "ps4") basePrice = hours * 1.5

    const controllerPrice = gameSession.hasController ? hours * 0.5 : 0

    return basePrice + controllerPrice
  }

  const calculateMenuTotal = () => {
    return menuItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalPrice = () => {
    return calculateGamePrice() + calculateMenuTotal()
  }

  const updateMenuQuantity = (index: number, change: number) => {
    setMenuItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: Math.max(0, item.quantity + change) } : item)),
    )
  }

  const handleConsoleChange = (console: "ps3" | "ps4") => {
    setGameSession((prev) => ({
      ...prev,
      selectedConsole: prev.selectedConsole === console ? "" : console,
    }))
  }

  const resetAll = () => {
    setGameSession({
      selectedConsole: "",
      hasController: false,
      startTime: "",
      endTime: "",
    })
    setMenuItems((prev) => prev.map((item) => ({ ...item, quantity: 0 })))
  }

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}s ${mins}d`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Başlıq */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <GamepadIcon className="w-8 h-8" />
              Atlant
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Vaxt Seçimi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Oyun Vaxtı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Başlama vaxtı</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={gameSession.startTime}
                  onChange={(e) => setGameSession((prev) => ({ ...prev, startTime: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="endTime">Bitmə vaxtı</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={gameSession.endTime}
                  onChange={(e) => setGameSession((prev) => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>

            {gameSession.startTime && gameSession.endTime && (
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-lg font-bold text-blue-700">Ümumi müddət: {formatTime(calculateTimeDifference())}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Konsol Seçimi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GamepadIcon className="w-5 h-5" />
              Konsol Seçimi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="ps3"
                  checked={gameSession.selectedConsole === "ps3"}
                  onChange={() => handleConsoleChange("ps3")}
                  className="w-4 h-4"
                />
                <Label htmlFor="ps3" className="flex-1 cursor-pointer">
                  PlayStation 3<span className="text-blue-600 ml-2 font-medium">(1 ₼/saat)</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="ps4"
                  checked={gameSession.selectedConsole === "ps4"}
                  onChange={() => handleConsoleChange("ps4")}
                  className="w-4 h-4"
                />
                <Label htmlFor="ps4" className="flex-1 cursor-pointer">
                  PlayStation 4<span className="text-blue-600 ml-2 font-medium">(1.5 ₼/saat)</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="controller"
                  checked={gameSession.hasController}
                  onChange={(e) => setGameSession((prev) => ({ ...prev, hasController: e.target.checked }))}
                  disabled={!gameSession.selectedConsole}
                  className="w-4 h-4"
                />
                <Label
                  htmlFor="controller"
                  className={`flex-1 cursor-pointer ${!gameSession.selectedConsole ? "text-gray-400" : ""}`}
                >
                  Əlavə kumanda
                  <span className="text-blue-600 ml-2 font-medium">(+0.5 ₼/saat)</span>
                </Label>
              </div>
            </div>

            {gameSession.selectedConsole && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-700">
                  Seçilmiş: {gameSession.selectedConsole === "ps3" ? "PlayStation 3" : "PlayStation 4"}
                  {gameSession.hasController && " + Əlavə kumanda"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menyu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Menyu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {menuItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-blue-600 ml-2 font-medium">{item.price} ₼</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMenuQuantity(index, -1)}
                    disabled={item.quantity === 0}
                  >
                    -
                  </Button>
                  <Badge variant="secondary" className="min-w-[30px] text-center">
                    {item.quantity}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => updateMenuQuantity(index, 1)}>
                    +
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ümumi Hesab */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Calculator className="w-5 h-5" />
              Ümumi Hesab
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {gameSession.selectedConsole && (
                <div className="flex justify-between text-sm">
                  <span>{gameSession.selectedConsole === "ps3" ? "PS3" : "PS4"}:</span>
                  <span>
                    {((calculateTimeDifference() / 60) * (gameSession.selectedConsole === "ps3" ? 1 : 1.5)).toFixed(2)}{" "}
                    ₼
                  </span>
                </div>
              )}
              {gameSession.hasController && gameSession.selectedConsole && (
                <div className="flex justify-between text-sm">
                  <span>Əlavə kumanda:</span>
                  <span>{((calculateTimeDifference() / 60) * 0.5).toFixed(2)} ₼</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Oyun haqqı:</span>
                <span className="font-medium">{calculateGamePrice().toFixed(2)} ₼</span>
              </div>
              <div className="flex justify-between">
                <span>Menyu:</span>
                <span className="font-medium">{calculateMenuTotal().toFixed(2)} ₼</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-green-700">
                <span>Cəmi:</span>
                <span>{getTotalPrice().toFixed(2)} ₼</span>
              </div>
            </div>

            <Button onClick={resetAll} variant="outline" className="w-full mt-4 bg-transparent">
              Hamısını Təmizlə
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
