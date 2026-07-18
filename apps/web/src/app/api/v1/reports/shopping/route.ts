import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ShoppingReportService } from "@lifesync/services"

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      // Purchase aggregates
      const history = await prisma.purchaseHistory.findMany({
        where: { userId: mockUserId },
      })
      const totalSpent = history.reduce((sum, p) => sum + p.totalAmount, 0)
      const totalItems = history.reduce((sum, p) => sum + p.itemsCount, 0)

      // Category breakdown
      const categorySum = {} as Record<string, number>
      const shoppingItems = await prisma.shoppingItem.findMany({
        where: { list: { userId: mockUserId } },
        include: { category: true },
      })

      shoppingItems.forEach((i) => {
        const catName = i.category?.name || "Groceries"
        categorySum[catName] = (categorySum[catName] || 0) + i.price * i.quantity
      })

      const totalCostSum = Object.values(categorySum).reduce((sum, a) => sum + a, 0) || 1
      const categoryBreakdown = Object.keys(categorySum).map((name) => {
        const amount = categorySum[name]
        const cat = shoppingItems.find((i) => i.category?.name === name)?.category
        return {
          categoryId: cat?.id || "Other",
          categoryName: name,
          amount,
          percentage: (amount / totalCostSum) * 100,
          color: cat?.color || "#9CA3AF",
        }
      })

      // Frequently purchased mocks
      const frequentlyPurchasedItems = [
        { name: "Organic Whole Milk", count: 8 },
        { name: "Fresh Avocados", count: 5 },
        { name: "Basmati Rice", count: 3 },
      ]

      // Month-by-month estimates
      const estimatedVsActualCost = [
        { month: "May", estimated: 180, actual: 165 },
        { month: "Jun", estimated: 220, actual: 242 },
        { month: "Jul", estimated: 190, actual: totalSpent },
      ]

      // Wishlist items
      const wishlistReport = await prisma.wishlistItem.findMany({
        where: { userId: mockUserId },
        include: { category: true },
      })

      // Pantry items
      const pantryReport = await prisma.pantryItem.findMany({
        where: { userId: mockUserId },
        include: { category: true },
      })

      return NextResponse.json({
        success: true,
        message: "Report compiled successfully",
        data: {
          monthlyShoppingSummary: { spent: totalSpent, itemsCount: totalItems },
          categoryBreakdown,
          frequentlyPurchasedItems,
          estimatedVsActualCost,
          wishlistReport,
          pantryReport,
        },
      })
    }

    const res = await ShoppingReportService.generateShoppingReport()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
