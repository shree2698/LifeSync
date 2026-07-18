import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ShoppingReportService } from "@lifesync/services"

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      // Pending items
      const todayShopping = await prisma.shoppingItem.findMany({
        where: {
          list: { userId: mockUserId },
          isCompleted: false,
        },
        include: { category: true },
      })
      const pendingItemsCount = todayShopping.length

      // Completed items
      const completedItemsCount = await prisma.shoppingItem.count({
        where: {
          list: { userId: mockUserId },
          isCompleted: true,
        },
      })

      // Monthly essentials
      const monthlyEssentialsCount = await prisma.monthlyEssential.count({
        where: { userId: mockUserId },
      })

      // Low stock pantry items
      const pantryItems = await prisma.pantryItem.findMany({
        where: { userId: mockUserId },
        include: { category: true },
      })
      const lowStockItems = pantryItems.filter((p) => p.currentQuantity <= p.minimumQuantity)

      // Wishlist items count
      const wishlistCount = await prisma.wishlistItem.count({
        where: { userId: mockUserId, isPurchased: false },
      })

      // Estimated total cost
      const estimatedTotalCost = todayShopping.reduce((sum, item) => sum + item.price * item.quantity, 0)

      // Recent purchases
      const recentPurchases = await prisma.purchaseHistory.findMany({
        where: { userId: mockUserId },
        orderBy: { purchaseDate: "desc" },
        take: 5,
      })

      // Statistics
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthlyPurchases = await prisma.purchaseHistory.findMany({
        where: {
          userId: mockUserId,
          purchaseDate: { gte: startOfMonth },
        },
      })
      const totalSpentThisMonth = monthlyPurchases.reduce((sum, p) => sum + p.totalAmount, 0)
      const itemsBoughtThisMonth = monthlyPurchases.reduce((sum, p) => sum + p.itemsCount, 0)

      return NextResponse.json({
        success: true,
        message: "Dashboard aggregates loaded",
        data: {
          todayShopping,
          pendingItemsCount,
          completedItemsCount,
          monthlyEssentialsCount,
          lowStockItems,
          wishlistCount,
          estimatedTotalCost,
          recentPurchases,
          shoppingStatistics: {
            totalSpentThisMonth,
            itemsBoughtThisMonth,
          },
        },
      })
    }

    const res = await ShoppingReportService.getShoppingDashboard()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
