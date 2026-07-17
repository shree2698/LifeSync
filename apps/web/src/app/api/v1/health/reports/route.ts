import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { HealthService } from "@lifesync/services"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"

      // Define date filter bounds if provided
      const dateFilter = {} as any
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)

      const hasDates = startDate || endDate
      const dateWhere = hasDates ? dateFilter : undefined

      // 1. Water
      const waterLogs = await prisma.waterLog.findMany({
        where: { userId: mockUserId, date: dateWhere },
        orderBy: { date: "asc" },
      })
      const totalWater = waterLogs.reduce((sum, w) => sum + w.amount, 0)
      const avgWater = waterLogs.length > 0 ? totalWater / waterLogs.length : 0

      // 2. Sleep
      const sleepLogs = await prisma.sleepLog.findMany({
        where: { userId: mockUserId, date: dateWhere },
        orderBy: { date: "asc" },
      })
      const totalSleep = sleepLogs.reduce((sum, s) => sum + s.duration, 0)
      const avgSleep = sleepLogs.length > 0 ? totalSleep / sleepLogs.length : 0
      const avgSleepQuality = sleepLogs.length > 0 ? sleepLogs.reduce((sum, s) => sum + s.quality, 0) / sleepLogs.length : 0

      // 3. Workouts
      const workouts = await prisma.workout.findMany({
        where: { userId: mockUserId, date: dateWhere },
        orderBy: { date: "asc" },
      })
      const totalWorkouts = workouts.length
      const totalWorkoutDuration = workouts.reduce((sum, w) => sum + w.duration, 0)

      // 4. Weight
      const weightLogs = await prisma.weightLog.findMany({
        where: { userId: mockUserId, date: dateWhere },
        orderBy: { date: "asc" },
      })
      const initialWeight = weightLogs.length > 0 ? weightLogs[0].weight : null
      const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null
      const weightChange = (initialWeight && currentWeight) ? currentWeight - initialWeight : null

      // 5. Medications
      const medications = await prisma.medication.findMany({
        where: { userId: mockUserId },
      })
      const medicationLogs = await prisma.medicationLog.findMany({
        where: {
          medication: { userId: mockUserId },
          takenAt: dateWhere,
        },
      })
      const totalMedLogs = medicationLogs.length
      const takenMedLogs = medicationLogs.filter((l) => l.status === "TAKEN").length
      const adherenceRate = totalMedLogs > 0 ? Math.round((takenMedLogs / totalMedLogs) * 100) : 100

      // 6. Cycles
      const cycles = await prisma.cycle.findMany({
        where: { userId: mockUserId },
        orderBy: { startDate: "asc" },
      })
      const cycleLengthSum = cycles.filter((c) => c.cycleLength !== null).reduce((sum, c) => sum + c.cycleLength!, 0)
      const cyclesWithLength = cycles.filter((c) => c.cycleLength !== null).length
      const averageCycleLength = cyclesWithLength > 0 ? cycleLengthSum / cyclesWithLength : 28

      // 7. PCOS
      const pcosLogs = await prisma.pCOSLog.findMany({
        where: { userId: mockUserId, date: dateWhere },
        orderBy: { date: "asc" },
      })
      const pcosSymptomFreq = {} as Record<string, number>
      pcosLogs.forEach((log: any) => {
        log.symptoms.forEach((s: string) => {
          pcosSymptomFreq[s] = (pcosSymptomFreq[s] || 0) + 1
        })
      })
      const avgPcosStress = pcosLogs.length > 0 ? pcosLogs.reduce((sum: number, l: any) => sum + (l.stressLevel || 0), 0) / pcosLogs.length : 0

      // 8. Mood
      const moodLogs = await prisma.moodLog.findMany({
        where: { userId: mockUserId, date: dateWhere },
        orderBy: { date: "asc" },
      })
      const avgEnergy = moodLogs.length > 0 ? moodLogs.reduce((sum, l) => sum + l.energyLevel, 0) / moodLogs.length : 0
      const avgMoodStress = moodLogs.length > 0 ? moodLogs.reduce((sum, l) => sum + l.stressLevel, 0) / moodLogs.length : 0
      const moodCounts = {} as Record<string, number>
      moodLogs.forEach((l) => {
        moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1
      })

      // 9. Hair Care
      const hairLogs = await prisma.hairLog.findMany({
        where: { userId: mockUserId, date: dateWhere },
        orderBy: { date: "asc" },
      })
      const washDoneCount = hairLogs.filter((l) => l.washDone).length
      const hairFallTrend = hairLogs.filter((l) => l.hairFallCount !== null).map((l) => l.hairFallCount!)

      // 10. Skin Care
      const skinLogs = await prisma.skinLog.findMany({
        where: { userId: mockUserId, date: dateWhere },
        orderBy: { date: "asc" },
      })
      const completedSkinCount = skinLogs.filter((l) => l.completed).length
      const skinCompletionRate = skinLogs.length > 0 ? Math.round((completedSkinCount / skinLogs.length) * 100) : 100

      return NextResponse.json({
        success: true,
        message: "Health report generated from database",
        data: {
          water: { total: totalWater, average: parseFloat(avgWater.toFixed(0)), history: waterLogs },
          sleep: { averageDuration: parseFloat(avgSleep.toFixed(1)), averageQuality: parseFloat(avgSleepQuality.toFixed(1)), history: sleepLogs },
          workout: { totalWorkouts, totalDuration: totalWorkoutDuration, history: workouts },
          weight: { initial: initialWeight, current: currentWeight, change: weightChange ? parseFloat(weightChange.toFixed(1)) : null, history: weightLogs },
          medication: { adherenceRate, history: medicationLogs },
          cycle: { averageLength: parseFloat(averageCycleLength.toFixed(1)), history: cycles },
          pcos: { symptomFrequency: pcosSymptomFreq, averageStress: parseFloat(avgPcosStress.toFixed(1)), history: pcosLogs },
          mood: { averageEnergy: parseFloat(avgEnergy.toFixed(1)), averageStress: parseFloat(avgMoodStress.toFixed(1)), moodCounts, history: moodLogs },
          hair: { washDoneCount, hairFallTrend, history: hairLogs },
          skin: { completionRate: skinCompletionRate, history: skinLogs },
        },
      })
    }

    // Fallback to mock in-memory service
    const res = await HealthService.generateHealthReport({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
